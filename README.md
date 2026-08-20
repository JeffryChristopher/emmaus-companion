# The Emmaus Companion — pilot copy

The RCIA session notes of the Diocese of Penang, as a digital companion for
candidates, with a private reflection journal that becomes a Word document.

**Phase I.** Three topics are built end to end, one for each shape of note:

| Topic | Session | Period | Why it is in the pilot |
|---|---|---|---|
| 1 — Our Search for Meaning in Life and Our Capacity for God | 2 | A | the standard five-part note (A–E) |
| 16 — The Mass Explained | 17 | B | question-and-answer teaching points, sub-lists, an activity |
| 29 — Prodigal Son Retreat | 32 | C | the retreat shape (A–D, no Saint, journal-first) |

The other 34 topics appear on the journey map, marked *Phase II*, so the whole
road is visible from the first day.

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
      topic-01.js       one file per topic — THE APPROVED TEXT
      topic-16.js
      topic-29.js

  assets/css/
    tokens.css          every colour, typeface and size in the app
    app.css             layout and components
    print.css           the same session on paper

  assets/js/
    app.js              theme, reading size, small helpers
    journal.js          saving what the candidate writes, on their device
    docx.js             writes the Word document, from scratch
    export.js           decides what goes into that document
    journey.js          draws the journey map
    session.js          draws a session page

  tools/
    check-content.js    checks every topic before it is published
    sample/             sample Word documents, produced by that check
```

---

## Adding a topic (Phase II)

1. Copy `content/topics/topic-16.js` to `topic-NN.js`.
2. Replace the text with the approved note, **word for word**. Do not
   paraphrase, tidy or shorten it — the Imprimatur covers the text as approved.
   Where the printed note contains an error, transcribe it as printed and note
   it in the comment at the top of the file, as `topic-01.js` and `topic-29.js`
   do.
3. Add `<script src="content/topics/topic-NN.js"></script>` to **both**
   `index.html` and `session.html`, beside the others.
4. Run the checker:

```bash
node tools/check-content.js
```

5. Proofread the finished page against the PDF, side by side, before the topic
   goes in front of a candidate.

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

In a `points` item, `title` and `body` are joined by `joiner`, which reproduces
the punctuation of the printed note exactly — a space, an en dash `" – "`, or
`"\n"` to start a new paragraph.

Every `journal` block needs an **`id` that is unique within the topic**. Answers
are stored under `id:questionIndex`, so changing an id after candidates have
started writing would orphan their answers. The checker verifies uniqueness.

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

Sample documents are in `tools/sample/`, rebuilt every time the checker runs.

---

## Things still to decide

- **The name.** *The Emmaus Companion* is a proposal, not a decision. It appears
  in `index.html`, `session.html` and the document header in `export.js`.
- **Saint portraits and the retreat picture.** The plates are built to look
  right without a picture. To add one, put the file in `assets/img/saints/` and
  name it in the topic's `saint` block (`image: 'assets/img/saints/aquinas.jpg'`).
  Use public-domain sacred art — Wikimedia Commons is the usual source.
- **Scripture text.** The app reproduces only the references and short excerpts
  the approved notes already contain. Embedding full passages from the NRSVCE or
  NJB would need the publisher's permission.
- **Fonts.** Cinzel, EB Garamond and Caveat load from Google Fonts, so the first
  view needs internet. For the offline app in Phase III they should be saved
  into `assets/` and served from there.

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
