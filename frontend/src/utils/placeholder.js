// Utility untuk placeholder images
// Menggunakan placeholder.com service

export const getPlaceholderImage = (width = 400, height = 300, text = "") => {
  // Menggunakan picsum.photos sebagai fallback yang lebih reliable
  const baseUrl = "https://picsum.photos";
  const dimensions = `${width}/${height}`;

  // Jika ada text, gunakan placeholder.com dengan fallback
  if (text) {
    return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(
      text
    )}`;
  }

  return `${baseUrl}/${dimensions}`;
};

// Predefined placeholder images
export const PLACEHOLDER_IMAGES = {
  // Common sizes
  small: (text = "") => getPlaceholderImage(100, 100, text),
  medium: (text = "") => getPlaceholderImage(400, 300, text),
  large: (text = "") => getPlaceholderImage(600, 400, text),

  // Specific use cases
  vendor: (text = "Vendor") => getPlaceholderImage(400, 300, text),
  service: (text = "Service") => getPlaceholderImage(400, 300, text),
  package: (text = "Package") => getPlaceholderImage(400, 300, text),
  user: (text = "User") => getPlaceholderImage(200, 200, text),
  portfolio: (text = "Portfolio") => getPlaceholderImage(400, 300, text),
  hero: (text = "Hero") => getPlaceholderImage(600, 400, text),
};
