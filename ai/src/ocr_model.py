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

    def call(self, y_true, y_pred):
        batch_len = tf.cast(tf.shape(y_true)[0], dtype="int64")

        input_length = tf.cast(tf.shape(y_pred)[1], dtype="int64")
        input_length = input_length * tf.ones(
            shape=(batch_len,), dtype="int64"
        )

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
        32, (3, 3), padding="same", activation="relu"
    )(input_img)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)

    # =================================================
    # CNN BLOCK 2
    # =================================================

    x = layers.Conv2D(
        64, (3, 3), padding="same", activation="relu"
    )(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)

    # =================================================
    # CNN BLOCK 3
    # =================================================

    x = layers.Conv2D(
        128, (3, 3), padding="same", activation="relu"
    )(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 1))(x)
    x = layers.Dropout(0.25)(x)

    # =================================================
    # RESHAPE
    # =================================================

    new_shape = (
        IMG_W // 4,
        (IMG_H // 8) * 128
    )
    x = layers.Reshape(target_shape=new_shape)(x)
    x = layers.Dense(64, activation="relu")(x)
    x = layers.Dropout(0.25)(x)

    # =================================================
    # BiLSTM
    # =================================================

    x = layers.Bidirectional(
        layers.LSTM(128, return_sequences=True, dropout=0.25)
    )(x)

    x = layers.Bidirectional(
        layers.LSTM(64, return_sequences=True, dropout=0.25)
    )(x)

    # =================================================
    # OUTPUT
    # =================================================

    x = layers.Dense(
        NUM_CLASSES,
        activation="linear",
        name="char_logits"
    )(x)

    output = CTCLayer(name="ctc_loss")(labels, x)

    model = keras.models.Model(
        inputs=[input_img, labels],
        outputs=output,
        name="MoneyLens_OCR"
    )

    return model

def build_inference_model(trained_model):

    inf_model = keras.Model(
        inputs=trained_model.inputs[0],
        outputs=trained_model.get_layer("char_logits").output,
        name="OCR_inference"
    )

    return inf_model