import { SITE_CONFIG } from './config.js';
import { initCountdowns } from './countdowns.js';

const INTRO_STORAGE_KEY = 'uwem-ministries-intro-seen-v1';

function applyPublicConfiguration() {
  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    const contact = SITE_CONFIG.contacts.phones[link.dataset.phoneLink];
    if (!contact) return;
    link.href = contact.tel;
    link.textContent = contact.display.replaceAll(' ', '\u00a0').replaceAll('-', '\u2011');
    if (!link.hasAttribute('aria-label')) link.setAttribute('aria-label', `Call ${contact.display}`);
  });

  document.querySelectorAll('[data-email-link]').forEach((link) => {
    link.href = `mailto:${SITE_CONFIG.contacts.email}`;
    link.textContent = SITE_CONFIG.contacts.email;
  });

  document.querySelectorAll('[data-website-link]').forEach((link) => {
    link.href = SITE_CONFIG.websiteUrl;
    link.textContent = new URL(SITE_CONFIG.websiteUrl).hostname;
  });

  document.querySelectorAll('[data-location-address]').forEach((node) => {
    node.textContent = SITE_CONFIG.location.address;
  });
  document.querySelectorAll('[data-map-link]').forEach((link) => {
    link.href = SITE_CONFIG.location.mapsUrl;
  });

  document.querySelectorAll('[data-social]').forEach((link) => {
    const account = SITE_CONFIG.social[link.dataset.social];
    if (account) link.href = account.url;
  });

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    if (link.dataset.whatsapp === 'community') {
      link.href = SITE_CONFIG.whatsapp.communityUrl;
      return;
    }

    if (link.dataset.whatsapp === 'general') {
      const message = link.dataset.whatsappMessage || SITE_CONFIG.whatsapp.generalMessage;
      link.href = `https://wa.me/${SITE_CONFIG.whatsapp.generalNumber}?text=${encodeURIComponent(message)}`;
    }
  });

  document.querySelectorAll('[data-tally-link]').forEach((link) => {
    link.href = SITE_CONFIG.prayer.tallyUrl;
  });
  document.querySelectorAll('[data-tally-embed]').forEach((frame) => {
    frame.src = SITE_CONFIG.prayer.embedUrl;
  });

  document.querySelectorAll('[data-additional-schedule]').forEach((row) => {
    const item = SITE_CONFIG.additionalSchedule[Number(row.dataset.additionalSchedule)];
    if (!item) return;
    const day = row.querySelector('[data-gathering-day]');
    const name = row.querySelector('[data-gathering-name]');
    const time = row.querySelector('[data-gathering-time]');
    if (day) day.textContent = item.day;
    if (name) name.textContent = item.name;
    if (time) time.textContent = item.time;
  });

  document.querySelectorAll('[data-tagline]').forEach((node) => {
    node.textContent = SITE_CONFIG.tagline;
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  }, { passive: true });
}

function initHeaderScrollState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initOpeningTagline() {
  const opening = document.querySelector('#opening');
  const output = document.querySelector('#typed-tagline');
  const skipButton = document.querySelector('#skip-opening');
  if (!opening || !output || !skipButton) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reducedMotion) return;

  try {
    if (window.localStorage.getItem(INTRO_STORAGE_KEY) === 'true') return;
  } catch {
    // Storage can be blocked in private browsing; the introduction can still run.
  }

  const tagline = SITE_CONFIG.tagline;
  let characterIndex = 0;
  let typingTimer = 0;
  let finishTimer = 0;
  let finished = false;

  opening.hidden = false;
  requestAnimationFrame(() => opening.classList.add('is-visible'));

  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, 'true');
  } catch {
    // A storage failure should never prevent access to the page.
  }

  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearInterval(typingTimer);
    window.clearTimeout(finishTimer);
    output.textContent = tagline;
    opening.classList.add('is-leaving');
    window.setTimeout(() => {
      opening.hidden = true;
      opening.classList.remove('is-visible', 'is-leaving');
    }, 600);
  };

  typingTimer = window.setInterval(() => {
    characterIndex += 1;
    output.textContent = tagline.slice(0, characterIndex);
    if (characterIndex >= tagline.length) {
      window.clearInterval(typingTimer);
      finishTimer = window.setTimeout(finish, 700);
    }
  }, 43);

  skipButton.addEventListener('click', finish, { once: true });
}

applyPublicConfiguration();
initNavigation();
document.documentElement.classList.add('js-enabled');
initHeaderScrollState();
initOpeningTagline();
initCountdowns(SITE_CONFIG.services, SITE_CONFIG.timeZone);
