/* ============================================================
   THE EMMAUS COMPANION: The Journal
   Penang Diocesan Catechetical Commission

   Everything the candidate writes is kept in this browser's own
   storage, on this device. There is no server, no account and no
   upload. Reflections leave only inside a Word document the
   candidate chooses to save.

   Storage layout
     emmaus.identity.v1     { name: "…" }
     emmaus.journal.v1.<n>  { answers: { "<blockId>:<i>": "…" },
                              updated: "<ISO timestamp>" }
   ============================================================ */

var Journal = (function () {
  'use strict';

  var IDENTITY_KEY = 'emmaus.identity.v1';
  var TOPIC_PREFIX = 'emmaus.journal.v1.';
  var SAVE_DELAY = 400;   /* milliseconds of quiet before writing */

  var timers = {};
  var listeners = [];

  function storageWorks() {
    try {
      localStorage.setItem('emmaus.probe', '1');
      localStorage.removeItem('emmaus.probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  var WORKS = storageWorks();

  /* ---------------- identity ---------------- */

  function getName() {
    if (!WORKS) { return ''; }
    try {
      var raw = JSON.parse(localStorage.getItem(IDENTITY_KEY)) || {};
      return raw.name || '';
    } catch (e) {
      return '';
    }
  }

  function setName(name) {
    if (!WORKS) { return; }
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name: name || '' }));
    } catch (e) { /* ignore */ }
  }

  /* ---------------- per-topic entries ---------------- */

  function load(topicNo) {
    if (!WORKS) { return { answers: {}, updated: null }; }
    try {
      var raw = JSON.parse(localStorage.getItem(TOPIC_PREFIX + topicNo));
      if (raw && typeof raw === 'object' && raw.answers) { return raw; }
    } catch (e) { /* fall through to an empty journal */ }
    return { answers: {}, updated: null };
  }

  function save(topicNo, entry) {
    if (!WORKS) { return false; }
    try {
      entry.updated = new Date().toISOString();
      localStorage.setItem(TOPIC_PREFIX + topicNo, JSON.stringify(entry));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getAnswer(topicNo, key) {
    return load(topicNo).answers[key] || '';
  }

  /* Debounced: the candidate types freely, the disk is touched once
     they pause. onSaved(ok) fires after each real write. */
  function setAnswer(topicNo, key, text, onSaved) {
    var timerKey = topicNo + '|' + key;
    if (timers[timerKey]) { clearTimeout(timers[timerKey]); }
    timers[timerKey] = setTimeout(function () {
      delete timers[timerKey];
      var entry = load(topicNo);
      if (text && text.length) {
        entry.answers[key] = text;
      } else {
        delete entry.answers[key];
      }
      var ok = save(topicNo, entry);
      if (onSaved) { onSaved(ok); }
      listeners.forEach(function (fn) { fn(topicNo); });
    }, SAVE_DELAY);
  }

  /* Force any pending write to land now (used before exporting). */
  function flush() {
    Object.keys(timers).forEach(function (k) {
      clearTimeout(timers[k]);
      delete timers[k];
    });
  }

  function countAnswered(topicNo) {
    var answers = load(topicNo).answers;
    return Object.keys(answers).filter(function (k) {
      return answers[k] && answers[k].trim().length;
    }).length;
  }

  function onChange(fn) { listeners.push(fn); }

  /* ---------------- which topics have writing in them ---------------- */

  function everyTopicWritten() {
    var found = [];
    if (!WORKS) { return found; }
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(TOPIC_PREFIX) === 0) {
        var n = parseInt(key.slice(TOPIC_PREFIX.length), 10);
        if (!isNaN(n)) { found.push(n); }
      }
    }
    return found.sort(function (a, b) { return a - b; });
  }

  return {
    available: WORKS,
    getName: getName,
    setName: setName,
    load: load,
    save: save,
    getAnswer: getAnswer,
    setAnswer: setAnswer,
    flush: flush,
    countAnswered: countAnswered,
    onChange: onChange,
    everyTopicWritten: everyTopicWritten
  };
})();
