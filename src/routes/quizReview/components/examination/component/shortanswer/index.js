import React from 'react';
import { connect } from 'dva';
import { InputItem } from 'components';
import { createForm } from 'rc-form';
import ResultIcon from '../icon';
import styles from './index.less';

@createForm()
class ShortAnswer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {

  }


  render () {
    const { answer, form } = this.props;
    const { getFieldProps } = form;
    return (
      <div className={styles.answer} >
        <InputItem
          {...getFieldProps(answer.name, {
            initialValue: answer.value,
          })}
          disabled
          clear
          placeholder="请回答"
        />
        {
          answer.currect !== '' && <ResultIcon currect={answer.currect} />
        }
      </div >
    );
  }
}

export default ShortAnswer;
