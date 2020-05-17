import React from 'react';
import { createForm } from 'rc-form';
import cheerio from 'cheerio';
import { Button, List, WhiteSpace, Picker } from 'components';
import ResultIcon from '../icon';
import styles from './index.less';

class Gapselect extends React.Component {
  componentDidMount () {
    this.props.onRef(this);
  }

  // onSubmit () {
  //   const fieldsValue = this.props.form.getFieldsValue(),
  //     result = {};
  //   for (let att in fieldsValue) {
  //     const value = fieldsValue[att];
  //     if (cnIsArray(value)) {
  //       value.map(v => {
  //         result[att] = v;
  //       });
  //     } else if (typeof value === 'object') {
  //       for (let attV in value) {
  //         result[attV] = value[attV];
  //       }
  //     } else {
  //       result[att] = value;
  //     }
  //   }
  //   return result;
  // }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { answer, type = 'quiz' } = this.props;
    const getSelect = ({ id, value = '', items = [], currect = '' }) =>
      (<div className={styles.picker}>{getFieldDecorator(id, {
        initialValue: value // 初始值
      })(
        <Picker data={items} cols={1} disabled={type !== 'quiz'}>
          <List.Item arrow="horizontal" wrap>
            <div className={styles.answer}>
              {'请选择答案'}
              {
                currect !== '' && <ResultIcon currect={currect}/>
              }
            </div>
          </List.Item>
        </Picker>
      )}
      </div>);
    const getContents = (html) => {
      const selectEls = cheerio('select', html),
        selectDatas = [];
      selectEls.map((index, node) => {
        let selectedValue = '',
          items = node.children.map((child, i) => {
            const { attribs: { selected = '', value = '' }, children = [] } = child;
            if (selected === 'selected') selectedValue = value;
            if (children.length > 0) {
              const label = value === '' ? '请选择' : children[0].data;
              return {
                label,
                value
              };
            }
          });
        selectDatas.push({
          id: node.attribs.name,
          value: selectedValue === '' ? '' : [selectedValue],
          items,
          currect: type !== 'quiz' && node.next && node.next.next ? node.next.next.attribs.title || '' : ''
        });
      });
      const tags = answer.match(/<p[^>]*>.*?<\/p>/)[0].split(/<span[^>]*>.*?<\/span>/),
        getHtml = (text) => ({
          __html: text,
        });
      return tags.map((tag, index) => {
        const result = [];
        result.push(<div dangerouslySetInnerHTML={getHtml(tag.replace(/<[^(br)]>/, ''))}/>);
        if (selectDatas.length > index) {
          result.push(getSelect(selectDatas[index]));
        }
        return result;
      });
    };
    return (
      <div className={styles.outer}>
        {getContents(answer)}
        <WhiteSpace size="lg"/>
      </div>
    );
  }
}


Gapselect.propTypes = {};
Gapselect.defaultProps = {
  onRef: () => (false)
};

export default Gapselect;
