/* ============================================================
   THE EMMAUS COMPANION: Bible link check
   Run:  node tools/check-bible-links.js  [en|ms|zh|ta] …

   Fetches the page every entry in the EDITIONS table of
   assets/js/scripture.js points at, and checks it really holds the
   book it claims. A wrong id would send a candidate to the wrong
   scripture, which is worse than no link at all, so nothing in that
   table is allowed to be a guess.

   This is the ONE tool here that needs the internet. Keep it out of
   the ordinary build: run it when the table changes, or every few
   months in case a site is reorganised. `node tools/check-content.js`
   stays offline and is the one to run routinely.

   Three of the four editions are plain server-rendered pages and are
   checked live. Alkitab Versi Borneo renders its text in the browser,
   so a fetch returns an empty shell: its 66 names were read off the
   site one by one in a browser and are checked here for internal
   consistency instead (see README.md).
   ============================================================ */

const path = require('path');
const Scripture = require(path.join(__dirname, '..', 'assets/js/scripture.js'));

const WANT = process.argv.slice(2).filter(a => /^(en|ms|zh|ta)$/.test(a));
const LANGS = WANT.length ? WANT : ['en', 'zh', 'ta', 'ms'];

let checks = 0;
let failures = 0;
const problems = [];

function report(ok, label, detail) {
  checks++;
  if (!ok) {
    failures++;
    problems.push(label + (detail ? '  -> ' + detail : ''));
    console.log('  FAIL  ' + label + (detail ? '  -> ' + detail : ''));
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* These are other people's servers, and one of them answers 429 if
   asked briskly. Back off and try again, so a rate limit is never
   reported as a broken link. */
async function grab(url, encoding) {
  for (let attempt = 0; attempt < 4; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        headers: { 'User-Agent': 'EmmausCompanion/1.0 (link check)' },
        redirect: 'follow'
      });
    } catch (e) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (res.status === 429 || res.status === 503) {
      await sleep(4000 * (attempt + 1));
      continue;
    }
    if (!res.ok) { return { status: res.status, text: '' }; }
    const buf = Buffer.from(await res.arrayBuffer());
    let text;
    try {
      text = new TextDecoder(encoding || 'utf-8').decode(buf);
    } catch (e) {
      text = buf.toString('latin1');
    }
    return { status: res.status, text: text };
  }
  return { status: 429, text: '' };
}

/* A few at a time, with a pause between: gentle enough not to hammer
   somebody else's parish website. */
async function inBatches(items, size, fn, pause) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn));
    process.stdout.write('.');
    if (i + size < items.length) { await sleep(pause == null ? 700 : pause); }
  }
  process.stdout.write('\n');
}

const EDITIONS = Scripture.editions;
const SLUGS = Object.keys(EDITIONS);

/* strip the accents and case so "Qohelet" matches "Ecclesiastes/Qohelet" */
function loose(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function checkEnglish() {
  console.log('\nNew Jerusalem Bible; scrutatio.it');
  await inBatches(SLUGS, 2, async (slug) => {
    const url = Scripture.url(pretty(slug) + ' 1:1', 'en');
    if (!url) { report(false, 'en ' + slug, 'no url built'); return; }
    const { status, text } = await grab(url);
    if (status !== 200) { report(false, 'en ' + slug, 'HTTP ' + status); return; }
    /* the page names its own book in the heading, under that
       edition's own name for it, where it differs from the app's */
    const site = (EDITIONS[slug].siteName || {}).en || englishName(slug);
    const body = loose(text.slice(0, 40000));
    report(body.indexOf(loose(site)) > -1, 'en ' + slug,
      'page does not name "' + site + '"; ' + url);
  });
}

async function checkTamil() {
  console.log('\nஅருள்வாக்கு; arulvakku.com');
  await inBatches(SLUGS, 3, async (slug) => {
    const url = Scripture.url(pretty(slug) + ' 1:1', 'ta');
    if (!url) { report(false, 'ta ' + slug, 'no url built'); return; }
    const { status, text } = await grab(url);
    if (status !== 200) { report(false, 'ta ' + slug, 'HTTP ' + status); return; }
    const want = EDITIONS[slug].name.ta;
    report(text.indexOf(want) > -1, 'ta ' + slug,
      'page does not name "' + want + '"; ' + url);
  });
}

async function checkChinese() {
  console.log('\n思高本圣经; ccccn.org');
  await inBatches(SLUGS, 3, async (slug) => {
    const url = Scripture.url(pretty(slug) + ' 1:1', 'zh');
    if (!url) { report(false, 'zh ' + slug, 'no url built'); return; }
    const { status, text } = await grab(url.split('#')[0], 'gbk');
    if (status !== 200) { report(false, 'zh ' + slug, 'HTTP ' + status); return; }
    const want = EDITIONS[slug].name.zh;
    report(text.indexOf(want) > -1, 'zh ' + slug,
      'page does not name "' + want + '"; ' + url);

    /* Whatever anchor the table promises for this book must be on the
       page. A book declared anchorless is expected to have none. */
    const style = EDITIONS[slug].zhAnchor || 'verse';
    const fragment = url.indexOf('#') > -1 ? decodeURIComponent(url.split('#')[1]) : null;
    if (style === 'none') {
      report(fragment === null, 'zh ' + slug + ' anchor',
        'declared anchorless but the url carries #' + fragment);
    } else {
      const quoted = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const has = new RegExp('<a\\s+name=["\']?' + quoted + '["\'\\s>]').test(text);
      report(has, 'zh ' + slug + ' anchor',
        'no <a name="' + fragment + '"> on ' + url + ' (style ' + style + ')');
    }
  });
}

/* AVB is client-rendered; these are the checks that can be made
   without a browser. The names themselves were read off the site. */
function checkMalay() {
  console.log('\nAlkitab Versi Borneo; alkitabversiborneo.org (table check)');
  const withId = SLUGS.filter(s => EDITIONS[s].ms);
  const without = SLUGS.filter(s => !EDITIONS[s].ms);

  report(withId.length === 66, 'ms carries exactly 66 books',
    withId.length + ' found');
  report(without.length === 7, 'ms leaves the 7 deuterocanonical books unlinked',
    without.join(', '));

  const ids = withId.map(s => EDITIONS[s].ms).sort((a, b) => a - b);
  report(ids[0] === 141 && ids[ids.length - 1] === 206,
    'ms ids run 141–206', ids[0] + '–' + ids[ids.length - 1]);
  report(new Set(ids).size === ids.length, 'ms ids are unique');
  report(ids.every((n, i) => i === 0 || n === ids[i - 1] + 1),
    'ms ids are contiguous');
  report(withId.every(s => EDITIONS[s].name.ms), 'every ms book is named');
  report(without.every(s => EDITIONS[s].name.ms === null),
    'a book AVB does not carry is named null, not guessed');
  /* and nothing may link to a Bible that does not hold it */
  report(Scripture.url('Sirach 3:2', 'ms') === null,
    'a deuterocanonical reference makes no Malay link');
}

function englishName(slug) {
  const label = Scripture.chapterLabel(pretty(slug) + ' 1:1', 'en');
  return label ? label.replace(/ 1$/, '') : slug;
}

/* a reference the parser will certainly resolve back to this book */
function pretty(slug) {
  const book = Scripture.books.find(b => b.slug === slug);
  return book.names[0].replace(/^(\d)/, '$1 ');
}

(async function () {
  console.log('Checking every book of every edition against the live sites.');
  console.log('(' + SLUGS.length + ' books per edition; this takes a few minutes)');

  /* the table has to agree with itself before the network is worth asking */
  report(SLUGS.length === 73, 'the table holds the 73 books of the canon',
    SLUGS.length + ' found');
  SLUGS.forEach(slug => {
    report(!!Scripture.books.find(b => b.slug === slug),
      'edition "' + slug + '" matches a book the parser knows');
  });
  Scripture.books.forEach(b => {
    report(!!EDITIONS[b.slug], 'book "' + b.slug + '" has an edition entry');
  });

  try {
    if (LANGS.indexOf('ms') > -1) { checkMalay(); }
    if (LANGS.indexOf('en') > -1) { await checkEnglish(); }
    if (LANGS.indexOf('ta') > -1) { await checkTamil(); }
    if (LANGS.indexOf('zh') > -1) { await checkChinese(); }
  } catch (e) {
    console.log('\nThe check could not finish: ' + e.message);
    console.log('If this is a network problem, it says nothing about the table.');
    process.exit(2);
  }

  console.log('\n----------------------------------------------------');
  console.log(checks + ' checks, ' + failures + ' failed.');
  if (failures) {
    console.log('\nEvery failure below is a link that would send a candidate');
    console.log('to the wrong page, or to none:');
    problems.forEach(p => console.log('  · ' + p));
    console.log('\nBIBLE LINKS NEED ATTENTION');
  } else {
    console.log('EVERY BIBLE LINK RESOLVES TO THE RIGHT BOOK');
  }
  process.exit(failures ? 1 : 0);
})();
