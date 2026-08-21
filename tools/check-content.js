/* ============================================================
   THE EMMAUS COMPANION: Content check
   Run:  node tools/check-content.js

   Reads every topic file the app ships, in every language, and
   checks it is sound before anyone puts it in front of a candidate:

     · the file loads and registers a topic under its language
     · required fields are present and the period exists
     · every block type is one the app knows how to draw
     · journal ids are unique, so no two answers share a key
     · a translated note asks the SAME questions, under the same
       journal ids, as the English one; answers are stored against
       the topic and not the language, so a mismatch would strand
       whatever a candidate had already written
     · every Scripture reference still resolves, whatever language
       the book is named in
     · no empty or accidentally-undefined text
     · the session number matches the syllabus schema
     · every language answers for every string the app asks for

   Then it writes a sample Word document per language to
   tools/sample/ so the export can be opened and looked at without
   using a browser.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP = path.join(__dirname, '..');
const EmmausDocx = require(path.join(APP, 'assets/js/docx.js'));
const EmmausExport = require(path.join(APP, 'assets/js/export.js'));
const Scripture = require(path.join(APP, 'assets/js/scripture.js'));
const Lang = require(path.join(APP, 'assets/js/i18n.js'));
const Saints = require(path.join(APP, 'assets/js/saints.js'));
const Prayers = require(path.join(APP, 'assets/js/prayers.js'));

/* Block types the session renderer can draw (see session.js buildBlock). */
const KNOWN_BLOCKS = new Set([
  'label', 'subhead', 'aside', 'lead', 'para', 'list', 'points',
  'pericope', 'versicle', 'prayer', 'saint', 'plate', 'journal',
  'table', 'media'
]);

let failures = 0;
let checks = 0;

function check(label, condition, detail) {
  checks++;
  if (condition) {
    console.log('  ok    ' + label);
  } else {
    failures++;
    console.log('  FAIL  ' + label + (detail ? '  -> ' + detail : ''));
  }
}

/* ---- load the content files the way a browser would ---- */

const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.join(APP, relPath), 'utf8');
  vm.runInContext(code, sandbox, { filename: relPath });
}

console.log('Loading content…');
loadScript('content/syllabus.js');

const LANGS = Lang.languages().map(l => l.code);
const TOPIC_ROOT = path.join(APP, 'content/topics');

const loadedFiles = {};
LANGS.forEach(code => {
  const dir = path.join(TOPIC_ROOT, code);
  if (!fs.existsSync(dir)) { loadedFiles[code] = []; return; }
  loadedFiles[code] = fs.readdirSync(dir).filter(n => n.endsWith('.js')).sort();
  loadedFiles[code].forEach(name => loadScript('content/topics/' + code + '/' + name));
});

/* A stray file left in the old flat layout would load into no language
   at all and be silently invisible in the app. */
const strays = fs.readdirSync(TOPIC_ROOT).filter(n => n.endsWith('.js'));

const RCIA = sandbox.window.RCIA;
const allTopics = RCIA.topics || {};

LANGS.forEach(code => {
  const found = Object.keys(allTopics[code] || {}).map(Number).sort((a, b) => a - b);
  console.log('  ' + code + ': ' + loadedFiles[code].length + ' file(s)' +
              (found.length ? '; Topic ' + found.join(', ') : ''));
});
console.log();

/* ---- the syllabus itself ---- */

console.log('The syllabus');
check('no topic file is left in the old flat layout',
  strays.length === 0, strays.join(', '));
check('four periods are defined', RCIA.periods.length === 4, RCIA.periods.length + ' found');
check('forty-two sessions are defined', RCIA.sessions.length === 42, RCIA.sessions.length + ' found');

const sessionNumbers = RCIA.sessions.map(s => s.session);
check('session numbers run 1–42 with no gaps',
  sessionNumbers.every((n, i) => n === i + 1));

const topicNumbersInSchema = RCIA.sessions.filter(s => s.topic != null).map(s => s.topic);
check('thirty-seven topics carry a session note',
  topicNumbersInSchema.length === 37, topicNumbersInSchema.length + ' found');
check('topic numbers are unique in the schema',
  new Set(topicNumbersInSchema).size === topicNumbersInSchema.length);
check('every session names a period that exists',
  RCIA.sessions.every(s => RCIA.periods.some(p => p.id === s.period)));
check('English carries at least one topic',
  Object.keys(allTopics.en || {}).length > 0);
console.log();

/* ---- the languages ---- */

console.log('Languages');
const enStrings = Lang.strings[Lang.DEFAULT];
const enKeys = Object.keys(enStrings).sort();

LANGS.forEach(code => {
  const meta = Lang.meta(code);
  check(code + ' is named in its own script and in English',
    !!meta.endonym && !!meta.english && !!meta.html && !!meta.locale);

  const keys = Object.keys(Lang.strings[code] || {}).sort();
  const missing = enKeys.filter(k => keys.indexOf(k) < 0);
  const extra = keys.filter(k => enKeys.indexOf(k) < 0);
  check(code + ' answers for every string the app asks for',
    missing.length === 0, 'missing: ' + missing.join(', '));
  check(code + ' has no string the app never asks for',
    extra.length === 0, 'extra: ' + extra.join(', '));

  check(code + ' names all four periods',
    ['A', 'B', 'C', 'D'].every(p => {
      const words = Lang.period(p, code);
      return words && words.name && words.stage;
    }));

  /* A placeholder the app never fills would print as literal "{n}". */
  const unfilled = keys.filter(k => {
    const value = Lang.strings[code][k];
    if (typeof value !== 'string') { return false; }
    const here = (value.match(/\{(\w+)\}/g) || []).sort().join(',');
    const there = (String(enStrings[k]).match(/\{(\w+)\}/g) || []).sort().join(',');
    return here !== there;
  });
  check(code + ' uses the same placeholders English does',
    unfilled.length === 0, unfilled.join(', '));

  check(code + ' writes a date without throwing',
    typeof Lang.formatDate(new Date(2026, 7, 21), code) === 'string');
});
console.log();

/* ---- Scripture references resolve, in every language ---- */

console.log('Scripture links');

/* What the parser makes of a reference, whatever Bible it ends up
   pointing at. tools/check-bible-links.js is the one that asks the
   four sites whether those addresses are real. */
[
  ['John 6:52–63', 'john', 6],
  ['Lk 15:11-32', 'luke', 15],
  ['Ep 1:9, 2:18', 'ephesians', 1],
  ['1 Corinthians 13:1', '1corinthians', 13],
  ['Song of Songs 2:10', 'songofsongs', 2],
  ['Psalm 23:1', 'psalms', 23],
  ['Matthew The Parable of the Prodigal Son - Lk 15:11-32.', 'luke', 15],
  ['CCC 27-28', null, null],
  ['Summa Theologica', null, null],
  /* A translated note names its books in its own language, so the
     parser must NOT guess at them; the content file carries the
     chapter in a `passage` field instead. */
  ['Yohanes 1:35-51', null, null],
  ['யோவான் 1:35-51', null, null],
  ['若望福音 1:35-51', null, null]
].forEach(([input, slug, chapter]) => {
  const got = Scripture.parse(input);
  check('"' + input.slice(0, 34) + '" -> ' + (slug ? slug + ' ' + chapter : 'not a reference'),
    slug ? (got && got.slug === slug && got.chapter === chapter) : got === null,
    JSON.stringify(got));
});

/* Each language must land in its own Bible, and never in a Bible that
   does not carry the book. */
const EXPECTED_HOST = {
  en: 'scrutatio.it',
  ms: 'alkitabversiborneo.org',
  zh: 'ccccn.org',
  ta: 'arulvakku.com'
};
LANGS.forEach(code => {
  const link = Scripture.url('John 1:35-51', code);
  check(code + ' opens John in ' + EXPECTED_HOST[code],
    !!link && link.indexOf(EXPECTED_HOST[code]) > -1, String(link));
  check(code + ' names the Bible it is linking to',
    typeof Scripture.bibleName(code) === 'string' && Scripture.bibleName(code).length > 0);
  check(code + ' labels the chapter in its own script',
    typeof Scripture.chapterLabel('John 1:35-51', code) === 'string',
    String(Scripture.chapterLabel('John 1:35-51', code)));
});
check('the Malay Bible carries no deuterocanonical book, so none is linked',
  Scripture.url('Sirach 3:2', 'ms') === null, String(Scripture.url('Sirach 3:2', 'ms')));
check('every other language does link Sirach',
  ['en', 'zh', 'ta'].every(c => !!Scripture.url('Sirach 3:2', c)));
check('the Psalter picks the right volume in Chinese',
  Scripture.url('Psalm 95:1', 'zh').indexOf('jiuyue/026') > -1,
  Scripture.url('Psalm 95:1', 'zh'));
console.log();

/* ============================================================
   Each topic, in each language
   ============================================================ */

/* The shape a candidate's answers are stored against: the journal ids
   in order, and how many questions each holds. Every language must
   present the same shape or a change of language would strand
   whatever has already been written. */
/* A table is only readable if every row has as many cells as the
   heading promises; a short row silently shifts the columns. */
function checkTable(block, where, problems) {
  if (!Array.isArray(block.rows) || !block.rows.length) {
    problems.push(where + ': a table with no rows');
    return;
  }
  const width = (block.head && block.head.length) || block.rows[0].length;
  block.rows.forEach(function (row, r) {
    if (!Array.isArray(row) || row.length !== width) {
      problems.push(where + ': table row ' + (r + 1) + ' has ' +
                    (Array.isArray(row) ? row.length : '?') + ' cells, not ' + width);
    }
    (row || []).forEach(function (cell) {
      if (typeof cell !== 'string') {
        problems.push(where + ': table row ' + (r + 1) + ' has a cell that is not text');
      }
    });
  });
}

/* Every link the note sends a candidate to must actually go somewhere. */
function checkMedia(block, where, problems) {
  const items = block.items || [block];
  if (!items.length) { problems.push(where + ': a media block with no links'); }
  items.forEach(function (item) {
    if (!item.href || !/^https?:\/\//.test(item.href)) {
      problems.push(where + ': media link "' + item.label + '" has no http address');
    }
  });
}

function answerShape(topic) {
  const shape = [];
  topic.parts.forEach(part => {
    (part.blocks || []).forEach(block => {
      if (block.type === 'journal') {
        shape.push(block.id + ':' + block.questions.length);
      }
    });
  });
  return shape;
}

const outDir = path.join(__dirname, 'sample');
fs.mkdirSync(outDir, { recursive: true });

LANGS.forEach(function (code) {
  const topics = allTopics[code] || {};
  const numbers = Object.keys(topics).map(Number).sort((a, b) => a - b);
  if (!numbers.length) {
    console.log('; ' + Lang.meta(code).english + ': no topics transcribed yet; ');
    console.log();
    return;
  }

  numbers.forEach(function (n) {
    const topic = topics[n];
    console.log('[' + code + '] Topic ' + n + '; ' + topic.title);

    check('has a title, period and session number',
      !!topic.title && !!topic.period && Number.isInteger(topic.session));
    check('declares the language it is written in (' + code + ')',
      code === Lang.DEFAULT ? true : topic.lang === code,
      'file says ' + topic.lang);

    const schemaRow = RCIA.sessions.find(s => s.topic === topic.topic);
    check('appears in the syllabus schema', !!schemaRow);
    if (schemaRow) {
      check('session number matches the schema (' + schemaRow.session + ')',
        topic.session === schemaRow.session, 'content says ' + topic.session);
      check('period matches the schema (' + schemaRow.period + ')',
        topic.period === schemaRow.period, 'content says ' + topic.period);
    }

    check('has parts', Array.isArray(topic.parts) && topic.parts.length > 0);

    /* every block is a type the renderer knows */
    const unknown = [];
    const emptyText = [];
    const journalIds = [];

    topic.parts.forEach(function (part) {
      if (!part.letter || !part.name) { emptyText.push('a part is missing letter or name'); }
      (part.blocks || []).forEach(function (block, i) {
        if (!KNOWN_BLOCKS.has(block.type)) { unknown.push(block.type); }

        if (['label', 'subhead', 'aside', 'lead', 'para'].includes(block.type)) {
          if (!block.text || !block.text.trim()) {
            emptyText.push(part.letter + ' block ' + i + ' (' + block.type + ') has no text');
          }
        }
        if (block.type === 'points') {
          block.items.forEach(function (item, j) {
            /* A point must say something. Usually that is a sentence,
               but some printed points answer their own question with
               a bare list or a table and no prose, and inventing a
               sentence to fill the gap would not be transcription. */
            const hasSomething = (item.body && item.body.trim()) ||
                                 (item.afterBody && item.afterBody.trim()) ||
                                 (item.list && item.list.length) || item.table;
            if (!hasSomething) {
              emptyText.push(part.letter + ' point ' + (j + 1) + ' has nothing in it');
            }
            if (/undefined/.test(item.body || '') || (item.title && /undefined/.test(item.title))) {
              emptyText.push(part.letter + ' point ' + (j + 1) + ' contains the word "undefined"');
            }
          });
        }
        if (block.type === 'journal') {
          journalIds.push(block.id);
          block.questions.forEach(function (q, j) {
            if (!q.text || !q.text.trim()) {
              emptyText.push('journal ' + block.id + ' question ' + j + ' has no text');
            }
            if (!q.n) {
              emptyText.push('journal ' + block.id + ' question ' + j + ' has no number/marker');
            }
          });
        }
        if (block.type === 'saint') {
          if (!block.name) { emptyText.push('a saint block has no name'); }
          if (!Array.isArray(block.facts) || !block.facts.length) {
            emptyText.push('saint ' + block.name + ' has no facts');
          }
        }
        /* A ragged table renders with empty cells and reads as if the
           note lost a column, so the widths are checked here. */
        if (block.type === 'table') { checkTable(block, part.letter + ' block ' + i, emptyText); }
        if (block.type === 'media') { checkMedia(block, part.letter + ' block ' + i, emptyText); }
        if (block.type === 'points') {
          block.items.forEach(function (item, j) {
            const where = part.letter + ' point ' + (j + 1);
            if (item.table) { checkTable(item.table, where, emptyText); }
            if (item.media) { checkMedia(item.media, where, emptyText); }
            if (item.list2 && !item.list) {
              emptyText.push(where + ' has a second list but no first one');
            }
          });
        }
      });
    });

    /* Every Scripture reference the candidate sees must produce a
       working link. A translated note names its books in its own
       language, which the parser cannot read, so those carry an
       explicit `passage`. A reference with neither would silently
       render as plain text; worth failing the build over. */
    const unresolved = [];
    const falseLinks = [];
    topic.parts.forEach(function (part) {
      /* Only the Scripture part's heading is a reference. Elsewhere
         `ref` carries the topic title or an activity name; the part
         is recognised by its letter, which is B in every language. */
      const isScripturePart = part.letter === 'B';
      if (part.ref && isScripturePart && !Scripture.url(part.passage || part.ref)) {
        unresolved.push('part ' + part.letter + ' ref: "' + part.ref +
                        '" (add a `passage` field)');
      }
      if (part.ref && !isScripturePart && !part.passage && Scripture.url(part.ref)) {
        falseLinks.push('part ' + part.letter + ' ref "' + part.ref +
                        '" would link to ' + Scripture.url(part.ref));
      }
      (part.blocks || []).forEach(function (block) {
        if (block.type === 'pericope' && !Scripture.url(block.passage || block.cite)) {
          unresolved.push('pericope: "' + block.cite + '" (add a `passage` field)');
        }
        if (block.type === 'versicle' && block.ref && !Scripture.url(block.passage || block.ref)) {
          unresolved.push('versicle ref: "' + block.ref + '" (add a `passage` field)');
        }
        if (block.type === 'points') {
          block.items.forEach(function (item) {
            const m = item.marginal;
            if (!m) { return; }
            const wantsLink = m.passage || m.mark === 'Scripture';
            if (wantsLink && !Scripture.url(m.passage || m.text)) {
              unresolved.push('marginal: "' + m.text + '" (add a `passage` field)');
            }
          });
        }
      });
    });
    check('every Scripture reference resolves to a chapter',
      unresolved.length === 0, unresolved.join(' | '));
    check('no ordinary heading is mistaken for a Scripture reference',
      falseLinks.length === 0, falseLinks.join(' | '));

    check('every block type is one the app can draw',
      unknown.length === 0, 'unknown: ' + [...new Set(unknown)].join(', '));
    check('no empty or "undefined" text',
      emptyText.length === 0, emptyText.slice(0, 3).join(' | '));
    check('journal ids are unique within the topic',
      new Set(journalIds).size === journalIds.length,
      'ids: ' + journalIds.join(', '));

    /* answer keys must be unique across the whole topic, two questions
       sharing a key would overwrite each other's answer */
    const keys = EmmausExport.questionKeys(topic).map(k => k.key);
    check('every question has its own storage key (' + keys.length + ' questions)',
      new Set(keys).size === keys.length);
    check('the topic asks at least one question', keys.length > 0);

    /* the translation must not strand what has already been written */
    const english = (allTopics[Lang.DEFAULT] || {})[n];
    if (code !== Lang.DEFAULT) {
      check('the English note for Topic ' + n + ' exists to fall back to', !!english);
      if (english) {
        const here = answerShape(topic).join(' ');
        const there = answerShape(english).join(' ');
        check('asks the same questions, under the same journal ids, as English',
          here === there, here + '  vs English  ' + there);
      }
    }

    /* the export must build and produce a real .docx */
    const answers = {};
    keys.forEach((k, i) => { if (i % 2 === 0) { answers[k] = 'A written reflection for ' + k + '.'; } });

    const period = RCIA.periods.find(p => p.id === topic.period);
    const built = EmmausExport.buildSpec(topic, answers, {
      name: 'Teresa Lim',
      period: period,
      sessionDate: new Date(2026, 8, 5),
      today: new Date(2026, 7, 20),
      lang: code,
      noteLang: code
    });
    const bytes = EmmausDocx.build(built.spec, new Date(2026, 7, 20, 9, 30, 0));

    check('the Word document builds', bytes.length > 2000, bytes.length + ' bytes');
    check('it is a ZIP archive (PK header)',
      bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04);
    check('it counts the written reflections correctly',
      built.wrote === Object.keys(answers).length,
      built.wrote + ' vs ' + Object.keys(answers).length);
    check('its wording is in ' + code,
      built.spec.footer === Lang.t('docFooter', null, code) &&
      built.spec.meta[0] === Lang.t('docName', { name: 'Teresa Lim' }, code),
      built.spec.meta[0]);

    const outFile = path.join(outDir, code + ' · ' + EmmausExport.fileNameFor(topic, 'Sample', code));
    fs.writeFileSync(outFile, Buffer.from(bytes));
    console.log('        sample written: tools/sample/' + path.basename(outFile));
    console.log();
  });
});

/* ============================================================
   The Saints gallery

   The gallery writes nothing down: it reads every saint out of the
   note that names one. So what has to hold is that the notes can be
   read, that a feast day the app claims to understand really parses,
   and that one it does not understand is left undated rather than
   filed under the wrong month.
   ============================================================ */

console.log('The Saints gallery');
/* The same fallback the app uses, over the content this script loaded. */
function topicInSandbox(n, code) {
  const wanted = (allTopics[code] || {})[n];
  if (wanted) { return { topic: wanted, lang: code, translated: true }; }
  const english = (allTopics[Lang.DEFAULT] || {})[n];
  if (english) { return { topic: english, lang: Lang.DEFAULT, translated: false }; }
  return null;
}
const sandboxContent = { topics: allTopics, topicIn: topicInSandbox };

const saintsList = Saints.gather(Lang.DEFAULT, sandboxContent);
const topicsWithSaint = Object.keys(allTopics[Lang.DEFAULT] || {}).map(Number)
  .filter(n => Saints.saintOf(allTopics[Lang.DEFAULT][n]));

check('every note that names a saint is in the gallery',
  saintsList.length === topicsWithSaint.length,
  saintsList.length + ' vs ' + topicsWithSaint.length);
check('the gallery names no saint twice for one topic',
  new Set(saintsList.map(s => s.topic)).size === saintsList.length);

/* Undated saints must come last, or a reader scanning the calendar
   would meet a gap in the middle of it. */
const firstUndated = saintsList.findIndex(s => !s.date);
check('any saint without a feast day is placed at the end',
  firstUndated === -1 || saintsList.slice(firstUndated).every(s => !s.date),
  'first undated at ' + firstUndated);

/* And the dated ones must actually be in calendar order. */
let ordered = true;
for (let i = 1; i < saintsList.length; i++) {
  const a = saintsList[i - 1].date, b = saintsList[i].date;
  if (!a || !b) { continue; }
  if (a.month > b.month || (a.month === b.month && a.day > b.day)) { ordered = false; }
}
check('the dated saints run in calendar order', ordered);

const undated = saintsList.filter(s => !s.date).map(s => s.topic);
console.log('        ' + saintsList.length + ' saints; ' +
  (undated.length ? 'no feast day given in Topic ' + undated.join(', ')
                  : 'every one carries a feast day'));

/* A date the parser misreads is worse than one it cannot read at all,
   so each parsed day is checked against the words it came from. */
const misdated = [];
saintsList.forEach(function (entry) {
  if (!entry.date) { return; }
  const printed = Saints.fact(Saints.saintOf(allTopics[Lang.DEFAULT][entry.topic]), 'feast');
  const monthName = Saints.monthName(entry.date.month, Lang.DEFAULT);
  if (printed.toLowerCase().indexOf(monthName.toLowerCase()) < 0 ||
      printed.indexOf(String(entry.date.day)) < 0) {
    misdated.push('Topic ' + entry.topic + ': "' + printed + '" read as ' +
                  monthName + ' ' + entry.date.day);
  }
});
check('every feast day is read as the note prints it',
  misdated.length === 0, misdated.join(' | '));

/* Each language must be able to find the patronage line in its own
   notes, or the gallery would show a saint with no patronage at all. */
LANGS.forEach(function (code) {
  const prefix = Lang.t('patronLabel', null, code);
  const topics = allTopics[code] || {};
  const missed = Object.keys(topics).map(Number).filter(function (n) {
    const saint = Saints.saintOf(topics[n]);
    if (!saint || !(saint.facts || []).length) { return false; }
    /* Only complain when the note HAS a patronage fact the prefix
       fails to find, some notes give none. */
    const hasPatron = (saint.facts || []).some(f =>
      /patron|penaung|主保|பாதுகாவலர்/i.test(f.label));
    return hasPatron && !Saints.fact(saint, prefix);
  });
  check(code + ' finds the patronage line in its own notes ("' + prefix + '")',
    missed.length === 0, 'missed in Topic ' + missed.join(', '));
});
console.log();

/* ============================================================
   The Prayers page

   Like the gallery, it reads rather than stores. What must hold is
   that it shows every prayer the notes print, none twice, each one
   pointing back at the part it came from.
   ============================================================ */

console.log('Prayers of the Journey');
const prayerList = Prayers.gather(Lang.DEFAULT,
  Object.assign({ sessions: RCIA.sessions }, sandboxContent));

let printedPrayers = 0;
Object.keys(allTopics[Lang.DEFAULT] || {}).forEach(function (n) {
  printedPrayers += Prayers.prayersOf(allTopics[Lang.DEFAULT][n]).length;
});
check('every prayer the notes print is on the page',
  prayerList.length === printedPrayers,
  prayerList.length + ' vs ' + printedPrayers);

check('no prayer is shown twice',
  new Set(prayerList.map(p => p.topic + ':' + p.part + ':' + p.prayer.lines[0]))
    .size === prayerList.length);

check('every prayer has lines to pray',
  prayerList.every(p => Array.isArray(p.prayer.lines) && p.prayer.lines.length &&
                        p.prayer.lines.every(l => l && l.trim())));

/* Each card links back to the very part the prayer stands in. */
const badLinks = prayerList.filter(function (p) {
  const topic = (allTopics[Lang.DEFAULT] || {})[p.topic];
  return !topic || !topic.parts.some(part => part.letter === p.part);
});
check('every prayer names a part that is really in its note',
  badLinks.length === 0,
  badLinks.map(p => 'Topic ' + p.topic + ' part ' + p.part).join(', '));

/* They are gathered in the order the road is walked, not by topic
   number, the two differ in the Mystagogy. */
const walked = RCIA.sessions.filter(s => s.topic != null).map(s => s.topic);
let inOrder = true;
for (let i = 1; i < prayerList.length; i++) {
  if (walked.indexOf(prayerList[i - 1].topic) > walked.indexOf(prayerList[i].topic)) {
    inOrder = false;
  }
}
check('they stand in the order the road is walked', inOrder);
console.log('        ' + prayerList.length + ' prayers, from Topic ' +
  [...new Set(prayerList.map(p => p.topic))].join(', '));
console.log();

/* ============================================================
   The pages load the same content files

   Three HTML pages each list every content script by hand. A file
   added to one and forgotten in another would be invisible on that
   page alone, the kind of fault nobody notices until a candidate
   opens the wrong page.
   ============================================================ */

console.log('Every page loads every content file');
const contentFiles = ['content/syllabus.js'].concat(
  LANGS.flatMap(code => (loadedFiles[code] || [])
    .map(name => 'content/topics/' + code + '/' + name)));

['index.html', 'session.html', 'saints.html', 'prayers.html'].forEach(function (page) {
  const html = fs.readFileSync(path.join(APP, page), 'utf8');
  const listed = (html.match(/<script src="(content\/[^"]+)"><\/script>/g) || [])
    .map(tag => /src="([^"]+)"/.exec(tag)[1]);
  const missing = contentFiles.filter(f => listed.indexOf(f) < 0);
  const ghosts = listed.filter(f => contentFiles.indexOf(f) < 0);
  check(page + ' lists every content file (' + contentFiles.length + ')',
    missing.length === 0, 'missing: ' + missing.join(', '));
  check(page + ' lists no file that is not there',
    ghosts.length === 0, 'stale: ' + ghosts.join(', '));
});
console.log();

/* ---- the fallback path: a Tamil reader opening an English-only note ---- */

console.log('Falling back to English');
const fallbackTopic = (allTopics.en || {})[16];
if (fallbackTopic) {
  const built = EmmausExport.buildSpec(fallbackTopic, {}, {
    name: '',
    period: RCIA.periods.find(p => p.id === fallbackTopic.period),
    today: new Date(2026, 7, 20),
    lang: 'ta',
    noteLang: 'en'
  });
  check('the document is framed in the chosen language',
    built.spec.header[0] === Lang.t('brand', null, 'ta'));
  check('it says the note inside is still in English',
    built.spec.meta.indexOf(Lang.t('docLanguageNote', null, 'ta')) > -1,
    built.spec.meta.join(' | '));
  const bytes = EmmausDocx.build(built.spec, new Date(2026, 7, 20, 9, 30, 0));
  check('it still builds a real .docx', bytes.length > 2000 &&
    bytes[0] === 0x50 && bytes[1] === 0x4B);
  const xml = Buffer.from(bytes).toString('latin1');
  check('Word is told a face for both scripts',
    xml.indexOf('w:cs="Nirmala UI"') > -1, 'no complex-script font named');
}
console.log();

console.log('----------------------------------------------------');
console.log(checks + ' checks, ' + failures + ' failed.');
console.log(failures ? 'CONTENT NEEDS ATTENTION' : 'ALL CONTENT CHECKS PASSED');
process.exit(failures ? 1 : 0);
