export const getAdminToken = () => localStorage.getItem("token");

export const adminHeaders = (extra = {}) => {
  const token = getAdminToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
};

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export const fetchAdminJson = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...adminHeaders(options.headers || {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" })
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
};
