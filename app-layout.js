(function () {
  const API_BASE = window.SKILLSWAP_API_BASE || "http://localhost:4000/api";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function parseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getCurrentUser() {
    return parseJSON(localStorage.getItem("skillswap_current_user"), null);
  }

  function getProfileFor(user) {
    if (!user || !user.username) return null;
    const key = `skillswap_profile_${String(user.username).toLowerCase()}`;
    return parseJSON(localStorage.getItem(key), null);
  }

  function isNetworkError(error) {
    return Boolean(
      error &&
      (
        error.name === "TypeError" ||
        /Failed to fetch|NetworkError|ERR_CONNECTION_REFUSED|ECONNREFUSED/i.test(error.message || "")
      )
    );
  }

  async function api(path, options = {}, retries = 2, delayMs = 350) {
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const res = await fetch(`${API_BASE}${path}`, {
          headers: { "Content-Type": "application/json", ...(options.headers || {}) },
          ...options
        });

        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(payload.message || "Request failed");
        }
        return payload;
      } catch (error) {
        lastError = error;
        if (attempt < retries && isNetworkError(error)) {
          await sleep(delayMs * (attempt + 1));
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error("Request failed");
  }

  function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }

  function setShell(user, pageKey) {
    const profile = getProfileFor(user) || {};

    const sidebarName = document.getElementById("sidebarName");
    const sidebarMeta = document.getElementById("sidebarMeta");
    const topProfile = document.getElementById("topProfileName");

    if (sidebarName) sidebarName.textContent = user.username || user.name || "user";
    if (sidebarMeta) sidebarMeta.textContent = `${profile.branch || "Information Technology"} | ${profile.yearStudy || "2nd Year"}`;
    if (topProfile) topProfile.textContent = user.name || user.username || "Profile";

    document.querySelectorAll(".nav a[data-page]").forEach((a) => {
      if (a.getAttribute("data-page") === pageKey) a.classList.add("active");
      else a.classList.remove("active");
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("skillswap_current_user");
        window.location.href = "index.html";
      });
    }

    const searchInput = document.getElementById("topSearch");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        document.dispatchEvent(new CustomEvent("skillswap-search", { detail: searchInput.value.trim().toLowerCase() }));
      });
    }
  }

  window.SkillSwapApp = {
    api,
    getCurrentUser,
    requireAuth,
    setShell,
    parseJSON
  };
})();
