/* ============================================================
   THE EMMAUS COMPANION: Languages
   Penang Diocesan Catechetical Commission

   The candidate chooses a language on the journey map and the whole
   app follows: the chrome below, the session notes under
   content/topics/<code>/, the Word document, and the typeface.

   Two rules govern what may live in this file.

   1. Only the APP'S OWN words are translated here: buttons, notices,
      headings the app invents. The teaching text of a session note is
      never translated by this app: it is transcribed from the note the
      Commission approved in that language, and lives in
      content/topics/<code>/topic-NN.js.

   2. The period names under `periods` are navigation labels rendered
      from the syllabus schema, which exists in English only. They are
      the app's translations and are marked for the Commission to
      check. See the note in README.md.

   Adding a language: add an entry to LANGS, a block to STRINGS with
   every key the English block has (check-content.js enforces this),
   the font stack in assets/css/lang.css, and the topic files.
   ============================================================ */

var Lang = (function () {
  'use strict';

  /* code:    what preferences and folder names use
     endonym: the language's name in itself, as it is offered
     html:    the BCP-47 tag put on <html lang>
     locale:  what Intl is asked for when a date is written out
     webfont: the Google Fonts family fetched on demand, if any    */
  var LANGS = [
    { code: 'en', endonym: 'English',         english: 'English',         html: 'en',      locale: 'en-MY', webfont: null },
    { code: 'ms', endonym: 'Bahasa Malaysia', english: 'Bahasa Malaysia', html: 'ms',      locale: 'ms-MY', webfont: null },
    { code: 'zh', endonym: '华语',    english: 'Mandarin',        html: 'zh-Hans', locale: 'zh-CN', webfont: 'Noto+Serif+SC:wght@400;600' },
    { code: 'ta', endonym: 'தமிழ்', english: 'Tamil', html: 'ta', locale: 'ta-IN', webfont: 'Noto+Serif+Tamil:wght@400;500;600' }
  ];

  var DEFAULT = 'en';

  var STRINGS = {

    /* ==================================================== English */
    en: {
      brand: 'Penang Diocesan Catechetical Commission',
      eyebrow: 'Rite of Christian Initiation of Adults · Diocese of Penang',
      appTitle: 'The Emmaus Companion',
      deck: '“Were not our hearts burning within us while he was talking to us on the road, while he was opening the scriptures to us?” Forty-two stops on one road, from first questions to the day you are sent.',

      langLabel: 'Language',
      langChoose: 'Choose the language of your session notes',
      themeDaylight: '☀ Daylight',
      themeCompline: '☾ Compline',
      themeToDark: 'Switch to the candlelit theme',
      themeToLight: 'Switch to the daylight theme',
      typeReading: 'A Reading size',
      typeLarger: 'A Larger',
      typeLargest: 'A Largest',

      periods: {
        A: { name: 'Why be a Catholic?', stage: 'Evangelization · 6 lessons' },
        B: { name: 'How to Become & Live as a Catholic?', stage: 'Precatechumenate & Catechumenate · 20 lessons' },
        C: { name: 'How to Deepen Your Life as a Catholic?', stage: 'Purification & Enlightenment · 5 lessons' },
        D: { name: 'How to Become an Evangelizing Catholic?', stage: 'Mystagogy · 6 lessons' }
      },
      legendA: 'Evangelization',
      legendB: 'Catechumenate',
      legendC: 'Purification',
      legendD: 'Mystagogy',
      legendRites: '✠ the Rites',

      open: 'Open',
      briefing: 'Briefing',
      reflections: '{n} reflections',
      reflection1: '1 reflection',
      comingLater: 'Phase II',
      englishOnly: 'In English',

      journalHeading: 'Your journal',
      journalEmpty: 'Nothing is written yet. Open a session and begin. Whatever you write stays on this device, and you save it as a Word document when you are done.',
      journalSummary: 'You have written {reflections} across {topics}. Remember to save each session as a Word document. That is the copy that stays with you.',
      topicsCount: '{n} topics',
      topics1: '1 topic',
      saintsTitle: 'The Saints of the Journey',
      saintsDeck: 'A saint stands beside almost every topic on the road. Here they are together, set out by the day the Church keeps their feast, so a name half-remembered can be found again.',
      saint1: '1 saint',
      saintsCount: '{n} saints',
      saintsSummary: '{saints}, one for each topic that names one.',
      saintsNoFeast: 'The note gives no feast day',
      saintsLink: 'The Saints',
      saintsEmpty: 'No saint is named in the notes yet.',
      patronLabel: 'patron',
      prayersTitle: 'Prayers of the Journey',
      prayersDeck: 'The prayers the notes set down, gathered in the order you meet them, for the days between one session and the next.',
      prayer1: '1 prayer',
      prayersCount: '{n} prayers',
      prayersSummary: '{prayers}, as the notes print them.',
      prayersLink: 'The Prayers',
      prayersEmpty: 'No prayer is set down in the notes yet.',
      topicLine: 'Topic {n}: {title}',

      colophonNotes: 'The session notes are reproduced from those approved for publication by the Penang Diocesan Catechetical Commission.',
      colophonImprimatur: 'Imprimatur: ✠ Cardinal Sebastian Francis, Bishop of Penang, 31 May 2026 (PKK/BCR/2026/05/705).',
      colophonSession: 'The text of this session is reproduced from the notes approved for publication by the Penang Diocesan Catechetical Commission. Imprimatur: ✠ Cardinal Sebastian Francis, Bishop of Penang, 31 May 2026.',
      colophonTranslated: 'The session notes are the text approved in this language. The names of the four periods and the wording of the app itself are the app’s own, and await the Commission’s check.',
      amdg: 'Ad Maiorem Dei Gloriam',

      notFoundTitle: 'There is no Topic {n}',
      notFoundNone: 'No topic was chosen',
      notFoundBody: 'The session notes run from Topic {first} to Topic {last}. Check the number, or go back to the journey and choose a session.',
      topicName: 'Topic {n}',
      backToJourney: 'Return to the journey',

      topicNo: 'Topic {n}',
      themeLine: 'Theme: {theme}',
      fallbackNotice: 'This session’s notes have not been transcribed into {language} yet. The approved English text is below. Whatever you write is kept, and will still be there when the {language} notes arrive.',

      sealPrivacy: 'Whatever you write below is saved on this device alone. It is never sent anywhere, and no one else can read it unless you save it as a Word document and choose to share it.',
      sealNoStorage: 'This browser is not allowing anything to be saved (private browsing may be switched on). You may still write and save a Word document, but your words will be lost when you close this page.',

      readChapter: 'Read {chapter} in the {bible} ↗',
      readChapterTitle: 'Read {chapter} in the {bible} (opens in a new tab)',
      readMore: 'Read more: ',
      pictureTitle: 'The picture',
      pictureNote: 'This picture is printed in the session note. To place it in the app, save it as {file} and name that file in the topic content.',

      writeHere: 'Write here…',
      yourReflection: 'Your reflection: {question}',

      exportHeading: 'Save your reflections',
      exportBody: 'Your answers become a Word document, made here on your device and saved straight to it. Nothing is sent anywhere.',
      yourName: 'Your name',
      namePlaceholder: 'e.g. Teresa Lim',
      sessionDate: 'Session date',
      saveWord: '⤓  Save as Word document',
      printSession: 'Print this session',
      savedAt: 'Saved on this device · {time}',
      saveRefused: 'This browser would not let your writing be saved.',
      savedFile: 'Saved “{file}” to your device. {wrote} of {total} reflections written.',
      savedFileBlank: 'Saved “{file}”. The questions are there, ready for you to write.',
      exportFailed: 'The document could not be made on this device. Try the Print button instead, and choose “Save as PDF”.',

      prevTopic: 'Previous',
      nextTopic: 'Next',
      theJourney: 'The journey',
      allSessions: 'All sessions',
      backLink: '← The journey',

      /* the Word document */
      docSubtitle: 'RCIA · Journal of the Journey',
      docName: 'Name: {name}',
      docTopic: 'Topic {n} · Period {letter}: {period}',
      docSessionDate: 'Session date: {date}',
      docSaved: 'Saved {date}',
      docNotWritten: '(not yet written)',
      docClosingPrayer: 'Closing prayer',
      docClosingPrayerLabelled: '{label}: closing prayer',
      docCandidate: 'RCIA Candidate',
      docFooter: 'Ad maiorem Dei gloriam',
      docLanguageNote: 'Session note in English (not yet translated).'
    },

    /* ============================================ Bahasa Malaysia */
    ms: {
      brand: 'Suruhanjaya Kateketikal Keuskupan Pulau Pinang',
      eyebrow: 'Inisiasi Kristian Dewasa · Keuskupan Pulau Pinang',
      appTitle: 'Pendamping Emaus',
      deck: '“Bukankah hati kita berkobar-kobar ketika Dia berbicara dengan kita di jalan dan menerangkan Kitab Suci kepada kita?” Empat puluh dua perhentian di satu jalan, dari soalan pertama sehingga hari anda diutus.',

      langLabel: 'Bahasa',
      langChoose: 'Pilih bahasa nota sesi anda',
      themeDaylight: '☀ Siang',
      themeCompline: '☾ Malam',
      themeToDark: 'Tukar kepada tema malam',
      themeToLight: 'Tukar kepada tema siang',
      typeReading: 'A Saiz bacaan',
      typeLarger: 'A Lebih besar',
      typeLargest: 'A Paling besar',

      periods: {
        A: { name: 'Mengapa menjadi seorang Katolik?', stage: 'Evangelisasi · 6 pelajaran' },
        B: { name: 'Bagaimana menjadi dan hidup sebagai seorang Katolik?', stage: 'Prakatekumenat & Katekumenat · 20 pelajaran' },
        C: { name: 'Bagaimana mendalami hidup anda sebagai seorang Katolik?', stage: 'Penyucian & Pencerahan · 5 pelajaran' },
        D: { name: 'Bagaimana menjadi seorang Katolik yang mewartakan Injil?', stage: 'Mistagogi · 6 pelajaran' }
      },
      legendA: 'Evangelisasi',
      legendB: 'Katekumenat',
      legendC: 'Penyucian',
      legendD: 'Mistagogi',
      legendRites: '✠ Upacara-upacara',

      open: 'Buka',
      briefing: 'Taklimat',
      reflections: '{n} renungan',
      reflection1: '1 renungan',
      comingLater: 'Fasa II',
      englishOnly: 'Dalam bahasa Inggeris',

      journalHeading: 'Jurnal anda',
      journalEmpty: 'Belum ada apa-apa yang ditulis. Bukalah satu sesi dan mulakan. Apa sahaja yang anda tulis kekal pada peranti ini, dan anda menyimpannya sebagai dokumen Word apabila selesai.',
      journalSummary: 'Anda telah menulis {reflections} merentasi {topics}. Ingatlah untuk menyimpan setiap sesi sebagai dokumen Word. Itulah salinan yang kekal bersama anda.',
      topicsCount: '{n} topik',
      topics1: '1 topik',
      saintsTitle: 'Para Kudus dalam Perjalanan',
      saintsDeck: 'Seorang kudus berdiri di sisi hampir setiap topik di sepanjang jalan ini. Di sini mereka dikumpulkan, disusun mengikut hari Gereja merayakan pesta mereka, supaya nama yang separuh diingati dapat ditemui semula.',
      saint1: '1 orang kudus',
      saintsCount: '{n} orang kudus',
      saintsSummary: '{saints}, satu bagi setiap topik yang menamakannya.',
      saintsNoFeast: 'Nota tidak menyatakan hari pesta',
      saintsLink: 'Para Kudus',
      saintsEmpty: 'Belum ada orang kudus dinamakan dalam nota.',
      patronLabel: 'penaung',
      prayersTitle: 'Doa-doa Perjalanan',
      prayersDeck: 'Doa-doa yang ditetapkan dalam nota, dikumpulkan mengikut urutan anda menemuinya, untuk hari-hari antara satu sesi dengan sesi berikutnya.',
      prayer1: '1 doa',
      prayersCount: '{n} doa',
      prayersSummary: '{prayers}, sebagaimana tercetak dalam nota.',
      prayersLink: 'Doa-doa',
      prayersEmpty: 'Belum ada doa ditetapkan dalam nota.',
      topicLine: 'Topik {n}: {title}',

      colophonNotes: 'Nota sesi ini diterbitkan semula daripada nota yang diluluskan untuk penerbitan oleh Suruhanjaya Kateketikal Keuskupan Pulau Pinang.',
      colophonImprimatur: 'Imprimatur: ✠ Kardinal Sebastian Francis, Uskup Pulau Pinang, 31 Mei 2026 (PKK/BCR/2026/05/705).',
      colophonSession: 'Teks sesi ini diterbitkan semula daripada nota yang diluluskan untuk penerbitan oleh Suruhanjaya Kateketikal Keuskupan Pulau Pinang. Imprimatur: ✠ Kardinal Sebastian Francis, Uskup Pulau Pinang, 31 Mei 2026.',
      colophonTranslated: 'Nota sesi ialah teks yang diluluskan dalam bahasa ini. Nama empat tempoh dan perkataan aplikasi ini sendiri adalah milik aplikasi, dan masih menunggu semakan Suruhanjaya.',
      amdg: 'Ad Maiorem Dei Gloriam',

      notFoundTitle: 'Tiada Topik {n}',
      notFoundNone: 'Tiada topik dipilih',
      notFoundBody: 'Nota sesi bermula daripada Topik {first} hingga Topik {last}. Sila semak nombor itu, atau kembali ke perjalanan dan pilih satu sesi.',
      topicName: 'Topik {n}',
      backToJourney: 'Kembali ke perjalanan',

      topicNo: 'Topik {n}',
      themeLine: 'Tema: {theme}',
      fallbackNotice: 'Nota sesi ini belum ditranskripsi ke dalam {language}. Teks bahasa Inggeris yang diluluskan ada di bawah. Apa sahaja yang anda tulis akan disimpan, dan masih ada apabila nota {language} tiba.',

      sealPrivacy: 'Apa sahaja yang anda tulis di bawah disimpan pada peranti ini sahaja. Ia tidak pernah dihantar ke mana-mana, dan tiada sesiapa boleh membacanya melainkan anda menyimpannya sebagai dokumen Word dan memilih untuk berkongsi.',
      sealNoStorage: 'Pelayar ini tidak membenarkan apa-apa disimpan (mungkin mod pelayaran peribadi dihidupkan). Anda masih boleh menulis dan menyimpan dokumen Word, tetapi tulisan anda akan hilang apabila halaman ini ditutup.',

      readChapter: 'Baca {chapter} dalam {bible} ↗',
      readChapterTitle: 'Baca {chapter} dalam {bible} (dibuka dalam tab baharu)',
      readMore: 'Baca lanjut: ',
      pictureTitle: 'Gambar',
      pictureNote: 'Gambar ini dicetak dalam nota sesi. Untuk meletakkannya dalam aplikasi, simpan gambar sebagai {file} dan namakan fail itu dalam kandungan topik.',

      writeHere: 'Tulis di sini…',
      yourReflection: 'Renungan anda: {question}',

      exportHeading: 'Simpan renungan anda',
      exportBody: 'Jawapan anda menjadi sebuah dokumen Word, dibuat di sini pada peranti anda dan disimpan terus padanya. Tiada apa-apa dihantar ke mana-mana.',
      yourName: 'Nama anda',
      namePlaceholder: 'cth. Teresa Lim',
      sessionDate: 'Tarikh sesi',
      saveWord: '⤓  Simpan sebagai dokumen Word',
      printSession: 'Cetak sesi ini',
      savedAt: 'Disimpan pada peranti ini · {time}',
      saveRefused: 'Pelayar ini tidak membenarkan tulisan anda disimpan.',
      savedFile: 'Menyimpan “{file}” ke peranti anda. {wrote} daripada {total} renungan ditulis.',
      savedFileBlank: 'Menyimpan “{file}”. Soalan-soalannya ada di situ, sedia untuk anda tulis.',
      exportFailed: 'Dokumen tidak dapat dihasilkan pada peranti ini. Cuba butang Cetak, dan pilih “Simpan sebagai PDF”.',

      prevTopic: 'Sebelum ini',
      nextTopic: 'Seterusnya',
      theJourney: 'Perjalanan',
      allSessions: 'Semua sesi',
      backLink: '← Perjalanan',

      docSubtitle: 'IKD · Jurnal Perjalanan',
      docName: 'Nama: {name}',
      docTopic: 'Topik {n} · Tempoh {letter}: {period}',
      docSessionDate: 'Tarikh sesi: {date}',
      docSaved: 'Disimpan {date}',
      docNotWritten: '(belum ditulis)',
      docClosingPrayer: 'Doa penutup',
      docClosingPrayerLabelled: '{label}: doa penutup',
      docCandidate: 'Calon IKD',
      docFooter: 'Ad maiorem Dei gloriam',
      docLanguageNote: 'Nota sesi dalam bahasa Inggeris (belum diterjemahkan).'
    },

    /* =================================================== Mandarin */
    zh: {
      brand: '槟城教区教理委员会',
      eyebrow: '成人入门圣事礼典 · 槟城教区',
      appTitle: '厄玛乌斯同行',
      deck: '“当他在路上与我们谈话，给我们讲解圣经的时候，我们的心不是火热的吗？”一条路上的四十二站，从最初的疑问，直到你被派遣的那一天。',

      langLabel: '语言',
      langChoose: '选择你的课程讲义语言',
      themeDaylight: '☀ 日光',
      themeCompline: '☾ 夜祷',
      themeToDark: '切换到烛光主题',
      themeToLight: '切换到日光主题',
      typeReading: 'A 阅读字号',
      typeLarger: 'A 较大',
      typeLargest: 'A 最大',

      periods: {
        A: { name: '为什么要成为天主教徒？', stage: '福传 · 6 课' },
        B: { name: '如何成为并活出天主教徒的生活？', stage: '慕道前期与慕道期 · 20 课' },
        C: { name: '如何深化你的天主教徒生活？', stage: '净化与光照期 · 5 课' },
        D: { name: '如何成为传福音的天主教徒？', stage: '奥迹期 · 6 课' }
      },
      legendA: '福传',
      legendB: '慕道期',
      legendC: '净化',
      legendD: '奧迹期',
      legendRites: '✠ 各项礼仪',

      open: '打开',
      briefing: '说明',
      reflections: '{n} 篇反思',
      reflection1: '1 篇反思',
      comingLater: '第二阶段',
      englishOnly: '英文版',

      journalHeading: '你的札记',
      journalEmpty: '还没有写下任何内容。打开一课就可以开始。你所写的一切都留在这部装置上，写完后再存成 Word 文件。',
      journalSummary: '你已在 {topics} 中写下 {reflections}。记得把每一课都存成 Word 文件。那才是留在你身边的一份。',
      topicsCount: '{n} 个主题',
      topics1: '1 个主题',
      saintsTitle: '旅程中的圣人',
      saintsDeck: '路上几乎每一个主题旁都站着一位圣人。此处将他们汇集一处，按教会庆祝其庆日的日期排列，让依稀记得的名字得以重寻。',
      saint1: '1 位圣人',
      saintsCount: '{n} 位圣人',
      saintsSummary: '{saints}，每一个提及圣人的主题各有一位。',
      saintsNoFeast: '讲义未列出庆日',
      saintsLink: '圣人',
      saintsEmpty: '讲义中尚未提及任何圣人。',
      patronLabel: '主保',
      prayersTitle: '旅程中的祷词',
      prayersDeck: '讲义所列出的祷词，按您遇见的次序汇集于此，供两次聚会之间的日子诵念。',
      prayer1: '1 篇祷词',
      prayersCount: '{n} 篇祷词',
      prayersSummary: '{prayers}，一如讲义所印。',
      prayersLink: '祷词',
      prayersEmpty: '讲义中尚未列出任何祷词。',
      topicLine: '主题 {n}：{title}',

      colophonNotes: '课程讲义转载自槟城教区教理委员会核准出版的讲义。',
      colophonImprimatur: '出版许可：✠ 沈保禄枢机，槟城教区主教，2026 年 5 月 31 日（PKK/BCR/2026/05/705）。',
      colophonSession: '本课文本转载自槟城教区教理委员会核准出版的讲义。出版许可：✠ 沈保禄枢机，槟城教区主教，2026 年 5 月 31 日。',
      colophonTranslated: '课程讲义为本语言中获核准的文本。四个阶段的名称以及应用程式本身的用语出自本应用程式，仍待委员会审核。',
      amdg: 'Ad Maiorem Dei Gloriam',

      notFoundTitle: '没有主题 {n}',
      notFoundNone: '未选择主题',
      notFoundBody: '课程讲义涵盖主题 {first} 至主题 {last}。请检查号码，或返回旅程选择一课。',
      topicName: '主题 {n}',
      backToJourney: '返回旅程',

      topicNo: '主题 {n}',
      themeLine: '主题思想：{theme}',
      fallbackNotice: '本课讲义尚未转录成{language}。下方是获核准的英文本。你所写的一切都会保留，{language}讲义推出后仍在。',

      sealPrivacy: '你在下方写的一切只存在这部装置上。它不会被送往任何地方，除非你把它存成 Word 文件并选择分享，否则没有人能读到。',
      sealNoStorage: '此浏览器不允许储存任何内容（可能开启了无痕浏览）。你仍可书写并储存 Word 文件，但关闭本页后文字将会遗失。',

      readChapter: '在《{bible}》阅读{chapter} ↗',
      readChapterTitle: '在《{bible}》阅读{chapter}（在新分页开启）',
      readMore: '延伸阅读：',
      pictureTitle: '图像',
      pictureNote: '此图像印在课程讲义中。若要放入应用程式，请将图片存为 {file}，并在主题内容中指明该档案。',

      writeHere: '在此书写…',
      yourReflection: '你的反思：{question}',

      exportHeading: '保存你的反思',
      exportBody: '你的答案会成为一份 Word 文件，就在你的装置上生成并直接存到装置里。不会传送到任何地方。',
      yourName: '你的姓名',
      namePlaceholder: '例如：林德兰',
      sessionDate: '上课日期',
      saveWord: '⤓  存成 Word 文件',
      printSession: '列印本课',
      savedAt: '已存于此装置 · {time}',
      saveRefused: '此浏览器不允许保存你的书写。',
      savedFile: '已将“{file}”存到你的装置。共 {total} 题中已写 {wrote} 题。',
      savedFileBlank: '已保存“{file}”。题目都在，等你书写。',
      exportFailed: '无法在此装置上生成文件。请改用列印按钮，并选择“另存为 PDF”。',

      prevTopic: '上一课',
      nextTopic: '下一课',
      theJourney: '旅程',
      allSessions: '全部课程',
      backLink: '← 旅程',

      docSubtitle: '成人慕道 · 旅程札记',
      docName: '姓名：{name}',
      docTopic: '主题 {n} · 阶段 {letter}：{period}',
      docSessionDate: '上课日期：{date}',
      docSaved: '保存于 {date}',
      docNotWritten: '（尚未书写）',
      docClosingPrayer: '结束祷词',
      docClosingPrayerLabelled: '{label}：结束祷词',
      docCandidate: '慕道者',
      docFooter: 'Ad maiorem Dei gloriam',
      docLanguageNote: '本课讲义为英文（尚未翻译）。'
    },

    /* ====================================================== Tamil */
    ta: {
      brand: 'பினாங்கு மறைமாவட்ட மறைக்கல்வி ஆணையம்',
      eyebrow: 'பெரியோர் கிறிஸ்தவ அருட்பொழிவு · பினாங்கு மறைமாவட்டம்',
      appTitle: 'எம்மாவு துணைவர்',
      deck: '“வழியில் அவர் நம்மோடு பேசியபோதும், மறைநூலை நமக்கு விளக்கியபோதும், நம் உள்ளம் பற்றி எரியவில்லையா?” ஒரே பாதையில் நாற்பத்திரண்டு நிறுத்தங்கள்: முதல் வினாக்களிலிருந்து நீங்கள் அனுப்பப்படும் நாள்வரை.',

      langLabel: 'மொழி',
      langChoose: 'உங்கள் அமர்வுக் குறிப்புகளின் மொழியைத் தேர்ந்தெடுங்கள்',
      themeDaylight: '☀ பகல்',
      themeCompline: '☾ இரவு',
      themeToDark: 'இரவு வண்ணத்திற்கு மாற்று',
      themeToLight: 'பகல் வண்ணத்திற்கு மாற்று',
      typeReading: 'A வாசிப்பு அளவு',
      typeLarger: 'A பெரியது',
      typeLargest: 'A மிகப் பெரியது',

      periods: {
        A: { name: 'ஏன் கத்தோலிக்கராக இருக்க வேண்டும்?', stage: 'நற்செய்தி அறிவிப்பு · 6 பாடங்கள்' },
        B: { name: 'கத்தோலிக்கராக மாறி வாழ்வது எப்படி?', stage: 'மறைக்கல்வி முன்னிலை மற்றும் மறைக்கல்வி · 20 பாடங்கள்' },
        C: { name: 'கத்தோலிக்க வாழ்வை ஆழப்படுத்துவது எப்படி?', stage: 'தூய்மைப்படுத்துதல் மற்றும் ஒளியூட்டல் · 5 பாடங்கள்' },
        D: { name: 'நற்செய்தி அறிவிக்கும் கத்தோலிக்கராக மாறுவது எப்படி?', stage: 'மறைபொருள் விளக்கம் · 6 பாடங்கள்' }
      },
      legendA: 'நற்செய்தி அறிவிப்பு',
      legendB: 'மறைக்கல்வி',
      legendC: 'தூய்மைப்படுத்தல்',
      legendD: 'மறைப்பொருள் விளக்கம்',
      legendRites: '✠ சடங்குகள்',

      open: 'திற',
      briefing: 'விளக்கம்',
      reflections: '{n} சிந்தனைகள்',
      reflection1: '1 சிந்தனை',
      comingLater: 'இரண்டாம் கட்டம்',
      englishOnly: 'ஆங்கிலத்தில்',

      journalHeading: 'உங்கள் குறிப்பேடு',
      journalEmpty: 'இன்னும் எதுவும் எழுதப்படவில்லை. ஓர் அமர்வைத் திறந்து தொடங்குங்கள். நீங்கள் எழுதுவது இந்தச் சாதனத்திலேயே இருக்கும்; முடித்ததும் அதை Word ஆவணமாகச் சேமிக்கலாம்.',
      journalSummary: '{topics} சேர்த்து {reflections} எழுதியுள்ளீர்கள். ஒவ்வோர் அமர்வையும் Word ஆவணமாகச் சேமிக்க மறவாதீர்கள்; உங்களோடு நிலைத்திருப்பது அந்த நகலே.',
      topicsCount: '{n} தலைப்புகளில்',
      topics1: '1 தலைப்பில்',
      saintsTitle: 'பயணத்தின் புனிதர்கள்',
      saintsDeck: 'பாதையில் ஏறக்குறைய ஒவ்வொரு தலைப்பின் அருகிலும் ஒரு புனிதர் நிற்கிறார். திருச்சபை அவர்களின் திருவிழாவைக் கொண்டாடும் நாளின்படி அவர்கள் இங்கே ஒன்றாகத் தொகுக்கப்பட்டுள்ளனர்; பாதி நினைவிலுள்ள ஒரு பெயரை மீண்டும் கண்டறியலாம்.',
      saint1: '1 புனிதர்',
      saintsCount: '{n} புனிதர்கள்',
      saintsSummary: '{saints}, புனிதரைக் குறிப்பிடும் ஒவ்வொரு தலைப்புக்கும் ஒருவர்.',
      saintsNoFeast: 'குறிப்பில் திருவிழா நாள் தரப்படவில்லை',
      saintsLink: 'புனிதர்கள்',
      saintsEmpty: 'குறிப்புகளில் இதுவரை எந்தப் புனிதரும் குறிப்பிடப்படவில்லை.',
      patronLabel: 'பாதுகாவலர்',
      prayersTitle: 'பயணத்தின் செபங்கள்',
      prayersDeck: 'குறிப்புகளில் தரப்பட்டுள்ள செபங்கள், நீங்கள் அவற்றைச் சந்திக்கும் வரிசையில்: ஒரு அமர்வுக்கும் அடுத்த அமர்வுக்கும் இடையிலான நாட்களுக்காக.',
      prayer1: '1 செபம்',
      prayersCount: '{n} செபங்கள்',
      prayersSummary: '{prayers}, குறிப்புகளில் அச்சிடப்பட்டவாறே.',
      prayersLink: 'செபங்கள்',
      prayersEmpty: 'குறிப்புகளில் இதுவரை எந்தச் செபமும் தரப்படவில்லை.',
      topicLine: 'தலைப்பு {n}: {title}',

      colophonNotes: 'அமர்வுக் குறிப்புகள், பினாங்கு மறைமாவட்ட மறைக்கல்வி ஆணையத்தால் வெளியிட ஒப்புதல் அளிக்கப்பட்டவற்றிலிருந்து மீள்பதிப்பு செய்யப்பட்டவை.',
      colophonImprimatur: 'இம்ப்ரிமாதூர்: ✠ கர்தினால் செபஸ்தியான் பிரான்சிஸ், பினாங்கு ஆயர், 31 மே 2026 (PKK/BCR/2026/05/705).',
      colophonSession: 'இந்த அமர்வின் உரை, பினாங்கு மறைமாவட்ட மறைக்கல்வி ஆணையத்தால் வெளியிட ஒப்புதல் அளிக்கப்பட்ட குறிப்புகளிலிருந்து மீள்பதிப்பு செய்யப்பட்டது. இம்ப்ரிமாதூர்: ✠ கர்தினால் செபஸ்தியான் பிரான்சிஸ், பினாங்கு ஆயர், 31 மே 2026.',
      colophonTranslated: 'அமர்வுக் குறிப்புகள் இந்த மொழியில் ஒப்புதல் பெற்ற உரையே. நான்கு காலங்களின் பெயர்களும் இந்தச் செயலியின் சொற்களும் செயலியுடையவை; ஆணையத்தின் சரிபார்ப்புக்குக் காத்திருக்கின்றன.',
      amdg: 'Ad Maiorem Dei Gloriam',

      notFoundTitle: 'தலைப்பு {n} இல்லை',
      notFoundNone: 'எந்தத் தலைப்பும் தேர்ந்தெடுக்கப்படவில்லை',
      notFoundBody: 'அமர்வுக் குறிப்புகள் தலைப்பு {first} முதல் தலைப்பு {last} வரை உள்ளன. எண்ணைச் சரிபார்க்கவும், அல்லது பயணத்திற்குத் திரும்பி ஓர் அமர்வைத் தேர்ந்தெடுக்கவும்.',
      topicName: 'தலைப்பு {n}',
      backToJourney: 'பயணத்திற்குத் திரும்பு',

      topicNo: 'தலைப்பு {n}',
      themeLine: 'கருப்பொருள்: {theme}',
      fallbackNotice: 'இந்த அமர்வின் குறிப்புகள் இன்னும் {language} மொழியில் படியெடுக்கப்படவில்லை. ஒப்புதல் பெற்ற ஆங்கில உரை கீழே உள்ளது. நீங்கள் எழுதுவது பாதுகாக்கப்படும்; {language} குறிப்புகள் வந்தபிறகும் அது அங்கேயே இருக்கும்.',

      sealPrivacy: 'கீழே நீங்கள் எழுதுவது இந்தச் சாதனத்தில் மட்டுமே சேமிக்கப்படுகிறது. அது எங்கும் அனுப்பப்படுவதில்லை; நீங்கள் அதை Word ஆவணமாகச் சேமித்துப் பகிர்ந்தாலொழிய வேறு யாரும் படிக்க முடியாது.',
      sealNoStorage: 'இந்த உலாவி எதையும் சேமிக்க அனுமதிக்கவில்லை (தனிப்பட்ட உலாவல் இயங்கிக் கொண்டிருக்கலாம்). நீங்கள் எழுதி Word ஆவணமாகச் சேமிக்க முடியும், ஆனால் இந்தப் பக்கத்தை மூடியதும் உங்கள் சொற்கள் இழக்கப்படும்.',

      readChapter: '{bible} நூலில் {chapter} படிக்க ↗',
      readChapterTitle: '{bible} நூலில் {chapter} படிக்க (புதிய தத்தலில் திறக்கும்)',
      readMore: 'மேலும் படிக்க: ',
      pictureTitle: 'படம்',
      pictureNote: 'இந்தப் படம் அமர்வுக் குறிப்பில் அச்சிடப்பட்டுள்ளது. செயலியில் சேர்க்க, படத்தை {file} எனச் சேமித்து, அந்தக் கோப்பைத் தலைப்பு உள்ளடக்கத்தில் குறிப்பிடுங்கள்.',

      writeHere: 'இங்கே எழுதுங்கள்…',
      yourReflection: 'உங்கள் சிந்தனை: {question}',

      exportHeading: 'உங்கள் சிந்தனைகளைச் சேமியுங்கள்',
      exportBody: 'உங்கள் பதில்கள் ஒரு Word ஆவணமாகும்: உங்கள் சாதனத்திலேயே உருவாக்கப்பட்டு, அதிலேயே சேமிக்கப்படும். எதுவும் எங்கும் அனுப்பப்படுவதில்லை.',
      yourName: 'உங்கள் பெயர்',
      namePlaceholder: 'எ.கா. தெரேசா லிம்',
      sessionDate: 'அமர்வு நாள்',
      saveWord: '⤓  Word ஆவணமாகச் சேமி',
      printSession: 'இந்த அமர்வை அச்சிடு',
      savedAt: 'இந்தச் சாதனத்தில் சேமிக்கப்பட்டது · {time}',
      saveRefused: 'உங்கள் எழுத்தைச் சேமிக்க இந்த உலாவி அனுமதிக்கவில்லை.',
      savedFile: '“{file}” உங்கள் சாதனத்தில் சேமிக்கப்பட்டது. {total}-ல் {wrote} சிந்தனைகள் எழுதப்பட்டுள்ளன.',
      savedFileBlank: '“{file}” சேமிக்கப்பட்டது. கேள்விகள் அங்கே உள்ளன, நீங்கள் எழுதத் தயார்.',
      exportFailed: 'இந்தச் சாதனத்தில் ஆவணத்தை உருவாக்க முடியவில்லை. அச்சிடு பொத்தானைப் பயன்படுத்தி “PDF ஆகச் சேமி” என்பதைத் தேர்ந்தெடுங்கள்.',

      prevTopic: 'முந்தையது',
      nextTopic: 'அடுத்தது',
      theJourney: 'பயணம்',
      allSessions: 'அனைத்து அமர்வுகளும்',
      backLink: '← பயணம்',

      docSubtitle: 'RCIA · பயணக் குறிப்பேடு',
      docName: 'பெயர்: {name}',
      docTopic: 'தலைப்பு {n} · காலம் {letter}: {period}',
      docSessionDate: 'அமர்வு நாள்: {date}',
      docSaved: '{date} அன்று சேமிக்கப்பட்டது',
      docNotWritten: '(இன்னும் எழுதப்படவில்லை)',
      docClosingPrayer: 'நிறைவுச் செபம்',
      docClosingPrayerLabelled: '{label}: நிறைவுச் செபம்',
      docCandidate: 'RCIA விண்ணப்பதாரர்',
      docFooter: 'Ad maiorem Dei gloriam',
      docLanguageNote: 'அமர்வுக் குறிப்பு ஆங்கிலத்தில் (இன்னும் மொழிபெயர்க்கப்படவில்லை).'
    }
  };

  /* ---------------- the chosen language ---------------- */

  function known(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) { return LANGS[i]; }
    }
    return null;
  }

  /* Emmaus owns the preferences file; this reads and writes only the
     one key it needs, so the two never fight over the same object. */
  function current() {
    var prefs = (typeof Emmaus !== 'undefined') ? Emmaus.readPrefs() : {};
    return known(prefs.lang) ? prefs.lang : DEFAULT;
  }

  function meta(code) { return known(code || current()) || known(DEFAULT); }

  function set(code) {
    if (!known(code)) { return current(); }
    var prefs = Emmaus.readPrefs();
    prefs.lang = code;
    Emmaus.writePrefs(prefs);
    apply(code);
    return code;
  }

  /* Put the choice on <html>, so the stylesheet can pick the typeface
     and assistive technology reads the page in the right voice. */
  function apply(code) {
    var lang = meta(code);
    document.documentElement.setAttribute('lang', lang.html);
    document.documentElement.setAttribute('data-lang', lang.code);
    ensureFont(lang);
  }

  /* Tamil and Chinese need a face the Latin stack has never carried.
     Their webfonts are large, so they are fetched only when chosen. */
  var fetched = {};

  function ensureFont(lang) {
    if (!lang.webfont || fetched[lang.code]) { return; }
    fetched[lang.code] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + lang.webfont + '&display=swap';
    document.head.appendChild(link);
  }

  /* ---------------- words ---------------- */

  function table(code) { return STRINGS[code || current()] || STRINGS[DEFAULT]; }

  /* t('topicNo', {n: 3}) -> "Topic 3". Falls back to English for a key a
     language has not filled in, and to the key itself if there is no
     such string at all, so a missing word is visible, never blank. */
  function t(key, vars, code) {
    var value = table(code)[key];
    if (value == null) { value = STRINGS[DEFAULT][key]; }
    if (value == null) { return key; }
    if (!vars) { return value; }
    return String(value).replace(/\{(\w+)\}/g, function (whole, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : whole;
    });
  }

  /* "3 reflections" / "1 reflection", in the language's own way. */
  function count(n, oneKey, manyKey, code) {
    return n === 1 ? t(oneKey, { n: n }, code) : t(manyKey, { n: n }, code);
  }

  function period(letter, code) {
    var block = table(code).periods || {};
    return block[letter] || (STRINGS[DEFAULT].periods || {})[letter] || { name: '', stage: '' };
  }

  /* A date written the way the language writes one. */
  function formatDate(date, code) {
    var lang = meta(code);
    try {
      return new Intl.DateTimeFormat(lang.locale,
        { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
      return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }
  }

  function formatTime(date, code) {
    var lang = meta(code);
    try {
      return new Intl.DateTimeFormat(lang.locale,
        { hour: 'numeric', minute: '2-digit' }).format(date);
    } catch (e) {
      var h = date.getHours(), m = date.getMinutes();
      var suffix = h >= 12 ? 'pm' : 'am';
      h = h % 12; if (h === 0) { h = 12; }
      return h + ':' + (m < 10 ? '0' : '') + m + suffix;
    }
  }

  /* ---------------- the chrome that sits in the HTML ----------------
     Elements carrying data-i18n are filled in on every page load, so
     index.html can hold readable English and still speak Tamil. */

  function paint(root) {
    var scope = root || document;
    var translated = current() !== DEFAULT;
    var nodes = scope.querySelectorAll('[data-i18n]');
    Array.prototype.forEach.call(nodes, function (node) {
      /* data-i18n-when="translated" marks a line that is only worth
         saying when the app is not speaking English, the note about
         which words are the Commission's and which are the app's. */
      if (node.getAttribute('data-i18n-when') === 'translated' && !translated) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      var key = node.getAttribute('data-i18n');
      var attr = node.getAttribute('data-i18n-attr');
      var text = t(key);
      if (attr) { node.setAttribute(attr, text); }
      else { node.textContent = text; }
    });
  }

  /* ---------------- the chooser ----------------
     One control, used large on the journey map and small in the top
     bar of a session. Each language is offered in its own script, so
     a candidate who reads no English can still find their own. */

  function mountPicker(container, options) {
    options = options || {};
    var chosen = current();

    var wrap = document.createElement('div');
    wrap.className = 'langpick' + (options.compact ? ' langpick--compact' : '');

    var label = document.createElement('p');
    label.className = 'langpick-label';
    label.id = 'langpick-label' + (options.compact ? '-c' : '');
    label.textContent = t(options.compact ? 'langLabel' : 'langChoose');
    wrap.appendChild(label);

    var group = document.createElement('div');
    group.className = 'langpick-group';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', label.id);

    LANGS.forEach(function (lang) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'langpick-btn';
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', lang.code === chosen ? 'true' : 'false');
      button.setAttribute('lang', lang.html);
      button.setAttribute('data-lang-code', lang.code);
      /* the tooltip names it in the reader's own language, so an
         unfamiliar script is never a dead end */
      button.title = lang.english;

      var name = document.createElement('span');
      name.className = 'langpick-name';
      name.textContent = lang.endonym;
      button.appendChild(name);

      button.addEventListener('click', function () {
        if (lang.code === current()) { return; }
        set(lang.code);
        /* Every heading, note and question on the page is drawn from
           the chosen language, so the page is rebuilt from the top.
           Anything typed is already saved against the topic, not the
           language, so nothing written is lost. */
        if (options.onChange) { options.onChange(lang.code); }
        else { window.location.reload(); }
      });

      group.appendChild(button);
    });

    wrap.appendChild(group);
    if (container) { container.appendChild(wrap); }
    return wrap;
  }

  return {
    languages: function () { return LANGS.slice(); },
    mountPicker: mountPicker,
    current: current,
    meta: meta,
    set: set,
    apply: apply,
    known: known,
    t: t,
    count: count,
    period: period,
    formatDate: formatDate,
    formatTime: formatTime,
    paint: paint,
    strings: STRINGS,
    DEFAULT: DEFAULT
  };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = Lang; }
