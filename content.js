(() => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const THIRTY_MINUTES = 30 * 60 * 1000;
  const OVERLAY_ID = "sd-warning-overlay";
  const BUTTON_CLASS = "sd-continue";

  let warningTimer = null;
  let isActive = false;
  let overlayContinueAction = null;

  const ensureOverlay = () => {
    const existingOverlay = document.getElementById(OVERLAY_ID);
    if (existingOverlay) {
      const existingTitle = existingOverlay.querySelector(".sd-title");
      const existingMessage = existingOverlay.querySelector(".sd-message");
      const existingButton = existingOverlay.querySelector(`.${BUTTON_CLASS}`);
      if (existingTitle && existingMessage && existingButton) {
        return {
          overlay: existingOverlay,
          title: existingTitle,
          message: existingMessage,
          button: existingButton,
        };
      }
    }

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    const card = document.createElement("div");
    card.className = "sd-card";

    const title = document.createElement("h1");
    title.className = "sd-title";
    title.textContent = "Warning";

    const message = document.createElement("p");
    message.className = "sd-message";
    message.textContent = "5 minutes have passed. Do you want to continue?";

    const button = document.createElement("button");
    button.className = BUTTON_CLASS;
    button.type = "button";
    button.textContent = "Continue";

    button.addEventListener("click", () => {
      hideWarning();
      if (overlayContinueAction) {
        const action = overlayContinueAction;
        overlayContinueAction = null;
        action();
      }
    });

    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(button);
    overlay.appendChild(card);
    document.documentElement.appendChild(overlay);

    return { overlay, title, message, button };
  };

  const formatThirtyMinutesLater = () => {
    const later = new Date(Date.now() + THIRTY_MINUTES);
    const hour = String(later.getHours()).padStart(2, "0");
    const minute = String(later.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const showOverlay = ({ titleText, messageText, buttonText, onContinue }) => {
    if (!isActive) {
      return;
    }
    const parts = ensureOverlay();
    if (!parts) {
      return;
    }
    const { overlay, title, message, button } = parts;
    title.textContent = titleText;
    message.textContent = messageText;
    button.textContent = buttonText;
    overlayContinueAction = onContinue || null;
    overlay.classList.add("sd-visible");
  };

  const showWarning = () => {
    showOverlay({
      titleText: "Warning",
      messageText: "5 minutes have passed. Do you want to continue?",
      buttonText: "Continue",
      onContinue: scheduleNextWarning,
    });
  };

  const showEntryPrompt = () => {
    const thirtyMinutesLater = formatThirtyMinutesLater();
    showOverlay({
      titleText: "Check",
      messageText: `Do you really need to watch this? In 30 minutes, it will be ${thirtyMinutesLater}.`,
      buttonText: "Watch",
      onContinue: scheduleNextWarning,
    });
  };

  const hideWarning = () => {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      return;
    }
    overlay.classList.remove("sd-visible");
  };

  const scheduleNextWarning = () => {
    if (!isActive) {
      return;
    }
    if (warningTimer) {
      clearTimeout(warningTimer);
    }
    warningTimer = window.setTimeout(showWarning, FIVE_MINUTES);
  };

  const clearWarningTimer = () => {
    if (warningTimer) {
      clearTimeout(warningTimer);
      warningTimer = null;
    }
  };

  const isInstagram = () => location.hostname.endsWith("instagram.com");
  const isX = () =>
    location.hostname.endsWith("x.com") || location.hostname.endsWith("twitter.com");
  const isYouTube = () => location.hostname.endsWith("youtube.com");
  const isYouTubeShorts = () => isYouTube() && location.pathname.startsWith("/shorts");

  const isTargetSite = () => isInstagram() || isX() || isYouTubeShorts();

  const updateActiveState = () => {
    const nextActive = isTargetSite();
    if (nextActive === isActive) {
      return;
    }
    isActive = nextActive;
    if (!isActive) {
      hideWarning();
      clearWarningTimer();
      return;
    }
    clearWarningTimer();
    showEntryPrompt();
  };

  const watchUrlChanges = () => {
    let lastHref = location.href;
    const check = () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        updateActiveState();
      }
    };

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      check();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      check();
    };

    window.addEventListener("popstate", check);
    window.addEventListener("hashchange", check);
    window.setInterval(check, 800);
  };

  const init = () => {
    updateActiveState();
    watchUrlChanges();
  };

  init();
})();
