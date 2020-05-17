import React from 'react';
import { createForm } from 'rc-form';
import cheerio from 'cheerio';
import { InputItem, Button, List, WhiteSpace, Picker } from 'components';
import ResultIcon from '../icon';
import styles from './index.less';

const PrefixCls = 'multianswer';


class Multianswer extends React.Component {
  componentDidMount () {

  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { answer } = this.props;
    const getSelect = ({ id, value = '', items = [] }) =>
      (<div >{getFieldDecorator(id, {
        initialValue: value // 初始值
      })(
        <Picker data={items} cols={1} >
          <List.Item arrow="horizontal" wrap >{'请选择答案'}</List.Item >
        </Picker >
      )}
      </div >);
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
          const { title = '', items = [] } = dataItem;
          if (items.length > 0) {
            return (<div key={i} >
              <List renderHeader={() => <h3 className={styles.title} >{title}</h3 >} >{
                items.map((item, i) => {
                  const { id = '', value = '', size = '', type = 'input', currect = '' } = item;
                  if (type === 'input') {
                    return (
                      <div key={i} className={styles.answer} >
                        <InputItem
                          value={value}
                          disabled
                          key={id}
                          placeholder="请输入"
                          size={{ size }}
                        />
                        {
                          currect !== '' && <ResultIcon currect={currect} />
                        }
                      </div >
                    );
                  }
                  return '';
                })
              }
              </List >
            </div >);
          }
          return '';
        });
      };
    return (
      <div className={styles[`${PrefixCls}-outer`]} >
        {getContents(answer)}
        <WhiteSpace size="lg" />
      </div >
    );
  }
}

export default createForm()(Multianswer);
