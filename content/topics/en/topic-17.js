/* ============================================================
   TOPIC 17: Introduction to Sacraments and Sacramentals
   Source: "PD RCIA Cdt Tp17 Intro to Sacraments n Sacramentals.pdf"

   The teaching text below is transcribed VERBATIM from the note
   approved under the Imprimatur. Do not paraphrase, shorten or
   "improve" it. Proofread against the PDF before publishing.

   Two places where the printed layout could not be reproduced
   line for line, and what was done instead:
   · Point 6 prints each category (a–c) on its own line with its
     roman-numbered sacraments on the line beneath. Here the two
     lines are joined by an em dash so the lettering still reads as
     one list. No word is changed.
   · Point 7 is a three-column table of the matter and form of each
     sacrament, reproduced here column for column. Where a cell in
     the note holds two lines, Holy Matrimony's "Exchange of vows"
     and "“I do” (consent)", they are joined by an em dash.
   ============================================================ */

window.RCIA = window.RCIA || {};
window.RCIA.topics = window.RCIA.topics || {};
window.RCIA.topics.en = window.RCIA.topics.en || {};

window.RCIA.topics.en[17] = {
  topic: 17,
  session: 19,
  period: 'B',
  template: 'standard',
  title: 'Introduction to Sacraments and Sacramentals',
  topicQuestion: 'What are Sacraments & Sacramentals?',
  status: 'draft',

  parts: [
    /* -------------------------------------------------- A */
    {
      letter: 'A',
      name: 'Life Experience',
      blocks: [
        { type: 'label', text: 'Introduction:' },
        { type: 'lead', text: 'When Jesus ascended to heaven, God established the Church to continue His work of salvation. The sacraments are “efficacious signs of grace” instituted by Christ and entrusted to the Church by which God’s life is given to us. There are seven sacraments in the Catholic Church: Baptism, Confirmation, the Eucharist, Penance, the Anointing of the Sick, Holy Orders, and Matrimony. The seven sacraments touch all the stages and important moments of Christian life: they give birth and increase, healing and mission to the Christian’s life of faith.' },
        { type: 'para', text: 'Many other religions practice initiation rites too.' },
        { type: 'para', text: 'Judaism: The rite by which a Jewish boy is formally initiated into the religious community and assumes the duties and responsibilities of a Jew is known as a bar mitzvah.' },
        { type: 'para', text: 'Islam: To become a Muslim, a person must take the “shahadah” by declaring, “I bear witness that there is no deity (none worthy of worship) but Allah, and I bear witness that Muhammad is the Messenger of Allah.”' },
        { type: 'para', text: 'Hinduism: Once a child enters the world, the “jatakarma” ceremony is performed to welcome the child into the family by putting some honey in the child’s mouth and whispering the name of god in the child’s ear.' },
        {
          type: 'journal',
          id: 'A',
          prompt: 'Questions to reflect and share.',
          questions: [
            { n: '1.', text: 'Why do you think initiation rites are important in any religion?' },
            { n: '2.', text: 'Share any initiation rites you have gone through in your life. What did it mean for you?' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- B */
    {
      letter: 'B',
      name: 'Scripture',
      ref: 'John 9:1-38',
      blocks: [
        {
          type: 'pericope',
          cite: 'John 9:1-38 – Jesus Heals a Man Born Blind.',
          instruction: 'Read Text and prepare answers for Questions below:'
        },
        {
          type: 'journal',
          id: 'B',
          questions: [
            { n: '1.', text: 'What happened in Jn 9:1-23?' },
            { n: '2.', text: 'What is the lesson in Jn 9:24-34?' },
            { n: '3.', text: 'What is the meaning of Jn 9:38?' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- C */
    {
      letter: 'C',
      name: 'Topic of the Day',
      ref: 'Introduction to the Sacraments and Sacramentals',
      blocks: [
        {
          type: 'points',
          items: [
            {
              title: 'What are the sacraments and why do we need them?', joiner: '\n',
              body: 'The word “sacrament” comes from the Latin word sacramentum, which means “to make holy”. A sacrament is an outward sign of inner grace instituted by Christ. Visible matter and words are used to convey the grace given to us by God.'
            },
            {
              title: 'What are the seven sacraments?', joiner: '\n',
              body: 'There are seven sacraments in the Holy Catholic Church, namely Baptism, Confirmation, the Eucharist, Penance and Reconciliation, Anointing of the Sick, Holy Orders, and Holy Matrimony.'
            },
            {
              title: 'What is the purpose of sacraments?', joiner: '\n',
              body: 'God uses sacraments to communicate His divine life to the receiver. The sacraments are meant to make us holy.'
            },
            {
              title: 'Why did Christ institute the sacraments?', joiner: '\n',
              body: 'We can and should come to God with all our senses, not just with the intellect. That is why God gives Himself to us through earthly signs — especially in bread and wine, the Body and Blood of Christ.'
            },
            {
              title: 'Why is faith in Jesus a prerequisite for the sacraments?', joiner: '\n',
              body: 'The sacraments are not magic. A sacrament can be effective only if one understands and accepts it in faith. Sacraments not only presuppose faith, but they also strengthen it and give expression to it (CCC 1122-1126).',
              afterBody: 'Christ has entrusted the sacraments to his Church. They are the sacraments “of the Church” to build up the Church. By celebrating the sacraments, the Church professes the faith that comes from the apostles.',
              marginal: { mark: 'CCC', text: '1122–1126: Faith and the sacraments; lex orandi, lex credendi.' }
            },
            {
              title: 'What are the 3 categories of sacraments?', joiner: '\n',
              body: 'The seven sacraments can be divided into three categories:',
              list: [
                'Sacraments of Initiation: i. Baptism  ii. Confirmation  iii. Eucharist',
                'Sacraments of Healing: iv. Penance & Reconciliation  v. Anointing of the Sick',
                'Sacraments of Service: vi. Holy Orders  vii. Holy Matrimony'
              ],
              listStyle: 'lettered'
            },
            {
              title: 'What are the elements of a Sacrament?', joiner: '\n',
              body: 'All sacraments have matter (material or tangible elements) and form (words or prayers).',
              table: {
                head: ['Sacrament', 'Matter', 'Form'],
                rows: [
                  ['Baptism (Jn.3:5, Ac 6:14-15, 1 Cr 1:16)', 'Water', '“Name, I baptize you in the name of the Father, and of the Son and of the Holy Spirit.”'],
                  ['Confirmation (Ac 8:14-17, Tt 3:5)', 'Oil', '“Be sealed with the gift of the Holy Spirit!”'],
                  ['Eucharist (Lk 22:19-20, Jn 6:51-56)', 'Bread & grape wine', '“This is my body… This is my blood…”'],
                  ['Penance & Reconciliation (Lk 11:4, Mk 1:15, Jn 20:21-23, 2 Cr 5:18-20)', 'Sin', '“I absolve you from all your sins in the name of the Father, Son and the Holy Spirit.”'],
                  ['Anointing of the Sick (Mk 2:9-12, Mk 16:17-18, 1 Cr 12:7-9, Ja 5:14-15)', 'Oil', '“Through this holy anointing, may the Lord in his love and mercy help you with the grace of the Holy Spirit … May the Lord who saves you from sin save you and raise you up.”'],
                  ['Holy Orders (He 5:1, 4-6, Tt 1:5, Mt. 19:12, 1 Tm 1:4-14, 2 Tm 1:6)', 'Laying of hands/oil', 'Prayer of consecration'],
                  ['Holy Matrimony (Gn 1:27, Ho 3:1, Mk 10:4-12)', 'Ring', 'Exchange of vows, “I do” (consent)']
                ]
              }
            },
            {
              title: 'What is the definition of sacramentals?', joiner: '\n',
              body: 'Sacramentals are sacred signs, usually Church-instituted (though some are Christ-instituted). They work through the power and prayers of the Church (ex opere operantis Ecclesiae) and, subjectively (ex opere operantis), that is, through the pious disposition of the one using them.'
            },
            {
              title: 'What are sacramentals?', joiner: '\n',
              body: 'Blessings are called "sacramentals" because they prepare us to receive the grace of the sacraments and help us to grow to be more like Christ. Sacramentals do not confer the grace of the Holy Spirit in the way that the sacraments do, but by the Church’s prayer, they prepare us to receive grace and dispose us to cooperate with it.'
            },
            {
              title: 'Are sacramentals found in the Bible?', joiner: '\n',
              body: 'Although we will not be able to find any verses in the Bible about people fingering Rosary beads, wearing scapulars or donning miraculous medals, there are a number of passages of Scripture that support the use of sacramentals.'
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
          name: 'St Edith Stein',
          alsoKnown: 'St Teresa Benedicta of the Cross',
          monogram: 'E',
          image: null,
          imageCaption: null,
          facts: [
            { label: 'Feast day', value: 'August 9.' },
            { label: 'Birth', value: 'October 12, 1891 in Breslau, Poland.' },
            { label: 'Death', value: 'August 9/10, 1942 in Auschwitz, concentration camp.' }
          ],
          paragraphs: [
            'St Edith Stein was a Roman Catholic convert from Judaism, Carmelite nun, philosopher, and spiritual writer who was executed by the Nazis because of her Jewish ancestry and who is regarded as a modern martyr. She was declared a saint by the Roman Catholic Church in 1998.',
            '"We bow down before the testimony of the life and death of Edith Stein, an outstanding daughter of Israel and at the same time a daughter of the Carmelite Order, Sister Teresa Benedicta of the Cross, a personality who united within her rich life a dramatic synthesis of our century. It was the synthesis of a history full of deep wounds that are still hurting ... and also the synthesis of the full truth about man. All this came together in a single heart that remained restless and unfulfilled until it finally found rest in God."',
            '(These were the words of Pope John Paul II when he beatified Edith Stein in Cologne on 1 May 1987.)'
          ],
          list: null,
          sources: [
            'https://www.catholic.org/saints/saint.php?saint_id=179'
          ]
        }
      ]
    },

    /* -------------------------------------------------- E */
    {
      letter: 'E',
      name: 'Personal Activity & Reflection',
      blocks: [
        {
          type: 'journal',
          id: 'E',
          prompt: 'Read and reflect on the Bible texts concerning the 7 sacraments:',
          questions: [
            { n: '1.', text: 'Baptism (Jn.3:5, Ac 6:14-15, 1 Corinthians 1:16).' },
            { n: '2.', text: 'Confirmation (Acts 8:14-17; Titus 3:5).' },
            { n: '3.', text: 'Eucharist (Luke 22:19-20; John 6:51-56).' },
            { n: '4.', text: 'Penance & Reconciliation (Luke 11:4, Mark 1:15, John 20:21-23, 2 Corinthians 5:18-20).' },
            { n: '5.', text: 'Anointing of the Sick (Mk 2:9-12, Mk 16:17-18, 1 Corinthians 12:7-9, James 5:14-15).' },
            { n: '6.', text: 'Holy Orders (He 5:1, 4-6, Titus 1:5, Matthew 19:12, 1 Timothy 1:4-14, 2 Timothy 1:6).' },
            { n: '7.', text: 'Holy Matrimony (Gn 1:27, Hosea 3:1, Mark 10:4-12).' }
          ]
        }
      ]
    }
  ]
};
