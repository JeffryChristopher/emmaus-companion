# The Emmaus Companion — pilot copy

The RCIA session notes of the Diocese of Penang, as a digital companion for
candidates, with a private reflection journal that becomes a Word document.
In **English, Bahasa Malaysia, Mandarin and Tamil**.

**Phase I.** Three topics are built end to end, one for each shape of note:

| Topic | Session | Period | Why it is in the pilot |
|---|---|---|---|
| 1 — Our Search for Meaning in Life and Our Capacity for God | 2 | A | the standard five-part note (A–E) |
| 16 — The Mass Explained | 17 | B | question-and-answer teaching points, sub-lists, an activity |
| 29 — Prodigal Son Retreat | 32 | C | the retreat shape (A–D, no Saint, journal-first) |

The other 34 topics appear on the journey map, marked *Phase II*, so the whole
road is visible from the first day.

---

## Languages

The candidate chooses a language on the journey map, above the road. The choice
is remembered on their device and carries into every session, the Word document
they save, and the typeface the page is set in.

Which notes are transcribed so far:

| Topic | English | Bahasa Malaysia | 华语 | தமிழ் |
|---|:-:|:-:|:-:|:-:|
| 1 — Meaning in Life | ✓ | ✓ | ✓ | ✓ |
| 16 — The Mass Explained | ✓ | ✓ | — | ✓ |
| 29 — Prodigal Son Retreat | ✓ | — | — | ✓ |

A topic with no note in the chosen language **falls back to English**, under a
notice in the chosen language saying so. The journey map marks those stops the
same way. Nobody is ever shown an empty page.

**Changing language never costs a candidate their writing.** Answers are stored
against the topic and the journal id — never against the language — so a
reflection typed while reading in English is still there, beside the same
question, when the page is read in Tamil. `check-content.js` enforces this: a
translated note must ask the same questions, under the same journal ids, as the
English one, or the build fails.

### What may be translated, and what may not

Two kinds of words live in this app, and they are governed by different rules.

1. **The session notes** are the Commission's, approved under the Imprimatur in
   each language. They are transcribed from the approved PDF for that language
   and **never translated by this app** — not from the English note, not by
   anyone editing the code. They live in `content/topics/<code>/topic-NN.js`.

2. **The app's own words** — buttons, notices, the privacy seal, the headings
   of the Word document — are the app's, and live in `assets/js/i18n.js`.

One thing sits between the two and should be looked at by the Commission: the
**names of the four periods** ("Why be a Catholic?" and the rest) and the short
legend labels. The syllabus schema exists in English only, so those navigation
labels in `i18n.js` under `periods` are the app's own translations. Every
non-English page carries a line in its colophon saying exactly this. The Rites
are left in English throughout, as the schema names them.

A handful of things inside the translated content files are also the app's
words rather than the note's — the `marginal` summaries beside a teaching
point, and the journal prompts the English note does not print either. Each is
flagged in the comment at the top of the file it appears in.

---

## Opening it

**The simple way.** Double-click `index.html`. It opens in your browser and
works — no installation, no internet needed except for the fonts.

**The way it will look on a phone.** From this folder:

```bash
node serve.js
```

Then open the address it prints (http://localhost:4173) on your computer, or on
your phone using your computer's IP address while on the same wi-fi.

---

## Where everything lives

```
App/
  index.html            the journey map — all 42 sessions
  session.html          one session, opened as session.html?topic=16
  serve.js              the little local server described above

  content/
    syllabus.js         the 42 sessions, four periods, and the Rites
    topics/
      en/               one folder per language, one file per topic
        topic-01.js     — THE APPROVED TEXT, in that language
        topic-16.js
        topic-29.js
      ms/  topic-01.js, topic-16.js
      zh/  topic-01.js
      ta/  topic-01.js, topic-16.js, topic-29.js

  assets/css/
    tokens.css          every colour, typeface and size in the app
    app.css             layout and components
    lang.css            the Tamil and Chinese faces, and the chooser
    print.css           the same session on paper

  assets/js/
    i18n.js             the four languages and every word the app owns
    app.js              theme, reading size, language, small helpers
    journal.js          saving what the candidate writes, on their device
    docx.js             writes the Word document, from scratch
    export.js           decides what goes into that document
    journey.js          draws the journey map
    session.js          draws a session page

  tools/
    check-content.js    checks every topic before it is published
    check-bible-links.js  asks the four Bible sites whether every
                          link really lands on the book it claims
    sample/             sample Word documents, produced by that check
```

---

## Adding a topic (Phase II)

1. Copy `content/topics/en/topic-16.js` to `content/topics/<code>/topic-NN.js`,
   where `<code>` is `en`, `ms`, `zh` or `ta`.
2. Change the registration line at the top to match both:

```js
window.RCIA.topics.ta = window.RCIA.topics.ta || {};
window.RCIA.topics.ta[19] = { … };
```

3. Replace the text with the approved note **for that language**, word for
   word. Do not paraphrase, tidy or shorten it — the Imprimatur covers the text
   as approved — and do not translate it from the English note; use the PDF the
   Commission approved in that language. Where the printed note contains an
   error, transcribe it as printed and note it in the comment at the top of the
   file, as `en/topic-01.js` and `ta/topic-29.js` do.
4. Set `lang: '<code>'` on the topic object (English may leave it out).
5. Keep the journal ids and the number of questions **identical to the English
   note**, or candidates who change language will lose sight of what they wrote.
6. Add `<script src="content/topics/<code>/topic-NN.js"></script>` to **both**
   `index.html` and `session.html`, beside the others.
7. Run the checker:

```bash
node tools/check-content.js
```

8. Proofread the finished page against the PDF, side by side, before the topic
   goes in front of a candidate.

### Reading the text out of the source PDFs

The Tamil PDFs cannot simply be copied out of. Word wrote a broken `/ToUnicode`
map for the Nirmala UI subsets, so the pre-base vowel signs come out shifted by
one glyph — "தேடுதலும்" extracts as "ததுதலும்" — and the eight files printed through
"Microsoft: Print To PDF" carry no ligature mappings at all. Text copied
straight out of them is subtly, invisibly wrong. Rebuild the map from the
embedded fonts' own glyph names before transcribing anything, and check the
result has no stray characters from the Tamil symbol block (U+0BD6–U+0BFF).

### Adding a language

1. Add an entry to `LANGS` in `assets/js/i18n.js` — its code, its name in its
   own script, its BCP-47 tag, its `Intl` locale, and the Google Fonts family
   if the Latin stack will not carry it.
2. Add a block to `STRINGS` with **every key the English block has**. The
   checker fails if one is missing, if there is one English does not have, or
   if a `{placeholder}` does not match English's.
3. Add the font stack and the drop-cap and letter-spacing overrides to
   `assets/css/lang.css`.
4. Add the Word fonts to `SCRIPT_FONTS` and the locale to `LOCALES` in
   `assets/js/docx.js`.
5. Create `content/topics/<code>/` and transcribe the notes as above.

### The parts of a topic file

Each part (A, B, C…) holds a list of blocks. The available blocks are:

| Block | What it draws |
|---|---|
| `lead` | an opening paragraph with a drop capital |
| `para` | an ordinary paragraph |
| `label` / `subhead` | a red rubric heading |
| `points` | the numbered teaching points of Part C |
| `pericope` | the Scripture reference box |
| `versicle` | a verse set apart, centred |
| `list` | a bulleted (✠) or lettered list |
| `saint` | the Saint of the Topic plate |
| `plate` | a picture with its caption |
| `prayer` | a closing prayer |
| `journal` | questions with ruled writing lines |

### Bible links

Scripture references become links to that chapter in **a Bible the candidate can
actually read**, chosen by the language they are reading in:

| Language | Edition | Site |
|---|---|---|
| English | New Jerusalem Bible | `scrutatio.it` |
| Bahasa Malaysia | Alkitab Versi Borneo | `alkitabversiborneo.org` |
| 华语 | 思高本圣经 (Studium Biblicum) | `ccccn.org` |
| தமிழ் | அருள்வாக்கு | `arulvakku.com` |

The New Jerusalem Bible is one of the two translations the syllabus itself
recommends, which is why English goes there.

Links open in a new tab so the candidate does not lose their place or their
writing. This happens automatically in three places: the reference beside a part
heading, the `cite` of a `pericope`, and the `ref` of a `versicle`. A marginal
note is linked when it carries a `passage`, or when its `mark` is `Scripture`;
catechism references stay as plain text.

**Alkitab Versi Borneo is a sixty-six book Bible.** It has no Tobit, Judith,
Wisdom, Sirach, Baruch or Maccabees. A reference to one of those is left as
plain text in Malay rather than pointed at a page that does not hold it — the
other three editions are complete Catholic Bibles and link it normally. The
checker asserts this, so nobody can quietly "fix" it into a wrong link.

Where each book sits in each edition is the `EDITIONS` table in
`assets/js/scripture.js`. **Every id in it was read off the site itself, not
guessed**, and there is a tool that proves it:

```bash
node tools/check-bible-links.js
```

That fetches all 73 books of all four editions — nearly 900 checks — and fails
if a page no longer holds the book it claims. It is the only tool here that
needs the internet, and it is deliberately separate from `check-content.js`:
run it when the table changes, or every few months in case a site is
reorganised. It can be pointed at one edition at a time
(`node tools/check-bible-links.js ta`).

Two wrinkles are recorded in that table rather than left to chance. The 思高本
puts a whole book on one page, so its links carry an anchor to reach the
chapter — and of its 77 pages, 71 mark every verse, three mark chapters with a
Chinese numeral, and three carry no anchor at all; `zhAnchor` says which. It
also splits the Psalter into its five traditional books, so that entry is a list
of chapter ranges.

**A translated note names its books in its own language** — "Yohanes",
"யோவான்", "若望福音" — which the parser deliberately does not try to read: one
parser, in one language, serves all four editions. Give those references the
English chapter in a `passage` field and the link resolves while the printed
reference stays exactly as approved:

```js
{ type: 'versicle', text: '…', ref: 'Amsal 16:4', passage: 'Proverbs 16' }
```

The same field is available on a part heading (`part.passage`) and on a
marginal note. The checker fails the build if a reference has neither a
readable form nor a `passage`.

`assets/js/scripture.js` reads the reference as printed, including the
abbreviations the notes use (`Jn`, `Lk`, `Mt`, and `Ep` for Ephesians), numbered
books (`1 Corinthians`, `1Cor`) and multi-word titles (`Song of Songs`). Only the
chapter is linked, never a verse range: a candidate lands on the right chapter
and reads the passage from there.

Where a printed heading would mislead the parser, name the passage explicitly —
Topic 29 does this, because its heading reads "Matthew …  Lk 15:11-32":

```js
{ type: 'pericope',
  cite: 'Matthew The Parable of the Prodigal Son - Lk 15:11-32.',
  passage: 'Luke 15' }
```

The checker fails the build if a Scripture reference cannot be resolved, or if an
ordinary heading would accidentally turn into a link. If a book slug ever proves
wrong, it is one line in the `BOOKS` table in `scripture.js`; if a site
reorganises, it is one line in `EDITIONS`.

In a `points` item, `title` and `body` are joined by `joiner`, which reproduces
the punctuation of the printed note exactly — a space, an en dash `" – "`, or
`"\n"` to start a new paragraph.

Every `journal` block needs an **`id` that is unique within the topic**, and
the **same ids and question counts in every language**. Answers are stored
under `id:questionIndex` against the topic number alone, so changing an id
after candidates have started writing — or letting a translation ask a
different number of questions — would orphan their answers. The checker
verifies both.

---

## The candidate's journal

Written answers are kept in the browser's own storage **on the candidate's
device**. There is no server, no account, no login and nothing is ever uploaded.

- Saved automatically, a moment after they stop typing.
- The journey map lists the sessions already written in, so a candidate can go
  back to one easily.
- Clearing the browser's site data erases what is held in the app. Nothing else
  does — and the Word documents already saved are untouched.

There is deliberately **no separate backup file**. The candidate saves a Word
document at the end of each session, and that document is the copy they keep.
Note the one consequence: the Word document is an archive, not a way back in —
answers cannot be read from a `.docx` into the app again. If a candidate clears
their browser data mid-journey, their saved documents are safe but the app
starts empty. Encourage saving the document at the end of every session.

## The Word document

`assets/js/docx.js` writes a real `.docx` with no outside library: a `.docx` is
a ZIP of XML parts, and the file writes both. That is why the app needs no
build step and keeps working offline for ever.

The document carries the PDCC heading, the topic title, the candidate's name and
date, each question with the answer beneath it, and the closing prayer. Questions
left unanswered appear as *(not yet written)*, so the sheet is still useful to
bring to a Personal Accompanier.

It is written in the candidate's language, headings and all. Word keeps three
font slots per run — Latin, East Asian and complex script — and the file names
all three, so a Tamil heading over an English note still renders every
character. Chinese is set in SimSun and Tamil in Nirmala UI, both of which ship
with Windows; the letter-spaced small capitals of the Latin headings are
dropped for those two scripts, where they mean nothing and can spoil the
shaping of a conjunct.

Sample documents — one per language per topic — are in `tools/sample/`, rebuilt
every time the checker runs.

---

## Things still to decide

- **The name.** *The Emmaus Companion* is a proposal, not a decision. It appears
  in `index.html`, `session.html` and the document header in `export.js`.
- **Saint portraits and the retreat picture.** The plates are built to look
  right without a picture. To add one, put the file in `assets/img/saints/` and
  name it in the topic's `saint` block (`image: 'assets/img/saints/aquinas.jpg'`).
  Use public-domain sacred art — Wikimedia Commons is the usual source.
- **Scripture text.** The app reproduces only the references and short excerpts
  the approved notes already contain, and links out to a Bible for the rest.
  Embedding full passages would need the publisher's permission.
- **Which Malay Bible.** *Open — awaiting the catechist's decision.* Alkitab
  Versi Borneo is the one non-Catholic edition of the four, and has no Tobit,
  Judith, Wisdom, Sirach, Baruch or Maccabees; references to those are left
  unlinked in Malay. None of the three topics in this pilot cites one, so
  nothing is affected today, but Phase II will reach them. Changing to a
  Catholic Malay edition is one entry in `BIBLES` and one column of `EDITIONS`
  in `assets/js/scripture.js`, plus a re-run of `check-bible-links.js`.
- **The four Bible sites.** They are somebody else's, and the app depends on
  their addresses staying put. `node tools/check-bible-links.js` is how that
  assumption gets tested; run it before each release.
- **Fonts.** Cinzel, EB Garamond and Caveat load from Google Fonts, so the first
  view needs internet. Noto Serif Tamil and Noto Serif SC are fetched only when
  Tamil or Mandarin is chosen, so nobody pays for a script they do not read. For
  the offline app in Phase III all of them should be saved into `assets/` and
  served from there — the two Noto families are large, so subset them.
- **The period names in each language.** They are the app's translations of an
  English-only schema and want the Commission's eye. They are all in one place:
  `periods` in `assets/js/i18n.js`.
- **The remaining translated notes.** Bahasa Malaysia has 20 of the 37 topics,
  Mandarin 11, Tamil all 37. Of the three topics in this pilot, Mandarin is
  missing 16 and 29, and Bahasa Malaysia is missing 29 — those fall back to
  English until the Commission issues them.

---

## Putting it on the web

The app is a plain static site, so GitHub Pages serves it as it stands — no
build step, no configuration. Pages serves whatever is on the chosen branch.

**This repository is the candidate-facing app only.** The source PDFs, the
Imprimatur letter and the internal guidelines for catechists are deliberately
kept outside it and must never be committed here; `.gitignore` blocks `*.pdf`
as a second line of defence.

To publish, from inside this folder:

```bash
git push -u origin main
```

Then in the repository on GitHub: **Settings → Pages → Source: Deploy from a
branch → main → / (root) → Save.** The site appears at
`https://<username>.github.io/<repository>/` within a minute or two.

Note that on a free GitHub account, a repository served by Pages must be
**public** — the session text will be readable by anyone with the address, and
search engines will index it. That is a decision for the Commission, not a
technical detail.

Every link in the app is relative, so it works from a sub-path
(`/<repository>/`) without any change. `.nojekyll` stops GitHub trying to
process the site as a Jekyll blog.

---

## Rights

The session text is the property of the Penang Diocesan Catechetical Commission
and is reproduced here under its Imprimatur. It is published for the use of RCIA
candidates and catechists of the Diocese of Penang. It is **not** released for
free reuse, adaptation or republication; no open-source licence is granted over
the content. Parishes outside the Diocese wanting to use this should ask the
Commission first.

---

*The text of every session is reproduced from the notes approved for publication
by the Penang Diocesan Catechetical Commission.
Imprimatur: ✠ Cardinal Sebastian Francis, Bishop of Penang, 31 May 2026
(PKK/BCR/2026/05/705).*
