window.APP_CONFIG = {
  API_BASE_URL: "https://your-backend.onrender.com/api",
};

window.AppHelpers = {
  getApiBaseUrl() {
    return window.APP_CONFIG.API_BASE_URL.replace(/\/$/, "");
  },

  getAuthToken() {
    return localStorage.getItem("token");
  },

  setButtonLoading(buttonElement, isLoading, loadingText) {
    if (!buttonElement) {
      return;
    }

    if (!buttonElement.dataset.defaultText) {
      buttonElement.dataset.defaultText = buttonElement.textContent;
    }

    buttonElement.disabled = isLoading;
    buttonElement.textContent = isLoading ? loadingText : buttonElement.dataset.defaultText;
    buttonElement.classList.toggle("button-loading", isLoading);
  },

  async apiRequest(path, options = {}) {
    const token = this.getAuthToken();
    const requestHeaders = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.getApiBaseUrl()}${path}`, {
      ...options,
      headers: requestHeaders,
    });

    let result;

    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok) {
      const errorMessage =
        result && result.message
          ? result.message
          : "Something went wrong. Please try again.";
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return result;
  },
};
