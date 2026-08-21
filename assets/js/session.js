/* ============================================================
   THE EMMAUS COMPANION — Session page
   Renders one topic from content/topics/topic-NN.js, mounts the
   journal, and hands the candidate a Word document on request.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;

  /* ---------------- which topic ---------------- */

  function requestedTopic() {
    var match = /[?&]topic=(\d+)/.exec(window.location.search);
    return match ? parseInt(match[1], 10) : null;
  }

  var topicNo = requestedTopic();
  var topic = topicNo != null && window.RCIA.topics ? window.RCIA.topics[topicNo] : null;
  var root = document.getElementById('sessionRoot');

  if (!topic) {
    root.appendChild(buildNotice(topicNo));
    return;
  }

  document.body.setAttribute('data-period', topic.period);
  document.title = 'Topic ' + topic.topic + ' — ' + topic.title + ' · The Emmaus Companion';

  /* ---------------- render ---------------- */

  root.appendChild(buildHead(topic));
  if (Journal.available) {
    root.appendChild(buildSeal());
  } else {
    root.appendChild(buildStorageWarning());
  }
  topic.parts.forEach(function (part) { root.appendChild(buildPart(part)); });
  root.appendChild(buildExport(topic));
  root.appendChild(buildPager(topic));
  root.appendChild(buildColophon());

  mountJournal(topic);

  /* The page is built by script, so a #part-D link has to be honoured
     once the parts actually exist. */
  if (window.location.hash) {
    try {
      var target = document.querySelector(window.location.hash);
      if (target) { target.scrollIntoView(); }
    } catch (e) { /* a hash that is not a valid selector */ }
  }

  /* ============================================================
     Builders
     ============================================================ */

  function buildNotice(requested) {
    var box = el('div', 'notice');
    box.appendChild(el('h1', null, requested ? 'Topic ' + requested + ' is not in this pilot yet'
                                             : 'No topic was chosen'));
    var written = Emmaus.availableTopics();
    box.appendChild(el('p', null,
      'This pilot copy carries ' +
      (written.length === 1 ? 'one topic' : written.length + ' topics') +
      ': ' + written.map(function (n) { return 'Topic ' + n; }).join(', ') +
      '. The remaining topics arrive in Phase II, once each has been transcribed and proofread against the approved notes.'));
    var back = el('a', 'btn', 'Return to the journey');
    back.href = 'index.html';
    box.appendChild(back);
    return box;
  }

  function buildHead(t) {
    var head = el('header', 'session-head');
    var period = Emmaus.periodOf(t.period);

    if (period) {
      head.appendChild(el('p', 'period-tag',
        period.letter + ' · ' + period.name + ' · ' + period.stage.split(' · ')[0]));
    }
    head.appendChild(el('p', 'topic-no', 'Topic ' + t.topic + ' · Session ' + t.session));
    head.appendChild(el('h1', null, t.title));
    if (t.theme) {
      head.appendChild(el('p', 'theme', 'Theme: ' + t.theme));
    }
    if (t.topicQuestion) {
      head.appendChild(el('p', 'question-of-topic', t.topicQuestion));
    }
    return head;
  }

  function buildSeal() {
    var seal = el('div', 'seal');
    seal.appendChild(el('span', 'cross', '✠'));
    seal.appendChild(el('p', null,
      'Whatever you write below is saved on this device alone. It is never sent anywhere, and no one else can read it unless you save it as a Word document and choose to share it.'));
    return seal;
  }

  function buildStorageWarning() {
    var seal = el('div', 'seal');
    seal.appendChild(el('span', 'cross', '✠'));
    seal.appendChild(el('p', null,
      'This browser is not allowing anything to be saved (private browsing may be switched on). You may still write and save a Word document, but your words will be lost when you close this page.'));
    return seal;
  }

  function buildPart(part) {
    var section = el('section', 'part');
    /* Lets a catechist link straight to a part: session.html?topic=16#part-D */
    section.id = 'part-' + part.letter;

    var head = el('div', 'part-head');
    head.appendChild(el('span', 'letter', part.letter));
    head.appendChild(el('h2', null, part.name));
    if (part.ref) {
      var ref = bibleLink(part.ref, part.ref);
      ref.className = 'ref';
      head.appendChild(ref);
    }
    section.appendChild(head);

    part.blocks.forEach(function (block) {
      var node = buildBlock(block, part);
      if (node) { section.appendChild(node); }
    });
    return section;
  }

  function buildBlock(block, part) {
    switch (block.type) {
      case 'label':    return el('p', 'sec-rubric', block.text);
      case 'subhead':  return el('p', 'sec-rubric', block.text);
      case 'aside':    return el('p', 'marginal', block.text);
      case 'lead':     return el('p', 'lead', block.text);
      case 'para':     return el('p', null, block.text);
      case 'list':     return buildList(block);
      case 'points':   return buildPoints(block);
      case 'pericope': return buildPericope(block);
      case 'versicle': return buildVersicle(block);
      case 'prayer':   return buildPrayer(block);
      case 'saint':    return buildSaint(block);
      case 'plate':    return buildPlate(block);
      case 'journal':  return buildJournal(block, part);
      default:         return el('p', null, block.text || '');
    }
  }

  function buildList(block) {
    var lettered = block.style === 'lettered';
    var list = el(lettered ? 'ol' : 'ul', lettered ? 'lettered' : 'plain');
    if (lettered) { list.setAttribute('type', 'a'); }
    block.items.forEach(function (item) {
      list.appendChild(el('li', null, item));
    });
    if (block.marker) { list.style.setProperty('--marker', '"' + block.marker + '"'); }
    return list;
  }

  function buildPoints(block) {
    var list = el('ol', 'points');
    block.items.forEach(function (item) {
      var li = el('li');

      if (item.title) {
        li.appendChild(el('b', 'pt-title-plain', item.title));
        /* The joiner reproduces the source punctuation exactly:
           a space, an en dash, or a break to a new paragraph. */
        if (item.joiner === '\n') {
          li.appendChild(el('br'));
        } else {
          li.appendChild(document.createTextNode(item.joiner || ' '));
        }
      }
      li.appendChild(document.createTextNode(item.body));

      if (item.afterBody) {
        li.appendChild(el('p', null, item.afterBody));
      }
      if (item.list) {
        li.appendChild(buildList({ items: item.list, style: item.listStyle === 'lettered' ? 'lettered' : null }));
      }
      if (item.marginal) {
        var note = el('span', 'marginal');
        note.appendChild(el('span', 'mrk', item.marginal.mark + ' '));
        /* Scripture marginalia link out; CCC references do not. */
        if (item.marginal.mark === 'Scripture') {
          note.appendChild(bibleLink(item.marginal.text, item.marginal.text));
        } else {
          note.appendChild(document.createTextNode(item.marginal.text));
        }
        li.appendChild(note);
      }
      list.appendChild(li);
    });
    return list;
  }

  /* A reference as printed, made clickable when it can be understood.
     Returns a plain <span> when it cannot, so nothing ever looks like a
     link that goes nowhere. `passage` in the content file overrides the
     parser, for a heading the parser would read wrongly. */
  function bibleLink(reference, label, passage) {
    var href = Scripture.url(passage || reference);
    if (!href) { return el('span', null, label); }

    var chapter = Scripture.chapterLabel(passage || reference);
    var a = el('a', null, label);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = 'Read ' + chapter + ' on the USCCB Bible (opens in a new tab)';
    return a;
  }

  function buildPericope(block) {
    var box = el('div', 'pericope');

    var cite = el('p', 'cite');
    cite.appendChild(bibleLink(block.cite, block.cite, block.passage));
    box.appendChild(cite);

    if (block.instruction) { box.appendChild(el('p', 'instruction', block.instruction)); }

    /* An unmistakable way in, rather than relying on the heading alone. */
    var chapter = Scripture.chapterLabel(block.passage || block.cite);
    if (chapter) {
      var line = el('p', 'bible-link');
      var open = bibleLink(block.cite, 'Read ' + chapter + ' on the USCCB Bible ↗', block.passage);
      line.appendChild(open);
      box.appendChild(line);
    }
    return box;
  }

  function buildVersicle(block) {
    var box = el('blockquote', 'versicle');
    var text = (block.number ? block.number + ' ' : '') + block.text;
    box.appendChild(document.createTextNode(text));
    if (block.ref) {
      var ref = el('span', 'vref');
      ref.appendChild(bibleLink(block.ref, block.ref, block.passage));
      box.appendChild(ref);
    }
    return box;
  }

  function buildPrayer(block) {
    var box = el('div', 'prayer');
    if (block.label) { box.appendChild(el('span', 'plabel', block.label)); }
    block.lines.forEach(function (line) {
      var isAmen = /Amen\.?$/.test(line);
      var p = el('p', null, line);
      if (isAmen) { p.className = 'amen-line'; }
      box.appendChild(p);
    });
    return box;
  }

  function buildSaint(block) {
    var plate = el('div', 'plate');

    var portrait = el('div', 'portrait');
    if (block.image) {
      var img = document.createElement('img');
      img.src = block.image;
      img.alt = block.name;
      img.loading = 'lazy';
      portrait.appendChild(img);
    } else {
      portrait.appendChild(el('span', 'monogram', block.monogram || '✠'));
    }
    plate.appendChild(portrait);

    var body = el('div');
    body.appendChild(el('h3', null, block.name + (block.alsoKnown ? ' (' + block.alsoKnown + ')' : '')));

    var dl = el('dl');
    block.facts.forEach(function (fact) {
      dl.appendChild(el('dt', null, fact.label));
      dl.appendChild(el('dd', null, fact.value));
    });
    body.appendChild(dl);

    block.paragraphs.forEach(function (text) { body.appendChild(el('p', null, text)); });

    if (block.list) {
      var list = el('ol', 'lettered');
      block.list.forEach(function (item) { list.appendChild(el('li', null, item)); });
      body.appendChild(list);
    }

    if (block.sources && block.sources.length) {
      var sources = el('p', 'sources');
      sources.appendChild(document.createTextNode('Read more: '));
      block.sources.forEach(function (href, i) {
        if (i > 0) { sources.appendChild(document.createTextNode(' · ')); }
        var a = el('a', null, hostOf(href));
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        sources.appendChild(a);
      });
      body.appendChild(sources);
    }

    plate.appendChild(body);
    return plate;
  }

  function hostOf(href) {
    try { return new URL(href).hostname.replace(/^www\./, ''); }
    catch (e) { return href; }
  }

  function buildPlate(block) {
    var figure = el('figure', 'plate');
    var portrait = el('div', 'portrait');
    portrait.style.aspectRatio = '4 / 5';

    if (block.image) {
      var img = document.createElement('img');
      img.src = block.image;
      img.alt = block.suggested || '';
      portrait.appendChild(img);
    } else {
      portrait.appendChild(el('span', 'monogram', '✠'));
    }
    figure.appendChild(portrait);

    var body = el('div');
    body.appendChild(el('h3', null, block.caption || 'The picture'));
    if (block.suggested) {
      body.appendChild(el('p', null, block.suggested));
    }
    body.appendChild(el('p', 'sources',
      'The retreat team shows this image on the day. To place it in the app, save the picture as ' +
      (block.fileHint || 'assets/img/…') + ' and name that file in the topic content.'));
    figure.appendChild(body);
    return figure;
  }

  function buildJournal(block, part) {
    var wrap = el('div', 'journal');
    wrap.setAttribute('data-journal-id', block.id);

    if (block.prompt) { wrap.appendChild(el('p', 'sec-rubric', block.prompt)); }

    block.questions.forEach(function (question, index) {
      var key = block.id + ':' + index;

      var q = el('p', 'question');
      q.appendChild(el('span', 'qn', question.n));
      q.appendChild(document.createTextNode(question.text));
      wrap.appendChild(q);

      var area = document.createElement('textarea');
      area.className = 'journal-lines';
      area.rows = 3;
      area.setAttribute('data-key', key);
      area.setAttribute('aria-label', 'Your reflection: ' + question.text);
      area.placeholder = 'Write here…';
      wrap.appendChild(area);
    });

    return wrap;
  }

  function buildExport(t) {
    var box = el('section', 'export');
    box.appendChild(el('h2', null, 'Save your reflections'));
    box.appendChild(el('p', null,
      'Your answers become a Word document, made here on your device and saved straight to it. Nothing is sent anywhere.'));

    var fields = el('div', 'namefield');

    var nameWrap = el('div');
    var nameLabel = el('label', null, 'Your name');
    nameLabel.setAttribute('for', 'candidateName');
    var nameInput = document.createElement('input');
    nameInput.id = 'candidateName';
    nameInput.type = 'text';
    nameInput.placeholder = 'e.g. Teresa Lim';
    nameInput.value = Journal.getName();
    nameInput.autocomplete = 'name';
    nameWrap.appendChild(nameLabel);
    nameWrap.appendChild(nameInput);

    var dateWrap = el('div');
    var dateLabel = el('label', null, 'Session date');
    dateLabel.setAttribute('for', 'sessionDate');
    var dateInput = document.createElement('input');
    dateInput.id = 'sessionDate';
    dateInput.type = 'date';
    dateWrap.appendChild(dateLabel);
    dateWrap.appendChild(dateInput);

    fields.appendChild(nameWrap);
    fields.appendChild(dateWrap);
    box.appendChild(fields);

    var actions = el('div', 'actions');

    var saveBtn = el('button', 'btn btn--primary', '⤓  Save as Word document');
    saveBtn.type = 'button';
    saveBtn.id = 'exportBtn';
    actions.appendChild(saveBtn);

    var printBtn = el('button', 'btn btn--quiet', 'Print this session');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () { window.print(); });
    actions.appendChild(printBtn);

    box.appendChild(actions);
    box.appendChild(el('p', 'status', ''));

    nameInput.addEventListener('input', function () { Journal.setName(nameInput.value); });
    saveBtn.addEventListener('click', function () {
      exportTopic(t, nameInput.value, dateInput.value, box.querySelector('.status'));
    });

    return box;
  }

  function buildPager(t) {
    var pager = el('nav', 'pager');
    var written = Emmaus.availableTopics();
    var index = written.indexOf(t.topic);

    var prev = el('div');
    if (index > 0) {
      var pa = el('a');
      pa.href = 'session.html?topic=' + written[index - 1];
      pa.appendChild(el('span', 'lbl', 'Previous in this pilot'));
      pa.appendChild(document.createTextNode('Topic ' + written[index - 1]));
      prev.appendChild(pa);
    }

    var home = el('div');
    var ha = el('a');
    ha.href = 'index.html';
    ha.appendChild(el('span', 'lbl', 'The journey'));
    ha.appendChild(document.createTextNode('All sessions'));
    home.appendChild(ha);

    var next = el('div');
    if (index > -1 && index < written.length - 1) {
      var na = el('a');
      na.href = 'session.html?topic=' + written[index + 1];
      na.appendChild(el('span', 'lbl', 'Next in this pilot'));
      na.appendChild(document.createTextNode('Topic ' + written[index + 1]));
      next.appendChild(na);
    }

    pager.appendChild(prev);
    pager.appendChild(home);
    pager.appendChild(next);
    return pager;
  }

  function buildColophon() {
    var foot = el('footer', 'colophon');
    foot.appendChild(el('p', null,
      'The text of this session is reproduced from the notes approved for publication by the Penang Diocesan Catechetical Commission. Imprimatur: ✠ Cardinal Sebastian Francis, Bishop of Penang, 31 May 2026.'));
    foot.appendChild(el('p', 'amdg', 'Ad Maiorem Dei Gloriam'));
    return foot;
  }

  /* ============================================================
     The journal: restore, autosave, grow
     ============================================================ */

  function grow(area) {
    var borders = area.offsetHeight - area.clientHeight;
    area.style.height = 'auto';
    area.style.height = (area.scrollHeight + borders) + 'px';
  }

  function mountJournal(t) {
    var saved = Journal.load(t.topic).answers;
    var status = document.querySelector('.export .status');

    var areas = root.querySelectorAll('textarea.journal-lines');
    Array.prototype.forEach.call(areas, function (area) {
      var key = area.getAttribute('data-key');
      if (saved[key]) { area.value = saved[key]; }
      grow(area);

      area.addEventListener('input', function () {
        grow(area);
        Journal.setAnswer(t.topic, key, area.value, function (ok) {
          if (!status) { return; }
          if (ok) {
            status.textContent = 'Saved on this device · ' + timeNow();
            status.setAttribute('data-state', 'saved');
          } else {
            status.textContent = 'This browser would not let your writing be saved.';
            status.setAttribute('data-state', 'error');
          }
        });
      });
    });

    /* Re-measure once the web fonts land, so ruled lines stay aligned. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        Array.prototype.forEach.call(areas, grow);
      });
    }
    window.addEventListener('resize', function () {
      Array.prototype.forEach.call(areas, grow);
    });
  }

  function timeNow() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var suffix = h >= 12 ? 'pm' : 'am';
    h = h % 12; if (h === 0) { h = 12; }
    return h + ':' + (m < 10 ? '0' : '') + m + suffix;
  }

  /* ============================================================
     The Word document
     ============================================================ */

  function exportTopic(t, name, isoDate, status) {
    Journal.flush();

    /* flush() cancels pending timers, so read straight from the boxes. */
    var answers = {};
    var areas = root.querySelectorAll('textarea.journal-lines');
    Array.prototype.forEach.call(areas, function (area) {
      answers[area.getAttribute('data-key')] = area.value;
    });

    /* Persist whatever is on screen before handing over the document.
       If storage is unavailable the document is still produced. */
    var entry = Journal.load(t.topic);
    Object.keys(answers).forEach(function (key) {
      if (answers[key] && answers[key].length) { entry.answers[key] = answers[key]; }
      else { delete entry.answers[key]; }
    });
    Journal.save(t.topic, entry);

    var sessionDate = null;
    if (isoDate) {
      var parts = isoDate.split('-');
      sessionDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }

    var built = EmmausExport.buildSpec(t, answers, {
      name: name,
      period: Emmaus.periodOf(t.period),
      sessionDate: sessionDate
    });
    var fileName = EmmausExport.fileNameFor(t, name);

    try {
      EmmausDocx.save(built.spec, fileName);
      status.setAttribute('data-state', 'saved');
      status.textContent = built.wrote
        ? 'Saved “' + fileName + '” to your device — ' + built.wrote + ' of ' +
          built.total + ' reflections written.'
        : 'Saved “' + fileName + '” — the questions are there, ready for you to write.';
    } catch (e) {
      status.setAttribute('data-state', 'error');
      status.textContent = 'The document could not be made on this device. ' +
        'Try the Print button instead, and choose “Save as PDF”.';
    }
  }
})();
