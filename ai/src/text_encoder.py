import tensorflow as tf
from src.ocr_config import CHARACTERS

char_to_num = tf.keras.layers.StringLookup(
    vocabulary=CHARACTERS,
    mask_token=None,
    num_oov_indices=1
)

_vocab = [v for v in char_to_num.get_vocabulary() if v != "[UNK]"]

num_to_char = tf.keras.layers.StringLookup(
    vocabulary=_vocab,
    mask_token=None,
    num_oov_indices=1,
    invert=True
)

def encode_text(text):
    """Encode string ke sequence of integer indices (1-based, 0=blank)."""
    text = tf.strings.unicode_split(text, input_encoding="UTF-8")
    return char_to_num(text)

def decode_prediction(pred):
    """
    Decode output logits model ke string.
    pred: tensor shape (batch, time_steps, num_classes)
    """
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
        res = res.replace("[UNK]", "")
        res = " ".join(res.split())
        output_text.append(res)

    return output_text