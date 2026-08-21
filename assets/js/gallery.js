/* ============================================================
   THE EMMAUS COMPANION — Drawing the Saints gallery
   The page itself. Saints.gather() does the reading; this only
   sets it out, month by month.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;
  var root = document.getElementById('saintsRoot');
  if (!root) { return; }

  var lang = Lang.current();
  var mounted = document.getElementById('langPick');
  if (mounted) { Lang.mountPicker(mounted); }

  var saints = Saints.gather(lang);

  if (!saints.length) {
    root.appendChild(el('p', null, Lang.t('saintsEmpty')));
    return;
  }

  root.appendChild(el('p', 'deck-count', Lang.t('saintsSummary', {
    saints: Lang.count(saints.length, 'saint1', 'saintsCount')
  })));

  /* Walk the list once, opening a new month whenever it turns over.
     The undated ones fall into a group of their own at the end. */
  var currentMonth = null;
  var openList = null;
  var undatedOpened = false;

  saints.forEach(function (entry) {
    if (entry.date) {
      if (currentMonth !== entry.date.month) {
        currentMonth = entry.date.month;
        root.appendChild(el('h2', 'month', Saints.monthName(currentMonth, lang)));
        openList = el('ul', 'saints');
        root.appendChild(openList);
      }
    } else if (!undatedOpened) {
      undatedOpened = true;
      currentMonth = null;
      root.appendChild(el('h2', 'month month--undated', Lang.t('saintsNoFeast')));
      openList = el('ul', 'saints');
      root.appendChild(openList);
    }
    openList.appendChild(buildSaint(entry));
  });

  function buildSaint(entry) {
    var saint = entry.saint;
    var li = el('li', 'saint-card');

    /* The initial the session page sets in the plate, kept here so a
       reader recognises the same saint in both places. */
    var mark = el('span', 'monogram', saint.monogram || '✠');
    li.appendChild(mark);

    var body = el('div');

    var day = el('p', 'feast');
    day.appendChild(document.createTextNode(
      Saints.feastLabel(entry.date, lang) || '—'));
    body.appendChild(day);

    var name = el('h3', null, saint.name);
    if (!entry.translated) { name.setAttribute('lang', 'en'); }
    body.appendChild(name);

    if (saint.alsoKnown) {
      var also = el('p', 'also', saint.alsoKnown);
      if (!entry.translated) { also.setAttribute('lang', 'en'); }
      body.appendChild(also);
    }

    /* Each language's notes begin this fact with a different word,
       and the Malay ones are not even consistent with each other
       ("Penaung", "Penaung bagi"), so it is matched as a prefix. The
       word itself is declared once, in i18n.js. */
    var patron = Saints.fact(saint, Lang.t('patronLabel', null, entry.translated ? lang : Lang.DEFAULT));
    if (patron) {
      var p = el('p', 'patron', patron);
      if (!entry.translated) { p.setAttribute('lang', 'en'); }
      body.appendChild(p);
    }

    var link = el('a', 'to-topic', Lang.t('topicName', { n: entry.topic }));
    link.href = 'session.html?topic=' + entry.topic + '#part-D';
    body.appendChild(link);

    li.appendChild(body);
    return li;
  }
})();
