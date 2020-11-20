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
    const getForm = (data) => {
      return data.map((item, i) => {
        const { id = '', value = '', size = '', type = 'text', currect = '' } = item;
        if (type === 'text') {
          return (<List
            key={id}
            className={styles.answer}
          >
            {getFieldDecorator(id, {
              initialValue: value // 初始值
            })(
              <InputItem
                disabled={this.props.type !== 'quiz'}
                placeholder="请输入"
                size={{ size }}
              >
                {`答案${i + 1}`}
              </InputItem>
            )}
            {
              currect !== '' && <ResultIcon currect={currect} />
            }
          </List>);
        }
        return '';
      });
    };


    const getValues = (text) => {
        const datas = [];
        const dataItems = cheerio('.form-control', text);
        dataItems.map((index, node) => {
          if (node.attribs) {
            datas.push({
              ...node.attribs,
              currect: this.props.type !== 'quiz' && node.next && node.next.next ? node.next.next.attribs.title || '' : ''
            });
          }
        });
        return datas;
      },
      getContents = (text) => {
        let $ = cheerio.load(text);
        if (this.props.type === 'quiz') {
          $('.form-control')
            .replaceWith('<i> ____ </i>');
        }
        let content = cheerio('.content', $.html());
        return (
          <div className={styles.container}>
            <div dangerouslySetInnerHTML={{ __html: cheerio.html(content) }} />
            <WhiteSpace />
            <div className={styles.form}>
              {getForm(getValues(text))}
            </div>
          </div>
        );
      };
    return (
      <div>
        {getContents(answer)}
        <WhiteSpace size="lg" />
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
