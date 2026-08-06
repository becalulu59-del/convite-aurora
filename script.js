(() => {
  "use strict";

  const screens = [...document.querySelectorAll(".screen")];
  const video = document.getElementById("invite-video");
  const playButton = document.getElementById("play-video");
  const giftsOverlay = document.getElementById("gifts-overlay");

  const openLetter = document.getElementById("open-letter");
  const openVideo = document.getElementById("open-video");
  const openGifts = document.getElementById("open-gifts");
  const closeGifts = document.getElementById("close-gifts");
  const goCrest = document.getElementById("go-crest");

  let current = 0;
  let transitionLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function showScreen(index) {
    if (transitionLocked) return;
    if (index < 0 || index >= screens.length || index === current) return;

    transitionLocked = true;

    const oldScreen = screens[current];
    const newScreen = screens[index];

    oldScreen.classList.add("leaving-left");
    oldScreen.classList.remove("active");

    newScreen.classList.add("active");
    newScreen.classList.remove("leaving-left");

    current = index;

    window.setTimeout(() => {
      oldScreen.classList.remove("leaving-left");
      transitionLocked = false;
    }, 240);
  }

  function nextScreen() {
    showScreen(current + 1);
  }

  async function startVideo() {
    try {
      await video.play();
      playButton.classList.add("hidden");
    } catch (error) {
      playButton.querySelector("span").textContent = "Toque novamente para assistir";
    }
  }

  function openGiftScreen() {
    giftsOverlay.classList.add("open");
    giftsOverlay.setAttribute("aria-hidden", "false");
  }

  function closeGiftScreen() {
    giftsOverlay.classList.remove("open");
    giftsOverlay.setAttribute("aria-hidden", "true");
  }

  openLetter.addEventListener("click", () => showScreen(1));
  openVideo.addEventListener("click", () => showScreen(2));
  playButton.addEventListener("click", startVideo);

  video.addEventListener("ended", () => {
    showScreen(3);
  });

  openGifts.addEventListener("click", openGiftScreen);
  closeGifts.addEventListener("click", closeGiftScreen);

  goCrest.addEventListener("click", () => showScreen(4));

  giftsOverlay.addEventListener("click", (event) => {
    if (event.target === giftsOverlay) closeGiftScreen();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && giftsOverlay.classList.contains("open")) {
      closeGiftScreen();
      return;
    }

    if (event.key === "ArrowRight" && current === 3) {
      showScreen(4);
    }
  });

  /*
    SWIPE LATERAL:
    Na tela de informações, deslizar para a esquerda leva ao brasão.
    Na tela do brasão, deslizar para a direita volta às informações.
  */
  const app = document.getElementById("app");

  app.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  app.addEventListener(
    "touchend",
    (event) => {
      if (giftsOverlay.classList.contains("open")) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;

      if (current === 3 && dx < 0) {
        showScreen(4);
      } else if (current === 4 && dx > 0) {
        showScreen(3);
      }
    },
    { passive: true }
  );

  /*
    Caso o vídeo falhe ao carregar, um toque continua tentando reproduzir.
  */
  video.addEventListener("error", () => {
    playButton.classList.remove("hidden");
    playButton.querySelector("span").textContent = "Toque para tentar novamente";
  });
})();
