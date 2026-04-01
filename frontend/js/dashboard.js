const token = localStorage.getItem("token");
const apiBaseUrl = localStorage.getItem("apiBaseUrl") || window.APP_CONFIG?.API_BASE_URL || window.location.origin;

const profileContent = document.getElementById("profileContent");
const scoresContent = document.getElementById("scoresContent");
const charityContent = document.getElementById("charityContent");
const drawContent = document.getElementById("drawContent");
const logoutButton = document.getElementById("logoutButton");
const scoreForm = document.getElementById("scoreForm");
const charityForm = document.getElementById("charityForm");
const runDrawButton = document.getElementById("runDrawButton");
const charitySelect = document.getElementById("charitySelect");
const dashboardMessage = document.getElementById("dashboardMessage");

if (!token) {
  window.location.href = "/login.html";
}

const showMessage = (message, isError = false) => {
  dashboardMessage.textContent = message;
  dashboardMessage.style.background = isError ? "rgba(180, 35, 24, 0.92)" : "rgba(31, 41, 51, 0.9)";
};

const authHeaders = () => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const renderInfoRow = (label, value) => {
  return `
    <div class="info-row">
      <span class="label">${label}</span>
      <span class="value">${value}</span>
    </div>
  `;
};

const renderScores = (scores) => {
  if (!scores.length) {
    return '<p class="empty-state">No scores added yet.</p>';
  }

  return scores
    .map((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString();

      return `
        <div class="score-item">
          <span class="label">Score</span>
          <span class="value">${item.score}</span>
          <span class="label">Date</span>
          <span>${formattedDate}</span>
        </div>
      `;
    })
    .join("");
};

const renderCharity = (charity) => {
  if (!charity) {
    return '<p class="empty-state">No charity selected yet.</p>';
  }

  return `
    <div class="info-row">
      <span class="label">Name</span>
      <span class="value">${charity.name}</span>
    </div>
    <div class="info-row">
      <span class="label">Description</span>
      <span>${charity.description}</span>
    </div>
    <div class="info-row">
      <span class="label">Charity Percentage</span>
      <span class="value">${charity.charityPercentage}%</span>
    </div>
  `;
};

const renderDraw = (drawParticipation, winnings) => {
  return `
    <div class="draw-item">
      <span class="label">Total Participations</span>
      <span class="value">${drawParticipation.totalParticipations}</span>
    </div>
    <div class="draw-item">
      <span class="label">Last Result</span>
      <span class="value">${drawParticipation.lastResult}</span>
    </div>
    <div class="draw-item">
      <span class="label">Matched Numbers</span>
      <span>${drawParticipation.lastMatchedNumbers.join(", ") || "None"}</span>
    </div>
    <div class="draw-item">
      <span class="label">Last Draw Numbers</span>
      <span>${drawParticipation.lastDrawNumbers.join(", ") || "No draw yet"}</span>
    </div>
    <div class="draw-item">
      <span class="label">Last Winnings</span>
      <span class="value">$${winnings.lastWinnings}</span>
    </div>
    <div class="draw-item">
      <span class="label">Total Winnings</span>
      <span class="value">$${winnings.totalWinnings}</span>
    </div>
  `;
};

const loadCharities = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/charities`);
    const result = await response.json();

    if (!response.ok) {
      charitySelect.innerHTML = "<option value=''>Unable to load charities</option>";
      return;
    }

    charitySelect.innerHTML = result.data.charities
      .map((charity) => `<option value="${charity._id}">${charity.name}</option>`)
      .join("");
  } catch (error) {
    charitySelect.innerHTML = "<option value=''>Unable to load charities</option>";
  }
};

const loadDashboard = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/dashboard`, {
      headers: authHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    const { profile, latestScores, selectedCharity, drawParticipation, winnings } = result.data;

    profileContent.innerHTML = `
      ${renderInfoRow("Name", profile.name)}
      ${renderInfoRow("Email", profile.email)}
      ${renderInfoRow("Joined", new Date(profile.createdAt).toLocaleDateString())}
    `;

    scoresContent.innerHTML = renderScores(latestScores);
    charityContent.innerHTML = renderCharity(selectedCharity);
    drawContent.innerHTML = renderDraw(drawParticipation, winnings);
  } catch (error) {
    profileContent.innerHTML = '<p class="empty-state">Unable to load dashboard data.</p>';
    scoresContent.innerHTML = "";
    charityContent.innerHTML = "";
    drawContent.innerHTML = "";
  }
};

scoreForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(scoreForm);
  const payload = {
    score: Number(formData.get("score")),
    date: formData.get("date"),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/scores`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Unable to save score", true);
      return;
    }

    scoreForm.reset();
    showMessage("Score saved successfully");
    await loadDashboard();
  } catch (error) {
    showMessage("Unable to connect to the server", true);
  }
});

charityForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(charityForm);
  const payload = {
    charityId: formData.get("charityId"),
    charityPercentage: Number(formData.get("charityPercentage")),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/charities/select-charity`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Unable to save charity", true);
      return;
    }

    showMessage("Charity updated successfully");
    await loadDashboard();
  } catch (error) {
    showMessage("Unable to connect to the server", true);
  }
});

runDrawButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/draw`);
    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Unable to run draw", true);
      return;
    }

    showMessage(`Draw completed. Numbers: ${result.data.drawNumbers.join(", ")}`);
    await loadDashboard();
  } catch (error) {
    showMessage("Unable to connect to the server", true);
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("apiBaseUrl");
  window.location.href = "/login.html";
});

loadCharities();
loadDashboard();
