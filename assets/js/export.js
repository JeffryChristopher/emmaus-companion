/* ============================================================
   THE EMMAUS COMPANION — Building the Word document's contents
   Penang Diocesan Catechetical Commission

   Pure logic: given a topic and the candidate's answers, work out
   what the document should contain. It touches no part of the
   page, so the same code runs in the browser and in the checking
   script under tools/.
   ============================================================ */

var EmmausExport = (function () {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  function formatDate(date) {
    return date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear();
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
  function collectBlocks(topic, answers) {
    var blocks = [];
    var wrote = 0;

    topic.parts.forEach(function (part) {
      var journals = part.blocks.filter(function (b) { return b.type === 'journal'; });
      if (!journals.length) { return; }

      blocks.push({
        type: 'rubric',
        text: part.letter + ' · ' + part.name + (part.ref ? ' — ' + part.ref : '')
      });

      journals.forEach(function (journal) {
        if (journal.prompt) { blocks.push({ type: 'note', text: journal.prompt }); }
        journal.questions.forEach(function (question, index) {
          var answer = (answers[journal.id + ':' + index] || '').trim();
          if (answer) { wrote++; }
          blocks.push({ type: 'question', text: question.n + ' ' + question.text });
          blocks.push({ type: 'answer', text: answer, placeholder: '(not yet written)' });
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
          text: block.label ? block.label + ' — closing prayer' : 'Closing prayer'
        });
        blocks.push({ type: 'prayer', lines: block.lines });
      });
    });

    return { blocks: blocks, wrote: wrote };
  }

  /* The full specification handed to EmmausDocx.build(). */
  function buildSpec(topic, answers, options) {
    options = options || {};
    var collected = collectBlocks(topic, answers);
    var candidate = (options.name || '').trim();
    var period = options.period;
    var today = options.today || new Date();

    var meta = [];
    meta.push('Name: ' + (candidate || '________________________'));
    if (period) {
      meta.push('Session ' + topic.session + ' · Period ' + period.letter + ': ' + period.name);
    }
    if (options.sessionDate) {
      meta.push('Session date: ' + formatDate(options.sessionDate));
    }
    meta.push('Saved ' + formatDate(today));

    return {
      spec: {
        header: ['Penang Diocesan Catechetical Commission', 'RCIA · Journal of the Journey'],
        title: 'Topic ' + topic.topic + ' — ' + topic.title,
        subtitle: topic.theme ? 'Theme: ' + topic.theme : null,
        meta: meta,
        author: candidate || 'RCIA Candidate',
        blocks: collected.blocks,
        footer: 'Ad maiorem Dei gloriam'
      },
      wrote: collected.wrote,
      total: questionKeys(topic).length
    };
  }

  function fileNameFor(topic, name) {
    var candidate = (name || '').trim();
    var raw = 'Topic ' + topic.topic + ' ' + topic.title + (candidate ? ' — ' + candidate : '');
    return raw.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim() + '.docx';
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
