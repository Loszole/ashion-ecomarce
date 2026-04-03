const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:5000";

export const normalizeImageUrl = (value, fallback = "") => {
  if (!value) return fallback;

  const raw = String(value).trim();
  if (!raw) return fallback;

  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) {
    return raw;
  }

  const normalized = raw.replace(/\\/g, "/");
  const uploadsMarker = "/uploads/";
  const uploadsIndex = normalized.toLowerCase().lastIndexOf(uploadsMarker);

  let resolvedPath = normalized;
  if (uploadsIndex >= 0) {
    resolvedPath = normalized.slice(uploadsIndex);
  } else if (normalized.toLowerCase().startsWith("uploads/")) {
    resolvedPath = `/${normalized}`;
  } else if (!normalized.startsWith("/")) {
    resolvedPath = `/${normalized}`;
  }

  if (resolvedPath.toLowerCase().startsWith("/uploads/")) {
    return `${API_ORIGIN}${resolvedPath}`;
  }

  return resolvedPath;
};

export const getProductPrimaryImage = (product, fallback = "") => {
  const image = (product?.images && product.images[0]) || product?.image || "";
  return normalizeImageUrl(image, fallback);
};
