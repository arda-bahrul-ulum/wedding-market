import Swal from "sweetalert2";

// Konfigurasi default untuk SweetAlert2
const defaultConfig = {
  confirmButtonColor: "#3b82f6",
  cancelButtonColor: "#6b7280",
  confirmButtonText: "Ya",
  cancelButtonText: "Batal",
  showCancelButton: true,
  showCloseButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  reverseButtons: true,
  focusCancel: false,
  focusConfirm: true,
};

// SweetAlert untuk konfirmasi delete
export const confirmDelete = (
  title = "Konfirmasi Hapus",
  text = "Apakah Anda yakin ingin menghapus item ini?"
) => {
  return Swal.fire({
    ...defaultConfig,
    title,
    text,
    icon: "warning",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    showDenyButton: false,
  });
};

// SweetAlert untuk konfirmasi umum
export const confirmAction = (
  title,
  text,
  confirmText = "Ya",
  cancelText = "Batal"
) => {
  return Swal.fire({
    ...defaultConfig,
    title,
    text,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    icon: "question",
  });
};

// SweetAlert untuk konfirmasi status (activate/deactivate)
export const confirmStatusChange = (action, itemName = "item") => {
  const isActivate = action === "activate";
  const title = isActivate ? "Aktifkan Item" : "Nonaktifkan Item";
  const text = isActivate
    ? `Apakah Anda yakin ingin mengaktifkan ${itemName}?`
    : `Apakah Anda yakin ingin menonaktifkan ${itemName}?`;
  const confirmText = isActivate ? "Ya, Aktifkan!" : "Ya, Nonaktifkan!";
  const icon = isActivate ? "success" : "warning";

  return Swal.fire({
    ...defaultConfig,
    title,
    text,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    icon,
    confirmButtonColor: isActivate ? "#10b981" : "#f59e0b",
  });
};

// SweetAlert untuk success
export const showSuccess = (
  title = "Berhasil!",
  text = "Operasi berhasil dilakukan."
) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#10b981",
    showCancelButton: false,
    showCloseButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
  });
};

// SweetAlert untuk error
export const showError = (
  title = "Error!",
  text = "Terjadi kesalahan saat melakukan operasi."
) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "OK",
    confirmButtonColor: "#ef4444",
    showCancelButton: false,
    showCloseButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
  });
};

// SweetAlert untuk warning
export const showWarning = (title = "Peringatan!", text = "Perhatian!") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonText: "OK",
    confirmButtonColor: "#f59e0b",
    showCancelButton: false,
    showCloseButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
  });
};

// SweetAlert untuk info
export const showInfo = (title = "Informasi", text = "Informasi penting.") => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonText: "OK",
    confirmButtonColor: "#3b82f6",
    showCancelButton: false,
    showCloseButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
  });
};

// SweetAlert untuk loading
export const showLoading = (
  title = "Memproses...",
  text = "Mohon tunggu sebentar."
) => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// SweetAlert untuk input
export const showInput = (
  title,
  text,
  inputType = "text",
  placeholder = ""
) => {
  return Swal.fire({
    title,
    text,
    input: inputType,
    inputPlaceholder: placeholder,
    confirmButtonText: "OK",
    cancelButtonText: "Batal",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    showCancelButton: true,
    showCloseButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value) {
        return "Input tidak boleh kosong!";
      }
    },
  });
};

// SweetAlert untuk pilihan (select)
export const showSelect = (title, text, options = []) => {
  return Swal.fire({
    title,
    text,
    input: "select",
    inputOptions: options,
    confirmButtonText: "OK",
    cancelButtonText: "Batal",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    showCancelButton: true,
    showCloseButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value) {
        return "Pilih salah satu opsi!";
      }
    },
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Close all alerts
export const closeAll = () => {
  Swal.close();
};

export default Swal;
