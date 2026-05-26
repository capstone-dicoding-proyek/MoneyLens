import tensorflow as tf
from src.ocr_config import CHARACTERS

char_to_num = tf.keras.layers.StringLookup(
    vocabulary=CHARACTERS,
    mask_token=None,
    num_oov_indices=1
)

num_to_char = tf.keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(),
    mask_token=None,
    num_oov_indices=1,
    invert=True
)

def encode_text(text):
    text = tf.strings.unicode_split(
        text,
        input_encoding="UTF-8"
    )
    return char_to_num(text)

def decode_prediction(pred):
    pred = tf.nn.softmax(pred, axis=-1)

    input_len = tf.ones(pred.shape[0]) * pred.shape[1]

    results = tf.keras.backend.ctc_decode(
        pred,
        input_length=input_len,
        greedy=True
    )[0][0]

    output_text = []

    for res in results:
        res = num_to_char(res)
        res = tf.strings.reduce_join(res).numpy().decode("utf-8")
        # Hapus token [UNK] (blank/padding)
        res = res.replace("[UNK]", "")
        res = " ".join(res.split())
        output_text.append(res)

    return output_text