import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from src.ocr_config import *

# =====================================================
# CTC LOSS LAYER
# =====================================================

class CTCLayer(layers.Layer):

    def __init__(self, name=None):
        super().__init__(name=name)
        self.loss_fn = keras.backend.ctc_batch_cost

    def call(self, y_true, y_pred):

        batch_len = tf.cast(
            tf.shape(y_true)[0],
            dtype="int64"
        )

        input_length = tf.cast(
            tf.shape(y_pred)[1],
            dtype="int64"
        )

        label_length = tf.cast(
            tf.shape(y_true)[1],
            dtype="int64"
        )

        input_length = input_length * tf.ones(
            shape=(batch_len, 1),
            dtype="int64"
        )

        label_length = label_length * tf.ones(
            shape=(batch_len, 1),
            dtype="int64"
        )

        loss = self.loss_fn(
            y_true,
            y_pred,
            input_length,
            label_length
        )

        self.add_loss(loss)

        return y_pred

# =====================================================
# BUILD OCR MODEL
# =====================================================

def build_ocr_model():

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

    # =================================================
    # CNN BLOCK 1
    # =================================================

    x = layers.Conv2D(
        32,
        (3,3),
        padding="same",
        activation="relu"
    )(input_img)

    x = layers.BatchNormalization()(x)

    x = layers.MaxPooling2D((2,2))(x)

    x = layers.Dropout(0.25)(x)

    # =================================================
    # CNN BLOCK 2
    # =================================================

    x = layers.Conv2D(
        64,
        (3,3),
        padding="same",
        activation="relu"
    )(x)

    x = layers.BatchNormalization()(x)

    x = layers.MaxPooling2D((2,2))(x)

    x = layers.Dropout(0.25)(x)

    # =================================================
    # CNN BLOCK 3
    # =================================================

    x = layers.Conv2D(
        128,
        (3,3),
        padding="same",
        activation="relu"
    )(x)

    x = layers.BatchNormalization()(x)

    x = layers.MaxPooling2D((2,1))(x)

    x = layers.Dropout(0.25)(x)

    # =================================================
    # RESHAPE
    # =================================================

    new_shape = (
        IMG_W // 4,
        (IMG_H // 8) * 128
    )

    x = layers.Reshape(
        target_shape=new_shape
    )(x)

    x = layers.Dense(
        64,
        activation="relu"
    )(x)

    x = layers.Dropout(0.25)(x)

    # =================================================
    # BiLSTM
    # =================================================

    x = layers.Bidirectional(
        layers.LSTM(
            128,
            return_sequences=True,
            dropout=0.25
        )
    )(x)

    x = layers.Bidirectional(
        layers.LSTM(
            64,
            return_sequences=True,
            dropout=0.25
        )
    )(x)

    x = layers.Dense(
        NUM_CLASSES,
        activation="linear",  # ✅ UBAH dari "softmax"
        name="char_prob"
    )(x)

    output = CTCLayer(
        name="ctc_loss"
    )(labels, x)

    model = keras.models.Model(
        inputs=[input_img, labels],
        outputs=output,
        name="MoneyLens_OCR"
    )

    return model