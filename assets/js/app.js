/* ============================================================
   THE EMMAUS COMPANION — Shell
   Theme (Daylight / Compline), reading size, language, and small
   helpers. Preferences are remembered on this device only.

   The language itself lives in assets/js/i18n.js; this file owns the
   preferences record it is stored in, and applies it early so the
   page never paints in the wrong typeface.
   ============================================================ */

var Emmaus = (function () {
  'use strict';

  var PREF_KEY = 'emmaus.prefs.v1';

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writePrefs(prefs) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    } catch (e) {
      /* Private browsing, or storage full. Preferences simply do not persist. */
    }
  }

  /* ---- theme: unset (follow the device) / light / dark ---- */

  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function toggleTheme() {
    var prefs = readPrefs();
    var current = prefs.theme;
    /* If following the device, the first press flips away from what is shown. */
    if (!current) { current = prefersDark() ? 'dark' : 'light'; }
    var next = current === 'dark' ? 'light' : 'dark';
    prefs.theme = next;
    writePrefs(prefs);
    applyTheme(next);
    return next;
  }

  /* ---- reading size ---- */

  var SIZES = ['', 'large', 'larger'];

  function applyType(size) {
    if (size) {
      document.documentElement.setAttribute('data-type', size);
    } else {
      document.documentElement.removeAttribute('data-type');
    }
  }

  function cycleType() {
    var prefs = readPrefs();
    var i = SIZES.indexOf(prefs.type || '');
    var next = SIZES[(i + 1) % SIZES.length];
    prefs.type = next;
    writePrefs(prefs);
    applyType(next);
    return next;
  }

  /* ---- wire the top bar ---- */

  function themeLabel(theme) {
    return Lang.t(theme === 'dark' ? 'themeCompline' : 'themeDaylight');
  }

  function typeLabel(size) {
    return Lang.t(size === 'larger' ? 'typeLargest'
                : size === 'large'  ? 'typeLarger'
                : 'typeReading');
  }

  function mountControls() {
    Lang.paint();

    var themeBtn = document.getElementById('themeBtn');
    var typeBtn = document.getElementById('typeBtn');

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = toggleTheme();
        themeBtn.textContent = themeLabel(next);
        themeBtn.setAttribute('aria-label',
          Lang.t(next === 'dark' ? 'themeToLight' : 'themeToDark'));
      });
      var shown = readPrefs().theme || (prefersDark() ? 'dark' : 'light');
      themeBtn.textContent = themeLabel(shown);
      themeBtn.setAttribute('aria-label',
        Lang.t(shown === 'dark' ? 'themeToLight' : 'themeToDark'));
    }

    if (typeBtn) {
      typeBtn.addEventListener('click', function () {
        var next = cycleType();
        typeBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
        typeBtn.textContent = typeLabel(next);
      });
      var t = readPrefs().type || '';
      typeBtn.setAttribute('aria-pressed', t ? 'true' : 'false');
      typeBtn.textContent = typeLabel(t);
    }
  }

  /* Applied as early as possible so the page never flashes the wrong
     theme or the wrong script. */
  function boot() {
    var prefs = readPrefs();
    applyTheme(prefs.theme);
    applyType(prefs.type);
    Lang.apply(prefs.lang);
  }

  /* ---- helpers ---- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }

  function periodOf(id) {
    var list = (window.RCIA && window.RCIA.periods) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { return list[i]; }
    }
    return null;
  }

  function sessionOfTopic(topicNo) {
    var list = (window.RCIA && window.RCIA.sessions) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].topic === topicNo) { return list[i]; }
    }
    return null;
  }

  /* ---- the notes, in whichever language they exist ----
     window.RCIA.topics is keyed by language code, then topic number:
     RCIA.topics.ta[16]. English is the floor every language stands on;
     a topic not yet transcribed into the chosen language is served in
     English so the candidate is never shown an empty page. */

  function topicsIn(code) {
    var all = (window.RCIA && window.RCIA.topics) || {};
    return all[code] || {};
  }

  /* The note to show, and the language it actually turned out to be. */
  function topicIn(topicNo, code) {
    var wanted = topicsIn(code)[topicNo];
    if (wanted) { return { topic: wanted, lang: code, translated: true }; }
    var english = topicsIn(Lang.DEFAULT)[topicNo];
    if (english) { return { topic: english, lang: Lang.DEFAULT, translated: false }; }
    return null;
  }

  /* Topics shipped with this build, in any language. */
  function availableTopics() {
    var all = (window.RCIA && window.RCIA.topics) || {};
    var seen = {};
    Object.keys(all).forEach(function (code) {
      Object.keys(all[code]).forEach(function (n) { seen[n] = true; });
    });
    return Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
  }

  /* Topics transcribed into one particular language. */
  function topicsTranslated(code) {
    return Object.keys(topicsIn(code)).map(Number).sort(function (a, b) { return a - b; });
  }

  /* ---- the five sessions that carry no candidate note ----
     Briefings, the sending, and the day of recollection. They are
     looked up by SESSION number, not by topic number: they have no
     topic number, which is the whole reason they need their own
     pages. Same fallback rule as a topic. */

  function gatesIn(code) {
    var all = (window.RCIA && window.RCIA.gates) || {};
    return all[code] || {};
  }

  function gateIn(sessionNo, code) {
    var wanted = gatesIn(code)[sessionNo];
    if (wanted) { return { topic: wanted, lang: code, translated: true }; }
    var english = gatesIn(Lang.DEFAULT)[sessionNo];
    if (english) { return { topic: english, lang: Lang.DEFAULT, translated: false }; }
    return null;
  }

  function availableGates() {
    var all = (window.RCIA && window.RCIA.gates) || {};
    var seen = {};
    Object.keys(all).forEach(function (code) {
      Object.keys(all[code]).forEach(function (n) { seen[n] = true; });
    });
    return Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
  }

  /* Every stop on the road that opens to a page, in the order they
     are walked. The pager uses this so a briefing can sit between two
     topics without either of them knowing about it. */
  function pageStops() {
    var gates = availableGates();
    var topics = availableTopics();
    return ((window.RCIA && window.RCIA.sessions) || []).filter(function (s) {
      return s.topic != null
        ? topics.indexOf(s.topic) > -1
        : gates.indexOf(s.session) > -1;
    }).map(function (s) {
      return {
        session: s.session,
        topic: s.topic,
        href: s.topic != null
          ? 'session.html?topic=' + s.topic
          : 'session.html?session=' + s.session
      };
    });
  }

  /* The key a page's answers are stored under. A topic keeps its bare
     number, which is what was written before these pages existed, so
     no candidate's writing moves. */
  function journalKeyFor(page) {
    return page.topic != null ? page.topic : 'gate-' + page.session;
  }

  function formatDate(date) {
    return Lang.formatDate(date);
  }

  return {
    boot: boot,
    mountControls: mountControls,
    el: el,
    periodOf: periodOf,
    sessionOfTopic: sessionOfTopic,
    topicIn: topicIn,
    availableTopics: availableTopics,
    topicsTranslated: topicsTranslated,
    gateIn: gateIn,
    availableGates: availableGates,
    pageStops: pageStops,
    journalKeyFor: journalKeyFor,
    formatDate: formatDate,
    readPrefs: readPrefs,
    writePrefs: writePrefs
  };
})();

Emmaus.boot();
