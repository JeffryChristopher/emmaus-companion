/* ============================================================
   THE EMMAUS COMPANION — Scripture links
   Penang Diocesan Catechetical Commission

   Turns a reference as it is printed in the notes — "John 6:52–63",
   "Lk 15:11-32", "Ep 1:9, 2:18" — into a link to that chapter on the
   USCCB Bible, which carries the NABRE text with the Church's own
   footnotes:

       https://bible.usccb.org/bible/<book>/<chapter>

   Only the chapter is linked, never a verse range: the USCCB verse
   anchors are numeric ids that would silently rot. The candidate lands
   on the right chapter and reads the passage from there.

   The notes are not always tidy — Topic 29 is headed "Matthew The
   Parable of the Prodigal Son - Lk 15:11-32." — so the parser looks
   for the first book name that is actually followed by a chapter
   number, rather than trusting the first word it sees.
   ============================================================ */

var Scripture = (function () {
  'use strict';

  /* slug: the name USCCB uses in the address.
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
    { slug: 'jeremiah',       names: ['jeremiah', 'jer'] },
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
    return String(text).toLowerCase().replace(/[.\s ]/g, '');
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
    var text = String(reference).replace(/[–—]/g, '-');

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

  /* The address of that chapter on the USCCB Bible, or null if the
     reference could not be understood. */
  function url(reference) {
    var found = parse(reference);
    return found ? 'https://bible.usccb.org/bible/' + found.slug + '/' + found.chapter : null;
  }

  /* "John 6" — what the link says it will open. */
  function chapterLabel(reference) {
    var found = parse(reference);
    return found ? found.book + ' ' + found.chapter : null;
  }

  return { parse: parse, url: url, chapterLabel: chapterLabel, books: BOOKS };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = Scripture; }
