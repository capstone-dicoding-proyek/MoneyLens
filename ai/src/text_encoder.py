import tensorflow as tf
from src.ocr_config import CHARACTERS

char_to_num = tf.keras.layers.StringLookup(
    vocabulary=CHARACTERS,
    mask_token=None
)

num_to_char = tf.keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(),
    mask_token=None,
    invert=True
)

def encode_text(text):

    text = tf.strings.unicode_split(
        text,
        input_encoding="UTF-8"
    )

    return char_to_num(text)

def decode_prediction(pred):

    input_len = tf.ones(pred.shape[0]) * pred.shape[1]

    results = tf.keras.backend.ctc_decode(
        pred,
        input_length=input_len,
        greedy=True
    )[0][0]

    output_text = []

    for res in results:
        # ✅ PERBAIKAN 2: bersihkan karakter [UNK]
        # num_to_char mengembalikan "[UNK]" untuk karakter
        # yang tidak ada di vocabulary — perlu dihapus
        # agar output teks bersih
        res = num_to_char(res)

        res = tf.strings.reduce_join(res).numpy().decode("utf-8")

        # Hapus token [UNK] yang muncul di hasil prediksi
        res = res.replace("[UNK]", "")

        # Bersihkan spasi berlebih akibat penghapusan [UNK]
        res = " ".join(res.split())

        output_text.append(res)

    return output_text