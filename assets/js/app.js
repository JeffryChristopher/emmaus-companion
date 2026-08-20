/* ============================================================
   THE EMMAUS COMPANION — Shell
   Theme (Daylight / Compline), reading size, and small helpers.
   Preferences are remembered on this device only.
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

  function mountControls() {
    var themeBtn = document.getElementById('themeBtn');
    var typeBtn = document.getElementById('typeBtn');

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = toggleTheme();
        themeBtn.textContent = next === 'dark' ? '☾ Compline' : '☀ Daylight';
        themeBtn.setAttribute('aria-label',
          next === 'dark' ? 'Switch to the daylight theme' : 'Switch to the candlelit theme');
      });
      var shown = readPrefs().theme || (prefersDark() ? 'dark' : 'light');
      themeBtn.textContent = shown === 'dark' ? '☾ Compline' : '☀ Daylight';
    }

    if (typeBtn) {
      typeBtn.addEventListener('click', function () {
        var next = cycleType();
        typeBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
        typeBtn.textContent = next === 'larger' ? 'A Largest'
                            : next === 'large'  ? 'A Larger'
                            : 'A Reading size';
      });
      var t = readPrefs().type || '';
      typeBtn.setAttribute('aria-pressed', t ? 'true' : 'false');
      typeBtn.textContent = t === 'larger' ? 'A Largest' : t === 'large' ? 'A Larger' : 'A Reading size';
    }
  }

  /* Applied as early as possible so the page never flashes the wrong theme. */
  function boot() {
    var prefs = readPrefs();
    applyTheme(prefs.theme);
    applyType(prefs.type);
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

  /* Topics that have been transcribed and shipped with this build. */
  function availableTopics() {
    var topics = (window.RCIA && window.RCIA.topics) || {};
    return Object.keys(topics).map(Number).sort(function (a, b) { return a - b; });
  }

  function formatDate(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
  }

  return {
    boot: boot,
    mountControls: mountControls,
    el: el,
    periodOf: periodOf,
    sessionOfTopic: sessionOfTopic,
    availableTopics: availableTopics,
    formatDate: formatDate,
    readPrefs: readPrefs,
    writePrefs: writePrefs
  };
})();

Emmaus.boot();
