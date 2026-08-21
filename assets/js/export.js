/* ============================================================
   THE EMMAUS COMPANION: Building the Word document's contents
   Penang Diocesan Catechetical Commission

   Pure logic: given a topic and the candidate's answers, work out
   what the document should contain. It touches no part of the
   page, so the same code runs in the browser and in the checking
   script under tools/.

   The questions and the closing prayer are the note's own words, in
   whichever language the note was written; everything the document
   adds around them ("Name:", "Session date:", "(not yet written)")
   is taken from Lang, so the page the candidate saves reads in one
   voice.
   ============================================================ */

var EmmausExport = (function () {
  'use strict';

  /* Under Node the checking script requires this file directly, and
     there is no <script> tag to have defined Lang. */
  var L = (typeof Lang !== 'undefined') ? Lang
        : (typeof require !== 'undefined' ? require('./i18n.js') : null);

  function formatDate(date, code) {
    return L.formatDate(date, code);
  }

  /* Every journal question in a topic, in the order it is read,
     paired with the key its answer is stored under. */
  function questionKeys(topic) {
    var keys = [];
    topic.parts.forEach(function (part) {
      part.blocks.forEach(function (block) {
        if (block.type !== 'journal') { return; }
        block.questions.forEach(function (question, index) {
          keys.push({
            key: block.id + ':' + index,
            part: part,
            journal: block,
            question: question
          });
        });
      });
    });
    return keys;
  }

  /* The questions, each followed by whatever the candidate wrote. */
  function collectBlocks(topic, answers, code) {
    var blocks = [];
    var wrote = 0;

    topic.parts.forEach(function (part) {
      var journals = part.blocks.filter(function (b) { return b.type === 'journal'; });
      if (!journals.length) { return; }

      blocks.push({
        type: 'rubric',
        text: part.letter + ' · ' + part.name + (part.ref ? ' · ' + part.ref : '')
      });

      journals.forEach(function (journal) {
        if (journal.prompt) { blocks.push({ type: 'note', text: journal.prompt }); }
        journal.questions.forEach(function (question, index) {
          var answer = (answers[journal.id + ':' + index] || '').trim();
          if (answer) { wrote++; }
          blocks.push({ type: 'question', text: question.n + ' ' + question.text });
          blocks.push({ type: 'answer', text: answer,
                        placeholder: L.t('docNotWritten', null, code) });
        });
      });
    });

    /* The closing prayer of the session, where the note gives one. */
    topic.parts.forEach(function (part) {
      part.blocks.forEach(function (block) {
        if (block.type !== 'prayer') { return; }
        blocks.push({ type: 'rule' });
        blocks.push({
          type: 'rubric',
          text: block.label
            ? L.t('docClosingPrayerLabelled', { label: block.label }, code)
            : L.t('docClosingPrayer', null, code)
        });
        blocks.push({ type: 'prayer', lines: block.lines });
      });
    });

    return { blocks: blocks, wrote: wrote };
  }

  /* The full specification handed to EmmausDocx.build().

     options.lang     the language the candidate is reading in
     options.noteLang the language this note actually exists in: the
                      same, unless it has not been transcribed yet  */
  function buildSpec(topic, answers, options) {
    options = options || {};
    var code = options.lang || L.DEFAULT;
    var noteLang = options.noteLang || code;
    var collected = collectBlocks(topic, answers, code);
    var candidate = (options.name || '').trim();
    var period = options.period;
    var today = options.today || new Date();

    var meta = [];
    meta.push(L.t('docName', { name: candidate || '________________________' }, code));
    if (period) {
      meta.push(L.t('docTopic', {
        n: topic.topic,
        letter: period.letter,
        period: L.period(period.id, code).name
      }, code));
    }
    if (options.sessionDate) {
      meta.push(L.t('docSessionDate', { date: formatDate(options.sessionDate, code) }, code));
    }
    meta.push(L.t('docSaved', { date: formatDate(today, code) }, code));
    /* Say so on the page itself when the note inside is not the
       language the rest of the document speaks. */
    if (noteLang !== code) {
      meta.push(L.t('docLanguageNote', null, code));
    }

    return {
      spec: {
        lang: code,
        noteLang: noteLang,
        header: [L.t('brand', null, code), L.t('docSubtitle', null, code)],
        title: L.t('topicLine', { n: topic.topic, title: topic.title }, code),
        subtitle: topic.theme ? L.t('themeLine', { theme: topic.theme }, code) : null,
        meta: meta,
        author: candidate || L.t('docCandidate', null, code),
        blocks: collected.blocks,
        footer: L.t('docFooter', null, code)
      },
      wrote: collected.wrote,
      total: questionKeys(topic).length
    };
  }

  /* Windows, macOS and Android all refuse some characters in a file
     name. The note's own title may be in any script, which is fine;
     only the forbidden punctuation is taken out. */
  function fileNameFor(topic, name, code) {
    var candidate = (name || '').trim();
    var raw = L.t('topicLine', { n: topic.topic, title: topic.title }, code) +
              (candidate ? ' - ' + candidate : '');
    /* A colon cannot go into a file name, so the one in "Topic 16: The
       Mass Explained" becomes a dash rather than simply vanishing. */
    return raw.replace(/:\s*/g, ' - ')
              .replace(/[\\\/*?"<>|]/g, '')
              .replace(/\s+/g, ' ').trim() + '.docx';
  }

  return {
    questionKeys: questionKeys,
    collectBlocks: collectBlocks,
    buildSpec: buildSpec,
    fileNameFor: fileNameFor,
    formatDate: formatDate
  };
})();

/* Allow the checking script to require this file under Node. */
if (typeof module !== 'undefined' && module.exports) { module.exports = EmmausExport; }
