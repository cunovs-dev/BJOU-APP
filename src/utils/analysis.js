const cheerio = require('cheerio');


module.exports = {

  getQuizInfo: (html, type) => { // 获取测验信息
    const $ = cheerio.load(html);
    const obj = {};
    if (type === 'description') {
      obj.title = `${$('.accesshide')
        .text()}`;
      obj.qtext = `${$('.qtext')
        .html()}`;
      return obj;
    }
    obj.title = `${$('.no')
      .text()}`;
    obj.state = `${$('.state')
      .text()}`;
    obj.grade = `${$('.grade')
      .text()}`;
    obj.qtext = `${$('.qtext').length ? $('.qtext')
      .html() : ''}`;
    obj.prompt = `${$('.prompt')
      .text()}`;
    return obj;
  },

  getFeedback: (html) => {
    const $ = cheerio.load(html);
    const obj = {};
    if ($('.feedback')) {
      obj.feedback = $('.feedback .specificfeedback')
        .text();
    }
    if ($('.rightanswer')) {
      obj.rightanswer = $('.rightanswer')
        .text();
    }
    return obj;
  },

  getTimes: (html) => { // 获取答题次数字段的name
    const $ = cheerio.load(html);
    const obj = {};
    if ($('.formulation input[type="hidden"]')) {
      return $('.formulation input[type="hidden"]')
        .attr('name');
    }
  },

  choiceQuestion: (html) => {

    const $ = cheerio.load(html);
    let items = [];

    if ($('.answer input[type="radio"]').length > 0) {

      $('.answer> div')
        .each((index, element) => {

          let answer;
          if ($('.answer label').length > 0) {
            answer = $('.answer label')
              .eq(index)
              .text();
          } else {
            answer = $('.answer .d-flex')
              .eq(index)
              .html();
          }

          items.push({
            id: $('.answer input[type="radio"]')
              .eq(index)
              .prop('id'),
            name: $('.answer input[type="radio"]')
              .eq(index)
              .attr('name'),
            label: answer.replace(/<br>/g, ''),
            value: $('.answer input[type="radio"]')
              .eq(index)
              .val(),
            checked: $('.answer input[type="radio"]')
              .eq(index)
              .prop('checked'),
            type: 'radio',
            disabled: $('.answer input[type="radio"]')
              .eq(index)
              .prop('disabled'),
            currect: $('.answer input[type="radio"]')
              .eq(index)
              .siblings('i')
              .prop('title') || ''
          });
        });
    } else if ($('.answer input[type="checkbox"]').length > 0) {
      $('.answer> div')
        .each((index, element) => {
          let answer;
          if ($('.answer label').length > 0) {
            answer = $('.answer label')
              .eq(index)
              .text();
          } else {
            answer = $('.answer .d-flex')
              .eq(index)
              .html();
            // answer = $('.answer .d-flex')
            //     .eq(index)
            //     .text()// 题号
            //   +
            //   $('.answer .flex-fill')
            //     .eq(index)
            //     .text();// 题目
          }

          items.push({
            id: $('.answer input[type="checkbox"]')
              .eq(index)
              .attr('id'),
            label: answer.replace(/<br>/g, ''),
            name: $('.answer input[type="checkbox"]')
              .eq(index)
              .attr('name'),
            value: $('.answer input[type="checkbox"]')
              .eq(index)
              .val(),
            checked: $('.answer input[type="checkbox"]')
              .eq(index)
              .prop('checked'),
            type: 'checkbox',
            disabled: $('.answer input[type="checkbox"]')
              .eq(index)
              .prop('disabled'),
            currect: $('.answer input[type="checkbox"]')
              .eq(index)
              .siblings('i')
              .prop('title') || ''
          });
        });
    }
    return items;
  },

  matchQuestion: (html) => {
    const $ = cheerio.load(html);
    const arr = [];
    const getAnswers = ($, index) => {
      $('.answer tbody tr select')
        .eq(index)
        .children('option')
        .each((i, ele) => {
          arr[i] = {
            label: $('.answer tbody tr select')
              .find('option')
              .eq(i)
              .text(),
            value: $('.answer tbody tr select')
              .find('option')
              .eq(i)
              .val(),
            selected: $('.answer tbody tr select')
              .find('option')
              .eq(i)
              .prop('selected')
          };
        });
      return arr;
    };
    let items = [];
    $('.answer tbody >tr select')
      .each((index, ele) => {
        let answers = ele.children.map(child => {
          const { attribs: { selected = '', value = '' }, children = [] } = child;
          if (children.length > 0) {
            const label = value === '' ? '请选择' : children[0].data;
            return {
              label,
              value,
              selected: selected === 'selected'
            };
          }
        });
        items.push({
          question: $('.text')
            .eq(index)
            .text(),
          answer: answers,
          name: $('.answer select')
            .eq(index)
            .attr('name'),
          currect: $('.answer select')
            .eq(index)
            .siblings('i')
            .prop('title') || ''
        });
      });
    return items;
  },

  shortanswerQusetion: (html) => {
    const $ = cheerio.load(html);
    let el;
    if ($('.answer').length > 0) {
      el = $('.answer input[type="text"]');
    } else {
      el = $('input[type="text"]');
    }
    let items = {};
    if (el) {
      items.id = el.prop('id');
      items.name = el.attr('name');
      items.value = el.val();
      items.currect = el.siblings('i')
        .prop('title') || '';
    }
    return items;
  },

  essayQusetion: (html) => {
    const $ = cheerio.load(html);
    const textarea = $('.answer textarea');
    const ipt = $('.answer input[type="hidden"]');
    let items = {};
    if (textarea.length > 0 && ipt) {
      items.id = textarea.prop('id');
      items.name = textarea.attr('name');
      items.value = textarea.val();
      items.format = ipt.attr('name');
      items.formatVal = ipt.val();
      items.rows = textarea.prop('rows');
    } else {
      const el = $('.answer .qtype_essay_editor');
      items.value = el.text();
    }
    return items;
  },

  getQuizText: (html) => {
    const quizText = cheerio('div', html);
    return quizText.length ? quizText.html() : html;
  }
};
