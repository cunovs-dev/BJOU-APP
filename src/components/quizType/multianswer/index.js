import React from 'react';
import { createForm } from 'rc-form';
import cheerio from 'cheerio';
import { InputItem, Button, List, WhiteSpace, Picker } from 'components';
import ResultIcon from '../icon';
import styles from './index.less';

class Multianswer extends React.Component {
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
    const { answer } = this.props;
    const getSelect = ({ id, value = '', items = [] }) =>
      (<div>{getFieldDecorator(id, {
        initialValue: value // 初始值
      })(
        <Picker data={items} cols={1}>
          <List.Item arrow="horizontal" wrap>{'请选择答案'}</List.Item>
        </Picker>
      )}
      </div>);
    const packContents = (text) => {
        const trs = cheerio('tr', 'table', text),
          tdLength = trs[0].children.length;
        let results = [],
          result = { items: [] };
        for (let i = 0; i < tdLength; i++) {
          trs.map((index, tr) => {
            const td = cheerio('td', tr)
                .get(i),
              valueEl = cheerio('.form-control', td),
              currect = valueEl.siblings('i')
                .prop('title') || '';
            if (valueEl.length) {
              let { attribs: { id = '', value = '', size = '' }, name: type = '' } = valueEl.get(0);
              result.items.push({
                type,
                id,
                value,
                size,
                currect
              });
            } else {
              let { title = '', items = [] } = result;
              if (title && items.length) {
                results.push({
                  title,
                  items: [...items],
                });
                result = { items: [] };
              }
              let tdEl = td.firstChild,
                elTitle = tdEl.data;
              while (tdEl && !elTitle) {
                if (tdEl.type === 'text') {
                  elTitle = tdEl.data;
                  break;
                }
                tdEl = tdEl.firstChild;
              }
              result.title = elTitle;
            }
          });
        }
        results.push(result);
        return results;
      },
      getContents = (text) => {
        const dataItems = packContents(text);
        return dataItems.map((dataItem, i) => {
          const { title = '', items } = dataItem;
          if (items.length > 0) {
            return (<div key={i}>
              <List renderHeader={() => <h3 className={styles.title}>{title}</h3>}>{
                items.map((item) => {
                  const { id = '', value = '', size = '', type = 'input', currect = '' } = item;
                  if (type === 'input') {
                    return (
                      <div key={id} className={styles.answer}>
                        {getFieldDecorator(id, {
                          initialValue: value // 初始值
                        })(
                          <InputItem
                            disabled={this.props.type !== 'quiz'}
                            placeholder="请输入"
                            size={{ size }}
                          />
                        )}
                        {
                          currect !== '' && <ResultIcon currect={currect}/>
                        }
                      </div>
                    );
                  }
                  return '';
                })
              }
              </List>
            </div>);
          }
          return '';
        });
      },
      packContentInfos = (text) => {
        const table = cheerio('table', text),
          others = table.siblings('p');
        let result = [];
        if (others.length) {
          others.each((i, n) => {
            result.push(cheerio.html(n));
          });
        }
        return result.length ? <div dangerouslySetInnerHTML={{ __html: result.join('') }}></div> : '';
      };
    return (
      <div>
        {packContentInfos(answer)}
        {getContents(answer)}
        <WhiteSpace size="lg"/>
      </div>
    );
  }
}


Multianswer.propTypes = {};
Multianswer.defaultProps = {
  type: 'quiz',
  onRef: () => (false)
};

export default Multianswer;
