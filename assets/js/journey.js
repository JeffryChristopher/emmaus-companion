/* ============================================================
   THE EMMAUS COMPANION — The Journey map
   The forty-two sessions drawn as one road through four periods,
   with the Rites standing along it as gates.

   A session's title is shown in the chosen language when the note
   itself exists in that language — the title then comes from the
   approved note, not from a translation this app made. Where the
   note has not been transcribed yet, the syllabus's own English
   title stands, and the stop says so.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;
  var root = document.getElementById('journeyRoot');
  if (!root) { return; }

  var lang = Lang.current();
  var written = Emmaus.availableTopics();
  var inLanguage = Emmaus.topicsTranslated(lang);

  mountPicker();

  window.RCIA.periods.forEach(function (period) {
    var sessions = window.RCIA.sessions.filter(function (s) { return s.period === period.id; });
    if (!sessions.length) { return; }
    root.appendChild(buildPeriod(period, sessions));
  });

  root.appendChild(buildJournalPanel());

  /* ---------------- the language chooser ----------------
     It sits above the road, where the candidate meets it before
     anything else they have to read. */

  function mountPicker() {
    var host = document.getElementById('langPick');
    if (host) { Lang.mountPicker(host); }
  }

  /* ---------------- builders ---------------- */

  function buildPeriod(period, sessions) {
    var section = el('section', 'period');
    section.setAttribute('data-period', period.id);
    var words = Lang.period(period.id);

    var head = el('div', 'period-head');
    head.appendChild(el('p', 'pletter', period.letter));
    head.appendChild(el('h2', null, words.name || period.name));
    head.appendChild(el('p', 'pstage', words.stage || period.stage));
    section.appendChild(head);

    var road = el('ol', 'road');
    sessions.forEach(function (session) {
      road.appendChild(buildStop(session));
      if (session.gateAfter) {
        road.appendChild(buildGate(session.gateAfter));
      }
    });
    section.appendChild(road);
    return section;
  }

  function buildStop(session) {
    var li = el('li', 'stop');
    var hasNote = session.topic != null;
    var isWritten = hasNote && written.indexOf(session.topic) > -1;
    var isTranslated = hasNote && inLanguage.indexOf(session.topic) > -1;

    var row;
    if (isWritten) {
      row = el('a', 'stop-link');
      row.href = 'session.html?topic=' + session.topic;
    } else {
      row = el('div', 'stop-blank');
    }

    /* The note's own title where it exists in this language, so the
       words on the map are the words on the candidate's paper. */
    var found = isWritten ? Emmaus.topicIn(session.topic, lang) : null;
    var title = (found && found.translated && found.topic.title) || session.title;
    var titleNode = el('span', 'title', title);
    if (found && !found.translated) {
      titleNode.setAttribute('lang', 'en');
    }
    row.appendChild(titleNode);

    if (isWritten) {
      var answered = Journal.countAnswered(session.topic);
      var text = answered
        ? Lang.count(answered, 'reflection1', 'reflections')
        : Lang.t('open');
      var flag = el('span', 'flag flag--written', text);
      row.appendChild(flag);

      /* Say plainly that this one is still only in English. */
      if (!isTranslated && lang !== Lang.DEFAULT) {
        row.appendChild(el('span', 'flag flag--soon',
          Lang.t('englishOnly', { n: session.topic })));
      }
    } else if (hasNote) {
      row.appendChild(el('span', 'flag flag--soon',
        Lang.t('comingLater', { n: session.topic })));
    } else {
      row.appendChild(el('span', 'flag flag--soon', Lang.t('briefing')));
    }

    li.appendChild(row);
    return li;
  }

  /* The Rites are named in the syllabus schema, which the Commission
     has issued in English only, so they stand as printed. */
  function buildGate(gate) {
    var li = el('li', 'gate' + (gate.major ? ' gate--major' : ''));
    li.appendChild(el('span', 'cross', '✠'));

    var body = el('span', 'gname', gate.name);
    body.setAttribute('lang', 'en');
    body.appendChild(el('span', 'gwhen', gate.when));
    li.appendChild(body);
    return li;
  }

  /* ---------------- what has been written so far ----------------
     The candidate's own keepsake is the Word document they save at
     the end of each session, so there is no separate backup here. */

  function buildJournalPanel() {
    var box = el('section', 'export');
    box.appendChild(el('h2', null, Lang.t('journalHeading')));

    var topicsWritten = Journal.everyTopicWritten().filter(function (n) {
      return Journal.countAnswered(n) > 0;
    });
    var total = topicsWritten.reduce(function (sum, n) {
      return sum + Journal.countAnswered(n);
    }, 0);

    if (!total) {
      box.appendChild(el('p', null, Lang.t('journalEmpty')));
      return box;
    }

    box.appendChild(el('p', null, Lang.t('journalSummary', {
      reflections: Lang.count(total, 'reflection1', 'reflections'),
      topics: Lang.count(topicsWritten.length, 'topics1', 'topicsCount')
    })));

    /* Which sessions have writing in them, so the candidate can go back. */
    var list = el('ul', 'plain');
    topicsWritten.forEach(function (n) {
      var found = Emmaus.topicIn(n, lang);
      if (!found) { return; }
      var count = Journal.countAnswered(n);
      var li = el('li');
      var link = el('a', null, Lang.t('topicLine', { n: n, title: found.topic.title }));
      link.href = 'session.html?topic=' + n;
      if (!found.translated) { link.setAttribute('lang', 'en'); }
      li.appendChild(link);
      li.appendChild(el('span', 'sub',
        '  ·  ' + Lang.count(count, 'reflection1', 'reflections')));
      list.appendChild(li);
    });
    box.appendChild(list);

    return box;
  }
})();
