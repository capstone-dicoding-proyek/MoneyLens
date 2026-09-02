/**
 * Convert technical error objects or API responses into clean, user-friendly messages.
 * @param {any} err - The error object from axios or catch block.
 * @param {string} [fallbackMessage='Terjadi kesalahan, silakan coba lagi'] - Default fallback message.
 * @returns {string} User-friendly message.
 */
export function getErrorMessage(err, fallbackMessage = 'Terjadi kesalahan, silakan coba beberapa saat lagi') {
  if (!err) return fallbackMessage;

  // Check if server returned a structured response message
  const serverMessage = err?.response?.data?.message;
  const status = err?.response?.status;

  // Network / Connection errors (no response from server)
  if (err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response && err.request) {
    return 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
  }

  // Timeout error
  if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
    return 'Koneksi melebihi batas waktu (timeout). Silakan coba lagi.';
  }

  // Server-side internal error (5xx)
  if (status >= 500) {
    return 'Terjadi gangguan pada server. Tim kami sedang menanganinya, silakan coba lagi nanti.';
  }

  // Specific status codes
  if (status === 401) {
    return serverMessage || 'Sesi Anda telah berakhir atau belum masuk. Silakan masuk kembali.';
  }

  if (status === 403) {
    return serverMessage || 'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.';
  }

  if (status === 404) {
    return serverMessage || 'Data yang diminta tidak ditemukan.';
  }

  if (status === 429) {
    return serverMessage || 'Terlalu banyak permintaan. Mohon tunggu beberapa menit sebelum mencoba lagi.';
  }

  // Client validation / business logic error (400, 422, etc.)
  if (typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }

  if (typeof err === 'string') {
    return err;
  }

  return fallbackMessage;
}
