import React from 'react';
import { connect } from 'dva';
import { TextareaItem } from 'components';
import { createForm } from 'rc-form';
import styles from './index.less';

@createForm()
class Essay extends React.Component {
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
      <TextareaItem
        {...getFieldProps(answer.name, {
          initialValue: answer.value,
        })}
        onChange={(val) => this.textChange(val)}
        placeholder="请回答"
        rows={answer.rows || 3}
      />
    );
  }
}

export default Essay;
