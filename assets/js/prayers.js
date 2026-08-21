/* ============================================================
   THE EMMAUS COMPANION: Prayers of the Journey

   Every prayer the notes set down, gathered in the order the
   candidate meets them, for the days between one session and the
   next.

   Like the Saints gallery, this writes nothing down: each prayer is
   read out of the note that prints it, at the moment the page is
   drawn, in whichever language that note exists in. So the page can
   never drift from the session it came from, and a note transcribed
   into Mandarin tomorrow brings its prayer here with it.

   The notes give a prayer a heading only sometimes: "Prayer for the
   Sick", "Prayer for unity". Where a prayer is printed with no
   heading of its own, none is invented; the note it belongs to is
   named beneath it instead, which is both true and the way back to
   the page it came from.
   ============================================================ */

var Prayers = (function () {
  'use strict';

  var L = (typeof Lang !== 'undefined') ? Lang
        : (typeof require !== 'undefined' ? require('./i18n.js') : null);

  /* Every prayer block in a topic, in the order it is read, with the
     part it stands in; a retreat prays more than once. */
  function prayersOf(topic) {
    var found = [];
    (topic.parts || []).forEach(function (part) {
      (part.blocks || []).forEach(function (block) {
        if (block.type === 'prayer') { found.push({ part: part, prayer: block }); }
      });
    });
    return found;
  }

  /* Every prayer in the notes, in the order the road is walked.

     `source` lets the checking script hand in the content it loaded
     into its own sandbox; in the browser it is left out. */
  function gather(code, source) {
    source = source || {};
    var all = source.topics || (window.RCIA && window.RCIA.topics) || {};
    var lookup = source.topicIn || function (n, c) { return Emmaus.topicIn(n, c); };
    var sessions = source.sessions || (window.RCIA && window.RCIA.sessions) || [];
    var english = all[L.DEFAULT] || {};
    var list = [];

    /* Session order, not topic order: they are the same everywhere but
       in the Mystagogy, where the notes and the Schema disagree about
       which is Topic 32. The road is what the candidate walks. */
    sessions.forEach(function (row) {
      if (row.topic == null || !english[row.topic]) { return; }

      var shown = lookup(row.topic, code);
      var inLanguage = shown && shown.translated ? prayersOf(shown.topic) : [];
      var inEnglish = prayersOf(english[row.topic]);

      /* A translated note may not yet print the prayer its English
         counterpart does; fall back one prayer at a time, not all or
         nothing, so a candidate never meets an empty card. */
      inEnglish.forEach(function (entry, i) {
        var use = inLanguage[i] || entry;
        list.push({
          topic: row.topic,
          period: english[row.topic].period,
          title: (shown && shown.translated ? shown.topic.title : english[row.topic].title),
          part: use.part.letter,
          prayer: use.prayer,
          translated: !!inLanguage[i]
        });
      });
    });
    return list;
  }

  return {
    prayersOf: prayersOf,
    gather: gather
  };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = Prayers; }
