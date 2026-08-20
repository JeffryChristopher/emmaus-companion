/* ============================================================
   THE EMMAUS COMPANION — Content check
   Run:  node tools/check-content.js

   Reads every topic file the app ships and checks it is sound
   before anyone puts it in front of a candidate:

     · the file loads and registers a topic
     · required fields are present and the period exists
     · every block type is one the app knows how to draw
     · journal ids are unique, so no two answers share a key
     · no empty or accidentally-undefined text
     · the session number matches the syllabus schema

   Then it writes a sample Word document to tools/sample/ so the
   export can be opened and looked at without using a browser.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP = path.join(__dirname, '..');
const EmmausDocx = require(path.join(APP, 'assets/js/docx.js'));
const EmmausExport = require(path.join(APP, 'assets/js/export.js'));

/* Block types the session renderer can draw (see session.js buildBlock). */
const KNOWN_BLOCKS = new Set([
  'label', 'subhead', 'aside', 'lead', 'para', 'list', 'points',
  'pericope', 'versicle', 'prayer', 'saint', 'plate', 'journal'
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

const topicFiles = fs.readdirSync(path.join(APP, 'content/topics'))
  .filter(name => name.endsWith('.js'))
  .sort();
topicFiles.forEach(name => loadScript('content/topics/' + name));

const RCIA = sandbox.window.RCIA;
const topics = RCIA.topics || {};
const topicNumbers = Object.keys(topics).map(Number).sort((a, b) => a - b);

console.log('Loaded ' + topicFiles.length + ' topic file(s): Topic ' + topicNumbers.join(', '));
console.log();

/* ---- the syllabus itself ---- */

console.log('The syllabus');
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
console.log();

/* ---- each topic ---- */

topicNumbers.forEach(function (n) {
  const topic = topics[n];
  console.log('Topic ' + n + ' — ' + topic.title);

  check('has a title, period and session number',
    !!topic.title && !!topic.period && Number.isInteger(topic.session));

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
          if (!item.body || !item.body.trim()) {
            emptyText.push(part.letter + ' point ' + (j + 1) + ' has no body');
          }
          if (/undefined/.test(item.body) || (item.title && /undefined/.test(item.title))) {
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
    });
  });

  check('every block type is one the app can draw',
    unknown.length === 0, 'unknown: ' + [...new Set(unknown)].join(', '));
  check('no empty or "undefined" text',
    emptyText.length === 0, emptyText.slice(0, 3).join(' | '));
  check('journal ids are unique within the topic',
    new Set(journalIds).size === journalIds.length,
    'ids: ' + journalIds.join(', '));

  /* answer keys must be unique across the whole topic — two questions
     sharing a key would overwrite each other's answer */
  const keys = EmmausExport.questionKeys(topic).map(k => k.key);
  check('every question has its own storage key (' + keys.length + ' questions)',
    new Set(keys).size === keys.length);
  check('the topic asks at least one question', keys.length > 0);

  /* the export must build and produce a real .docx */
  const answers = {};
  keys.forEach((k, i) => { if (i % 2 === 0) { answers[k] = 'A written reflection for ' + k + '.'; } });

  const period = RCIA.periods.find(p => p.id === topic.period);
  const built = EmmausExport.buildSpec(topic, answers, {
    name: 'Teresa Lim',
    period: period,
    sessionDate: new Date(2026, 8, 5),
    today: new Date(2026, 7, 20)
  });
  const bytes = EmmausDocx.build(built.spec, new Date(2026, 7, 20, 9, 30, 0));

  check('the Word document builds', bytes.length > 2000, bytes.length + ' bytes');
  check('it is a ZIP archive (PK header)',
    bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04);
  check('it counts the written reflections correctly',
    built.wrote === Object.keys(answers).length,
    built.wrote + ' vs ' + Object.keys(answers).length);

  const outDir = path.join(__dirname, 'sample');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, EmmausExport.fileNameFor(topic, 'Sample'));
  fs.writeFileSync(outFile, Buffer.from(bytes));
  console.log('        sample written: tools/sample/' + path.basename(outFile));
  console.log();
});

console.log('----------------------------------------------------');
console.log(checks + ' checks, ' + failures + ' failed.');
console.log(failures ? 'CONTENT NEEDS ATTENTION' : 'ALL CONTENT CHECKS PASSED');
process.exit(failures ? 1 : 0);
