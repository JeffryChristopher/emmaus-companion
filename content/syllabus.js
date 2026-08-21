/* ============================================================
   THE EMMAUS COMPANION: The Journey
   Transcribed from "New RCIA Syllabus Schema 2026".

   42 sessions across four periods. "topic" is the number on the
   candidate's session note (Topic 1 … Topic 37); sessions with no
   topic number are briefings, rites and days of recollection.
   ============================================================ */

window.RCIA = window.RCIA || {};

window.RCIA.periods = [
  {
    id: 'A',
    letter: 'A',
    name: 'Why be a Catholic?',
    stage: 'Evangelization · 6 lessons',
    colour: 'Seed Green'
  },
  {
    id: 'B',
    letter: 'B',
    name: 'How to Become & Live as a Catholic?',
    stage: 'Precatechumenate & Catechumenate · 20 lessons',
    colour: 'Deep Water'
  },
  {
    id: 'C',
    letter: 'C',
    name: 'How to Deepen Your Life as a Catholic?',
    stage: 'Purification & Enlightenment · 5 lessons',
    colour: 'Lenten Violet'
  },
  {
    id: 'D',
    letter: 'D',
    name: 'How to Become an Evangelizing Catholic?',
    stage: 'Mystagogy · 6 lessons',
    colour: 'Paschal Gold'
  }
];

/* session: the number in the parish's running order
   topic:   the number printed on the candidate's session note
   gateAfter: a Rite celebrated after that session               */
window.RCIA.sessions = [
  /* ---------- A · Evangelization ---------- */
  { session: 1,  topic: null, period: 'A', title: 'Welcome & Self-introduction: What is RCIA?' },
  { session: 2,  topic: 1,    period: 'A', title: 'Our Search for Meaning in Life and our Capacity for God' },
  { session: 3,  topic: 2,    period: 'A', title: 'God Comes to Meet Man' },
  { session: 4,  topic: 3,    period: 'A', title: 'Sacred Scripture - The Bible' },
  { session: 5,  topic: 4,    period: 'A', title: 'Bible Timeline I' },
  { session: 6,  topic: 5,    period: 'A', title: 'Bible Timeline II' },
  { session: 7,  topic: 6,    period: 'A', title: 'Prayer (Public / Private)' },

  /* ---------- B · Precatechumenate & Catechumenate ---------- */
  { session: 8,  topic: 7,    period: 'B', title: 'Introduction to the Creed' },
  { session: 9,  topic: 8,    period: 'B', title: 'God the Father Almighty' },
  { session: 10, topic: 9,    period: 'B', title: 'God the Son - 1) Who is Jesus?' },
  { session: 11, topic: 10,   period: 'B', title: 'God the Son - 2) Jesus Our Saviour' },
  { session: 12, topic: 11,   period: 'B', title: 'God the Holy Spirit' },
  { session: 13, topic: 12,   period: 'B', title: 'Nature & Purpose of the Catholic Church' },
  { session: 14, topic: 13,   period: 'B', title: 'Mary & the Saints' },
  { session: 15, topic: 14,   period: 'B', title: 'The Four Last Things' },
  { session: 16, topic: 15,   period: 'B', title: 'Liturgical Year & Calendar, Advent & Christmas' },
  { session: 17, topic: 16,   period: 'B', title: 'The Mass Explained' },
  { session: 18, topic: null, period: 'B', title: 'Briefing for the Rite of Acceptance',
    gateAfter: { name: 'Rite of Acceptance', when: 'Into the Order of Catechumens' } },
  { session: 19, topic: 17,   period: 'B', title: 'Introduction to Sacraments & Sacramentals' },
  { session: 20, topic: 18,   period: 'B', title: 'Spiritual Preparation for Christmas' },
  { session: 21, topic: 19,   period: 'B', title: 'Sacraments of Initiation: 1) Baptism 2) Confirmation' },
  { session: 22, topic: 20,   period: 'B', title: 'Sacraments of Initiation: 3) The Eucharist' },
  { session: 23, topic: 21,   period: 'B', title: 'Sacraments of Healing I: Reconciliation' },
  { session: 24, topic: 22,   period: 'B', title: 'Sacraments of Healing II: Anointing of the Sick' },
  { session: 25, topic: 23,   period: 'B', title: 'Sacraments of Service I: Marriage' },
  { session: 26, topic: 24,   period: 'B', title: 'Sacraments of Service II: Holy Orders' },
  { session: 27, topic: 25,   period: 'B', title: 'Introduction to Christian Morality' },
  { session: 28, topic: 26,   period: 'B', title: 'Overview of the Ten Commandments' },

  /* ---------- C · Purification & Enlightenment ---------- */
  { session: 29, topic: 27,   period: 'C', title: 'The Season of Lent' },
  { session: 30, topic: null, period: 'C', title: 'Rite of Sending; Rite of Election Briefing',
    gateAfter: { name: 'Rite of Election', when: 'First Sunday of Lent' } },
  { session: 31, topic: 28,   period: 'C', title: 'Briefing on the Rites of Scrutiny 1–3 (Preparation)',
    gateAfter: { name: 'Rite of the First Scrutiny', when: 'Third Sunday of Lent' } },
  { session: 32, topic: 29,   period: 'C', title: 'Prodigal Son Retreat',
    gateAfter: { name: 'Rite of the Second Scrutiny', when: 'Fourth Sunday of Lent' } },
  { session: 33, topic: 30,   period: 'C', title: 'The “Our Father”: Part 1 - Petitions 1-3',
    gateAfter: { name: 'Rite of the Third Scrutiny', when: 'Fifth Sunday of Lent' } },
  { session: 34, topic: 31,   period: 'C', title: 'The “Our Father”: Part 2 - Petitions 4-7' },
  { session: 35, topic: null, period: 'C', title: 'Preparing for the Sacraments of Initiation' },
  { session: 36, topic: null, period: 'C', title: 'Day of Recollection',
    gateAfter: { name: 'Sacraments of Initiation', when: 'The Easter Vigil', major: true } },

  /* ---------- D · Mystagogy ----------

     NOTE FOR THE COMMISSION: the Schema and the candidates' notes
     disagree about which of these two is Topic 32 and which is
     Topic 33. The Schema gives session 37 as Topic 32 "Personal
     Transformation and Evangelization" and session 38 as Topic 33
     "Communion in the Church, Fellowship". The session notes are
     numbered the other way round: "PD RCIA Cdt Tp32" is *Church as
     Communion and Fellowship* and "Tp33" is *Personal
     Transformation and Evangelization*.

     The order of the sessions and their titles are the same in
     both, so only the topic number is in question, and the topic
     number is what is printed on the note in the candidate's hand.
     The notes are therefore followed here: session 37 carries the
     note numbered 33, session 38 the note numbered 32. Nothing else
     changes. If the Commission renumbers the notes instead, swap
     these two `topic` values back.                               */
  { session: 37, topic: 33,   period: 'D', title: 'Personal Transformation and Evangelization' },
  { session: 38, topic: 32,   period: 'D', title: 'Communion in the Church, Fellowship' },
  { session: 39, topic: 34,   period: 'D', title: 'Church and Human Community' },
  { session: 40, topic: 35,   period: 'D', title: 'Dignity & Vocation of the Lay Faithful' },
  { session: 41, topic: 36,   period: 'D', title: 'Ecumenism and Interreligious Dialogue' },
  { session: 42, topic: 37,   period: 'D', title: 'Retreat - Living a Spiritual Life with the Holy Spirit',
    gateAfter: { name: 'Rite of Commissioning', when: 'Pentecost · Presentation of Baptism Certificates' } }
];
