const form = document.querySelector("form");
const loader = document.getElementById("loader");
const snackbar = document.getElementById("snackbar");

function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}

function showSnackbar(severity, message) {
  snackbar.classList.remove(
    "snackbar-success",
    "snackbar-error",
    "snackbar-hide"
  );

  snackbar.classList.add(
    severity === "success" ? "snackbar-success" : "snackbar-error"
  );

  snackbar.textContent = message;
  snackbar.classList.add("snackbar-show");

  setTimeout(() => {
    snackbar.classList.add("snackbar-hide");
    snackbar.classList.remove("snackbar-show");

    setTimeout(() => {
      snackbar.style.display = "none";
    }, 300);
  }, 3000);
}

async function saveApiKey(apiKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ apiKey }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve("API key saved successfully!");
      }
    });
  });
}

async function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("apiKey", (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.apiKey || null);
      }
    });
  });
}

async function wait(time = 1000) {
  return new Promise((res, rej) => {
    return setTimeout(() => {
      res(null);
    }, time);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    showLoader();

    const key = form.apikey.value;
    const res = await fetch(
      `http://localhost:3000/api/validate-key`,

      {
        headers: {
          "X-API-KEY": key,
        },
      }
    );

    if (res.ok) {
      await saveApiKey(key);
      await wait(2000);
      form.reset();
      showSnackbar("success", "API key configured successfully!");

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      showSnackbar("error", "Invalid API key");
    }
  } catch (E) {
    console.log(E);
    showSnackbar("error", "Something went wrong");
  } finally {
    hideLoader();
  }
});
