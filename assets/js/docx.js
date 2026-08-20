/* ============================================================
   THE EMMAUS COMPANION — Word (.docx) writer
   Penang Diocesan Catechetical Commission

   A .docx file is a ZIP archive of XML parts. This module builds
   one from scratch, in the browser, with no libraries at all:
   no npm install, no build step, no code from anyone else's
   server, and it keeps working offline for ever.

   ZIP entries are written "stored" (uncompressed), which needs
   only a CRC-32 — no compression code. Word opens such files
   normally; a reflection journal is small enough that the saved
   bytes would not be noticed.

   Public API:  EmmausDocx.build(spec) -> Uint8Array
                EmmausDocx.save(spec, filename)

   Fonts: Word has neither Cinzel nor EB Garamond, so titles use
   letter-spaced small capitals in Garamond (shipped with Office,
   falling back to Cambria) — the same inscriptional feeling with
   a face every machine already has.
   ============================================================ */

var EmmausDocx = (function () {
  'use strict';

  /* ---------------- bytes ---------------- */

  var utf8 = new TextEncoder();

  function concat(chunks) {
    var total = 0, i;
    for (i = 0; i < chunks.length; i++) { total += chunks[i].length; }
    var out = new Uint8Array(total), at = 0;
    for (i = 0; i < chunks.length; i++) { out.set(chunks[i], at); at += chunks[i].length; }
    return out;
  }

  /* CRC-32 (IEEE 802.3), the checksum every ZIP entry carries. */
  var CRC_TABLE = (function () {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* ---------------- ZIP (stored entries) ---------------- */

  function dosDateTime(date) {
    var year = date.getFullYear();
    if (year < 1980) { year = 1980; }
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
      date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
    };
  }

  function zipStore(entries, now) {
    var stamp = dosDateTime(now || new Date());
    var locals = [], centrals = [], offset = 0;

    entries.forEach(function (entry) {
      var nameBytes = utf8.encode(entry.name);
      var data = entry.data;
      var crc = crc32(data);

      var local = new Uint8Array(30 + nameBytes.length);
      var lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034B50, true);   // local file header signature
      lv.setUint16(4, 20, true);           // version needed to extract
      lv.setUint16(6, 0x0800, true);       // flag: filename is UTF-8
      lv.setUint16(8, 0, true);            // method: 0 = stored
      lv.setUint16(10, stamp.time, true);
      lv.setUint16(12, stamp.date, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, data.length, true); // compressed size
      lv.setUint32(22, data.length, true); // uncompressed size
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);           // extra field length
      local.set(nameBytes, 30);

      var central = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014B50, true);   // central directory signature
      cv.setUint16(4, 20, true);           // version made by
      cv.setUint16(6, 20, true);           // version needed
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, stamp.time, true);
      cv.setUint16(14, stamp.date, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, data.length, true);
      cv.setUint32(24, data.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);           // extra
      cv.setUint16(32, 0, true);           // comment
      cv.setUint16(34, 0, true);           // disk number start
      cv.setUint16(36, 0, true);           // internal attributes
      cv.setUint32(38, 0, true);           // external attributes
      cv.setUint32(42, offset, true);      // offset of local header
      central.set(nameBytes, 46);

      locals.push(local, data);
      centrals.push(central);
      offset += local.length + data.length;
    });

    var centralBytes = concat(centrals);
    var end = new Uint8Array(22);
    var ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054B50, true);            // end of central directory
    ev.setUint16(4, 0, true);                     // this disk
    ev.setUint16(6, 0, true);                     // disk with central directory
    ev.setUint16(8, entries.length, true);        // entries on this disk
    ev.setUint16(10, entries.length, true);       // entries total
    ev.setUint32(12, centralBytes.length, true);  // central directory size
    ev.setUint32(16, offset, true);               // central directory offset
    ev.setUint16(20, 0, true);                    // comment length

    return concat(locals.concat([centralBytes, end]));
  }

  /* ---------------- XML ---------------- */

  function esc(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      /* strip control characters Word rejects, keeping tab and newline */
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  }

  var DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
  var W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';

  /* One paragraph. Runs are split on newlines with <w:br/> between. */
  function para(styleId, text, runProps) {
    var lines = String(text == null ? '' : text).split(/\r?\n/);
    var runs = lines.map(function (line, i) {
      return (i > 0 ? '<w:br/>' : '') +
             '<w:t xml:space="preserve">' + esc(line) + '</w:t>';
    }).join('');
    return '<w:p><w:pPr><w:pStyle w:val="' + styleId + '"/></w:pPr>' +
           '<w:r>' + (runProps || '') + runs + '</w:r></w:p>';
  }

  function emptyPara() { return '<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr></w:p>'; }

  /* A horizontal rule, drawn as a paragraph with a bottom border. */
  function rule(colour) {
    return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="' +
           (colour || 'D8D2C4') + '"/></w:pBdr><w:spacing w:after="180"/></w:pPr></w:p>';
  }

  /* ---------------- styles.xml ---------------- */

  function styleDef(id, name, opts) {
    return '<w:style w:type="paragraph" w:styleId="' + id + '">' +
             '<w:name w:val="' + name + '"/>' +
             '<w:basedOn w:val="Normal"/>' +
             '<w:qFormat/>' +
             '<w:pPr>' + (opts.pPr || '') + '</w:pPr>' +
             '<w:rPr>' + (opts.rPr || '') + '</w:rPr>' +
           '</w:style>';
  }

  function stylesXml() {
    var fonts = '<w:rFonts w:ascii="Garamond" w:hAnsi="Garamond" w:cs="Garamond"/>';
    return DECL +
      '<w:styles ' + W_NS + '>' +
        '<w:docDefaults><w:rPrDefault><w:rPr>' + fonts +
          '<w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-MY"/>' +
        '</w:rPr></w:rPrDefault>' +
        '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
        '</w:docDefaults>' +

        '<w:style w:type="paragraph" w:default="1" w:styleId="Normal">' +
          '<w:name w:val="Normal"/><w:qFormat/>' +
          '<w:rPr>' + fonts + '<w:sz w:val="22"/></w:rPr>' +
        '</w:style>' +

        /* the two lines of the commission's name at the head of the page */
        styleDef('DocHeader', 'Emmaus Header', {
          pPr: '<w:jc w:val="center"/><w:spacing w:after="0"/>',
          rPr: '<w:smallCaps/><w:spacing w:val="60"/><w:sz w:val="16"/><w:color w:val="6B655B"/>'
        }) +

        /* the topic title */
        styleDef('DocTitle', 'Emmaus Title', {
          pPr: '<w:jc w:val="center"/><w:spacing w:before="220" w:after="60"/>',
          rPr: '<w:b/><w:smallCaps/><w:spacing w:val="50"/><w:sz w:val="30"/><w:color w:val="1F1B15"/>'
        }) +

        /* name and date */
        styleDef('DocMeta', 'Emmaus Meta', {
          pPr: '<w:jc w:val="center"/><w:spacing w:after="60"/>',
          rPr: '<w:i/><w:sz w:val="19"/><w:color w:val="6B655B"/>'
        }) +

        /* A · Life Experience, B · Scripture … */
        styleDef('SectionRubric', 'Emmaus Rubric', {
          pPr: '<w:spacing w:before="320" w:after="40"/>',
          rPr: '<w:b/><w:caps/><w:spacing w:val="50"/><w:sz w:val="17"/><w:color w:val="9E2B25"/>'
        }) +

        /* the question, in the notes' own wording */
        styleDef('QuestionText', 'Emmaus Question', {
          pPr: '<w:spacing w:before="60" w:after="60"/><w:keepNext/>',
          rPr: '<w:b/><w:sz w:val="22"/>'
        }) +

        /* the candidate's own words */
        styleDef('AnswerText', 'Emmaus Answer', {
          pPr: '<w:ind w:left="340"/><w:spacing w:after="140"/>',
          rPr: '<w:sz w:val="22"/>'
        }) +

        /* an answer left blank */
        styleDef('AnswerBlank', 'Emmaus Answer Blank', {
          pPr: '<w:ind w:left="340"/><w:spacing w:after="140"/>',
          rPr: '<w:i/><w:sz w:val="20"/><w:color w:val="9A948A"/>'
        }) +

        styleDef('PrayerText', 'Emmaus Prayer', {
          pPr: '<w:jc w:val="center"/><w:ind w:left="560" w:right="560"/><w:spacing w:after="60"/>',
          rPr: '<w:i/><w:sz w:val="22"/>'
        }) +

        styleDef('DocFooter', 'Emmaus Footer', {
          pPr: '<w:jc w:val="center"/><w:spacing w:before="240"/>',
          rPr: '<w:smallCaps/><w:spacing w:val="60"/><w:sz w:val="16"/><w:color w:val="6B655B"/>'
        }) +

        styleDef('NoteText', 'Emmaus Note', {
          pPr: '<w:spacing w:before="80" w:after="120"/>',
          rPr: '<w:i/><w:sz w:val="19"/><w:color w:val="6B655B"/>'
        }) +
      '</w:styles>';
  }

  /* ---------------- document.xml ---------------- */

  /* A4 portrait, 2 cm margins, in twentieths of a point. */
  var SECT_PR =
    '<w:sectPr>' +
      '<w:pgSz w:w="11906" w:h="16838"/>' +
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" ' +
               'w:header="708" w:footer="708" w:gutter="0"/>' +
    '</w:sectPr>';

  function documentXml(spec) {
    var body = [];

    (spec.header || []).forEach(function (line) {
      body.push(para('DocHeader', line));
    });

    if (spec.title) { body.push(para('DocTitle', spec.title)); }
    if (spec.subtitle) { body.push(para('DocMeta', spec.subtitle)); }
    (spec.meta || []).forEach(function (line) { body.push(para('DocMeta', line)); });
    body.push(rule());

    (spec.blocks || []).forEach(function (block) {
      switch (block.type) {
        case 'rubric':
          body.push(para('SectionRubric', block.text));
          break;
        case 'question':
          body.push(para('QuestionText', block.text));
          break;
        case 'answer':
          if (block.text && String(block.text).trim()) {
            body.push(para('AnswerText', block.text));
          } else {
            body.push(para('AnswerBlank', block.placeholder || '(left blank)'));
          }
          break;
        case 'note':
          body.push(para('NoteText', block.text));
          break;
        case 'prayer':
          (block.lines || []).forEach(function (line) {
            body.push(para('PrayerText', line));
          });
          break;
        case 'rule':
          body.push(rule());
          break;
        case 'pagebreak':
          body.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
          break;
        case 'spacer':
          body.push(emptyPara());
          break;
        default:
          body.push(para('Normal', block.text));
      }
    });

    if (spec.footer) {
      body.push(rule());
      body.push(para('DocFooter', spec.footer));
    }

    return DECL +
      '<w:document ' + W_NS + '><w:body>' + body.join('') + SECT_PR + '</w:body></w:document>';
  }

  /* ---------------- package ---------------- */

  function corePropsXml(spec, now) {
    var iso = now.toISOString().replace(/\.\d+Z$/, 'Z');
    return DECL +
      '<cp:coreProperties ' +
        'xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dc:title>' + esc(spec.title || 'RCIA Journal') + '</dc:title>' +
        '<dc:creator>' + esc(spec.author || 'RCIA Candidate') + '</dc:creator>' +
        '<cp:lastModifiedBy>' + esc(spec.author || 'RCIA Candidate') + '</cp:lastModifiedBy>' +
        '<dcterms:created xsi:type="dcterms:W3CDTF">' + iso + '</dcterms:created>' +
        '<dcterms:modified xsi:type="dcterms:W3CDTF">' + iso + '</dcterms:modified>' +
      '</cp:coreProperties>';
  }

  var CONTENT_TYPES = DECL +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '</Types>';

  var ROOT_RELS = DECL +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '</Relationships>';

  var DOC_RELS = DECL +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>';

  function build(spec, now) {
    var stamp = now || new Date();
    return zipStore([
      { name: '[Content_Types].xml',      data: utf8.encode(CONTENT_TYPES) },
      { name: '_rels/.rels',              data: utf8.encode(ROOT_RELS) },
      { name: 'docProps/core.xml',        data: utf8.encode(corePropsXml(spec, stamp)) },
      { name: 'word/_rels/document.xml.rels', data: utf8.encode(DOC_RELS) },
      { name: 'word/styles.xml',          data: utf8.encode(stylesXml()) },
      { name: 'word/document.xml',        data: utf8.encode(documentXml(spec)) }
    ], stamp);
  }

  /* Hand the finished document to the candidate. */
  function save(spec, filename) {
    var bytes = build(spec);
    var blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return bytes.length;
  }

  return { build: build, save: save, crc32: crc32, _esc: esc };
})();

/* Allow the test harness to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = EmmausDocx; }
