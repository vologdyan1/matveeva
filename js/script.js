/**
 * Мобильное меню (бургер): открытие/закрытие, закрытие по Escape и по клику на якорь.
 * Плавная прокрутка к секциям по клику на якорные ссылки (в шапке и футере).
 */
const SECTION_IDS = ["hero", "services", "portfolio", "about", "contacts"];

/** Карусель «Пример готового проекта»: подписи слайдов. URL строится по индексу: assets/carousel-thumbs/ и CAROUSEL_LIGHTBOX_BASE. */
const CAROUSEL_LIGHTBOX_BASE = "assets/carousel-lightbox/";
const CAROUSEL_ITEMS = [
  { caption: "1 обмерный план" },
  { caption: "2 Схема демонтажа перегородок" },
  { caption: "2.1 Схема монтажа перегородок" },
  { caption: "3 План расстановки мебели" },
  { caption: "4 Схема сантехники" },
  { caption: "4.1 Схема сантехники" },
  { caption: "4.2 Сантех привязка кондиционеров" },
  { caption: "5 Схема потолков" },
  { caption: "6 Схема напольных покрытий" },
  { caption: "7 Схема светильников" },
  { caption: "8 Схема розеток" },
  { caption: "9 Ведомость светильников" },
  { caption: "10 Спецификация розеточных блоков" },
  { caption: "11 Схема отделки стен" },
  { caption: "12 Развертки по стенам коридора" },
  { caption: "12.1 Развертки стен коридора 2" },
  { caption: "13 Развертки по стенам кухни гостиной" },
  { caption: "13.1 Развертки по стенам кухни гостиной 2" },
  { caption: "14 Развертки по стенам спальни" },
  { caption: "15 Развертки по стенам детской 1" },
  { caption: "15.1 Развертки по стенам детской 2" },
  { caption: "16 развертки по стенам душевой" },
  { caption: "16.1 Развертки по стенам ванной" },
  { caption: "17 Ведомость заполнения дверных проемов" },
  { caption: "18 Сводная ведомость отделки потолка и стен 1" },
  { caption: "18.1 Сводная ведомость отделки потолка и стен 2" },
];
window.__CAROUSEL_ITEMS = CAROUSEL_ITEMS;

const init = () => {
  const header = document.querySelector(".page-header");
  const burger = document.querySelector(".page-header__burger");
  const nav = document.getElementById("page-header-nav");

  const isMenuOpen = () => header?.classList.contains("page-header--menu-open");

  const closeMobileMenu = () => {
    if (!header) return;
    header.classList.remove("page-header--menu-open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    if (!header) return;
    header.classList.add("page-header--menu-open");
    burger?.setAttribute("aria-expanded", "true");
    burger?.setAttribute("aria-label", "Закрыть меню");
    document.body.style.overflow = "hidden";
  };

  const handleBurgerClick = () => {
    if (isMenuOpen()) closeMobileMenu();
    else openMobileMenu();
  };

  const handleBurgerKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    handleBurgerClick();
  };

  if (burger) {
    burger.addEventListener("click", handleBurgerClick);
    burger.addEventListener("keydown", handleBurgerKeyDown);
  }

  const HEADER_OFFSET_PX = () =>
    header?.offsetHeight ?? parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "80", 10);

  /** Доп. отступ для scroll-spy (порог входа секции в «видимую» зону). */
  const SCROLL_SPY_OFFSET_PX = 80;

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const title = section.querySelector(".section__title") || section;
    const top = title.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const handleSectionLinkClick = (e) => {
    const href = e.currentTarget.getAttribute("href") || "";
    const id = href.slice(1);
    if (!SECTION_IDS.includes(id)) return;
    e.preventDefault();
    closeMobileMenu();
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
  };

  document.querySelectorAll(".nav-list__link[href^='#']").forEach((link) => {
    const id = (link.getAttribute("href") || "").slice(1);
    if (SECTION_IDS.includes(id)) link.addEventListener("click", handleSectionLinkClick);
  });

  document.querySelectorAll(".page-footer__nav-link[href^='#']").forEach((link) => {
    const id = (link.getAttribute("href") || "").slice(1);
    if (SECTION_IDS.includes(id)) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(id);
      });
    }
  });

  /** Throttle скролла для scroll-spy (мс). */
  const SCROLL_THROTTLE_MS = 120;
  /** Debounce resize для карусели (мс). */
  const CAROUSEL_RESIZE_DEBOUNCE_MS = 150;

  /** Подсветка пункта навигации при скролле до привязанной секции. */
  const NAV_LINK_ACTIVE_CLASS = "nav-list__link--active";
  const SECTION_SELECTOR = "[id='hero'], [id='services'], [id='portfolio'], [id='about'], [id='contacts']";

  const navLinks = document.querySelectorAll(".nav-list__link[href^='#']");
  const sections = document.querySelectorAll(SECTION_SELECTOR);

  if (navLinks.length > 0 && sections.length > 0) {
    const sectionIds = Array.from(sections).map((section) => section.id);

    const setActiveLink = (activeId) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const targetId = href ? href.slice(1) : "";
        if (targetId === activeId) {
          link.classList.add(NAV_LINK_ACTIVE_CLASS);
          link.setAttribute("aria-current", "location");
        } else {
          link.classList.remove(NAV_LINK_ACTIVE_CLASS);
          link.removeAttribute("aria-current");
        }
      });
    };

    const getVisibleSectionId = () => {
      const offset = HEADER_OFFSET_PX() + SCROLL_SPY_OFFSET_PX;
      const scrollY = window.scrollY || window.pageYOffset;
      const atBottom =
        scrollY + window.innerHeight >= document.documentElement.scrollHeight - offset;

      let currentId = sectionIds[0];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const top = section.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - offset) {
          currentId = section.id;
          break;
        }
      }
      if (atBottom && sectionIds.length > 0) {
        currentId = sectionIds[sectionIds.length - 1];
      }
      return currentId;
    };

    const handleScroll = () => {
      setActiveLink(getVisibleSectionId());
    };

    let scrollScheduled = false;
    const handleScrollThrottled = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      handleScroll();
      setTimeout(() => { scrollScheduled = false; }, SCROLL_THROTTLE_MS);
    };

    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    handleScroll();
  }

/**
 * Модальное окно формы консультации и формы в блоке Контакты.
 * Валидация и маска телефона общие для обеих форм.
 */
const CONSULT_MODAL_ID = "consult-modal";
const INVALID_CLASS_INPUT = "consult-form__input--invalid";
const INVALID_CLASS_CHECKBOX = "consult-form__checkbox--invalid";
const PHONE_PLACEHOLDER = "+79999999999";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// Ключ виден в клиенте. Для продакшена: ограничьте домен в dashboard Web3Forms; при наличии бэкенда подставляйте ключ на сервере.
const WEB3FORMS_ACCESS_KEY = "e6f55808-55b4-452b-91bf-e4ceb94651ed";
const SUBMIT_BTN_LABEL_DEFAULT = "Свяжитесь со мной";
const SUBMIT_BTN_LABEL_SENDING = "Отправка…";

const modal = document.getElementById(CONSULT_MODAL_ID);
const openBtns = document.querySelectorAll(".js-open-consult");
const backdrop = modal?.querySelector(".modal__backdrop");
const closeBtn = modal?.querySelector(".modal__close");
let lastOpenTrigger = null;
let modalFocusTrapCleanup = null;

const FOCUSABLE_SELECTOR = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";

const getFocusableElements = (container) => {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    return el.getAttribute("aria-hidden") !== "true" && el.offsetParent !== null;
  });
};

const setupFocusTrap = (container, initialFocus) => {
  const previousActive = document.activeElement;
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    if (container.getAttribute("aria-hidden") !== "false") return;
    const focusables = getFocusableElements(container);
    if (focusables.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const current = document.activeElement;
    const idx = focusables.indexOf(current);
    let nextIdx;
    if (idx === -1) {
      nextIdx = 0;
    } else if (e.shiftKey) {
      nextIdx = idx <= 0 ? focusables.length - 1 : idx - 1;
    } else {
      nextIdx = idx >= focusables.length - 1 ? 0 : idx + 1;
    }
    focusables[nextIdx].focus();
  };
  document.addEventListener("keydown", handleKeyDown, true);
  const first = (initialFocus && container.contains(initialFocus) ? initialFocus : getFocusableElements(container)[0]);
  first?.focus();
  return (returnFocusTo) => {
    document.removeEventListener("keydown", handleKeyDown, true);
    (returnFocusTo ?? previousActive)?.focus?.();
  };
};

const setBackdropInert = (activeOverlay) => {
  Array.from(document.body.children).forEach((child) => {
    if (child !== activeOverlay) child.setAttribute("inert", "");
    else child.removeAttribute("inert");
  });
};

const clearBackdropInert = () => {
  Array.from(document.body.children).forEach((child) => child.removeAttribute("inert"));
};

const onlyLettersRegex = /[^\p{L}\s]/gu;

const isNameValid = (value) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  return !onlyLettersRegex.test(trimmed);
};

const isPhoneValid = (value) => {
  const digits = value.replace(/\D/g, "");
  return value.startsWith("+7") && digits.length >= 11;
};

const setInvalid = (el, invalid, invalidClass = INVALID_CLASS_INPUT) => {
  if (!el) return;
  el.classList.toggle(invalidClass, invalid);
  el.setAttribute("aria-invalid", invalid ? "true" : "false");
};

/**
 * Инициализация одной формы консультации (модальной или инлайновой).
 * @param {{ form: HTMLFormElement | null, nameInput: HTMLInputElement | null, phoneInput: HTMLInputElement | null, consentCheckbox: HTMLInputElement | null, submitBtn: HTMLButtonElement | null, phonePlaceholder?: string, onSuccess?: () => void }} config
 */
const initConsultForm = (config) => {
  const {
    form,
    nameInput,
    phoneInput,
    consentCheckbox,
    submitBtn,
    phonePlaceholder = PHONE_PLACEHOLDER,
    onSuccess,
  } = config;
  if (!form) return;

  const statusEl = document.createElement("p");
  statusEl.className = "consult-form__status";
  statusEl.setAttribute("role", "status");
  statusEl.setAttribute("aria-live", "polite");
  if (submitBtn?.parentNode) submitBtn.parentNode.insertBefore(statusEl, submitBtn.nextSibling);

  const setStatus = (text, type = "") => {
    statusEl.textContent = text || "";
    statusEl.classList.toggle("consult-form__status--error", type === "error");
    statusEl.classList.toggle("consult-form__status--success", type === "success");
  };

  const updateSubmitButton = () => {
    if (!submitBtn) return;
    const nameOk = isNameValid(nameInput?.value ?? "");
    const phoneOk = isPhoneValid(phoneInput?.value ?? "");
    const consentOk = consentCheckbox?.checked === true;
    submitBtn.disabled = !(nameOk && phoneOk && consentOk);
  };

  const validateAndMark = () => {
    setInvalid(nameInput, !isNameValid(nameInput?.value ?? ""));
    setInvalid(phoneInput, !isPhoneValid(phoneInput?.value ?? ""));
    setInvalid(consentCheckbox, !(consentCheckbox?.checked === true), INVALID_CLASS_CHECKBOX);
  };

  const handleNameInput = (e) => {
    const el = e.target;
    const cursor = el.selectionStart;
    const oldLen = el.value.length;
    el.value = el.value.replace(onlyLettersRegex, "");
    const newLen = el.value.length;
    el.setSelectionRange(cursor - (oldLen - newLen), cursor - (oldLen - newLen));
    setInvalid(el, false);
    updateSubmitButton();
  };

  const handlePhoneInput = (e) => {
    const el = e.target;
    let val = el.value.replace(/[^\d+]/g, "");
    if (val.startsWith("8")) val = "+7" + val.slice(1);
    if (val.length > 1 && !val.startsWith("+")) val = "+7" + val.replace(/^7?/, "");
    if (val === "+" || val === "") val = "";
    else if (val[0] !== "+") val = "+7" + val.replace(/^7?/, "");
    el.value = val;
    setInvalid(el, false);
    updateSubmitButton();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateAndMark();
    if (
      !isNameValid(nameInput?.value ?? "") ||
      !isPhoneValid(phoneInput?.value ?? "") ||
      !consentCheckbox?.checked
    ) {
      return;
    }

    setStatus("");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = SUBMIT_BTN_LABEL_SENDING;
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: (nameInput?.value ?? "").trim(),
          phone: (phoneInput?.value ?? "").trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        form.reset();
        if (phoneInput) phoneInput.placeholder = phonePlaceholder;
        updateSubmitButton();
        setStatus("Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.", "success");
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setStatus("Не удалось отправить заявку. Попробуйте позже или позвоните нам.", "error");
        updateSubmitButton();
      }
    } catch {
      setStatus("Не удалось отправить заявку. Проверьте интернет и попробуйте снова.", "error");
      updateSubmitButton();
    } finally {
      if (submitBtn) submitBtn.textContent = SUBMIT_BTN_LABEL_DEFAULT;
      updateSubmitButton();
    }
  };

  form.addEventListener("submit", handleSubmit);
  nameInput?.addEventListener("input", handleNameInput);
  nameInput?.addEventListener("blur", () =>
    setInvalid(nameInput, !isNameValid(nameInput.value) && nameInput.value.length > 0)
  );
  phoneInput?.addEventListener("input", handlePhoneInput);
  phoneInput?.addEventListener("focus", () => {
    if (phoneInput.placeholder) phoneInput.placeholder = "";
  });
  phoneInput?.addEventListener("blur", () => {
    if (phoneInput.value.length === 0) phoneInput.placeholder = phonePlaceholder;
    setInvalid(phoneInput, phoneInput.value.length > 0 && !isPhoneValid(phoneInput.value));
  });
  consentCheckbox?.addEventListener("change", () => {
    setInvalid(consentCheckbox, false);
    updateSubmitButton();
  });

  updateSubmitButton();
};

const openModal = (triggerEl) => {
  if (!modal) return;
  lastOpenTrigger = triggerEl ?? null;
  const form = document.getElementById("consult-form");
  const nameInput = document.getElementById("consult-name");
  const phoneInput = document.getElementById("consult-phone");
  const consentCheckbox = document.getElementById("consult-consent");
  setInvalid(nameInput, false);
  setInvalid(phoneInput, false);
  setInvalid(consentCheckbox, false, INVALID_CLASS_CHECKBOX);
  const submitBtn = form?.querySelector(".consult-form__submit");
  if (submitBtn) {
    const nameOk = isNameValid(nameInput?.value ?? "");
    const phoneOk = isPhoneValid(phoneInput?.value ?? "");
    const consentOk = consentCheckbox?.checked === true;
    submitBtn.disabled = !(nameOk && phoneOk && consentOk);
  }
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setBackdropInert(modal);
  if (modalFocusTrapCleanup) modalFocusTrapCleanup();
  modalFocusTrapCleanup = setupFocusTrap(modal, nameInput ?? closeBtn);
};

const closeModal = () => {
  if (!modal) return;
  if (modalFocusTrapCleanup) {
    modalFocusTrapCleanup(lastOpenTrigger);
    modalFocusTrapCleanup = null;
  }
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearBackdropInert();
};

if (openBtns.length > 0) {
  openBtns.forEach((btn) => btn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(e.currentTarget);
  }));
}

if (backdrop) {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

const ESCAPE_CLOSE_REGISTRY = [];
ESCAPE_CLOSE_REGISTRY.push({
  isOpen: () => isMenuOpen(),
  close: closeMobileMenu,
});
ESCAPE_CLOSE_REGISTRY.push({
  isOpen: () => modal?.getAttribute("aria-hidden") === "false",
  close: closeModal,
});

initConsultForm({
  form: document.getElementById("consult-form"),
  nameInput: document.getElementById("consult-name"),
  phoneInput: document.getElementById("consult-phone"),
  consentCheckbox: document.getElementById("consult-consent"),
  submitBtn: document.getElementById("consult-form")?.querySelector(".consult-form__submit") ?? null,
  phonePlaceholder: PHONE_PLACEHOLDER,
  onSuccess: closeModal,
});

initConsultForm({
  form: document.getElementById("contacts-form"),
  nameInput: document.getElementById("contacts-name"),
  phoneInput: document.getElementById("contacts-phone"),
  consentCheckbox: document.getElementById("contacts-consent"),
  submitBtn: document.getElementById("contacts-form")?.querySelector(".consult-form__submit") ?? null,
  phonePlaceholder: PHONE_PLACEHOLDER,
});

/**
 * Лайтбокс галереи проекта: приближение фото по клику.
 */
const GALLERY_LIGHTBOX_ID = "gallery-lightbox";
const lightbox = document.getElementById(GALLERY_LIGHTBOX_ID);
const projectGallerySection = document.querySelector(".section.project-gallery");

if (lightbox && projectGallerySection) {
  const lightboxImg = lightbox.querySelector(".lightbox__img");
  const lightboxBackdrop = lightbox.querySelector(".lightbox__backdrop");
  const lightboxClose = lightbox.querySelector(".lightbox__close");
  const galleryItems = projectGallerySection.querySelectorAll(".project-gallery__item");
  let galleryLightboxTrigger = null;
  let galleryFocusTrapCleanup = null;

  const openLightbox = (src, alt, triggerEl) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt ?? "";
    galleryLightboxTrigger = triggerEl ?? null;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setBackdropInert(lightbox);
    if (galleryFocusTrapCleanup) galleryFocusTrapCleanup();
    galleryFocusTrapCleanup = setupFocusTrap(lightbox, lightboxClose);
  };

  const closeLightbox = () => {
    if (galleryFocusTrapCleanup) {
      galleryFocusTrapCleanup(galleryLightboxTrigger);
      galleryFocusTrapCleanup = null;
    }
    galleryLightboxTrigger = null;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearBackdropInert();
  };

  const handleItemClick = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (!img?.src) return;
    e.preventDefault();
    const src = img.currentSrc || img.src;
    openLightbox(src, img.alt, e.currentTarget);
  };

  galleryItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", handleItemClick);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  lightboxBackdrop?.addEventListener("click", closeLightbox);
  lightboxClose?.addEventListener("click", closeLightbox);
  ESCAPE_CLOSE_REGISTRY.push({
    isOpen: () => lightbox.getAttribute("aria-hidden") === "false",
    close: closeLightbox,
  });
}

/**
 * Лайтбокс для фото «что входит в стоимость» в блоке Услуги (главная).
 */
const servicesLightbox = document.getElementById("services-lightbox");

if (servicesLightbox) {
  const servicesLightboxImg = servicesLightbox.querySelector(".lightbox__img");
  const servicesLightboxBackdrop = servicesLightbox.querySelector(".lightbox__backdrop");
  const servicesLightboxClose = servicesLightbox.querySelector(".lightbox__close");
  const lightboxNavPrev = servicesLightbox.querySelector(".lightbox__nav--prev");
  const lightboxNavNext = servicesLightbox.querySelector(".lightbox__nav--next");
  let currentCarouselIndex = -1;
  let servicesLightboxTrigger = null;
  let servicesFocusTrapCleanup = null;

  const LIGHTBOX_NAV_HIDDEN_CLASS = "lightbox__nav--hidden";

  const showCarouselNav = (show) => {
    const hidden = !show;
    if (lightboxNavPrev) {
      lightboxNavPrev.setAttribute("aria-hidden", hidden);
      lightboxNavPrev.classList.toggle(LIGHTBOX_NAV_HIDDEN_CLASS, !show);
    }
    if (lightboxNavNext) {
      lightboxNavNext.setAttribute("aria-hidden", hidden);
      lightboxNavNext.classList.toggle(LIGHTBOX_NAV_HIDDEN_CLASS, !show);
    }
  };

  const updateLightboxDialogLabel = (label) => {
    servicesLightbox.setAttribute("aria-label", label);
  };

  const showCarouselImage = (index) => {
    const items = window.__CAROUSEL_ITEMS || [];
    if (index < 0 || index >= items.length) return;
    currentCarouselIndex = index;
    const item = items[index];
    if (!item || !servicesLightboxImg) return;
    servicesLightbox.classList.add("lightbox--loading");
    const caption = item.caption ?? "";
    servicesLightboxImg.alt = caption;
    servicesLightboxImg.onload = () => servicesLightbox.classList.remove("lightbox--loading");
    servicesLightboxImg.onerror = () => {
      servicesLightboxImg.onerror = null;
      servicesLightbox.classList.remove("lightbox--loading");
    };
    servicesLightboxImg.src = CAROUSEL_LIGHTBOX_BASE + String(index).padStart(2, "0") + ".webp";
    const label = `Слайд ${index + 1} из ${items.length}${caption ? ": " + caption : ""}`;
    updateLightboxDialogLabel(label);
    if (lightboxNavPrev) lightboxNavPrev.classList.toggle(LIGHTBOX_NAV_HIDDEN_CLASS, index <= 0);
    if (lightboxNavNext) lightboxNavNext.classList.toggle(LIGHTBOX_NAV_HIDDEN_CLASS, index >= items.length - 1);
  };

  const openServicesLightbox = (src, alt, carouselIndex, triggerEl) => {
    if (!servicesLightboxImg) return;
    currentCarouselIndex = carouselIndex ?? -1;
    servicesLightboxTrigger = triggerEl ?? null;
    const isCarousel = typeof carouselIndex === "number" && carouselIndex >= 0;
    showCarouselNav(isCarousel);
    if (isCarousel) {
      showCarouselImage(carouselIndex);
    } else {
      servicesLightbox.classList.add("lightbox--loading");
      const singleAlt = alt?.trim() || "Что входит в проект";
      servicesLightboxImg.alt = singleAlt;
      servicesLightboxImg.onload = () => servicesLightbox.classList.remove("lightbox--loading");
      servicesLightboxImg.src = src;
      updateLightboxDialogLabel(singleAlt);
      /* Для одиночного фото (кнопки «Что входит в проект») стрелки не показываем */
    }
    servicesLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setBackdropInert(servicesLightbox);
    if (servicesFocusTrapCleanup) servicesFocusTrapCleanup();
    servicesFocusTrapCleanup = setupFocusTrap(servicesLightbox, servicesLightboxClose);
    window.addEventListener("keydown", handleLightboxKeydown);
  };

  const closeServicesLightbox = () => {
    window.removeEventListener("keydown", handleLightboxKeydown);
    if (servicesFocusTrapCleanup) {
      servicesFocusTrapCleanup(servicesLightboxTrigger);
      servicesFocusTrapCleanup = null;
    }
    servicesLightboxTrigger = null;
    servicesLightbox.setAttribute("aria-hidden", "true");
    servicesLightbox.classList.remove("lightbox--loading");
    currentCarouselIndex = -1;
    document.body.style.overflow = "";
    clearBackdropInert();
  };

  if (lightboxNavPrev) {
    lightboxNavPrev.classList.add(LIGHTBOX_NAV_HIDDEN_CLASS);
    lightboxNavPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentCarouselIndex <= 0) return;
      showCarouselImage(currentCarouselIndex - 1);
    });
  }
  if (lightboxNavNext) {
    lightboxNavNext.classList.add(LIGHTBOX_NAV_HIDDEN_CLASS);
    lightboxNavNext.addEventListener("click", (e) => {
      e.stopPropagation();
      const items = window.__CAROUSEL_ITEMS || [];
      if (currentCarouselIndex < 0 || currentCarouselIndex >= items.length - 1) return;
      showCarouselImage(currentCarouselIndex + 1);
    });
  }

  const handleLightboxKeydown = (e) => {
    if (servicesLightbox.getAttribute("aria-hidden") !== "false" || currentCarouselIndex < 0) return;
    const items = window.__CAROUSEL_ITEMS || [];
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentCarouselIndex > 0) showCarouselImage(currentCarouselIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (currentCarouselIndex < items.length - 1) showCarouselImage(currentCarouselIndex + 1);
    }
  };
  /** Кнопки «Что входит в проект» — открывают лайтбокс с картинкой по data-included-src. */
  const openIncludedBtns = document.querySelectorAll(".js-open-included");
  const handleOpenIncludedClick = (e) => {
    const btn = e.currentTarget;
    const src = btn.getAttribute("data-included-src");
    const alt = btn.getAttribute("data-included-alt") ?? "";
    if (src) {
      e.preventDefault();
      openServicesLightbox(src, alt, undefined, btn);
    }
  };

  const handleOpenIncludedKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const btn = e.currentTarget;
    const src = btn.getAttribute("data-included-src");
    const alt = btn.getAttribute("data-included-alt") ?? "";
    if (src) {
      e.preventDefault();
      openServicesLightbox(src, alt, undefined, btn);
    }
  };

  openIncludedBtns.forEach((btn) => {
    btn.addEventListener("click", handleOpenIncludedClick);
    btn.addEventListener("keydown", handleOpenIncludedKeyDown);
  });

  servicesLightboxBackdrop?.addEventListener("click", closeServicesLightbox);
  servicesLightboxClose?.addEventListener("click", closeServicesLightbox);
  ESCAPE_CLOSE_REGISTRY.push({
    isOpen: () => servicesLightbox.getAttribute("aria-hidden") === "false",
    close: closeServicesLightbox,
  });

  /** Карусель: делегирование — кнопки создаются позже, слушатель на контейнере. */
  const carouselContainer = document.querySelector(".portfolio-carousel");
  if (carouselContainer) {
    const handleCarouselLightbox = (e) => {
      const btn = e.target.closest(".js-carousel-lightbox");
      if (!btn) return;
      const src = btn.getAttribute("data-full-src") || btn.querySelector("img")?.src;
      const alt = btn.querySelector("img")?.alt ?? "";
      const indexStr = btn.getAttribute("data-carousel-index");
      const index = indexStr !== null ? parseInt(indexStr, 10) : -1;
      if (src) {
        e.preventDefault();
        openServicesLightbox(src, alt, index, btn);
      }
    };
    carouselContainer.addEventListener("click", handleCarouselLightbox);
    carouselContainer.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      handleCarouselLightbox(e);
    });
  }
}

const CAROUSEL_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23eaeaea' width='400' height='300'/%3E%3C/svg%3E";

/**
 * Карусель: строим только когда блок в зоне видимости; в полосе только превью или плейсхолдер (полный PNG только в лайтбоксе).
 */
const carousel = document.querySelector(".portfolio-carousel");
if (carousel) {
  const track = carousel.querySelector(".portfolio-carousel__track");
  const dotsContainer = carousel.querySelector(".portfolio-carousel__dots");
  const viewport = carousel.querySelector(".portfolio-carousel__viewport");
  let carouselBuilt = false;

  const buildCarousel = () => {
    if (!track || CAROUSEL_ITEMS.length === 0) return;
    carouselBuilt = true;

    track.innerHTML = "";
    const thumbBase = "assets/carousel-thumbs/";
    let stripLoadingCount = 0;
    const MAX_STRIP_LOADING = 6;

    CAROUSEL_ITEMS.forEach((item, index) => {
      const thumbSrc = thumbBase + String(index).padStart(2, "0") + ".webp";
      const captionEsc = item.caption.replace(/"/g, "&quot;");
      const li = document.createElement("li");
      li.className = "portfolio-carousel__slide";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "portfolio-carousel__thumb js-carousel-lightbox";
      btn.setAttribute("tabindex", "0");
      btn.setAttribute("aria-label", "Открыть фото: " + captionEsc);
      btn.setAttribute("data-full-src", CAROUSEL_LIGHTBOX_BASE + String(index).padStart(2, "0") + ".webp");
      btn.setAttribute("data-carousel-index", String(index));
      const img = document.createElement("img");
      img.dataset.src = thumbSrc;
      img.alt = item.caption;
      img.width = 400;
      img.height = 300;
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
      li.appendChild(btn);
      const cap = document.createElement("p");
      cap.className = "portfolio-carousel__caption";
      cap.textContent = item.caption;
      li.appendChild(cap);
      track.appendChild(li);
    });

    const loadOneInStrip = (img) => {
      if (!img || img.src || stripLoadingCount >= MAX_STRIP_LOADING) return;
      const src = img.dataset.src;
      if (!src) return;
      stripLoadingCount += 1;
      img.onload = () => { stripLoadingCount -= 1; };
      img.onerror = () => {
        stripLoadingCount -= 1;
        img.src = CAROUSEL_PLACEHOLDER;
      };
      img.src = src;
    };

    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slide = entry.target;
          const img = slide.querySelector("img");
          if (!img || img.src) return;
          loadOneInStrip(img);
        });
      },
      { root: viewport || null, rootMargin: "40px", threshold: 0.01 }
    );
    track.querySelectorAll(".portfolio-carousel__slide").forEach((el) => slideObserver.observe(el));
  };

  const initCarouselUI = () => {
    if (dotsContainer && CAROUSEL_ITEMS.length > 0) {
      dotsContainer.innerHTML = "";
      const dotCount = Math.max(0, CAROUSEL_ITEMS.length - 3);
      for (let index = 0; index < dotCount; index++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "portfolio-carousel__dot";
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-label", "Слайд " + (index + 1));
        btn.setAttribute("data-index", String(index));
        btn.setAttribute("aria-selected", index === 0 ? "true" : "false");
        dotsContainer.appendChild(btn);
      }
    }

    const slides = carousel.querySelectorAll(".portfolio-carousel__slide");
    const prevBtn = carousel.querySelector(".portfolio-carousel__nav--prev");
    const nextBtn = carousel.querySelector(".portfolio-carousel__nav--next");
    const dots = carousel.querySelectorAll(".portfolio-carousel__dot");
    const total = slides.length;
    const visibleCount = 4;
    const maxIndex = Math.max(0, total - visibleCount);
    let currentIndex = 0;

    const updateTransform = () => {
      if (!track || !slides[0]) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gapPx = parseFloat(getComputedStyle(track).gap) || 12;
      const offsetPx = -currentIndex * (slideWidth + gapPx);
      track.style.transform = `translateX(${offsetPx}px)`;
    };

    const setSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateTransform();
      dots.forEach((dot, i) => {
        dot.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      });
    };

    if (prevBtn) prevBtn.addEventListener("click", () => setSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => setSlide(currentIndex + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const btn = e.target.closest(".portfolio-carousel__dot");
        if (!btn) return;
        const index = parseInt(btn.getAttribute("data-index"), 10);
        if (!Number.isNaN(index)) setSlide(index);
      });
    });

    let resizeTimeout = null;
    window.addEventListener("resize", () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateTransform, CAROUSEL_RESIZE_DEBOUNCE_MS);
    });

    updateTransform();
  };

  const whenInView = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting || carouselBuilt) return;
      buildCarousel();
      initCarouselUI();
      whenInView.disconnect();
    },
    { root: null, rootMargin: "100px", threshold: 0 }
  );
  whenInView.observe(carousel);
}

  /** Один глобальный обработчик Escape для всех модалок и лайтбоксов. */
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const h of ESCAPE_CLOSE_REGISTRY) {
      if (h.isOpen()) {
        h.close();
        break;
      }
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
