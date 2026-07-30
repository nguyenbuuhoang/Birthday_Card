document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // Chỉnh các nội dung cá nhân của thiệp tại đây.
  const CARD_CONTENT = {
    name: "Vân Anh",
    dateLabel: "30 · 07 · 2026",
    password: "10062026",
    waxInitials: "V.A",
    birthdayParagraphs: [
      "Dear My Love",
      "Mong những ngày sắp tới sẽ đối xử với em thật dịu dàng — cho em đủ niềm vui để mỉm cười, đủ bình yên để ngủ ngon và đủ dũng khí để theo đuổi những điều em mong muốn.",
      "Nếu có một ngày em thấy mệt, mong em nhớ rằng vẫn luôn có anh ở đây, sẵn sàng lắng nghe và cùng em đi qua những khoảng trời không nắng.",
      "Cảm ơn em vì đã đến với thế giới này, và vì đã trở thành một phần thật đẹp trong những ngày của anh. Được gặp em là một điều mà anh luôn trân trọng.",
      "Tuổi mới rồi, anh chỉ mong em sẽ luôn mỉm cười nhiều hơn hôm qua, hạnh phúc nhiều hơn hôm nay và bình yên trong tất cả những chặng đường phía trước.",
      "Happy Birthday, Vân Anh. ❤️"
    ],
    letterParagraphs: [
      "10.06.2026 không chỉ là một chiếc mật mã.",
      "Đó là ngày anh lần đầu gửi đến em những lời yêu thương mà anh đã giữ trong lòng. Là ngày anh đủ can đảm để nói rằng anh thích em, thích nụ cười của em, thích cách em xuất hiện và khiến những ngày bình thường của anh trở nên đặc biệt hơn.",
      "Anh chọn ngày ấy làm chìa khóa vì đó là một dấu mốc rất đẹp với anh — khoảnh khắc tình cảm này không còn chỉ là điều anh âm thầm cất giữ, mà đã thật sự được gửi đến em.",
      "Và nếu em đang đọc được bức thư này, anh chỉ muốn nói thêm một lần nữa:",
      "Anh thích em. Thật lòng và rất nhiều. ♡"
    ]
  };

  $$('[data-card-date]').forEach(element => { element.textContent = CARD_CONTENT.dateLabel; });
  $("#introRecipient").textContent = "Gửi em, người đặc biệt ♡";
  $("#birthdayName").textContent = CARD_CONTENT.name;
  $("#waxSeal").textContent = CARD_CONTENT.waxInitials;
  $("#waxSeal").setAttribute("aria-label", `Dấu mộc ${CARD_CONTENT.name}`);

  // Nền sao nhẹ, không ảnh hưởng thao tác
  const canvas = $("#stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resizeStars() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(120, Math.floor(innerWidth / 10)) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: Math.random() * 1.2 + .2,
      alpha: Math.random() * .6 + .2
    }));
    drawStars();
  }
  function drawStars() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    stars.forEach(star => {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#fff4ec";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  resizeStars();
  addEventListener("resize", resizeStars, { passive: true });

  // -------------------------------------------------------------
  // Hiệu ứng cánh hoa hồng và trái tim rơi lơ lửng (Petals Engine)
  // -------------------------------------------------------------
  function initPetals() {
    const pCanvas = document.createElement("canvas");
    pCanvas.id = "petals";
    pCanvas.style.position = "fixed";
    pCanvas.style.inset = "0";
    pCanvas.style.width = "100%";
    pCanvas.style.height = "100%";
    pCanvas.style.pointerEvents = "none";
    pCanvas.style.zIndex = "1"; // phía trên stars, dưới nội dung
    document.body.appendChild(pCanvas);

    const pCtx = pCanvas.getContext("2d");
    let pWidth = window.innerWidth;
    let pHeight = window.innerHeight;
    let petals = [];

    function resizePetalsCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      pWidth = window.innerWidth;
      pHeight = window.innerHeight;
      pCanvas.width = pWidth * ratio;
      pCanvas.height = pHeight * ratio;
      pCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    window.addEventListener("resize", resizePetalsCanvas, { passive: true });
    resizePetalsCanvas();

    class Petal {
      constructor() {
        this.reset();
        this.y = Math.random() * pHeight - pHeight; // Khởi tạo ở trên màn hình
      }

      reset() {
        this.x = Math.random() * pWidth;
        this.y = -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 1.0 + 0.6;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
        this.type = Math.random() < 0.65 ? "petal" : "heart";
        this.color = this.type === "petal"
          ? `rgba(${203 + Math.floor(Math.random() * 20 - 10)}, 101, 120, ${Math.random() * 0.35 + 0.3})` // hồng đào
          : `rgba(${133 + Math.floor(Math.random() * 20 - 10)}, 57, 78, ${Math.random() * 0.25 + 0.2})`;   // đỏ nhung
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.4; // Đung đưa theo gió
        this.angle += this.spin;

        if (this.y > pHeight + 20 || this.x < -20 || this.x > pWidth + 20) {
          this.reset();
        }
      }

      draw() {
        pCtx.save();
        pCtx.translate(this.x, this.y);
        pCtx.rotate(this.angle);
        pCtx.fillStyle = this.color;

        if (this.type === "petal") {
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.quadraticCurveTo(this.size * 0.8, -this.size * 1.2, this.size, 0);
          pCtx.quadraticCurveTo(this.size * 0.5, this.size * 1.2, 0, 0);
          pCtx.fill();
        } else {
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
          pCtx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
          pCtx.fill();
        }
        pCtx.restore();
      }
    }

    const maxPetals = Math.min(50, Math.floor(pWidth / 28));
    for (let i = 0; i < maxPetals; i++) {
      petals.push(new Petal());
    }

    // Hiệu ứng bùng nổ khi đồng ý
    window.burstPetals = function () {
      const burstCount = 80;
      for (let i = 0; i < burstCount; i++) {
        const p = new Petal();
        p.x = pWidth / 2 + (Math.random() * 80 - 40);
        p.y = pHeight / 2 + (Math.random() * 80 - 40);
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 6 + 3;
        p.speedX = Math.cos(a) * sp;
        p.speedY = Math.sin(a) * sp - 1.5;
        p.spin = Math.random() * 0.15 - 0.075;
        p.size = Math.random() * 9 + 5;
        petals.push(p);

        setTimeout(() => {
          const idx = petals.indexOf(p);
          if (idx > -1) petals.splice(idx, 1);
        }, 2200);
      }
    };

    function animatePetals() {
      if (!document.body.classList.contains("card-transitioning")) {
        pCtx.clearRect(0, 0, pWidth, pHeight);
        petals.forEach(petal => {
          petal.update();
          petal.draw();
        });
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }
  initPetals();

  // Mở và đóng thiệp
  const intro = $("#intro");
  const cardView = $("#cardView");
  let opening = false;
  let envelopeOpened = false;
  let autoOpenTimer = null;
  function openCard() {
    if (opening || !envelopeOpened) return;
    clearTimeout(autoOpenTimer);
    autoOpenTimer = null;
    opening = true;
    document.body.classList.add("card-transitioning");
    intro.classList.add("is-opening");
    const openDelay = window.matchMedia("(max-width: 700px), (max-height: 500px)").matches ? 520 : 1050;
    setTimeout(() => {
      intro.hidden = true;
      cardView.hidden = false;
      opening = false;
      intro.classList.remove("is-opening");
      document.body.classList.remove("card-transitioning");
      document.body.classList.add("card-open");
      if (window.matchMedia("(pointer: fine)").matches) {
        $("#prevPage").focus({ preventScroll: true });
      }
    }, openDelay);
  }
  function openEnvelope() {
    if (envelopeOpened || opening) return;
    if (!playing && !musicManuallyPaused) startBackgroundMusic();
    envelopeOpened = true;
    $(".envelope").classList.add("open");
    $("#openCard").setAttribute("aria-label", "Chạm lần nữa để mở tấm thiệp");
    $("#openCardLabel").innerHTML = "Chạm lần nữa để mở thiệp <span>→</span>";
    $("#openCardLabel").disabled = true;
    clearTimeout(autoOpenTimer);
    autoOpenTimer = setTimeout(openCard, 10000);
  }
  $("#openCard").addEventListener("click", () => {
    if (!envelopeOpened) {
      openEnvelope();
      return;
    }
    openCard();
  });
  $("#openCardLabel").addEventListener("click", () => {
    if (!envelopeOpened) openEnvelope();
  });
  $("#closeCard").addEventListener("click", () => {
    clearTimeout(autoOpenTimer);
    autoOpenTimer = null;
    document.body.classList.remove("card-transitioning");
    cardView.hidden = true;
    document.body.classList.remove("card-open");
    intro.hidden = false;
    intro.classList.remove("is-opening");
    $(".envelope").classList.remove("open");
    envelopeOpened = false;
    $("#openCard").setAttribute("aria-label", "Mở tấm thiệp");
    $("#openCardLabel").innerHTML = "Chạm để mở thiệp <span>→</span>";
    $("#openCardLabel").disabled = false;
  });

  // Điều hướng trang thiệp
  const allPages = $$(".page");
  // pages: birthday, birthday-wish, lock-gate, letter, love-counter, memories, confession
  const pages = [
    allPages[0],
    allPages[1],
    allPages[2], // page-lock-gate
    allPages[3], // page-letter
    allPages[4], // page-love-counter
    allPages[5], // page-memories
    allPages[6]  // page-confession
  ];
  const dots = $("#pageDots");
  let currentPage = 0;
  let writingStarted = false;
  let birthdayWritingStarted = false;
  let birthdayLetterOpened = false;
  let memoriesUnlocked = false;
  let candleBlown = false;
  let birthdayGiftOpened = false;
  let counterInterval = null;

  dots.replaceChildren();
  pages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Mở trang ${index + 1}`);
    dot.addEventListener("click", () => showPage(index));
    dots.append(dot);
  });
  function showPage(index) {
    const requestedPage = Math.max(0, Math.min(pages.length - 1, index));
    currentPage = !birthdayGiftOpened && requestedPage > 0
      ? 0
      : !memoriesUnlocked && requestedPage > 2
        ? 2
        : requestedPage;
    pages.forEach((page, i) => {
      page.hidden = i !== currentPage;
      page.classList.toggle("active", i === currentPage);
    });
    $$("#pageDots button").forEach((dot, i) => dot.classList.toggle("active", i === currentPage));
    $("#prevPage").disabled = currentPage === 0;
    $("#nextPage").disabled = currentPage === pages.length - 1 ||
      (currentPage === 2 && !memoriesUnlocked) ||
      (currentPage === 0 && !birthdayGiftOpened);
    if (currentPage === 1 && !birthdayWritingStarted) {
      birthdayWritingStarted = true;
      openBirthdayLetter();
    }
    if (currentPage === 3 && !writingStarted) {
      writingStarted = true;
      requestAnimationFrame(startLetterWriting);
    }
    if (currentPage === 4) {
      updateLoveCounter();
      clearInterval(counterInterval);
      counterInterval = setInterval(updateLoveCounter, 1000);
    } else {
      clearInterval(counterInterval);
    }
  }
  $("#prevPage").addEventListener("click", () => showPage(currentPage - 1));
  $("#nextPage").addEventListener("click", () => showPage(currentPage + 1));

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeTracking = false;
  const pagesArea = $("#pages");
  pagesArea.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" || event.target.closest("button, input, textarea, dialog")) return;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    swipeTracking = true;
  }, { passive: true });
  pagesArea.addEventListener("pointerup", event => {
    if (!swipeTracking) return;
    swipeTracking = false;
    const deltaX = event.clientX - swipeStartX;
    const deltaY = event.clientY - swipeStartY;
    if (Math.abs(deltaX) < 58 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    showPage(currentPage + (deltaX < 0 ? 1 : -1));
  }, { passive: true });
  pagesArea.addEventListener("pointercancel", () => {
    swipeTracking = false;
  }, { passive: true });

  document.addEventListener("keydown", event => {
    if (cardView.hidden) return;
    if (event.target.matches("input, textarea")) return;
    if (event.key === "Escape") {
      const openPhotoDialog = $("#birthdayPhotoDialog[open]");
      if (openPhotoDialog) {
        event.preventDefault();
        openPhotoDialog.close();
        return;
      }
      $("#closeCard").click();
      return;
    }
    if (event.key === "ArrowLeft") showPage(currentPage - 1);
    if (event.key === "ArrowRight") showPage(currentPage + 1);
  });
  showPage(0);

  // Typewriter Lời chúc sinh nhật
  const birthdayParagraphs = CARD_CONTENT.birthdayParagraphs;
  let birthdayTimer = null;
  function prepareBirthdayWriting() {
    const copy = $("#birthdayCopy");
    copy.replaceChildren();
    birthdayParagraphs.forEach(text => {
      const paragraph = document.createElement("p");
      [...text].forEach(character => {
        const span = document.createElement("span");
        span.className = character === " " ? "ink-char ink-space" : "ink-char";
        span.textContent = character;
        paragraph.append(span);
      });
      copy.append(paragraph);
    });
  }
  function finishBirthdayWriting() {
    clearTimeout(birthdayTimer);
    $$("#birthdayCopy .ink-char").forEach(character => character.classList.add("written"));
    $("#birthdayPen").style.opacity = "0";
    $("#birthdayWritingStatus").textContent = "Lời chúc đã viết xong ♡";
    $("#finishBirthdayWriting").hidden = true;
  }
  function startBirthdayWriting() {
    prepareBirthdayWriting();
    const characters = $$("#birthdayCopy .ink-char");
    const area = $(".birthday-writing");
    const pen = $("#birthdayPen");
    pen.style.opacity = "1";
    $("#finishBirthdayWriting").hidden = false;
    let index = 0;
    function writeNext() {
      if (index >= characters.length) {
        finishBirthdayWriting();
        return;
      }
      const batchSize = 1;
      let character = characters[index];
      for (let count = 0; count < batchSize && index < characters.length; count += 1) {
        character = characters[index];
        character.classList.add("written");
        index += 1;
      }
      if (!isTouchDevice || index % 2 === 0 || index >= characters.length) {
        const areaBox = area.getBoundingClientRect();
        const charBox = character.getBoundingClientRect();
        const penLeft = Math.max(8, Math.min(area.clientWidth - 28, charBox.right - areaBox.left));
        pen.style.left = `${penLeft}px`;
        pen.style.top = `${charBox.bottom - areaBox.top}px`;
        if (charBox.bottom > areaBox.bottom - 28) {
          area.scrollTop += charBox.bottom - areaBox.bottom + 46;
        }
      }
      const pause = isTouchDevice
        ? (/[.,!?—]/.test(character.textContent) ? 230 : character.textContent === " " ? 40 : 72)
        : (/[.,!?—]/.test(character.textContent) ? 260 : character.textContent === " " ? 35 : 88);
      birthdayTimer = setTimeout(writeNext, pause);
    }
    requestAnimationFrame(writeNext);
  }

  function openBirthdayLetter() {
    if (birthdayLetterOpened) {
      startBirthdayWriting();
      return;
    }
    birthdayLetterOpened = true;
    const fold = $("#birthdayLetterFold");
    $("#nextPage").disabled = true;
    fold.hidden = false;
    if (playing) {
      bgMusic.volume = 0.28;
      try {
        playFlipSound();
      } catch (error) {
        // Âm thanh phụ không được phép làm gián đoạn hiệu ứng mở thư.
      }
    }
    void fold.offsetWidth;
    fold.classList.add("opening");
    setTimeout(() => {
      fold.hidden = true;
      fold.classList.remove("opening");
      bgMusic.volume = 0.75;
      $("#nextPage").disabled = false;
      startBirthdayWriting();
    }, 1250);
  }

  $("#finishBirthdayWriting").addEventListener("click", finishBirthdayWriting);
  prepareBirthdayWriting();

  // Thổi nến tương tác
  const cake = $("#birthdayCake");
  function celebrateBirthdayWish() {
    const celebration = document.createElement("div");
    celebration.className = "birthday-celebration";
    celebration.setAttribute("aria-hidden", "true");
    const colors = ["#e98d9d", "#f4b7a4", "#d98bb6", "#f1c76d", "#e2a5a5"];
    for (let i = 0; i < 36; i += 1) {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${Math.random() * 100}vw`);
      petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 34}vw`);
      petal.style.setProperty("--turn", `${Math.round(260 + Math.random() * 520)}deg`);
      petal.style.setProperty("--delay", `${Math.random() * 0.7}s`);
      petal.style.setProperty("--duration", `${2.15 + Math.random() * 0.8}s`);
      petal.style.background = colors[i % colors.length];
      celebration.appendChild(petal);
    }
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 3400);
  }

  function turnCandleIntoStar() {
    const page = $(".page-birthday");
    const pageBox = page.getBoundingClientRect();
    const cakeBox = cake.getBoundingClientRect();
    const star = document.createElement("span");
    star.className = "wish-star-in-card";
    star.setAttribute("aria-label", "Điều ước đã hóa thành một vì sao");
    star.textContent = "✦";
    const startX = cakeBox.left - pageBox.left + cakeBox.width / 2;
    const startY = cakeBox.top - pageBox.top + 22;
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    const flyX = pageBox.width - 52 - startX;
    const flyY = 42 - startY;
    star.style.setProperty("--fly-x", `${flyX}px`);
    star.style.setProperty("--fly-y", `${flyY}px`);
    star.style.setProperty("--fly-x-mid", `${flyX * 0.52}px`);
    star.style.setProperty("--fly-y-mid", `${flyY * 0.55 - 34}px`);
    page.appendChild(star);
    setTimeout(() => star.remove(), 4500);
  }

  cake.addEventListener("click", () => {
    if (cake.classList.contains("blown")) return;
    cake.classList.add("blown");

    // Phát âm thanh thổi nến và nhạc vang lên
    if (playing && audioContext) {
      playBlowSound();
      setTimeout(playChimeSound, 400);
    } else {
      // Nếu nhạc chưa bật, khởi tạo audioContext ngầm để phát hiệu ứng
      initAudioSilent();
    }

    // Tạo hiệu ứng khói bay
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.className = "smoke-particle";
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 32}px`);
      p.style.animationDelay = `${i * 0.08}s`;
      cake.appendChild(p);
      setTimeout(() => p.remove(), 1300);
    }

    $("#blowInstruction").innerHTML = "Điều ước của Vân Anh đã được gửi đến những vì sao ♡";
    $("#blowInstruction").classList.add("highlight-text");
    celebrateBirthdayWish();
    turnCandleIntoStar();

    candleBlown = true;
    setTimeout(() => {
      $("#openBirthdayGift").hidden = false;
    }, 1100);
  });

  $("#openBirthdayGift").addEventListener("click", () => {
    if (birthdayGiftOpened) return;
    birthdayGiftOpened = true;
    const reveal = $("#birthdayGiftReveal");
    reveal.hidden = false;
    requestAnimationFrame(() => reveal.classList.add("show"));
    $("#nextPage").disabled = false;
    burst();
  });

  $("#continueBirthdayGift").addEventListener("click", () => showPage(1));

  const birthdayPhotoDialog = $("#birthdayPhotoDialog");
  $("#openBirthdayPhoto").addEventListener("click", () => {
    birthdayPhotoDialog.showModal();
    burst();
  });
  $("#closeBirthdayPhoto").addEventListener("click", () => birthdayPhotoDialog.close());
  birthdayPhotoDialog.addEventListener("click", event => {
    if (event.target === birthdayPhotoDialog) birthdayPhotoDialog.close();
  });

  function initAudioSilent() {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      initAudioNodes();
      playBlowSound();
      setTimeout(playChimeSound, 400);
    } catch (e) { }
  }

  // Khóa thư mật
  $("#memorySeal").addEventListener("click", () => {
    $("#memorySeal").classList.add("opening");
    setTimeout(() => {
      $("#memorySeal").hidden = true;
      $("#memoryPasswordPanel").hidden = false;
      $("#password").focus();
    }, 650);
  });

  // Typewriter Bức thư bí mật
  const letterParagraphs = CARD_CONTENT.letterParagraphs;
  let writingTimer = null;
  function prepareLetter() {
    const letterCopy = $("#letterCopy");
    letterCopy.replaceChildren();
    letterParagraphs.forEach(text => {
      const paragraph = document.createElement("p");
      [...text].forEach(character => {
        const span = document.createElement("span");
        span.className = character === " " ? "ink-char ink-space" : "ink-char";
        span.textContent = character;
        paragraph.append(span);
      });
      letterCopy.append(paragraph);
    });
  }
  function movePenTo(character) {
    const areaBox = $(".writing-area").getBoundingClientRect();
    const charBox = character.getBoundingClientRect();
    $("#writingPen").style.left = `${charBox.right - areaBox.left}px`;
    $("#writingPen").style.top = `${charBox.bottom - areaBox.top}px`;
  }
  function finishLetterWriting() {
    clearTimeout(writingTimer);
    $$("#letterCopy .ink-char").forEach(character => {
      character.classList.add("written");
    });
    $("#writingPen").classList.add("done");
    $("#writingStatus").textContent = "Bức thư đã viết xong ♡";
    $("#finishWriting").hidden = true;
    $("#letterSignature").classList.add("show");
  }
  function startLetterWriting() {
    prepareLetter();
    $("#writingPen").classList.remove("done");
    $("#writingPen").style.left = "0px";
    $("#writingPen").style.top = "0px";
    $("#finishWriting").hidden = false;
    $("#writingStatus").textContent = "Đang viết thư...";
    $("#letterSignature").classList.remove("show");
    const characters = $$("#letterCopy .ink-char");
    characters.forEach(character => character.classList.remove("written"));
    let index = 0;
    function writeNext() {
      if (index >= characters.length) {
        finishLetterWriting();
        return;
      }
      const batchSize = 1;
      let character = characters[index];
      for (let count = 0; count < batchSize && index < characters.length; count += 1) {
        character = characters[index];
        character.classList.add("written");
        index += 1;
      }
      if (!isTouchDevice || index % 2 === 0 || index >= characters.length) {
        movePenTo(character);
      }
      const pause = isTouchDevice
        ? (/[.,!?]/.test(character.textContent) ? 220 : character.textContent === " " ? 38 : 68)
        : (/[.,!?]/.test(character.textContent) ? 230 : character.textContent === " " ? 28 : 62);
      writingTimer = setTimeout(writeNext, pause);
    }
    requestAnimationFrame(writeNext);
  }
  function unlockMemories() {
    const password = $("#password").value.trim();
    if (password === CARD_CONTENT.password) {
      $("#memoryPasswordPanel").hidden = true;
      $("#unlockSuccess").hidden = false;
      memoriesUnlocked = true;
      $("#nextPage").disabled = false;
    } else {
      $("#formMessage").textContent = "Chưa đúng rồi, em thử lại nhé ♡";
      $("#password").focus();
    }
  }
  $("#unlockButton").addEventListener("click", unlockMemories);
  $("#openSecretLetter").addEventListener("click", () => showPage(3));
  $("#password").addEventListener("keydown", event => {
    if (event.key === "Enter") unlockMemories();
  });
  $("#finishWriting").addEventListener("click", finishLetterWriting);

  // Bộ đếm ngày kỉ niệm
  const startDate = new Date("2026-06-10T00:00:00+07:00");
  function updateLoveCounter() {
    const now = new Date();
    const diff = now - startDate;
    if (diff < 0) {
      $("#countDays").textContent = "00";
      $("#countHours").textContent = "00";
      $("#countMinutes").textContent = "00";
      $("#countSeconds").textContent = "00";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    $("#countDays").textContent = String(days).padStart(2, "0");
    $("#countHours").textContent = String(hours).padStart(2, "0");
    $("#countMinutes").textContent = String(minutes).padStart(2, "0");
    $("#countSeconds").textContent = String(seconds).padStart(2, "0");
  }

  // Kỷ niệm lật 3D Polaroid
  $$(".polaroid-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      if (playing && audioContext) {
        playFlipSound();
      }
    });
  });

  // -------------------------------------------------------------
  // Nhạc nền (Audio Element) & Hiệu ứng Âm thanh (Web Audio SFX)
  // -------------------------------------------------------------
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = 0.75;
  let playing = false;
  let musicManuallyPaused = false;

  // audioContext chỉ dùng cho SFX ngắn (blow, chime, flip)
  let audioContext = null;

  function ensureAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  }

  function midiToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // SFX 1: Tiếng gió thổi nến (White Noise Blow)
  function playBlowSound() {
    ensureAudioContext();
    const bufferSize = audioContext.sampleRate * 0.35;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, audioContext.currentTime);
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    noise.connect(filter).connect(gain).connect(audioContext.destination);
    noise.start(now);
  }

  // SFX 2: Chuông ngũ âm lung linh sau khi thổi nến
  function playChimeSound() {
    ensureAudioContext();
    const now = audioContext.currentTime;
    const notes = [72, 76, 79, 81, 84, 88];
    notes.forEach((note, index) => {
      const osc = audioContext.createOscillator();
      const oscGain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(midiToFreq(note), now + index * 0.08);
      oscGain.gain.setValueAtTime(0.0001, now + index * 0.08);
      oscGain.gain.linearRampToValueAtTime(0.04, now + index * 0.08 + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.2);
      osc.connect(oscGain).connect(audioContext.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 1.3);
    });
  }

  // SFX 3: Lật ảnh Polaroid (Highpass sweep)
  function playFlipSound() {
    ensureAudioContext();
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.14);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  function updateMusicButton() {
    $("#soundButton").classList.toggle("playing", playing);
    $("#soundButton").setAttribute("aria-pressed", String(playing));
  }

  async function startBackgroundMusic() {
    try {
      await bgMusic.play();
      return true;
    } catch (e) {
      playing = false;
      updateMusicButton();
      return false;
    }
  }

  bgMusic.addEventListener("play", () => {
    playing = true;
    updateMusicButton();
  });

  bgMusic.addEventListener("pause", () => {
    playing = false;
    updateMusicButton();
  });

  // Cố gắng phát ngay khi mở thiệp; nếu trình duyệt chặn autoplay,
  // lần chạm đầu tiên vào trang sẽ phát nhạc tự động.
  startBackgroundMusic();
  document.addEventListener("pointerdown", () => {
    if (!playing && !musicManuallyPaused) startBackgroundMusic();
  });

  // soundButton: bật/tắt nhạc nền MP3
  $("#soundButton").addEventListener("click", async () => {
    if (!playing) {
      musicManuallyPaused = false;
      ensureAudioContext();
      await startBackgroundMusic();
    } else {
      musicManuallyPaused = true;
      bgMusic.pause();
    }
  });

  // -------------------------------------------------------------
  // Tỏ tình & Nút Trốn tìm (Confession & Playful Dodging Button)
  // -------------------------------------------------------------
  const thinkButton = $("#thinkButton");
  let thinkClicks = 0;

  function dodgeButton() {
    const cardShell = $(".card-shell");
    const shellRect = cardShell.getBoundingClientRect();
    const btnRect = thinkButton.getBoundingClientRect();

    // Định khoảng cách chạy trốn tối đa nằm gọn trong card shell
    const xMax = Math.min(220, shellRect.width / 2 - btnRect.width);
    const yMax = Math.min(160, shellRect.height / 2 - btnRect.height);

    let randomX = (Math.random() - 0.5) * xMax * 2;
    let randomY = (Math.random() - 0.5) * yMax * 2 - 40; // dịch lên trên tí để tránh đè nút đồng ý

    thinkButton.style.transform = `translate(${randomX}px, ${randomY}px)`;

    const messages = [
      "Hông cho bấm đâuuu 😜",
      "Nút này bị hỏng rùi em ạ...",
      "Anh chờ em đồng ý thui đó ♡",
      "Bên trái có nút đẹp hơn kìa ✨",
      "Thử bấm nút bên trái xem sao? 😘",
      "Đừng né tránh tình cảm của anh mà 🥺",
      "Không bấm được đâu nha bé yêu!"
    ];
    $("#answerMessage").textContent = messages[thinkClicks % messages.length];
    thinkClicks++;
  }

  thinkButton.addEventListener("mouseenter", dodgeButton);
  thinkButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    dodgeButton();
  });
  thinkButton.addEventListener("click", (e) => {
    e.preventDefault();
    dodgeButton();
  });

  $("#yesButton").addEventListener("click", () => {
    $("#successDialog").showModal();
    burst();
    if (window.burstPetals) {
      window.burstPetals(); // Bùng nổ cánh hoa
    }
  });
  $("#closeSuccess").addEventListener("click", () => {
    $("#successDialog").close();
    showPage(0);
  });

  function burst() {
    const layer = $("#confetti");
    layer.replaceChildren();
    for (let index = 0; index < 38; index += 1) {
      const piece = document.createElement("i");
      piece.textContent = index % 3 ? "♥" : "✦";
      const angle = Math.random() * Math.PI * 2;
      const distance = 130 + Math.random() * Math.min(innerWidth, innerHeight) * .42;
      piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      piece.style.color = index % 3 ? "#e88190" : "#d9b06f";
      piece.style.fontSize = `${12 + Math.random() * 18}px`;
      layer.append(piece);
    }
    setTimeout(() => layer.replaceChildren(), 1600);
  }
});
