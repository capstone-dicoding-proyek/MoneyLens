IMG_H = 32
IMG_W = 128
CHANNELS = 1

MAX_TEXT_LENGTH = 32

CHARACTERS = list(
    "0123456789"
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    " .,:-/()%"
)

NUM_CLASSES = len(CHARACTERS) + 1

CLASS_LABELS = [
    "QTY",
    "harga_satuan",
    "nama_produk",
    "tanggal",
    "total_harga_barang",
    "total_transaksi",
]