const token = localStorage.getItem("token");

const profileContent = document.getElementById("profileContent");
const scoresContent = document.getElementById("scoresContent");
const charityContent = document.getElementById("charityContent");
const drawContent = document.getElementById("drawContent");
const logoutButton = document.getElementById("logoutButton");
const scoreForm = document.getElementById("scoreForm");
const charityForm = document.getElementById("charityForm");
const runDrawButton = document.getElementById("runDrawButton");
const scoreButton = document.getElementById("scoreButton");
const charityButton = document.getElementById("charityButton");
const charitySelect = document.getElementById("charitySelect");
const dashboardMessage = document.getElementById("dashboardMessage");

if (!token) {
  window.location.href = "./login.html";
}

const showMessage = (message, isError = false) => {
  dashboardMessage.textContent = message;
  dashboardMessage.style.background = isError ? "rgba(180, 35, 24, 0.92)" : "rgba(31, 41, 51, 0.9)";
  dashboardMessage.classList.add("is-visible");
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
  charitySelect.innerHTML = "<option value=''>Loading charities...</option>";

  try {
    const result = await window.AppHelpers.apiRequest("/charities", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    charitySelect.innerHTML = result.data.charities
      .map((charity) => `<option value="${charity._id}">${charity.name}</option>`)
      .join("");
  } catch (error) {
    charitySelect.innerHTML = "<option value=''>Unable to load charities</option>";
    showMessage(error.message || "Unable to load charities", true);
  }
};

const loadDashboard = async () => {
  profileContent.innerHTML = '<p class="empty-state">Loading profile...</p>';
  scoresContent.innerHTML = '<p class="empty-state">Loading scores...</p>';
  charityContent.innerHTML = '<p class="empty-state">Loading charity...</p>';
  drawContent.innerHTML = '<p class="empty-state">Loading draw details...</p>';

  try {
    const result = await window.AppHelpers.apiRequest("/dashboard");

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
    if (error.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "./login.html";
      return;
    }

    profileContent.innerHTML = '<p class="empty-state">Unable to load dashboard data.</p>';
    scoresContent.innerHTML = '<p class="empty-state">Please try again later.</p>';
    charityContent.innerHTML = '<p class="empty-state">Please try again later.</p>';
    drawContent.innerHTML = '<p class="empty-state">Please try again later.</p>';
    showMessage(error.message || "Unable to load dashboard data.", true);
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
    window.AppHelpers.setButtonLoading(scoreButton, true, "Saving score...");
    showMessage("Saving score...", false);

    await window.AppHelpers.apiRequest("/scores", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    scoreForm.reset();
    showMessage("Score saved successfully");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message || "Unable to connect to the server", true);
  } finally {
    window.AppHelpers.setButtonLoading(scoreButton, false, "Saving score...");
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
    window.AppHelpers.setButtonLoading(charityButton, true, "Saving charity...");
    showMessage("Saving charity...", false);

    await window.AppHelpers.apiRequest("/charities/select-charity", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    showMessage("Charity updated successfully");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message || "Unable to connect to the server", true);
  } finally {
    window.AppHelpers.setButtonLoading(charityButton, false, "Saving charity...");
  }
});

runDrawButton.addEventListener("click", async () => {
  try {
    window.AppHelpers.setButtonLoading(runDrawButton, true, "Running draw...");
    showMessage("Running draw...", false);
    const result = await window.AppHelpers.apiRequest("/draw", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    showMessage(`Draw completed. Numbers: ${result.data.drawNumbers.join(", ")}`);
    await loadDashboard();
  } catch (error) {
    showMessage(error.message || "Unable to connect to the server", true);
  } finally {
    window.AppHelpers.setButtonLoading(runDrawButton, false, "Running draw...");
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "./login.html";
});

loadCharities();
loadDashboard();
