const form = document.querySelector("form");
const loadingModal = document.querySelector("#loading-modal");

function showLoading() {
  loadingModal.classList.add("active");
}

function hideLoading() {
  loadingModal.classList.remove("active");
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
    if (form.apikey.value != "") {
      showLoading();
      await saveApiKey();
      await wait(2000);
      hideLoading();
      form.reset();
    }
  } catch (E) {
    console.log(E);
  }
});
