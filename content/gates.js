/* ============================================================
   THE EMMAUS COMPANION — The five sessions that carry no note

   Sessions 1, 18, 30, 35 and 36 are briefings, a day of recollection
   and the sending to the Rite of Election. The Commission has issued
   no candidate session note for any of them.

   These pages therefore carry NOTHING the app has made up about the
   faith. What is here is only:

     · the line the Syllabus Schema itself prints in its "Topic
       content" column, word for word, where it prints one at all —
       and where it prints nothing, these pages say so rather than
       invent something;
     · the Rite that follows the session, taken from the Schema and
       drawn by the app from content/syllabus.js, so it is never
       written down twice;
     · pointers to the session notes that DO treat the subject, which
       are approved under the Imprimatur and say it properly;
     · a place to write, so the day is not lost.

   The part names, the sentences that introduce a cross-reference,
   and the journal prompts are the APP's own words. They are kept
   plain and few on purpose, and every page says at the top that it
   is not a session note.

   The Schema is issued in English only, so these pages are English
   only. A reader in another language meets them under the same
   notice as an untranslated topic.

   If the Commission issues notes for these sessions, they belong in
   content/topics/, not here, and these files should go.
   ============================================================ */

window.RCIA = window.RCIA || {};
window.RCIA.gates = window.RCIA.gates || {};
window.RCIA.gates.en = window.RCIA.gates.en || {};

/* -------------------------------------------------- session 1 */

/* Transcription note: the Schema prints this content as one run-on
   line — "Stages of RCIA(what to expect), Dates and Topics of future
   sessions and Rites, Four Pillars of the Church/Introduce RCIA team
   & local Community/Role of sponsors." It is broken into its own
   items here for reading; no word is changed, and the missing space
   in "RCIA(what" is the Schema's. */
window.RCIA.gates.en[1] = {
  session: 1,
  period: 'A',
  kind: 'gate',
  label: 'The first meeting',
  title: 'Welcome & Self-introduction: What is RCIA?',

  parts: [
    {
      letter: 'A',
      name: 'What the Syllabus gives this session',
      blocks: [
        { type: 'lead', text: 'The Syllabus Schema sets down what this first meeting covers:' },
        {
          type: 'list',
          items: [
            'Stages of RCIA(what to expect)',
            'Dates and Topics of future sessions and Rites',
            'Four Pillars of the Church',
            'Introduce RCIA team & local Community',
            'Role of sponsors'
          ]
        }
      ]
    },
    {
      letter: 'B',
      name: 'Where to write',
      blocks: [
        {
          type: 'journal',
          id: 'A',
          prompt: 'Nothing here is asked of you by the Commission. These are simply a place to keep the day.',
          questions: [
            { n: '❧', text: 'What brought me to ask about the Catholic faith?' },
            { n: '❧', text: 'What do I hope for from this journey, and what am I unsure of?' },
            { n: '❧', text: 'The names of the people walking with me — my accompanier, my sponsor, the others in the group.' }
          ]
        }
      ]
    }
  ]
};

/* -------------------------------------------------- session 18 */

/* Transcription note: the Schema prints "Explaination of Rite of
   Acceptance" — the misspelling is the Schema's and is kept. */
window.RCIA.gates.en[18] = {
  session: 18,
  period: 'B',
  kind: 'gate',
  label: 'A briefing',
  title: 'Briefing for the Rite of Acceptance',

  parts: [
    {
      letter: 'A',
      name: 'What the Syllabus gives this session',
      blocks: [
        { type: 'lead', text: 'The Syllabus Schema sets down what this briefing covers:' },
        {
          type: 'list',
          items: [
            'Faith',
            'Conversion',
            'Church as Community',
            'Explaination of Rite of Acceptance'
          ]
        },
        { type: 'aside', text: 'It also gives the question this session answers: “What is man’s response to God’s revelation?”' }
      ]
    },
    {
      letter: 'B',
      name: 'The Rite that follows',
      blocks: [
        { type: 'rite' }
      ]
    },
    {
      letter: 'C',
      name: 'Where these are explained',
      blocks: [
        { type: 'para', text: 'The Commission has issued no note for this briefing. The three subjects it names are treated in these notes, which are approved:' },
        {
          type: 'crossref',
          items: [
            { topic: 7, note: 'Faith, and what a creed is.' },
            { topic: 12, note: 'The Church as community.' }
          ]
        }
      ]
    },
    {
      letter: 'D',
      name: 'Where to write',
      blocks: [
        {
          type: 'journal',
          id: 'A',
          prompt: 'Nothing here is asked of you by the Commission. These are simply a place to keep the day.',
          questions: [
            { n: '❧', text: 'What am I asking of the Church at this Rite, and what is the Church asking of me?' },
            { n: '❧', text: 'What has changed in me since the first session?' }
          ]
        }
      ]
    }
  ]
};

/* -------------------------------------------------- session 30 */

window.RCIA.gates.en[30] = {
  session: 30,
  period: 'C',
  kind: 'gate',
  label: 'A briefing',
  title: 'Rite of Sending; Rite of Election Briefing',

  parts: [
    {
      letter: 'A',
      name: 'What the Syllabus gives this session',
      blocks: [
        { type: 'lead', text: 'The Syllabus Schema names this session and the Rite that follows it, and sets down no further content for it. Nothing is added here in its place.' }
      ]
    },
    {
      letter: 'B',
      name: 'The Rite that follows',
      blocks: [
        { type: 'rite' }
      ]
    },
    {
      letter: 'C',
      name: 'Where this is explained',
      blocks: [
        { type: 'para', text: 'The period this Rite opens is treated in these notes, which are approved:' },
        {
          type: 'crossref',
          items: [
            { topic: 27, note: 'The season of Lent, which the Rite of Election begins on its First Sunday.' },
            { topic: 28, note: 'The Period of Purification and Enlightenment, the Scrutinies, and how to prepare for them.' }
          ]
        }
      ]
    },
    {
      letter: 'D',
      name: 'Where to write',
      blocks: [
        {
          type: 'journal',
          id: 'A',
          prompt: 'Nothing here is asked of you by the Commission. These are simply a place to keep the day.',
          questions: [
            { n: '❧', text: 'My parish is sending me to the Bishop to be chosen. What do I want to say to God about that?' },
            { n: '❧', text: 'What in me still needs purifying before Easter?' }
          ]
        }
      ]
    }
  ]
};

/* -------------------------------------------------- session 35 */

window.RCIA.gates.en[35] = {
  session: 35,
  period: 'C',
  kind: 'gate',
  label: 'A preparation',
  title: 'Preparing for the Sacraments of Initiation',

  parts: [
    {
      letter: 'A',
      name: 'What the Syllabus gives this session',
      blocks: [
        { type: 'lead', text: 'The Syllabus Schema names this session and sets down no further content for it. Nothing is added here in its place.' }
      ]
    },
    {
      letter: 'B',
      name: 'Where these are explained',
      blocks: [
        { type: 'para', text: 'The three Sacraments you are being prepared for are treated in these notes, which are approved:' },
        {
          type: 'crossref',
          items: [
            { topic: 19, note: 'Baptism and Confirmation.' },
            { topic: 20, note: 'The Eucharist.' },
            { topic: 28, note: 'The two rites of Holy Saturday — the Ephphetha and the Anointing — and the choosing of a baptismal name.' }
          ]
        }
      ]
    },
    {
      letter: 'C',
      name: 'Where to write',
      blocks: [
        {
          type: 'journal',
          id: 'A',
          prompt: 'Nothing here is asked of you by the Commission. These are simply a place to keep the day.',
          questions: [
            { n: '❧', text: 'The baptismal name I have chosen, and why that saint.' },
            { n: '❧', text: 'What I still want to ask before the Easter Vigil.' }
          ]
        }
      ]
    }
  ]
};

/* -------------------------------------------------- session 36 */

window.RCIA.gates.en[36] = {
  session: 36,
  period: 'C',
  kind: 'gate',
  label: 'A day of recollection',
  title: 'Day of Recollection',

  parts: [
    {
      letter: 'A',
      name: 'What the Syllabus gives this session',
      blocks: [
        { type: 'lead', text: 'The Syllabus Schema names this day and sets down no further content for it. The note for Topic 28, which is approved, does describe it:' },
        {
          type: 'versicle',
          text: '“After the period of purification and enlightenment the elect will go through a half day of recollection and prayers on Holy Saturday and two rites. The two rites are: Rite of Ephphetha. Rite of Anointing.”',
          cite: 'Topic 28, Preparation for the Period of Purification and Enlightenment'
        }
      ]
    },
    {
      letter: 'B',
      name: 'The Rite that follows',
      blocks: [
        { type: 'rite' }
      ]
    },
    {
      letter: 'C',
      name: 'Where this is explained',
      blocks: [
        {
          type: 'crossref',
          items: [
            { topic: 28, note: 'The two rites of this day, and the reason for choosing a baptismal name.' }
          ]
        }
      ]
    },
    {
      letter: 'D',
      name: 'Where to write',
      blocks: [
        {
          type: 'journal',
          id: 'A',
          prompt: 'Nothing here is asked of you by the Commission. These are simply a place to keep the day.',
          questions: [
            { n: '❧', text: 'What I bring to God on this last day before the Vigil.' },
            { n: '❧', text: 'What I want to remember about tonight, years from now.' }
          ]
        }
      ]
    }
  ]
};
