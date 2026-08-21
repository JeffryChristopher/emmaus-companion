/* ============================================================
   TOPIC 3: Scripture – The Bible
   Source: "PD RCIA Cdt Tp03 Sacred Scripture - The Bible.pdf"

   The teaching text below is transcribed VERBATIM from the note
   approved under the Imprimatur. Do not paraphrase, shorten or
   "improve" it. Proofread against the PDF before publishing.

   Transcription notes for the proofreader:
   · Part A of the printed note carries NO introduction text, only
     a montage of four old photographs of Penang, which the first
     question refers to ("the above pictures"). The picture is
     described in the `plate` block below and is still to be added;
     until it is, the plate says so rather than leaving the question
     unanswerable in silence.
   · Point 5 prints one lettered list a)–h) broken in the middle by
     the heading "Composition of The New Testament: Total 27 books."
     That is reproduced with `afterList` and `list2`, which resumes
     the lettering at e).
   · Part E of the printed note gives an instruction to reflect but
     no numbered questions. The two questions under journal E are
     the APP's, drawn from that instruction, so the candidate has
     somewhere to write. So are the `marginal` summaries in Part C.
   ============================================================ */

window.RCIA = window.RCIA || {};
window.RCIA.topics = window.RCIA.topics || {};
window.RCIA.topics.en = window.RCIA.topics.en || {};

window.RCIA.topics.en[3] = {
  topic: 3,
  session: 4,
  period: 'A',
  template: 'standard',
  title: 'Scripture – The Bible',
  topicQuestion: 'What is and why the Bible?',
  status: 'draft',

  parts: [
    /* -------------------------------------------------- A */
    {
      letter: 'A',
      name: 'Life Experience',
      blocks: [
        { type: 'label', text: 'Introduction:' },
        {
          type: 'plate',
          image: null,
          suggested: 'The note prints a montage of four old photographs of Penang: a street hawker with his laden bicycle cart, two men carrying baskets on shoulder poles, a double-decker bus on a city street, and a row of shophouses with cars of the 1950s.',
          fileHint: 'assets/img/topics/penang-past.jpg',
          caption: 'The pictures in the note'
        },
        {
          type: 'journal',
          id: 'A',
          prompt: 'Questions to reflect and share.',
          questions: [
            { n: '1)', text: 'Discuss and share what you see in the above pictures?' },
            { n: '2)', text: 'Do you have any story or memories of Penang in the past? Share.' },
            { n: '3)', text: 'Take a moment to think of the stories that your parents or grandparents may have told you about their past. Share what you learnt from them in their stories.' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- B */
    {
      letter: 'B',
      name: 'Scripture',
      ref: 'Mt. 13: 1-58',
      passage: 'Matthew 13',
      blocks: [
        {
          type: 'pericope',
          cite: 'Mt. 13: 1-58: Purpose of Parables.',
          passage: 'Matthew 13',
          instruction: 'Read Text and prepare answers for Questions below:'
        },
        {
          type: 'journal',
          id: 'B',
          questions: [
            { n: '1.', text: 'What is a parable?' },
            { n: '2.', text: 'Why did Jesus speak/teach in parables?' },
            { n: '3.', text: 'What is the meaning and lesson of the parable of the Sower?' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- C */
    {
      letter: 'C',
      name: 'Topic of the Day',
      ref: 'Sacred Scripture – The Bible',
      blocks: [
        {
          type: 'points',
          items: [
            {
              title: 'What is the Bible?', joiner: '\n',
              body: 'The Bible is a collection of books that the Catholic church believes are the inspired words of God written under the direction of the Holy Spirit for the benefit of all mankind.'
            },
            {
              title: 'The Canon or List of the Bible', joiner: ' - ',
              body: 'The canon of Scripture is a set of books Christians hold as Sacred Scripture.'
            },
            {
              title: 'History of the Bible', joiner: ' - ',
              body: 'There is a difference between the Protestant and Catholic Bibles due to the controversies in choosing the canon of the Old Testament. The Protestant Canon has 39 books of the Old Testament, while the Catholic Canon has 46 books of the Old Testament because it contains an additional 7 books, known as the Deutero-canon books. Both the Protestant and Catholic Bibles have 27 books of the New Testament.'
            },
            {
              title: 'General Structure of the Bible', joiner: ' - ',
              body: 'The Bible is divided into two major parts, The Old Testament (OT) and the New Testament (NT). The word ‘testament’ means agreement or covenant. A covenant is a sacred agreement between God and the Jewish people in the Old Testament in preparation for the coming of the Messiah. The New Testament is a record of the new covenant made by God with the entire human race through the life, passion, death and resurrection of Jesus Christ, his teachings and the events of first-century Christianity.'
            },
            {
              title: 'Composition of the Catholic Bible:', joiner: '\n',
              body: 'Composition of the Old Testament: Total 46 books.',
              list: [
                'The first 5 books, called the Pentateuch.',
                'The 16 Historical Books.',
                'The 7 Wisdom Books.',
                'The 18 Prophetic Books.'
              ],
              listStyle: 'lettered',
              afterList: 'Composition of The New Testament: Total 27 books.',
              list2: [
                'The 4 Gospels.',
                'The Acts of the Apostles.',
                'The Epistles or Letters.',
                'The Book of Revelation.'
              ],
              list2Style: 'lettered',
              list2Start: 5
            },
            {
              title: 'Who is the Author of the Bible?', joiner: '\n',
              body: 'The author of the Bible is God, who reveals His merciful plan of salvation through human authors. Although these human authors were the ‘true authors’ of Scripture, they were inspired by the Holy Spirit.'
            },
            {
              title: 'Inerrancy of the Bible', joiner: ' - ',
              body: 'Inerrancy, meaning “the quality of being without error”, describes the truth of Scripture through the doctrine that is inspired by the Holy Spirit. Since God is the author of Scripture, everything that the human authors affirm is affirmed by the Holy Spirit (CCC 107).',
              marginal: { mark: 'CCC', text: '107: The books of Scripture teach the truth God wished to see confided to them.' }
            },
            {
              title: 'The Context of Sacred Scripture', joiner: ' – ',
              body: 'The Scriptural texts were written from the faith experiences of ancient communities. The context means looking at every verse or passage in relation to the verses, chapters, and broader narratives surrounding it and knowing what other ideas, themes, or stories the author was thinking about when writing. The purpose is to understand how this context affects or influences the way a verse should be read.'
            },
            {
              title: 'Reading and interpreting the bible', joiner: ' - ',
              body: 'To interpret Scripture correctly, the reader must be attentive to the original social and historical context and what the human authors truly wanted to affirm, and to what God wanted to reveal to us by their words (CCC 109).',
              marginal: { mark: 'CCC', text: '109: Attend to what the human authors truly wanted to affirm.' }
            },
            {
              title: 'The senses of Scripture', joiner: ' – ',
              body: 'there are two senses of Scripture:',
              list: [
                'The Literal Sense – conveys the meaning of the words of the text themselves, as expressed directly by the inspired human authors.',
                'The Spiritual Sense – conveys the meaning of the biblical texts, when read under the influence of the Holy Spirit. The spiritual sense is subdivided into three senses:'
              ],
              listStyle: 'lettered',
              afterList: null,
              list2: [
                'i. The Allegorical Sense - points to Christ and His Church.',
                'ii. Moral Sense – Teaches us to act justly.',
                'iii. Anagogical Sense - (Greek: anagoge, "leading") points to eternal life.'
              ],
              list2Style: 'plain'
            }
          ]
        }
      ]
    },

    /* -------------------------------------------------- D */
    {
      letter: 'D',
      name: 'Saint for the Topic',
      blocks: [
        {
          type: 'saint',
          name: 'St. Jerome',
          alsoKnown: 'St Jerome of Stridon (original name: Eusebius Sophronius Hieronymus)',
          monogram: 'J',
          image: null,
          imageCaption: null,
          facts: [
            { label: 'Feast day', value: 'September 30.' },
            { label: 'Patron of', value: 'Archaeologists, Biblical scholars, librarians, students and translators.' },
            { label: 'Birth', value: 'c 342-347AD in Stridon, Dalmatia. (Today: Croatia or Slovenia).' },
            { label: 'Death', value: '420 AD.' }
          ],
          paragraphs: [
            'He was a Theologian, translator and historian. Learned Latin and Greek from famous Roman grammarian, Aelius Donatus. At the age of 12, he travelled to Rome to study grammar, philosophy and rhetoric. He is known for his translation of the Bible into Latin (known as the Vulgate) and his commentaries on the whole Bible. In addition to his biblical works, he wrote polemical and historical essays, always from a theologian’s perspective.'
          ],
          list: null,
          sources: [
            'https://www.franciscanmedia.org/saint-of-the-day/saint-jerome/',
            'https://www.catholic.org/saints/saint.php?saint_id=10'
          ]
        }
      ]
    },

    /* -------------------------------------------------- E */
    {
      letter: 'E',
      name: 'Personal Activity & Reflection',
      blocks: [
        { type: 'para', text: 'Read the Bible Readings for the Day (you can find it in the Church bulletin or Google it).' },
        { type: 'label', text: 'Use this method:' },
        {
          type: 'list',
          items: [
            'Pray before reading (ask the Holy Spirit to inspire you through the WOG).',
            'Read the passage or Bible text.',
            'Meditate or reflect on what you read (what word/sentence struck you as you read).',
            'Speak to God (ask Him what is He telling you).',
            'Close with a prayer of thanksgiving to God.'
          ]
        },
        { type: 'label', text: 'Reflection:' },
        { type: 'para', text: 'Reflect on the text you just read and think of how it can apply to you and what God wants you to do.' },
        {
          type: 'journal',
          id: 'E',
          questions: [
            { n: '❧', text: 'Which word or sentence struck you as you read today’s Bible reading?' },
            { n: '❧', text: 'How can this text apply to you, and what does God want you to do?' }
          ]
        }
      ]
    }
  ]
};
