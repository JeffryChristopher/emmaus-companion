/* ============================================================
   THE EMMAUS COMPANION — The Journey map
   The forty-two sessions drawn as one road through four periods,
   with the Rites standing along it as gates.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;
  var root = document.getElementById('journeyRoot');
  if (!root) { return; }

  var written = Emmaus.availableTopics();

  window.RCIA.periods.forEach(function (period) {
    var sessions = window.RCIA.sessions.filter(function (s) { return s.period === period.id; });
    if (!sessions.length) { return; }
    root.appendChild(buildPeriod(period, sessions));
  });

  root.appendChild(buildJournalPanel());

  /* ---------------- builders ---------------- */

  function buildPeriod(period, sessions) {
    var section = el('section', 'period');
    section.setAttribute('data-period', period.id);

    var head = el('div', 'period-head');
    head.appendChild(el('p', 'pletter', period.letter));
    head.appendChild(el('h2', null, period.name));
    head.appendChild(el('p', 'pstage', period.stage));
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

    var row;
    if (isWritten) {
      row = el('a', 'stop-link');
      row.href = 'session.html?topic=' + session.topic;
    } else {
      row = el('div', 'stop-blank');
    }

    row.appendChild(el('span', 'sess', 'Sess ' + session.session));
    row.appendChild(el('span', 'title', session.title));

    if (isWritten) {
      var answered = Journal.countAnswered(session.topic);
      var flag = el('span', 'flag flag--written',
        answered ? answered + (answered === 1 ? ' reflection' : ' reflections') : 'Open');
      row.appendChild(flag);
    } else if (hasNote) {
      row.appendChild(el('span', 'flag flag--soon', 'Topic ' + session.topic + ' · Phase II'));
    } else {
      row.appendChild(el('span', 'flag flag--soon', 'Briefing'));
    }

    li.appendChild(row);
    return li;
  }

  function buildGate(gate) {
    var li = el('li', 'gate' + (gate.major ? ' gate--major' : ''));
    li.appendChild(el('span', 'cross', '✠'));

    var body = el('span', 'gname', gate.name);
    body.appendChild(el('span', 'gwhen', gate.when));
    li.appendChild(body);
    return li;
  }

  /* ---------------- what has been written so far ----------------
     The candidate's own keepsake is the Word document they save at
     the end of each session, so there is no separate backup here. */

  function buildJournalPanel() {
    var box = el('section', 'export');
    box.appendChild(el('h2', null, 'Your journal'));

    var topicsWritten = Journal.everyTopicWritten().filter(function (n) {
      return Journal.countAnswered(n) > 0;
    });
    var total = topicsWritten.reduce(function (sum, n) {
      return sum + Journal.countAnswered(n);
    }, 0);

    if (!total) {
      box.appendChild(el('p', null,
        'Nothing is written yet. Open a session and begin — whatever you write stays on this device, and you save it as a Word document when you are done.'));
      return box;
    }

    box.appendChild(el('p', null,
      'You have written ' + total + (total === 1 ? ' reflection' : ' reflections') +
      ' across ' + topicsWritten.length + (topicsWritten.length === 1 ? ' topic' : ' topics') +
      '. Remember to save each session as a Word document — that is the copy that stays with you.'));

    /* Which sessions have writing in them, so the candidate can go back. */
    var list = el('ul', 'plain');
    topicsWritten.forEach(function (n) {
      var topic = (window.RCIA.topics || {})[n];
      if (!topic) { return; }
      var count = Journal.countAnswered(n);
      var li = el('li');
      var link = el('a', null, 'Topic ' + n + ' — ' + topic.title);
      link.href = 'session.html?topic=' + n;
      li.appendChild(link);
      li.appendChild(el('span', 'sub',
        '  ·  ' + count + (count === 1 ? ' reflection' : ' reflections')));
      list.appendChild(li);
    });
    box.appendChild(list);

    return box;
  }
})();
