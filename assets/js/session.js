/* ============================================================
   THE EMMAUS COMPANION — Session page
   Renders one topic from content/topics/<lang>/topic-NN.js, mounts
   the journal, and hands the candidate a Word document on request.

   The note shown is the one approved in the chosen language. Where a
   topic has not been transcribed into that language yet, the English
   note is shown under a notice saying so — never an empty page. The
   candidate's answers are stored against the topic and not against
   the language, so they survive the change either way.
   ============================================================ */

(function () {
  'use strict';

  var el = Emmaus.el;

  /* "Amen" closes a prayer in every language the app carries; the last
     line is set apart wherever it is recognised. Declared here, above
     the render below, because a `var` initialiser does not hoist. */
  var AMEN = /(?:Amen|Amin|阿门|阿們|ஆமென்)[.。．]?$/;

  /* ---------------- which topic ---------------- */

  function requestedTopic() {
    var match = /[?&]topic=(\d+)/.exec(window.location.search);
    return match ? parseInt(match[1], 10) : null;
  }

  var chosen = Lang.current();
  var topicNo = requestedTopic();
  var found = topicNo != null ? Emmaus.topicIn(topicNo, chosen) : null;
  var root = document.getElementById('sessionRoot');

  if (!found) {
    root.appendChild(buildNotice(topicNo));
    return;
  }

  var topic = found.topic;

  document.body.setAttribute('data-period', topic.period);
  /* The note's own script, which may differ from the chrome around it. */
  root.setAttribute('lang', Lang.meta(found.lang).html);
  document.title = Lang.t('topicLine', { n: topic.topic, title: topic.title }) +
                   ' · ' + Lang.t('appTitle');

  /* ---------------- render ---------------- */

  root.appendChild(buildHead(topic));
  if (!found.translated && chosen !== Lang.DEFAULT) {
    root.appendChild(buildLanguageNotice());
  }
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
    box.appendChild(el('h1', null, requested
      ? Lang.t('notFoundTitle', { n: requested })
      : Lang.t('notFoundNone')));

    /* Naming the range rather than listing every topic: with the whole
       syllabus transcribed, the list would run to thirty-seven. */
    var written = Emmaus.availableTopics();
    box.appendChild(el('p', null, Lang.t('notFoundBody', {
      first: written[0],
      last: written[written.length - 1]
    })));

    var back = el('a', 'btn', Lang.t('backToJourney'));
    back.href = 'index.html';
    box.appendChild(back);
    return box;
  }

  /* Shown when the chosen language has no note for this topic yet. */
  function buildLanguageNotice() {
    var box = el('div', 'seal seal--notice');
    box.appendChild(el('span', 'cross', '✠'));
    box.appendChild(el('p', null,
      Lang.t('fallbackNotice', { language: Lang.meta(chosen).endonym })));
    return box;
  }

  function buildHead(t) {
    var head = el('header', 'session-head');
    var period = Emmaus.periodOf(t.period);

    if (period) {
      var words = Lang.period(period.id);
      head.appendChild(el('p', 'period-tag',
        period.letter + ' · ' + words.name + ' · ' + words.stage.split(' · ')[0]));
    }
    head.appendChild(el('p', 'topic-no',
      Lang.t('topicNo', { n: t.topic })));
    head.appendChild(el('h1', null, t.title));
    if (t.theme) {
      head.appendChild(el('p', 'theme', Lang.t('themeLine', { theme: t.theme })));
    }
    if (t.topicQuestion) {
      head.appendChild(el('p', 'question-of-topic', t.topicQuestion));
    }
    return head;
  }

  function buildSeal() {
    var seal = el('div', 'seal');
    seal.appendChild(el('span', 'cross', '✠'));
    seal.appendChild(el('p', null, Lang.t('sealPrivacy')));
    return seal;
  }

  function buildStorageWarning() {
    var seal = el('div', 'seal');
    seal.appendChild(el('span', 'cross', '✠'));
    seal.appendChild(el('p', null, Lang.t('sealNoStorage')));
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
      var ref = bibleLink(part.ref, part.ref, part.passage);
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
      case 'table':    return buildTable(block);
      case 'media':    return buildMedia(block);
      case 'journal':  return buildJournal(block, part);
      default:         return el('p', null, block.text || '');
    }
  }

  /* `style` is 'lettered' (a, b, c…), 'numbered' (1, 2, 3…) or plain
     (a ✠, or whatever `marker` says). `start` continues a lettering
     that the printed note broke in two — Topic 3 runs a) to d), prints
     a heading, then carries on at e). */
  function buildList(block) {
    var ordered = block.style === 'lettered' || block.style === 'numbered';
    var list = el(ordered ? 'ol' : 'ul', ordered ? 'lettered' : 'plain');
    if (block.style === 'lettered') { list.setAttribute('type', 'a'); }
    if (block.start) { list.setAttribute('start', block.start); }
    block.items.forEach(function (item) {
      list.appendChild(el('li', null, item));
    });
    if (block.marker) { list.style.setProperty('--marker', '"' + block.marker + '"'); }
    return list;
  }

  /* A table as the note prints one — Topic 17's matter and form of each
     sacrament, Topic 28's Sunday readings. `head` is a row of column
     headings; `rows` are rows of cells. Both are plain strings. It
     scrolls sideways inside its own frame rather than pushing the page
     wider than the phone it is read on. */
  function buildTable(block) {
    var frame = el('div', 'table-frame');
    var table = el('table', 'plain-table');

    if (block.caption) { table.appendChild(el('caption', null, block.caption)); }
    if (block.head && block.head.length) {
      var thead = el('thead');
      var hrow = el('tr');
      block.head.forEach(function (cell) {
        var th = el('th', null, cell);
        th.setAttribute('scope', 'col');
        hrow.appendChild(th);
      });
      thead.appendChild(hrow);
      table.appendChild(thead);
    }

    var tbody = el('tbody');
    (block.rows || []).forEach(function (cells) {
      var tr = el('tr');
      cells.forEach(function (cell, i) {
        /* The first column names the row — a sacrament, a Sunday — so
           it is a heading, and a screen reader says it before the cell. */
        var td = el(i === 0 && block.head ? 'th' : 'td', null, cell);
        if (i === 0 && block.head) { td.setAttribute('scope', 'row'); }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    frame.appendChild(table);
    if (block.note) { frame.appendChild(el('p', 'table-note', block.note)); }
    return frame;
  }

  /* A video or page the note sends the candidate to. The label is the
     note's own words; the address is shown beneath it, because a
     printed note is read on paper as often as on a screen. */
  function buildMedia(block) {
    var wrap = el('div', 'media');
    var items = block.items || [{ label: block.label, href: block.href, note: block.note }];

    if (block.label && block.items) { wrap.appendChild(el('p', 'media-lead', block.label)); }

    items.forEach(function (item) {
      var row = el('p', 'media-item');
      var a = el('a', null, item.label || item.href);
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      row.appendChild(a);
      if (item.note) { row.appendChild(el('span', 'media-note', item.note)); }
      row.appendChild(el('span', 'media-host', hostOf(item.href)));
      wrap.appendChild(row);
    });
    return wrap;
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
      /* Some printed points answer their own question with nothing but
         a list or a table, and no sentence at all. */
      if (item.body) { li.appendChild(document.createTextNode(item.body)); }

      /* Everything a printed point can carry after its opening
         sentence, in the order the note prints it: a table, a further
         paragraph, a list, and — where the note breaks one list with a
         heading and resumes it — a second paragraph and a second list. */
      if (item.table) { li.appendChild(buildTable(item.table)); }
      if (item.afterBody) {
        li.appendChild(el('p', null, item.afterBody));
      }
      if (item.list) {
        li.appendChild(buildList({
          items: item.list,
          style: item.listStyle || null,
          start: item.listStart || null
        }));
      }
      if (item.afterList) {
        li.appendChild(el('p', null, item.afterList));
      }
      if (item.list2) {
        li.appendChild(buildList({
          items: item.list2,
          style: item.list2Style || item.listStyle || null,
          start: item.list2Start || null
        }));
      }
      if (item.media) { li.appendChild(buildMedia(item.media)); }
      if (item.marginal) {
        var note = el('span', 'marginal');
        note.appendChild(el('span', 'mrk', item.marginal.mark + ' '));
        /* Scripture marginalia link out; catechism references do not.
           A translated note names its books in its own language, so
           `passage` carries the chapter the link should open. */
        if (item.marginal.passage || item.marginal.mark === 'Scripture') {
          note.appendChild(bibleLink(item.marginal.text, item.marginal.text,
                                     item.marginal.passage));
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
     parser, for a heading the parser would read wrongly.

     The link goes to a Bible in the candidate's own language, so a
     Tamil reader lands in a Tamil Bible. A reference to a book that
     edition does not carry — the deuterocanonical books are absent
     from the Malay AVB — is left as plain text rather than pointed at
     a page that does not hold it. */
  function bibleLink(reference, label, passage) {
    var href = Scripture.url(passage || reference, chosen);
    if (!href) { return el('span', null, label); }

    var chapter = Scripture.chapterLabel(passage || reference, chosen);
    var a = el('a', null, label);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = Lang.t('readChapterTitle', {
      chapter: chapter,
      bible: Scripture.bibleName(chosen)
    });
    return a;
  }

  function buildPericope(block) {
    var box = el('div', 'pericope');

    var cite = el('p', 'cite');
    cite.appendChild(bibleLink(block.cite, block.cite, block.passage));
    box.appendChild(cite);

    if (block.instruction) { box.appendChild(el('p', 'instruction', block.instruction)); }

    /* An unmistakable way in, rather than relying on the heading alone.
       Only offered when there is somewhere to go: a book the chosen
       language's Bible does not carry gets no dead invitation. */
    var chapter = Scripture.chapterLabel(block.passage || block.cite, chosen);
    if (chapter && Scripture.url(block.passage || block.cite, chosen)) {
      var line = el('p', 'bible-link');
      var open = bibleLink(block.cite, Lang.t('readChapter', {
        chapter: chapter,
        bible: Scripture.bibleName(chosen)
      }), block.passage);
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
      var isAmen = AMEN.test(line);
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
      sources.appendChild(document.createTextNode(Lang.t('readMore')));
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
    body.appendChild(el('h3', null, block.caption || Lang.t('pictureTitle')));
    if (block.suggested) {
      body.appendChild(el('p', null, block.suggested));
    }
    body.appendChild(el('p', 'sources',
      Lang.t('pictureNote', { file: block.fileHint || 'assets/img/…' })));
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
      area.setAttribute('aria-label', Lang.t('yourReflection', { question: question.text }));
      area.placeholder = Lang.t('writeHere');
      /* The candidate writes in their own language, whatever script
         the question happens to be printed in. */
      area.setAttribute('lang', Lang.meta(chosen).html);
      wrap.appendChild(area);
    });

    return wrap;
  }

  function buildExport(t) {
    var box = el('section', 'export');
    box.appendChild(el('h2', null, Lang.t('exportHeading')));
    box.appendChild(el('p', null, Lang.t('exportBody')));

    var fields = el('div', 'namefield');

    var nameWrap = el('div');
    var nameLabel = el('label', null, Lang.t('yourName'));
    nameLabel.setAttribute('for', 'candidateName');
    var nameInput = document.createElement('input');
    nameInput.id = 'candidateName';
    nameInput.type = 'text';
    nameInput.placeholder = Lang.t('namePlaceholder');
    nameInput.value = Journal.getName();
    nameInput.autocomplete = 'name';
    nameWrap.appendChild(nameLabel);
    nameWrap.appendChild(nameInput);

    var dateWrap = el('div');
    var dateLabel = el('label', null, Lang.t('sessionDate'));
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

    var saveBtn = el('button', 'btn btn--primary', Lang.t('saveWord'));
    saveBtn.type = 'button';
    saveBtn.id = 'exportBtn';
    actions.appendChild(saveBtn);

    var printBtn = el('button', 'btn btn--quiet', Lang.t('printSession'));
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
    var stops = Emmaus.pageStops();
    var index = -1;
    stops.forEach(function (stop, i) {
      if (stop.session === t.session) { index = i; }
    });

    var prev = el('div');
    if (index > 0) {
      var pa = el('a');
      pa.href = stops[index - 1].href;
      pa.appendChild(el('span', 'lbl', Lang.t('prevTopic')));
      pa.appendChild(document.createTextNode(Lang.t('topicName', { n: stops[index - 1].topic })));
      prev.appendChild(pa);
    }

    var home = el('div');
    var ha = el('a');
    ha.href = 'index.html';
    ha.appendChild(el('span', 'lbl', Lang.t('theJourney')));
    ha.appendChild(document.createTextNode(Lang.t('allSessions')));
    home.appendChild(ha);

    var next = el('div');
    if (index > -1 && index < stops.length - 1) {
      var na = el('a');
      na.href = stops[index + 1].href;
      na.appendChild(el('span', 'lbl', Lang.t('nextTopic')));
      na.appendChild(document.createTextNode(Lang.t('topicName', { n: stops[index + 1].topic })));
      next.appendChild(na);
    }

    pager.appendChild(prev);
    pager.appendChild(home);
    pager.appendChild(next);
    return pager;
  }

  function buildColophon() {
    var foot = el('footer', 'colophon');
    foot.appendChild(el('p', null, Lang.t('colophonSession')));
    if (chosen !== Lang.DEFAULT) {
      foot.appendChild(el('p', null, Lang.t('colophonTranslated')));
    }
    foot.appendChild(el('p', 'amdg', Lang.t('amdg')));
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
            status.textContent = Lang.t('savedAt', { time: Lang.formatTime(new Date()) });
            status.setAttribute('data-state', 'saved');
          } else {
            status.textContent = Lang.t('saveRefused');
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
      sessionDate: sessionDate,
      /* The chrome of the document follows the candidate's choice; the
         note inside it is whichever language it was actually found in,
         and says so when the two differ. */
      lang: chosen,
      noteLang: found.lang
    });
    var fileName = EmmausExport.fileNameFor(t, name, chosen);

    try {
      EmmausDocx.save(built.spec, fileName);
      status.setAttribute('data-state', 'saved');
      status.textContent = built.wrote
        ? Lang.t('savedFile', { file: fileName, wrote: built.wrote, total: built.total })
        : Lang.t('savedFileBlank', { file: fileName });
    } catch (e) {
      status.setAttribute('data-state', 'error');
      status.textContent = Lang.t('exportFailed');
    }
  }
})();
