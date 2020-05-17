import React from 'react';
import { connect } from 'dva';
import { InputItem } from 'components';
import { createForm } from 'rc-form';
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

  textChange = (value) => {
    this.props.dispatch({
      type: 'quizDetails/updateTextVal',
      payload: {
        value,
      }
    });
  };

  render () {
    const { answer, form } = this.props;
    const { getFieldProps } = form;
    return (
      <InputItem
        {...getFieldProps(answer.name, {
          initialValue: answer.value,
        })}
        onChange={(val) => this.textChange(val)}
        clear
        placeholder="请回答"
      />
    );
  }
}

export default ShortAnswer;
