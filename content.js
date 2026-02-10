(() => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const OVERLAY_ID = "sd-warning-overlay";
  const BUTTON_CLASS = "sd-continue";

  let warningTimer = null;

  const ensureOverlay = () => {
    if (document.getElementById(OVERLAY_ID)) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    const card = document.createElement("div");
    card.className = "sd-card";

    const title = document.createElement("h1");
    title.className = "sd-title";
    title.textContent = "警告";

    const message = document.createElement("p");
    message.className = "sd-message";
    message.textContent = "5分経過しました。続けますか？";

    const button = document.createElement("button");
    button.className = BUTTON_CLASS;
    button.type = "button";
    button.textContent = "継続する";

    button.addEventListener("click", () => {
      hideWarning();
      scheduleNextWarning();
    });

    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(button);
    overlay.appendChild(card);
    document.documentElement.appendChild(overlay);
  };

  const showWarning = () => {
    ensureOverlay();
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      return;
    }
    overlay.classList.add("sd-visible");
  };

  const hideWarning = () => {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      return;
    }
    overlay.classList.remove("sd-visible");
  };

  const scheduleNextWarning = () => {
    if (warningTimer) {
      clearTimeout(warningTimer);
    }
    warningTimer = window.setTimeout(showWarning, FIVE_MINUTES);
  };

  const init = () => {
    ensureOverlay();
    scheduleNextWarning();
  };

  init();
})();
