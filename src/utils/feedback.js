const questionTpye = {
  MULTICHOICE_TYPE_SEP: '>>>>>',
  MULTICHOICE_ADJUST_SEP: '<<<<<',
  MULTICHOICE_HIDENOSELECT: 'h',
  MULTICHOICERATED_VALUE_SEP: '####',
  LINE_SEP: '|',
  MODE_RESPONSETIME: 1,
  MODE_COURSE: 2,
  MODE_CATEGORY: 3,
};
module.exports = {

  getItemFormLabel: (item) => {
    item.template = 'label';
    return item;
  },

  getItemFormInfo: (item) => {
    item.template = 'label';
    const type = parseInt(item.presentation, 10);

    if (type === questionTpye.MODE_COURSE || type === questionTpye.MODE_CATEGORY) {
      item.presentation = item.otherdata;
      item.value = typeof item.responsevalue !== 'undefined' ? item.responsevalue : item.otherdata;
    } else if (type == questionTpye.MODE_RESPONSETIME) {
      item.value = '__CURRENT__TIMESTAMP__';
      const tempValue = typeof item.responsevalue !== 'undefined' ? item.responsevalue * 1000 : new Date().getTime();
      // item.presentation = moment(tempValue)
      //   .format('LLL');
    } else {
      return false;
    }

    return item;
  },

  getItemFormNumeric: (item) => {
    item.template = 'numeric';

    const range = item.presentation.split(questionTpye.LINE_SEP) || [];
    item.rangefrom = range.length > 0 ? parseInt(range[0], 10) || '' : '';
    item.rangeto = range.length > 1 ? parseInt(range[1], 10) || '' : '';
    item.value = typeof item.responsevalue !== 'undefined' ? parseFloat(item.responsevalue) : '';

    return item;
  },

  getItemFormTextfield: (item) => {
    item.template = 'textfield';
    item.length = item.presentation.split(questionTpye.LINE_SEP)[1] || 255;
    item.value = typeof item.responsevalue !== 'undefined' ? item.responsevalue : '';

    return item;
  },

  getItemFormTextarea: (item) => {
    item.template = 'textarea';
    item.value = typeof item.responsevalue !== 'undefined' ? item.responsevalue : '';

    return item;
  },

  getItemFormMultichoice: (item) => {
    let parts = item.presentation.split(questionTpye.MULTICHOICE_TYPE_SEP) || [];
    item.subtype = parts.length > 0 && parts[0] ? parts[0] : 'r';
    item.template = `multichoice-${item.subtype}`;
    item.presentation = parts.length > 1 ? parts[1] : '';
    if (item.subtype != 'd') {
      parts = item.presentation.split(questionTpye.MULTICHOICE_ADJUST_SEP) || [];
      item.presentation = parts.length > 0 ? parts[0] : '';
      // Horizontal are not supported right now. item.horizontal = parts.length > 1 && !!parts[1];
    }

    item.choices = item.presentation.split(questionTpye.LINE_SEP) || [];
    item.choices = item.choices.map((choice, index) => {
      const weightValue = choice.split(questionTpye.MULTICHOICERATED_VALUE_SEP) || [''];
      choice = weightValue.length == 1 ? weightValue[0] : `(${weightValue[0]}) ${weightValue[1]}`;

      return { value: index + 1, label: choice, id: `${item.id}_${index}` };
    });

    if (item.subtype == 'r' && item.options.search(questionTpye.MULTICHOICE_HIDENOSELECT) === -1) {
      item.choices.unshift({ value: 0, label: '未选择' });
      item.value = typeof item.responsevalue !== 'undefined' ? parseInt(item.responsevalue, 10) : 0;
    } else if (item.subtype == 'd') {
      item.choices.unshift({ value: 0, label: '' });
      item.value = typeof item.responsevalue !== 'undefined' ? parseInt(item.responsevalue, 10) : 0;
    } else if (item.subtype == 'c') {
      if (typeof item.responsevalue === 'undefined') {
        item.value = '';
      } else {
        item.responsevalue = `${item.responsevalue}`;
        const values = item.responsevalue.split(questionTpye.LINE_SEP);
        item.choices.forEach((choice) => {
          for (const x in values) {
            if (choice.value == values[x]) {
              choice.checked = true;

              return;
            }
          }
        });
      }
    } else {
      item.value = typeof item.responsevalue !== 'undefined' ? parseInt(item.responsevalue, 10) : '';
    }

    return item;
  },

};
