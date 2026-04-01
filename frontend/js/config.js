window.APP_CONFIG = {
  API_BASE_URL:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? window.location.origin
      : "https://your-render-backend.onrender.com",
};
