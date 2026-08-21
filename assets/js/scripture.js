/* ============================================================
   THE EMMAUS COMPANION: Scripture links
   Penang Diocesan Catechetical Commission

   Turns a reference as it is printed in the notes; "John 6:52–63",
   "Lk 15:11-32", "Ep 1:9, 2:18", into a link to that chapter in a
   Bible the candidate can actually read, in their own language:

     English   New Jerusalem Bible      scrutatio.it
     Malay     Alkitab Versi Borneo     alkitabversiborneo.org
     Mandarin  思高本圣经 (Studium Biblicum)  ccccn.org
     Tamil     அருள்வாக்கு              arulvakku.com

   The New Jerusalem Bible is one of the two translations the syllabus
   itself recommends, which is why the English link goes there.

   Only the chapter is linked, never a verse range: a candidate lands
   on the right chapter and reads the passage from there. The Chinese
   edition puts a whole book on one page, so those links carry an
   anchor to reach the chapter; see `zhAnchor` below.

   The notes are not always tidy; Topic 29 is headed "Matthew The
   Parable of the Prodigal Son - Lk 15:11-32.", so the parser looks
   for the first book name that is actually followed by a chapter
   number, rather than trusting the first word it sees.

   A TRANSLATED note names its books in its own language, which this
   parser deliberately does not try to read: those content files carry
   an explicit English `passage` instead (see README.md). That keeps
   one parser, in one language, for every edition.
   ============================================================ */

var Scripture = (function () {
  'use strict';

  /* slug: this app's own name for the book.
     names: what the notes might call it, lower case, no dots. */
  var BOOKS = [
    { slug: 'genesis',        names: ['genesis', 'gen', 'gn'] },
    { slug: 'exodus',         names: ['exodus', 'exod', 'ex'] },
    { slug: 'leviticus',      names: ['leviticus', 'lev', 'lv'] },
    { slug: 'numbers',        names: ['numbers', 'num', 'nm'] },
    { slug: 'deuteronomy',    names: ['deuteronomy', 'deut', 'dt'] },
    { slug: 'joshua',         names: ['joshua', 'josh', 'jos'] },
    { slug: 'judges',         names: ['judges', 'judg', 'jgs'] },
    { slug: 'ruth',           names: ['ruth', 'ru'] },
    { slug: '1samuel',        names: ['1samuel', '1sam', '1sm'] },
    { slug: '2samuel',        names: ['2samuel', '2sam', '2sm'] },
    { slug: '1kings',         names: ['1kings', '1kgs', '1kg'] },
    { slug: '2kings',         names: ['2kings', '2kgs', '2kg'] },
    { slug: '1chronicles',    names: ['1chronicles', '1chr', '1chron'] },
    { slug: '2chronicles',    names: ['2chronicles', '2chr', '2chron'] },
    { slug: 'ezra',           names: ['ezra', 'ezr'] },
    { slug: 'nehemiah',       names: ['nehemiah', 'neh'] },
    { slug: 'tobit',          names: ['tobit', 'tob', 'tb'] },
    { slug: 'judith',         names: ['judith', 'jdt'] },
    { slug: 'esther',         names: ['esther', 'esth', 'est'] },
    { slug: '1maccabees',     names: ['1maccabees', '1macc', '1mc'] },
    { slug: '2maccabees',     names: ['2maccabees', '2macc', '2mc'] },
    { slug: 'job',            names: ['job', 'jb'] },
    { slug: 'psalms',         names: ['psalms', 'psalm', 'pss', 'ps'] },
    { slug: 'proverbs',       names: ['proverbs', 'prov', 'prv', 'pr'] },
    { slug: 'ecclesiastes',   names: ['ecclesiastes', 'eccl', 'eccles', 'qoheleth'] },
    { slug: 'songofsongs',    names: ['songofsongs', 'songofsolomon', 'song', 'sg'] },
    { slug: 'wisdom',         names: ['wisdom', 'wis'] },
    { slug: 'sirach',         names: ['sirach', 'sir', 'ecclesiasticus'] },
    { slug: 'isaiah',         names: ['isaiah', 'isa', 'is'] },
    /* 'Je' is the abbreviation the session notes themselves use. */
    { slug: 'jeremiah',       names: ['jeremiah', 'jer', 'je'] },
    { slug: 'lamentations',   names: ['lamentations', 'lam'] },
    { slug: 'baruch',         names: ['baruch', 'bar'] },
    { slug: 'ezekiel',        names: ['ezekiel', 'ezek', 'ez'] },
    { slug: 'daniel',         names: ['daniel', 'dan', 'dn'] },
    { slug: 'hosea',          names: ['hosea', 'hos'] },
    { slug: 'joel',           names: ['joel', 'jl'] },
    { slug: 'amos',           names: ['amos', 'am'] },
    { slug: 'obadiah',        names: ['obadiah', 'obad', 'ob'] },
    { slug: 'jonah',          names: ['jonah', 'jon'] },
    { slug: 'micah',          names: ['micah', 'mic', 'mi'] },
    { slug: 'nahum',          names: ['nahum', 'nah', 'na'] },
    { slug: 'habakkuk',       names: ['habakkuk', 'hab'] },
    { slug: 'zephaniah',      names: ['zephaniah', 'zeph', 'zep'] },
    { slug: 'haggai',         names: ['haggai', 'hag', 'hg'] },
    { slug: 'zechariah',      names: ['zechariah', 'zech', 'zec'] },
    { slug: 'malachi',        names: ['malachi', 'mal'] },

    { slug: 'matthew',        names: ['matthew', 'matt', 'mt'] },
    { slug: 'mark',           names: ['mark', 'mk', 'mrk'] },
    { slug: 'luke',           names: ['luke', 'lk', 'lu'] },
    { slug: 'john',           names: ['john', 'jn', 'joh'] },
    { slug: 'acts',           names: ['acts', 'actsoftheapostles', 'ac'] },
    { slug: 'romans',         names: ['romans', 'rom', 'rm'] },
    { slug: '1corinthians',   names: ['1corinthians', '1cor', '1co'] },
    { slug: '2corinthians',   names: ['2corinthians', '2cor', '2co'] },
    { slug: 'galatians',      names: ['galatians', 'gal'] },
    /* the notes use "Ep" for Ephesians, which is not the usual "Eph" */
    { slug: 'ephesians',      names: ['ephesians', 'eph', 'ep'] },
    { slug: 'philippians',    names: ['philippians', 'phil', 'php'] },
    { slug: 'colossians',     names: ['colossians', 'col'] },
    { slug: '1thessalonians', names: ['1thessalonians', '1thess', '1thes', '1th'] },
    { slug: '2thessalonians', names: ['2thessalonians', '2thess', '2thes', '2th'] },
    { slug: '1timothy',       names: ['1timothy', '1tim', '1tm'] },
    { slug: '2timothy',       names: ['2timothy', '2tim', '2tm'] },
    { slug: 'titus',          names: ['titus', 'ti', 'tit'] },
    { slug: 'philemon',       names: ['philemon', 'phlm', 'phm'] },
    { slug: 'hebrews',        names: ['hebrews', 'heb'] },
    { slug: 'james',          names: ['james', 'jas', 'jm'] },
    { slug: '1peter',         names: ['1peter', '1pet', '1pt'] },
    { slug: '2peter',         names: ['2peter', '2pet', '2pt'] },
    { slug: '1john',          names: ['1john', '1jn', '1jo'] },
    { slug: '2john',          names: ['2john', '2jn', '2jo'] },
    { slug: '3john',          names: ['3john', '3jn', '3jo'] },
    { slug: 'jude',           names: ['jude', 'jud'] },
    { slug: 'revelation',     names: ['revelation', 'rev', 'rv', 'apocalypse'] }
  ];

  /* ------------------------------------------------------------------
     Where each book lives in each edition, and what that edition calls
     it. Every id here was read off the site itself, not guessed;
     tools/check-bible-links.js fetches every one of them and fails if
     a page no longer holds the book it claims.

       en  the book's number in scrutatio's New Jerusalem Bible (1–73,
           the Catholic canon in its usual order)
       ms  Alkitab Versi Borneo's own id. AVB is a SIXTY-SIX book
           Bible: it has no deuterocanonical books, so those are 0
           here and simply do not become links in Malay.
       zh  the file in the 思高本, which is one file per book, except
           the Psalter, which it splits into its five traditional
           books, so that entry is a list of [from, to, file].
       ta  அருள்வாக்கு's own id (1–75; it counts the Greek Esther and
           the Daniel supplements separately, hence 75 and not 73).
     ------------------------------------------------------------------ */
  var EDITIONS = {
    genesis:        { en: 1,  ms: 141, zh: 'jiuyue/001', ta: 1,
                      name: { ms: 'Kejadian', zh: '创世纪', ta: 'தொடக்க நூல்' } },
    exodus:         { en: 2,  ms: 142, zh: 'jiuyue/002', ta: 2,
                      name: { ms: 'Keluaran', zh: '出谷纪', ta: 'விடுதலைப் பயணம்' } },
    leviticus:      { en: 3,  ms: 143, zh: 'jiuyue/003', ta: 3,
                      name: { ms: 'Imamat', zh: '肋未纪', ta: 'லேவியர்' } },
    numbers:        { en: 4,  ms: 144, zh: 'jiuyue/004', ta: 4,
                      name: { ms: 'Bilangan', zh: '户籍纪', ta: 'எண்ணிக்கை' } },
    deuteronomy:    { en: 5,  ms: 145, zh: 'jiuyue/005', ta: 5, zhAnchor: 'cn',
                      name: { ms: 'Ulangan', zh: '申命纪', ta: 'இணைச் சட்டம்' } },
    joshua:         { en: 6,  ms: 146, zh: 'jiuyue/006', ta: 6,
                      name: { ms: 'Yosua', zh: '若苏厄书', ta: 'யோசுவா' } },
    judges:         { en: 7,  ms: 147, zh: 'jiuyue/007', ta: 7,
                      name: { ms: 'Hakim-Hakim', zh: '民长纪', ta: 'நீதித் தலைவர்கள்' } },
    ruth:           { en: 8,  ms: 148, zh: 'jiuyue/008', ta: 8,
                      name: { ms: 'Rut', zh: '卢德传', ta: 'ரூத்து' } },
    '1samuel':      { en: 9,  ms: 149, zh: 'jiuyue/009', ta: 9,
                      name: { ms: '1 Samuel', zh: '撒慕尔纪上', ta: '1 சாமுவேல்' } },
    '2samuel':      { en: 10, ms: 150, zh: 'jiuyue/010', ta: 10,
                      name: { ms: '2 Samuel', zh: '撒慕尔纪下', ta: '2 சாமுவேல்' } },
    '1kings':       { en: 11, ms: 151, zh: 'jiuyue/011', ta: 11,
                      name: { ms: '1 Raja-Raja', zh: '列王纪上', ta: '1 அரசர்கள்' } },
    '2kings':       { en: 12, ms: 152, zh: 'jiuyue/012', ta: 12,
                      name: { ms: '2 Raja-Raja', zh: '列王纪下', ta: '2 அரசர்கள்' } },
    '1chronicles':  { en: 13, ms: 153, zh: 'jiuyue/013', ta: 13,
                      name: { ms: '1 Tawarikh', zh: '编年纪上', ta: '1 குறிப்பேடு' } },
    '2chronicles':  { en: 14, ms: 154, zh: 'jiuyue/014', ta: 14,
                      name: { ms: '2 Tawarikh', zh: '编年纪下', ta: '2 குறிப்பேடு' } },
    ezra:           { en: 15, ms: 155, zh: 'jiuyue/015', ta: 15,
                      name: { ms: 'Ezra', zh: '厄斯德拉上', ta: 'எஸ்ரா' } },
    nehemiah:       { en: 16, ms: 156, zh: 'jiuyue/016', ta: 16,
                      name: { ms: 'Nehemia', zh: '厄斯德拉下', ta: 'நெகேமியா' } },
    tobit:          { en: 17, ms: 0,   zh: 'jiuyue/017', ta: 40,
                      name: { ms: null, zh: '多俾亚传', ta: 'தோபித்து' } },
    judith:         { en: 18, ms: 0,   zh: 'jiuyue/018', ta: 41,
                      name: { ms: null, zh: '友弟德传', ta: 'யூதித்து' } },
    esther:         { en: 19, ms: 157, zh: 'jiuyue/019', ta: 17, zhAnchor: 'cn',
                      name: { ms: 'Ester', zh: '艾斯德尔传', ta: 'எஸ்தர்' } },
    '1maccabees':   { en: 20, ms: 0,   zh: 'jiuyue/020', ta: 47, zhAnchor: 'cn',
                      name: { ms: null, zh: '玛加伯上', ta: '1 மக்கபேயர்' } },
    '2maccabees':   { en: 21, ms: 0,   zh: 'jiuyue/021', ta: 48,
                      name: { ms: null, zh: '玛加伯下', ta: '2 மக்கபேயர்' } },
    job:            { en: 22, ms: 158, zh: 'jiuyue/022', ta: 18,
                      name: { ms: 'Ayub', zh: '约伯传', ta: 'யோபு' } },
    psalms:         { en: 23, ms: 159, ta: 19,
                      /* the Psalter's five books, as the 思高本 divides it */
                      zh: [[1, 41, 'jiuyue/023'], [42, 72, 'jiuyue/024'],
                           [73, 89, 'jiuyue/025'], [90, 106, 'jiuyue/026'],
                           [107, 150, 'jiuyue/027']],
                      name: { ms: 'Mazmur', zh: '圣咏集', ta: 'திருப்பாடல்கள்' } },
    proverbs:       { en: 24, ms: 160, zh: 'jiuyue/028', ta: 20,
                      name: { ms: 'Amsal', zh: '箴言篇', ta: 'நீதிமொழிகள்' } },
    ecclesiastes:   { en: 25, ms: 161, zh: 'jiuyue/029', ta: 21,
                      name: { ms: 'Pengkhutbah', zh: '训道篇', ta: 'சபை உரையாளர்' } },
    /* The notes call this the Song of Songs, and so does the app; the
       New Jerusalem Bible heads the page "Canticle of Canticles".
       `siteName` is only what the link check should expect to find. */
    songofsongs:    { en: 26, ms: 162, zh: 'jiuyue/030', ta: 22, zhAnchor: 'none',
                      siteName: { en: 'Canticle of Canticles' },
                      name: { ms: 'Kidung Agung', zh: '雅歌', ta: 'இனிமைமிகு பாடல்' } },
    wisdom:         { en: 27, ms: 0,   zh: 'jiuyue/031', ta: 43,
                      name: { ms: null, zh: '智慧篇', ta: 'சாலமோனின் ஞானம்' } },
    sirach:         { en: 28, ms: 0,   zh: 'jiuyue/032', ta: 44,
                      name: { ms: null, zh: '德训篇', ta: 'சீராக்' } },
    isaiah:         { en: 29, ms: 163, zh: 'jiuyue/033', ta: 23,
                      name: { ms: 'Yesaya', zh: '依撒意亚', ta: 'எசாயா' } },
    jeremiah:       { en: 30, ms: 164, zh: 'jiuyue/034', ta: 24,
                      name: { ms: 'Yeremia', zh: '耶肋米亚', ta: 'எரேமியா' } },
    lamentations:   { en: 31, ms: 165, zh: 'jiuyue/035', ta: 25,
                      name: { ms: 'Ratapan', zh: '哀歌', ta: 'புலம்பல்' } },
    baruch:         { en: 32, ms: 0,   zh: 'jiuyue/036', ta: 45,
                      name: { ms: null, zh: '巴路克', ta: 'பாரூக்கு' } },
    ezekiel:        { en: 33, ms: 166, zh: 'jiuyue/037', ta: 26,
                      name: { ms: 'Yehezkiel', zh: '厄则克耳', ta: 'எசேக்கியேல்' } },
    daniel:         { en: 34, ms: 167, zh: 'jiuyue/038', ta: 27,
                      name: { ms: 'Daniel', zh: '达尼尔', ta: 'தானியேல்' } },
    hosea:          { en: 35, ms: 168, zh: 'jiuyue/039', ta: 28,
                      name: { ms: 'Hosea', zh: '欧瑟亚', ta: 'ஒசேயா' } },
    joel:           { en: 36, ms: 169, zh: 'jiuyue/040', ta: 29,
                      name: { ms: 'Yo’el', zh: '岳厄尔', ta: 'யோவேல்' } },
    amos:           { en: 37, ms: 170, zh: 'jiuyue/041', ta: 30,
                      name: { ms: 'Amos', zh: '亚毛斯', ta: 'ஆமோஸ்' } },
    obadiah:        { en: 38, ms: 171, zh: 'jiuyue/042', ta: 31, zhAnchor: 'none',
                      name: { ms: 'Obaja', zh: '亚北底亚', ta: 'ஒபதியா' } },
    jonah:          { en: 39, ms: 172, zh: 'jiuyue/043', ta: 32,
                      name: { ms: 'Yunus', zh: '约纳', ta: 'யோனா' } },
    micah:          { en: 40, ms: 173, zh: 'jiuyue/044', ta: 33,
                      name: { ms: 'Mikha', zh: '米该亚', ta: 'மீக்கா' } },
    nahum:          { en: 41, ms: 174, zh: 'jiuyue/045', ta: 34,
                      name: { ms: 'Nahum', zh: '纳鸿', ta: 'நாகூம்' } },
    habakkuk:       { en: 42, ms: 175, zh: 'jiuyue/046', ta: 35,
                      name: { ms: 'Habakuk', zh: '哈巴谷', ta: 'அபக்கூக்கு' } },
    zephaniah:      { en: 43, ms: 176, zh: 'jiuyue/047', ta: 36,
                      name: { ms: 'Zefanya', zh: '索福尼亚', ta: 'செப்பனியா' } },
    haggai:         { en: 44, ms: 177, zh: 'jiuyue/048', ta: 37,
                      name: { ms: 'Hagai', zh: '哈盖', ta: 'ஆகாய்' } },
    zechariah:      { en: 45, ms: 178, zh: 'jiuyue/049', ta: 38,
                      name: { ms: 'Zakharia', zh: '匝加利亚', ta: 'செக்கரியா' } },
    malachi:        { en: 46, ms: 179, zh: 'jiuyue/050', ta: 39,
                      name: { ms: 'Maleakhi', zh: '玛拉基亚', ta: 'மலாக்கி' } },

    matthew:        { en: 47, ms: 180, zh: 'xinyue/001', ta: 49,
                      name: { ms: 'Matius', zh: '玛窦福音', ta: 'மத்தேயு' } },
    mark:           { en: 48, ms: 181, zh: 'xinyue/002', ta: 50,
                      name: { ms: 'Markus', zh: '马尔谷福音', ta: 'மாற்கு' } },
    luke:           { en: 49, ms: 182, zh: 'xinyue/003', ta: 51,
                      name: { ms: 'Lukas', zh: '路加福音', ta: 'லூக்கா' } },
    john:           { en: 50, ms: 183, zh: 'xinyue/004', ta: 52,
                      name: { ms: 'Yohanes', zh: '若望福音', ta: 'யோவான்' } },
    acts:           { en: 51, ms: 184, zh: 'xinyue/005', ta: 53,
                      name: { ms: 'Kisah Para Rasul', zh: '宗徒大事录', ta: 'திருத்தூதர் பணிகள்' } },
    romans:         { en: 52, ms: 185, zh: 'xinyue/006', ta: 54,
                      name: { ms: 'Roma', zh: '罗马人书', ta: 'உரோமையர்' } },
    '1corinthians': { en: 53, ms: 186, zh: 'xinyue/007', ta: 55,
                      name: { ms: '1 Korintus', zh: '格林多前书', ta: '1 கொரிந்தியர்' } },
    '2corinthians': { en: 54, ms: 187, zh: 'xinyue/008', ta: 56,
                      name: { ms: '2 Korintus', zh: '格林多后书', ta: '2 கொரிந்தியர்' } },
    galatians:      { en: 55, ms: 188, zh: 'xinyue/009', ta: 57,
                      name: { ms: 'Galatia', zh: '迦拉达书', ta: 'கலாத்தியர்' } },
    ephesians:      { en: 56, ms: 189, zh: 'xinyue/010', ta: 58,
                      name: { ms: 'Efesus', zh: '厄弗所书', ta: 'எபேசியர்' } },
    philippians:    { en: 57, ms: 190, zh: 'xinyue/011', ta: 59,
                      name: { ms: 'Filipi', zh: '斐理伯书', ta: 'பிலிப்பியர்' } },
    colossians:     { en: 58, ms: 191, zh: 'xinyue/012', ta: 60,
                      name: { ms: 'Kolose', zh: '哥罗森书', ta: 'கொலோசையர்' } },
    '1thessalonians': { en: 59, ms: 192, zh: 'xinyue/013', ta: 61,
                      name: { ms: '1 Tesalonika', zh: '得撒洛尼前书', ta: '1 தெசலோனிக்கர்' } },
    '2thessalonians': { en: 60, ms: 193, zh: 'xinyue/014', ta: 62,
                      name: { ms: '2 Tesalonika', zh: '得撒洛尼后书', ta: '2 தெசலோனிக்கர்' } },
    '1timothy':     { en: 61, ms: 194, zh: 'xinyue/015', ta: 63,
                      name: { ms: '1 Timotius', zh: '弟茂德前书', ta: '1 திமொத்தேயு' } },
    '2timothy':     { en: 62, ms: 195, zh: 'xinyue/016', ta: 64,
                      name: { ms: '2 Timotius', zh: '弟茂德后书', ta: '2 திமொத்தேயு' } },
    titus:          { en: 63, ms: 196, zh: 'xinyue/017', ta: 65,
                      name: { ms: 'Titus', zh: '弟铎书', ta: 'தீத்து' } },
    philemon:       { en: 64, ms: 197, zh: 'xinyue/018', ta: 66,
                      name: { ms: 'Filemon', zh: '费肋孟书', ta: 'பிலமோன்' } },
    hebrews:        { en: 65, ms: 198, zh: 'xinyue/019', ta: 67,
                      name: { ms: 'Ibrani', zh: '希伯来书', ta: 'எபிரேயர்' } },
    james:          { en: 66, ms: 199, zh: 'xinyue/020', ta: 68,
                      name: { ms: 'Yakobus', zh: '雅各伯书', ta: 'யாக்கோபு' } },
    '1peter':       { en: 67, ms: 200, zh: 'xinyue/021', ta: 69,
                      name: { ms: '1 Petrus', zh: '伯多禄前书', ta: '1 பேதுரு' } },
    '2peter':       { en: 68, ms: 201, zh: 'xinyue/022', ta: 70,
                      name: { ms: '2 Petrus', zh: '伯多禄后书', ta: '2 பேதுரு' } },
    '1john':        { en: 69, ms: 202, zh: 'xinyue/023', ta: 71,
                      name: { ms: '1 Yohanes', zh: '若望一书', ta: '1 யோவான்' } },
    '2john':        { en: 70, ms: 203, zh: 'xinyue/024', ta: 72,
                      name: { ms: '2 Yohanes', zh: '若望二书', ta: '2 யோவான்' } },
    '3john':        { en: 71, ms: 204, zh: 'xinyue/025', ta: 73,
                      name: { ms: '3 Yohanes', zh: '若望三书', ta: '3 யோவான்' } },
    jude:           { en: 72, ms: 205, zh: 'xinyue/026', ta: 74, zhAnchor: 'none',
                      name: { ms: 'Yudas', zh: '犹达书', ta: 'யூதா' } },
    revelation:     { en: 73, ms: 206, zh: 'xinyue/027', ta: 75,
                      name: { ms: 'Wahyu', zh: '默示录', ta: 'திருவெளிப்பாடு' } }
  };

  /* ---- the four editions ---- */

  function zhFile(edition, chapter) {
    var where = edition.zh;
    if (typeof where === 'string') { return where; }
    if (!where) { return null; }
    for (var i = 0; i < where.length; i++) {
      if (chapter >= where[i][0] && chapter <= where[i][1]) { return where[i][2]; }
    }
    return null;
  }

  /* The 思高本 puts a whole book in one page, so the link needs an
     anchor to land on the right chapter, and the anchors are not laid
     the same way in every book. Of its 77 pages, 71 mark every verse
     ("1:1"), three mark chapters with a Chinese numeral ("六"), and
     three carry no anchor at all. `zhAnchor` records which, so the
     link is right rather than merely plausible; anything unmarked uses
     the verse form. A fragment a page does not have is ignored by the
     browser, so the worst case is landing at the top of the right
     book; never on the wrong one. */
  var CN_ONES = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  function cnNumeral(n) {
    if (n >= 1 && n <= 10) { return CN_ONES[n]; }
    if (n > 10 && n < 20) { return '十' + CN_ONES[n - 10]; }
    if (n >= 20 && n < 100) {
      return CN_ONES[Math.floor(n / 10)] + '十' + (n % 10 ? CN_ONES[n % 10] : '');
    }
    return null;   /* beyond what those three books need */
  }

  function zhAnchor(edition, chapter) {
    if (edition.zhAnchor === 'none') { return ''; }
    if (edition.zhAnchor === 'cn') {
      var numeral = cnNumeral(chapter);
      return numeral ? '#' + numeral : '';
    }
    return '#' + chapter + ':1';
  }

  var BIBLES = {
    en: {
      name: 'New Jerusalem Bible',
      url: function (edition, chapter) {
        return 'https://www.scrutatio.it/bibbia/lettura/en/newjerusalem/' +
               edition.en + '/' + chapter;
      }
    },
    ms: {
      name: 'Alkitab Versi Borneo',
      url: function (edition, chapter) {
        return 'https://www.alkitabversiborneo.org/reader' +
               '?version=alkitabVersiBorneo&book=' + edition.ms + '&chapter=' + chapter;
      }
    },
    zh: {
      name: '思高本圣经',
      url: function (edition, chapter) {
        var file = zhFile(edition, chapter);
        return file ? 'https://ccccn.org/txt/bible/' + file + '.htm' +
                      zhAnchor(edition, chapter) : null;
      }
    },
    ta: {
      name: 'அருள்வாக்கு',
      url: function (edition, chapter) {
        return 'https://www.arulvakku.com/bible.php?bk=' + edition.ta + '&ch=' + chapter;
      }
    }
  };

  var DEFAULT_LANG = 'en';

  /* name (squashed) -> book, built once */
  var LOOKUP = (function () {
    var map = {};
    BOOKS.forEach(function (book) {
      book.names.forEach(function (name) { map[name] = book; });
    });
    return map;
  })();

  var PRETTY = (function () {
    var map = {};
    BOOKS.forEach(function (book) {
      /* "1corinthians" -> "1 Corinthians", "songofsongs" -> "Song of Songs" */
      var full = book.names[0];
      var lead = '';
      var rest = full;
      var m = /^(\d)(.*)$/.exec(full);
      if (m) { lead = m[1] + ' '; rest = m[2]; }
      var label;
      if (rest === 'songofsongs') { label = 'Song of Songs'; }
      else if (rest === 'actsoftheapostles' || rest === 'acts') { label = 'Acts'; }
      else { label = rest.charAt(0).toUpperCase() + rest.slice(1); }
      map[book.slug] = lead + label;
    });
    return map;
  })();

  function squash(text) {
    return String(text).toLowerCase().replace(/[.\s ]/g, '');
  }

  /* Find the first "<book> <chapter>" in a string.
     Passing over anything that is not a known book followed by a number
     is what lets a messy heading still resolve correctly.

     Up to four words before the chapter number are captured, because a
     book can be several words long ("Song of Songs") or carry a numeral
     ("1 Corinthians"). Those words are then tried longest-first, so
     "Song of Songs 2" resolves to the whole title rather than stopping
     at "Songs", while "What happened in Jn 1" falls through the
     ordinary words and lands on "Jn". */
  function matchAt(words) {
    for (var take = Math.min(words.length, 4); take >= 1; take--) {
      var key = squash(words.slice(words.length - take).join(''));
      if (LOOKUP[key]) { return LOOKUP[key]; }
    }
    return null;
  }

  function parse(reference) {
    if (!reference) { return null; }
    /* An en or em dash between chapter and verse is normalised to a
       hyphen. The em dash is written as an escape so that no literal
       one appears anywhere in the app's own source. */
    var text = String(reference).replace(/[\u2013\u2014]/g, '-');

    /* Run twice: first insisting on a "chapter:verse" colon, which is how
       every reference in the notes is written, then more loosely. */
    /* The final word may itself carry the numeral, as in "1Cor". */
    var WORDS = '(?:(?:[0-9]+|[A-Za-z]+)\\.?[ \\t]+){0,3}[0-9]*[A-Za-z]+';
    var patterns = [
      new RegExp('(' + WORDS + ')\\.?[ \\t]*(\\d{1,3})[ \\t]*:', 'g'),
      new RegExp('(' + WORDS + ')\\.?[ \\t]*(\\d{1,3})\\b', 'g')
    ];

    for (var p = 0; p < patterns.length; p++) {
      var re = patterns[p];
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(text)) !== null) {
        var words = m[1].split(/[ \t]+/).filter(Boolean);
        var book = matchAt(words);
        if (book) {
          var chapter = parseInt(m[2], 10);
          if (chapter > 0) {
            return { slug: book.slug, chapter: chapter, book: PRETTY[book.slug] };
          }
        }
      }
    }
    return null;
  }

  /* The address of that chapter in the language's own Bible, or null if
     the reference could not be understood, or if that Bible does not
     carry the book at all, which is the case for the deuterocanonical
     books in the Malay AVB. Nothing is ever linked to a page that does
     not hold the passage. */
  function url(reference, lang) {
    var found = parse(reference);
    if (!found) { return null; }
    var edition = EDITIONS[found.slug];
    var bible = BIBLES[lang] || BIBLES[DEFAULT_LANG];
    var code = BIBLES[lang] ? lang : DEFAULT_LANG;
    if (!edition || !edition[code]) { return null; }
    return bible.url(edition, found.chapter);
  }

  /* "John 6" in English, "யோவான் 6" in Tamil, what the link says it
     will open, named as that edition names it. */
  function chapterLabel(reference, lang) {
    var found = parse(reference);
    if (!found) { return null; }
    var edition = EDITIONS[found.slug] || {};
    var localised = edition.name && edition.name[lang];
    return (localised || found.book) + ' ' + found.chapter;
  }

  /* "New Jerusalem Bible", "அருள்வாக்கு", the edition being linked to. */
  function bibleName(lang) {
    return (BIBLES[lang] || BIBLES[DEFAULT_LANG]).name;
  }

  return {
    parse: parse,
    url: url,
    chapterLabel: chapterLabel,
    bibleName: bibleName,
    books: BOOKS,
    editions: EDITIONS,
    bibles: BIBLES
  };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = Scripture; }
