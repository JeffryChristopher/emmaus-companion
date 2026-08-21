/* ============================================================
   THE EMMAUS COMPANION: The Saints of the Journey

   Every Saint for the Topic, gathered from the notes themselves and
   set out in the order of the calendar, so that a candidate who
   half-remembers a name can find it again.

   Nothing here is written down twice. Each saint is read out of the
   note that names him or her, in whichever language that note has
   been transcribed into, so the gallery says exactly what the
   session page says and can never drift from it.

   One wrinkle worth knowing. A translated note gives its feast day
   in its own language and script; "28 Januari", "1月28日",
   "ஜனவரி 28", and even labels the fact differently from one note
   to the next. So the DATE a saint is filed under is always read
   from the English note, which is complete and writes dates one way;
   only the words shown are taken from the chosen language. The month
   headings are asked of Intl, so they appear in the reader's
   language without being written down here at all.

   A saint whose note gives no feast day; Athanasius, in Topic 7; is not given one. The app does not know it, and guessing at a
   saint's day in a catechetical book is not the app's to do. Those
   stand in a group of their own at the end.
   ============================================================ */

var Saints = (function () {
  'use strict';

  /* Under Node the checking script requires this file directly, and
     there is no <script> tag to have defined Lang. */
  var L = (typeof Lang !== 'undefined') ? Lang
        : (typeof require !== 'undefined' ? require('./i18n.js') : null);

  var MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'];

  /* The saint block of a topic, if it names one. The two retreats and
     the Christmas preparation do not. */
  function saintOf(topic) {
    var found = null;
    (topic.parts || []).forEach(function (part) {
      (part.blocks || []).forEach(function (block) {
        if (block.type === 'saint') { found = block; }
      });
    });
    return found;
  }

  /* The notes label their facts inconsistently; "Feast day", "Feast
     Day", "Patron", "Patron of", "Born", "Birth", so a fact is found
     by what its label starts with, not by an exact match. */
  function fact(saint, prefix) {
    var hit = (saint.facts || []).filter(function (f) {
      return f.label && f.label.toLowerCase().indexOf(prefix) === 0;
    })[0];
    return hit ? hit.value : null;
  }

  /* "January 28." -> { month: 0, day: 28 }. Read from the English
     note only; returns null when the note gives no feast day. */
  function feastDate(value) {
    if (!value) { return null; }
    var match = /([A-Za-z]+)\s+(\d{1,2})/.exec(value);
    if (match) {
      var month = MONTHS.indexOf(match[1].toLowerCase());
      if (month > -1) { return { month: month, day: parseInt(match[2], 10) }; }
    }
    /* "28 January" reads the other way round. */
    match = /(\d{1,2})\s+([A-Za-z]+)/.exec(value);
    if (match) {
      var m2 = MONTHS.indexOf(match[2].toLowerCase());
      if (m2 > -1) { return { month: m2, day: parseInt(match[1], 10) }; }
    }
    return null;
  }

  /* Every saint the notes name, dated from English and worded in the
     chosen language, in calendar order. Undated saints come last.

     `source` lets the checking script hand in the content it loaded
     into its own sandbox; in the browser it is left out and the page's
     own globals are used. */
  function gather(code, source) {
    source = source || {};
    var all = source.topics || (window.RCIA && window.RCIA.topics) || {};
    var lookup = source.topicIn || function (n, c) { return Emmaus.topicIn(n, c); };
    var english = all[L.DEFAULT] || {};
    var list = [];

    Object.keys(english).map(Number).sort(function (a, b) { return a - b; })
      .forEach(function (n) {
        var enSaint = saintOf(english[n]);
        if (!enSaint) { return; }

        /* What the reader sees: the note in their own language where
           it exists, the English note where it does not. */
        var shown = lookup(n, code);
        var saint = (shown && saintOf(shown.topic)) || enSaint;

        list.push({
          topic: n,
          saint: saint,
          translated: !!(shown && shown.translated && saintOf(shown.topic)),
          /* dated from English, always */
          date: feastDate(fact(enSaint, 'feast'))
        });
      });

    list.sort(function (a, b) {
      if (!a.date && !b.date) { return a.topic - b.topic; }
      if (!a.date) { return 1; }
      if (!b.date) { return -1; }
      if (a.date.month !== b.date.month) { return a.date.month - b.date.month; }
      if (a.date.day !== b.date.day) { return a.date.day - b.date.day; }
      return a.topic - b.topic;
    });
    return list;
  }

  /* The feast day written the way the reader's language writes a date
     with no year in it: "January 28", "28 Januari", "1月28日". Gluing
     a numeral onto a month name would give "一月 28", which is not how
     Chinese writes a date at all, so Intl is asked for the whole
     thing. A leap year, so that a 29 February feast could be held. */
  function feastLabel(date, code) {
    if (!date) { return null; }
    try {
      return new Intl.DateTimeFormat(L.meta(code).locale,
        { month: 'long', day: 'numeric' })
        .format(new Date(2024, date.month, date.day));
    } catch (e) {
      return monthName(date.month, code) + ' ' + date.day;
    }
  }

  /* The month's name as the reader's language writes it. */
  function monthName(month, code) {
    try {
      return new Intl.DateTimeFormat(L.meta(code).locale, { month: 'long' })
        .format(new Date(2026, month, 1));
    } catch (e) {
      return MONTHS[month].charAt(0).toUpperCase() + MONTHS[month].slice(1);
    }
  }

  return {
    saintOf: saintOf,
    fact: fact,
    feastDate: feastDate,
    feastLabel: feastLabel,
    gather: gather,
    monthName: monthName
  };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = Saints; }
