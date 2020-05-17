import React from 'react';
import { connect } from 'dva';
import { Picker, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less';
import ResultIcon from '../icon';


class Match extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  render () {
    const { getFieldProps } = this.props.form;
    const { answer } = this.props;
    return (
      <div >
        {
          answer.map((item, i) =>
            (<Picker
              key={i}
              data={item.answer}
              cols={1}
              disabled
              {...getFieldProps(item.name,
                {
                  initialValue: [item.answer.find(child => child.selected === true).value]
                }
              )}
            >
              <List.Item arrow="horizontal" >
                <div className={styles.answer} >
                  {item.question}
                  {
                    item.currect !== '' && <ResultIcon currect={item.currect} />
                  }
                </div >
              </List.Item >
            </Picker >))
        }
      </div >
    );
  }
}

export default createForm()(Match);
