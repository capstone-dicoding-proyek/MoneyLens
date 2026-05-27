import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from src.ocr_config import *

# =====================================================
# [MAIN QUEST] Custom Layer #1 — CTC Loss Layer
# Memenuhi: "Custom Layer" dalam Functional API
# =====================================================

class CTCLayer(layers.Layer):
    """
    Custom layer yang menghitung CTC loss selama training.

    Digunakan dalam Functional API — menerima y_true dan y_pred,
    menghitung loss via tf.nn.ctc_loss, dan mengembalikan y_pred
    agar model bisa di-compile tanpa output loss eksplisit.
    """

    def __init__(self, name=None, **kwargs):
        super().__init__(name=name, **kwargs)

    def call(self, y_true, y_pred):
        batch_len    = tf.cast(tf.shape(y_true)[0], dtype="int64")
        input_length = tf.cast(tf.shape(y_pred)[1], dtype="int64")
        input_length = input_length * tf.ones(shape=(batch_len,), dtype="int64")

        label_length = tf.reduce_sum(
            tf.cast(tf.not_equal(y_true, PADDING_VALUE), dtype="int64"),
            axis=1
        )

        loss = tf.nn.ctc_loss(
            labels=tf.cast(y_true, tf.int32),
            logits=y_pred,
            label_length=tf.cast(label_length, tf.int32),
            logit_length=tf.cast(input_length, tf.int32),
            logits_time_major=False,
            blank_index=BLANK_INDEX
        )

        self.add_loss(tf.reduce_mean(loss))
        return y_pred

    def get_config(self):
        return super().get_config()


# =====================================================
# [MAIN QUEST] Custom Layer #2 — Residual CNN Block
# Arsitektur lebih dalam dengan skip connection
# untuk atasi underfitting pada variasi foto HP
# =====================================================

class ResidualCNNBlock(layers.Layer):
    """
    Custom layer residual block untuk feature extraction yang lebih kuat.

    Skip connection membantu gradient flow di jaringan yang lebih dalam,
    mencegah vanishing gradient yang jadi penyebab train loss plateau.
    """

    def __init__(self, filters, kernel_size=3, pool=None, dropout=0.25, **kwargs):
        super().__init__(**kwargs)
        self.filters     = filters
        self.kernel_size = kernel_size
        self.pool        = pool
        self.dropout_rate= dropout

        self.conv1 = layers.Conv2D(filters, kernel_size, padding="same", use_bias=False)
        self.bn1   = layers.BatchNormalization()
        self.act1  = layers.Activation("relu")

        self.conv2 = layers.Conv2D(filters, kernel_size, padding="same", use_bias=False)
        self.bn2   = layers.BatchNormalization()

        # Projection untuk skip connection jika channel berbeda
        self.proj  = None  # diinisialisasi di build()

        self.act2  = layers.Activation("relu")

        if pool:
            self.pool_layer = layers.MaxPooling2D(pool)
        else:
            self.pool_layer = None

        self.drop = layers.Dropout(dropout)

    def build(self, input_shape):
        in_filters = input_shape[-1]
        if in_filters != self.filters:
            self.proj = layers.Conv2D(self.filters, 1, padding="same", use_bias=False)
        super().build(input_shape)

    def call(self, x, training=False):
        residual = x
        if self.proj is not None:
            residual = self.proj(x)

        out = self.conv1(x)
        out = self.bn1(out, training=training)
        out = self.act1(out)
        out = self.conv2(out)
        out = self.bn2(out, training=training)

        out = out + residual         # Skip connection
        out = self.act2(out)

        if self.pool_layer:
            out = self.pool_layer(out)

        out = self.drop(out, training=training)
        return out

    def get_config(self):
        config = super().get_config()
        config.update({
            "filters"    : self.filters,
            "kernel_size": self.kernel_size,
            "pool"       : self.pool,
            "dropout"    : self.dropout_rate,
        })
        return config


# =====================================================
# [MAIN QUEST] Build OCR Model — TF Functional API
# =====================================================

def build_ocr_model():
    """
    Model OCR dengan arsitektur CNN-BiLSTM-CTC menggunakan Functional API.

    Arsitektur (diperbesar dari versi sebelumnya untuk atasi underfitting):
      Input (32x128x1)
        → ResidualCNNBlock(64)   + pool(2,2)   → 16x64
        → ResidualCNNBlock(128)  + pool(2,2)   → 8x32
        → ResidualCNNBlock(256)  + pool(2,1)   → 4x32
        → ResidualCNNBlock(256)  (no pool)     → 4x32
        → Reshape → Dense(128)
        → BiLSTM(256) → BiLSTM(128)
        → Dense(NUM_CLASSES) [logits]
        → CTCLayer [training only]
    """

    input_img = keras.Input(
        shape=(IMG_H, IMG_W, CHANNELS),
        name="image",
        dtype="float32"
    )

    labels = keras.Input(
        name="label",
        shape=(None,),
        dtype="int32"
    )

    # ── CNN Feature Extractor (Residual) ──────────────────
    x = ResidualCNNBlock(64,  pool=(2, 2), dropout=0.2, name="cnn_block_1")(input_img)
    x = ResidualCNNBlock(128, pool=(2, 2), dropout=0.2, name="cnn_block_2")(x)
    x = ResidualCNNBlock(256, pool=(2, 1), dropout=0.2, name="cnn_block_3")(x)
    x = ResidualCNNBlock(256, pool=None,   dropout=0.2, name="cnn_block_4")(x)

    # ── Reshape: (batch, W, H*C) ──────────────────────────
    # Setelah 4 block: H = 32/2/2/2 = 4, W = 128/2/2 = 32, C = 256
    new_shape = (IMG_W // 4, (IMG_H // 8) * 256)
    x = layers.Reshape(target_shape=new_shape, name="reshape")(x)
    x = layers.Dense(128, activation="relu", name="dense_proj")(x)
    x = layers.Dropout(0.25)(x)

    # ── BiLSTM Sequence Modelling ─────────────────────────
    x = layers.Bidirectional(
        layers.LSTM(256, return_sequences=True, dropout=0.25),
        name="bilstm_1"
    )(x)

    x = layers.Bidirectional(
        layers.LSTM(128, return_sequences=True, dropout=0.25),
        name="bilstm_2"
    )(x)

    # ── Output logits ─────────────────────────────────────
    x = layers.Dense(
        NUM_CLASSES,
        activation="linear",
        name="char_logits"
    )(x)

    # ── CTC Loss Layer (Custom Layer) ─────────────────────
    output = CTCLayer(name="ctc_loss")(labels, x)

    model = keras.models.Model(
        inputs=[input_img, labels],
        outputs=output,
        name="MoneyLens_OCR_v2"
    )

    return model


# =====================================================
# [MAIN QUEST] Build Inference Model
# Model terpisah untuk inference — tanpa CTCLayer
# =====================================================

def build_inference_model(trained_model):
    """
    Ekstrak sub-model untuk inference dari trained model.

    Input  : image (32x128x1), float32, normalized 0-1
    Output : logits (time_steps x NUM_CLASSES) — apply softmax + ctc_decode
    """
    image_input = trained_model.input[0]
    char_output = trained_model.get_layer("char_logits").output

    inf_model = keras.Model(
        inputs=image_input,
        outputs=char_output,
        name="MoneyLens_OCR_v2_inference"
    )
    return inf_model