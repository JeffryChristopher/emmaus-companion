/* ============================================================
   THE EMMAUS COMPANION — Drawing the Prayers page
   Prayers.gather() does the reading; this only sets it out.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;
  var root = document.getElementById('prayersRoot');
  if (!root) { return; }

  /* "Amen" closes a prayer in every language the app carries; the last
     line is set apart wherever it is recognised, exactly as the
     session page sets it. */
  var AMEN = /(?:Amen|Amin|阿门|阿們|ஆமென்)[.。．]?$/;

  var lang = Lang.current();
  var picker = document.getElementById('langPick');
  if (picker) { Lang.mountPicker(picker); }

  var prayers = Prayers.gather(lang);

  if (!prayers.length) {
    root.appendChild(el('p', null, Lang.t('prayersEmpty')));
    return;
  }

  root.appendChild(el('p', 'deck-count', Lang.t('prayersSummary', {
    prayers: Lang.count(prayers.length, 'prayer1', 'prayersCount')
  })));

  prayers.forEach(function (entry) {
    root.appendChild(buildCard(entry));
  });

  function buildCard(entry) {
    var card = el('article', 'prayer-card');
    /* Its period's colour, so the prayer is recognisably from the
       stretch of road the candidate met it on. */
    card.setAttribute('data-period', entry.period);

    var box = el('div', 'prayer');
    /* A heading only where the note prints one. */
    if (entry.prayer.label) {
      box.appendChild(el('span', 'plabel', entry.prayer.label));
    }
    entry.prayer.lines.forEach(function (line) {
      var p = el('p', AMEN.test(line) ? 'amen-line' : null, line);
      if (!entry.translated) { p.setAttribute('lang', 'en'); }
      box.appendChild(p);
    });
    card.appendChild(box);

    var from = el('p', 'prayer-from');
    var link = el('a', null, Lang.t('topicLine', {
      n: entry.topic, title: entry.title
    }));
    link.href = 'session.html?topic=' + entry.topic + '#part-' + entry.part;
    if (!entry.translated) { link.setAttribute('lang', 'en'); }
    from.appendChild(link);
    card.appendChild(from);

    return card;
  }
})();
