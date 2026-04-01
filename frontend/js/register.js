const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");
const messageElement = document.getElementById("message");

const showMessage = (message, isError = true) => {
  messageElement.textContent = message;
  messageElement.className = isError ? "message error-message" : "message success-message";
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  window.AppHelpers.setButtonLoading(registerButton, true, "Creating account...");
  showMessage("Creating account...", false);

  try {
    const result = await window.AppHelpers.apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    localStorage.setItem("token", result.data.token);
    showMessage("Registration successful. Redirecting...", false);
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (error) {
    showMessage(error.message || "Unable to connect to the server");
  } finally {
    window.AppHelpers.setButtonLoading(registerButton, false, "Creating account...");
  }
});
