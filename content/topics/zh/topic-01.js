/* ============================================================
   主题 1, 我们对生命意义的追寻，以及我们认识天主的能力
   来源: "PD cRCIA Cdt ⛪主题01：生命意义的追寻.pdf"

   Transcribed VERBATIM from the Mandarin note approved under the
   Imprimatur. Do not paraphrase, shorten or "improve" it, and do not
   translate it from the English note; this is its own approved text.
   Proofread against the PDF before publishing.

   Transcription notes for the proofreader:
     · Point 8 of Part C is printed with stray Markdown emphasis in
       the source, "**五种方式（五路论证）**", which is reproduced
       here without the asterisks, as the note plainly intends the
       phrase itself and not the marks. Flag this to the Commission.
     · The Mandarin note cites the Catechism as 《天主教教理》27-28
       in point 5 and 教理150 in point 9, and does not carry Part C
       point 10's scripture reference (Ep 1:9, 2:18) that the English
       note prints. Both are reproduced exactly as printed.
     · The Mandarin note gives St Thomas Aquinas no birth or death
       dates, so those two rows are absent here.

   Journal ids and question counts MUST match content/topics/en/
   topic-01.js.
   ============================================================ */

window.RCIA = window.RCIA || {};
window.RCIA.topics = window.RCIA.topics || {};
window.RCIA.topics.zh = window.RCIA.topics.zh || {};

window.RCIA.topics.zh[1] = {
  topic: 1,
  session: 2,
  period: 'A',
  lang: 'zh',
  template: 'standard',
  title: '我们对生命意义的追寻，以及我们认识天主的能力',
  topicQuestion: '为什么要参加慕道班？',
  status: 'draft',

  parts: [
    /* -------------------------------------------------- A */
    {
      letter: 'A',
      name: '生活经验',
      blocks: [
        { type: 'label', text: '导言：' },
        { type: 'lead', text: '人们追寻身份的理由多种多样，包括归属感、自我理解以及与他人的联系。建立身份感有助于个人理解自己是谁、自己的价值观是什么，以及自己在周围世界中的位置。一个人的身份可以由文化、家庭、经历和个人信念等多种因素塑造。它还为做出选择、建立关系和寻找人生目的提供了一个框架。' },
        {
          type: 'journal',
          id: 'A',
          prompt: '需要反思和分享的问题：',
          questions: [
            { n: '1.', text: '是什么赋予了我生命的意义？' },
            { n: '2.', text: '我在追寻什么？我在哪里找到了它？' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- B */
    {
      letter: 'B',
      name: '圣经',
      ref: '若望福音 1:35-51',
      passage: 'John 1',
      blocks: [
        {
          type: 'pericope',
          cite: '圣经：若望福音1:35-51 - 耶稣的首批门徒',
          passage: 'John 1',
          instruction: '阅读经文并准备回答以下问题：'
        },
        {
          type: 'journal',
          id: 'B',
          questions: [
            { n: '1.', text: '若望福音 1:35-51 发生了什么事情？' },
            { n: '2.', text: '若望福音 1:35-42 的教训是什么？' },
            { n: '3.', text: '若望福音 1:35-36 的意义是什么？' }
          ]
        }
      ]
    },

    /* -------------------------------------------------- C */
    {
      letter: 'C',
      name: '今日主题',
      ref: '我们对生命意义的追寻，以及我们认识天主的能力',
      blocks: [
        {
          type: 'points',
          items: [
            {
              title: '什么是生命？', joiner: ' ',
              body: '生命包含许多事物--对快乐、爱、平安、权力的渴望等等。生命的意义往往因人而异（目的），因为生命是一种现象--一个随着价值、情绪、处境等不断变化的变量。人类对生命的意义有着永无止境的渴望。'
            },
            {
              title: '为什么生命有时显得毫无意义？', joiner: ' ',
              body: '当我们迷失目标，或者当没有新事物能吸引我们的兴趣时，生命有时会显得毫无意义。'
            },
            {
              title: '爱是满足人心灵的最高美善', joiner: '--',
              body: '“爱”是我们所能追求的终极和最高目标，我们的救赎是通过爱并在爱中实现的。'
            },
            {
              title: '自我实现只有作为“自我超越”的副作用才有可能实现。', joiner: ' ',
              body: '我们越是通过投身于服务某项使命或爱另一个人来忘记自己，就越能实现自我。'
            },
            {
              title: '我们认识天主的能力召叫我们去寻找天主（《天主教教理》27-28）：', joiner: ' ',
              body: '天主在每个人心中都植下了对祂的渴望。这种渴望铭刻在人心深处，以促进我们的寻找，而天主从未停止吸引我们走向祂。我们蒙召与天主交谈，并与祂共融。',
              marginal: { mark: '教理', text: '27–28, 对天主的渴望铭刻在人心深处。' }
            },
            {
              title: '在生活中发现天主：', joiner: ' ',
              body: '人类天生拥有道德良知，并借着良心询问天主的存在。这表明人类拥有直接来自天主的属灵灵魂（永恒的种子）。'
            },
            {
              title: '人类理性在认识天主中的作用：', joiner: ' ',
              body: '我们通过一系列汇聚且具有说服力的论证来了解天主的存在，这些论证为我们提供了认识天主的途径。这些证据存在于物质世界和我们的内心世界中。'
            },
            {
              title: '天主存在的证据：', joiner: ' ',
              body: '根据圣多玛斯·阿奎纳（St Thomas Aquinas），天主的存在可以通过五种方式（五路论证）来证明。'
            },
            {
              title: '信德是认识天主的第二条途径：', joiner: ' ',
              body: '信德是相信你无法证明的事物，是相信你无法用五官去证实的事物。信德是一种自由的人类行为，是一种个人且团体的关系。“信德首先是人对天主的个人依附。。。它也是对天主所启示的全部真理的自由认同”（教理150）。',
              marginal: { mark: '教理', text: '150, 信德是人对天主的个人依附，也是对祂所启示真理的自由认同。' }
            },
            {
              title: '天主对人类的启示：', joiner: ' ',
              body: '天主通过派遣祂的圣子耶稣基督和圣神，揭示了祂的永恒计划。天主希望全人类都能通过基督，在圣神内接近祂。'
            }
          ]
        }
      ]
    },

    /* -------------------------------------------------- D */
    {
      letter: 'D',
      name: '主题圣人',
      blocks: [
        {
          type: 'saint',
          name: '圣多玛斯·阿奎纳',
          alsoKnown: 'St Thomas Aquinas',
          monogram: 'T',
          image: null,
          imageCaption: null,
          facts: [
            { label: '庆日', value: '1月28日' },
            { label: '主保', value: '学生及所有大学。' }
          ],
          paragraphs: [
            '阿奎纳是意大利道明会会士、司铎，是极具影响力的哲学家和神学家。他是教会最伟大的神学家之一，“教会圣师”，也是天主教理性与神圣启示传统的杰出代言人。',
            '他的代表作是《神学大全》（Summa Theologica），其中包含了著名的“五路论证”：'
          ],
          list: [
            '第一路：天主，第一推动者 (The Prime Mover)',
            '第二路：天主，第一因 (The First Cause)',
            '第三路：天主，必然存在者 (The Necessary Being)',
            '第四路：天主，绝对存在者 (The Absolute Being)',
            '第五路：天主，伟大的设计者 (The Grand Designer)。'
          ],
          listStyle: 'numbered',
          sources: [
            'https://www.franciscanmedia.org/saint-of-the-day/saint-thomas-aquinas/',
            'https://www.catholic.org/saints/saint.php?saint_id=2530'
          ]
        }
      ]
    },

    /* -------------------------------------------------- E */
    {
      letter: 'E',
      name: '个人活动与反思',
      ref: '与天主同行',
      blocks: [
        { type: 'para', text: '活动：去散散步，观察周围的事物：自然、空中的飞鸟、遇见的人。' },
        {
          type: 'list',
          items: [
            '尝试在每一件受造物中看到天主的手迹。',
            '尝试推考你所见之物的目的。',
            '赞美你所见之物的美丽并感谢天主，因为每一件受造物，就像你一样，都有其存在的理由和目的。'
          ]
        },
        { type: 'label', text: '反思我们的经验：' },
        {
          type: 'versicle',
          text: '“上主造万物，各有所用。”',
          ref: '箴言 16:4',
          passage: 'Proverbs 16'
        },
        { type: 'para', text: '闭上眼睛，反思这段话。感谢天主赐予生命中所有美好的事物，从你自己开始，并为你觉得不好或令人困扰的事物祈祷。在赞美和感谢中感受天主的爱。' },
        {
          type: 'journal',
          id: 'E',
          prompt: '你与天主同行的散步, 写下你所见到的，以及你所献上的感恩祷词。',
          questions: [
            { n: '❧', text: '我在散步时看见了什么？我推想出它有什么目的？' },
            { n: '❧', text: '我简短的感恩祷词。' }
          ]
        },
        {
          type: 'prayer',
          label: '祷词',
          lines: [
            '天父，感谢祢爱我，感谢祢创造了万物。求祢赐给我恩宠去认识祢、爱祢，并明了祢在我身上的旨意。',
            '请帮助我欣赏自然以及祢安排在我生命旅途中的人们。',
            '因耶稣之名祈祷。阿门。'
          ]
        }
      ]
    }
  ]
};
