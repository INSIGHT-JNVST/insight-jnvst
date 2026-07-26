/* =========================================================
   INSIGHT JNVST COACHING CENTRE — SCRIPT
   Vanilla JS, no build step, no external JS dependencies.
   Sections mirror style.css: preloader, theme, nav, reveal,
   counters, gallery, testimonials, FAQ+search, quiz, forms.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Safe storage helper (works even if storage
     is blocked, e.g. inside a sandboxed preview) ---------- */
  var memoryStore = {};
  var storage = {
    get: function (key) {
      try { return window.localStorage.getItem(key); }
      catch (e) { return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); }
      catch (e) { memoryStore[key] = value; }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initTheme();
    initNavbar();
    initHamburger();
    initSmoothActiveLinks();
    initReveal();
    initCounters();
    initGallery();
    initTestimonials();
    initFaq();
    initQuiz();
    initAdmissionForm();
    initCopyButtons();
    initFloatingButtons();
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    window.addEventListener("load", function () {
      setTimeout(function () { pre.classList.add("loaded"); }, 500);
    });
    // Safety fallback in case 'load' fires very late
    setTimeout(function () { pre.classList.add("loaded"); }, 3500);
  }

  /* ---------- Dark mode ---------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById("theme-toggle");
    var saved = storage.get("insight-theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);

    if (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        storage.set("insight-theme", next);
      });
    }

    function applyTheme(t) {
      if (t === "dark") {
        root.setAttribute("data-theme", "dark");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        root.removeAttribute("data-theme");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
    }
  }

  /* ---------- Navbar scroll + progress bar ---------- */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    var progress = document.getElementById("scroll-progress");
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (navbar) navbar.classList.toggle("scrolled", y > 40);
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (y / docH) * 100 : 0;
      if (progress) progress.style.width = pct + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initHamburger() {
    var burger = document.getElementById("hamburger");
    var links = document.getElementById("nav-links");
    if (!burger || !links) return;
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link highlight ---------- */
  function initSmoothActiveLinks() {
    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav-links a");
    if (!sections.length || !links.length) return;
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute("href").replace("#", "")] = l; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var link = byId[entry.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (i) { observer.observe(i); });
  }

  /* ---------- Counter animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { observer.observe(c); });

    function animateCounter(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
  }

  /* ---------- Gallery lightbox ---------- */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    if (!items.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<div><img alt=""><p class="lightbox-caption"></p></div>' +
      '<button class="lightbox-nav lightbox-next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector("img");
    var capEl = overlay.querySelector(".lightbox-caption");
    var index = 0;

    function open(i) {
      index = i;
      render();
      overlay.classList.add("open");
    }
    function render() {
      var item = items[index];
      imgEl.src = item.getAttribute("data-full");
      imgEl.alt = item.getAttribute("data-caption") || "";
      capEl.textContent = item.getAttribute("data-caption") || "";
    }
    function close() { overlay.classList.remove("open"); }
    function next() { index = (index + 1) % items.length; render(); }
    function prev() { index = (index - 1 + items.length) % items.length; render(); }

    items.forEach(function (item, i) {
      item.addEventListener("click", function () { open(i); });
    });
    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.querySelector(".lightbox-next").addEventListener("click", next);
    overlay.querySelector(".lightbox-prev").addEventListener("click", prev);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonials() {
    var track = document.getElementById("testimonial-track");
    if (!track) return;
    var cards = track.children;
    var dotsWrap = document.getElementById("t-dots");
    var prevBtn = document.getElementById("t-prev");
    var nextBtn = document.getElementById("t-next");
    var idx = 0;
    var timer;

    for (var i = 0; i < cards.length; i++) {
      var dot = document.createElement("span");
      if (i === 0) dot.className = "active";
      dot.addEventListener("click", (function (n) { return function () { goTo(n); }; })(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(n) {
      idx = (n + cards.length) % cards.length;
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }
    function autoplay() {
      timer = setInterval(function () { goTo(idx + 1); }, 5500);
    }
    function stop() { clearInterval(timer); }

    prevBtn.addEventListener("click", function () { goTo(idx - 1); stop(); autoplay(); });
    nextBtn.addEventListener("click", function () { goTo(idx + 1); stop(); autoplay(); });
    track.parentElement.addEventListener("mouseenter", stop);
    track.parentElement.addEventListener("mouseleave", autoplay);
    autoplay();
  }

  /* ---------- FAQ accordion + search ---------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });

    var search = document.getElementById("faq-search");
    var noResult = document.getElementById("faq-no-result");
    if (!search) return;
    search.addEventListener("input", function () {
      var term = search.value.trim().toLowerCase();
      var visibleCount = 0;
      items.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        var match = term === "" || text.indexOf(term) !== -1;
        item.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
      noResult.classList.toggle("hidden", visibleCount !== 0);
    });
  }

  /* ---------- Free practice quiz ---------- */
  var QUIZ_BANK = {
    mat: [
      { q: "Find the odd one out: Circle, Square, Triangle, Red", options: ["Circle", "Square", "Triangle", "Red"], answer: 3 },
      { q: "Complete the series: 2, 4, 6, 8, ?", options: ["9", "10", "11", "12"], answer: 1 },
      { q: "Hand is to Glove as Foot is to ?", options: ["Shoe", "Sock", "Leg", "Toe"], answer: 1 },
      { q: "Which does not belong with the others?", options: ["Apple", "Banana", "Carrot", "Mango"], answer: 2 },
      { q: "Complete the series: 5, 10, 15, 20, ?", options: ["22", "24", "25", "30"], answer: 2 },
      { q: "Book is to Reading as Fork is to ?", options: ["Kitchen", "Eating", "Spoon", "Plate"], answer: 1 },
      { q: "Find the odd one out: Rose, Lily, Lotus, Mango", options: ["Rose", "Lily", "Lotus", "Mango"], answer: 3 },
      { q: "If MOUSE is coded as NPVTF, how is CAT coded?", options: ["DBU", "BZS", "DZU", "DBS"], answer: 0 }
    ],
    evs: [
      { q: "Which organ pumps blood in the human body?", options: ["Lungs", "Heart", "Kidney", "Liver"], answer: 1 },
      { q: "Plants make their own food through a process called?", options: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"], answer: 2 },
      { q: "Which gas do plants absorb from the air to make food?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 2 },
      { q: "Which of these is a renewable source of energy?", options: ["Coal", "Petrol", "Sunlight", "Diesel"], answer: 2 },
      { q: "The process of water changing into vapour is called?", options: ["Condensation", "Evaporation", "Precipitation", "Freezing"], answer: 1 },
      { q: "Which of these helps purify the air we breathe?", options: ["Trees", "Vehicles", "Factories", "Plastic"], answer: 0 },
      { q: "Which part of the plant absorbs water from the soil?", options: ["Leaf", "Flower", "Root", "Stem"], answer: 2 },
      { q: "Washing hands before eating helps prevent the spread of?", options: ["Light", "Germs", "Sound", "Heat"], answer: 1 }
    ],
    math: [
      { q: "What is the LCM of 4 and 6?", options: ["10", "12", "18", "24"], answer: 1 },
      { q: "What is 3/4 written as a decimal?", options: ["0.34", "0.43", "0.75", "0.57"], answer: 2 },
      { q: "What is 20% of 150?", options: ["20", "25", "30", "35"], answer: 2 },
      { q: "Find the perimeter of a square with side 5 cm.", options: ["10 cm", "15 cm", "20 cm", "25 cm"], answer: 2 },
      { q: "What is the HCF of 8 and 12?", options: ["2", "4", "6", "8"], answer: 1 },
      { q: "What is 7 x 8?", options: ["54", "56", "58", "64"], answer: 1 },
      { q: "A shirt costs ₹400 and is sold for ₹460. What is the profit?", options: ["₹40", "₹50", "₹60", "₹70"], answer: 2 },
      { q: "What is the area of a rectangle 6 cm by 4 cm?", options: ["10 cm²", "20 cm²", "24 cm²", "28 cm²"], answer: 2 }
    ],
    eng: [
      { q: "Choose the correct synonym for 'Happy'.", options: ["Sad", "Angry", "Joyful", "Tired"], answer: 2 },
      { q: "Choose the correct antonym for 'Big'.", options: ["Huge", "Small", "Tall", "Wide"], answer: 1 },
      { q: "Identify the verb: 'She sings a beautiful song.'", options: ["She", "Sings", "Beautiful", "Song"], answer: 1 },
      { q: "Choose the correct plural of 'Child'.", options: ["Childs", "Childes", "Children", "Childrens"], answer: 2 },
      { q: "Which word is a pronoun in: 'He went to school.'", options: ["He", "Went", "To", "School"], answer: 0 },
      { q: "Choose the correctly spelled word.", options: ["Recieve", "Receive", "Receeve", "Receve"], answer: 1 },
      { q: "Fill in the blank: She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
      { q: "Choose the correct article: '___ apple a day keeps the doctor away.'", options: ["A", "An", "The", "No article needed"], answer: 1 }
    ]
  };
  var SUBJECT_LABEL = { mat: "Mental Ability", evs: "Environmental Studies", math: "Arithmetic", eng: "English" };

  function initQuiz() {
    var picker = document.getElementById("quiz-picker");
    var playBox = document.getElementById("quiz-play");
    var resultBox = document.getElementById("quiz-result");
    if (!picker) return;

    var questions = [], currentIndex = 0, score = 0, currentSubject = "";

    picker.querySelectorAll(".quiz-subject-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentSubject = btn.getAttribute("data-subject");
        questions = shuffle(QUIZ_BANK[currentSubject].slice()).slice(0, 5);
        currentIndex = 0; score = 0;
        picker.classList.add("hidden");
        resultBox.classList.add("hidden");
        playBox.classList.remove("hidden");
        renderQuestion();
      });
    });

    document.getElementById("quiz-next").addEventListener("click", function () {
      currentIndex++;
      if (currentIndex >= questions.length) showResult();
      else renderQuestion();
    });

    document.getElementById("quiz-retry").addEventListener("click", function () {
      resultBox.classList.add("hidden");
      picker.classList.remove("hidden");
    });

    function renderQuestion() {
      var item = questions[currentIndex];
      document.getElementById("quiz-progress-label").textContent = "Question " + (currentIndex + 1) + " of " + questions.length;
      document.getElementById("quiz-score-label").textContent = "Score: " + score;
      document.getElementById("quiz-progress-bar").style.width = ((currentIndex) / questions.length * 100) + "%";
      document.getElementById("quiz-question").textContent = item.q;
      var optionsWrap = document.getElementById("quiz-options");
      optionsWrap.innerHTML = "";
      var nextBtn = document.getElementById("quiz-next");
      nextBtn.disabled = true;

      item.options.forEach(function (opt, i) {
        var b = document.createElement("button");
        b.className = "quiz-option";
        b.textContent = opt;
        b.addEventListener("click", function () {
          if (b.classList.contains("locked")) return;
          Array.prototype.forEach.call(optionsWrap.children, function (o) { o.classList.add("locked"); });
          if (i === item.answer) {
            b.classList.add("correct");
            score++;
          } else {
            b.classList.add("incorrect");
            optionsWrap.children[item.answer].classList.add("correct");
          }
          document.getElementById("quiz-score-label").textContent = "Score: " + score;
          nextBtn.disabled = false;
        });
        optionsWrap.appendChild(b);
      });
    }

    function showResult() {
      playBox.classList.add("hidden");
      resultBox.classList.remove("hidden");
      document.getElementById("quiz-progress-bar").style.width = "100%";
      var pct = Math.round((score / questions.length) * 100);
      var title = pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort — keep practising!" : "Keep going — practice makes perfect!";
      document.getElementById("quiz-result-title").textContent = title;
      document.getElementById("quiz-result-score").textContent =
        "You scored " + score + " out of " + questions.length + " in " + SUBJECT_LABEL[currentSubject] + " (" + pct + "%).";
    }

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      return arr;
    }
  }

  /* ---------- Admission form -> WhatsApp ---------- */
  function initAdmissionForm() {
    var form = document.getElementById("admission-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = {
        student: document.getElementById("f-student"),
        parent: document.getElementById("f-parent"),
        phone: document.getElementById("f-phone"),
        studentClass: document.getElementById("f-class"),
        school: document.getElementById("f-school"),
        address: document.getElementById("f-address")
      };
      var message = document.getElementById("f-message");
      var valid = true;

      Object.keys(fields).forEach(function (key) {
        var el = fields[key];
        var errorEl = form.querySelector('.form-error[data-for="' + el.id + '"]');
        var value = el.value.trim();
        var fieldValid = value.length > 0;

        if (key === "phone" && value) {
          fieldValid = /^[+]?[0-9\s-]{10,14}$/.test(value);
        }

        el.classList.toggle("invalid", !fieldValid);
        if (errorEl) errorEl.textContent = fieldValid ? "" : (key === "phone" ? "Enter a valid phone number" : "This field is required");
        if (!fieldValid) valid = false;
      });

      if (!valid) {
        showToast("Please fill all required fields correctly.", "error");
        return;
      }

      var text =
        "New Admission Enquiry - INSIGHT JNVST\n" +
        "Student Name: " + fields.student.value.trim() + "\n" +
        "Parent Name: " + fields.parent.value.trim() + "\n" +
        "Phone: " + fields.phone.value.trim() + "\n" +
        "Class: " + fields.studentClass.value + "\n" +
        "School: " + fields.school.value.trim() + "\n" +
        "Address: " + fields.address.value.trim() +
        (message.value.trim() ? "\nMessage: " + message.value.trim() : "");

      var url = "https://wa.me/917638053535?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      showToast("Opening WhatsApp with your details...", "success");
    });

    // Clear error state as the user corrects a field
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("invalid"); });
    });
  }

  /* ---------- Copy to clipboard ---------- */
  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        copyText(text).then(function (ok) {
          showToast(ok ? "Copied to clipboard!" : "Could not copy — please copy manually.", ok ? "success" : "error");
        });
      });
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------- Floating back-to-top ---------- */
  function initFloatingButtons() {
    var topBtn = document.getElementById("back-to-top");
    if (!topBtn) return;
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Toast notifications ---------- */
  function showToast(msg, type) {
    var container = document.getElementById("toast-container");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast";
    var icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + msg + "</span>";
    container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("leaving");
      setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  }

  window.InsightToast = showToast; // exposed in case future sections need it
})();
