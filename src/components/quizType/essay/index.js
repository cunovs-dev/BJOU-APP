import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
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
    // this.props.dispatch({
    //   type: 'quizDetails/updateTextVal',
    //   payload: {
    //     value,
    //   }
    // });
  };

  render () {
    const { answer, form, type = 'quiz' } = this.props;
    const { getFieldProps } = form;
    return (
      <TextareaItem
        {...getFieldProps(answer.name || 'textarea', {
          initialValue: answer.value||'',
        })}
        // onChange={(val) => this.textChange(val)}
        placeholder="请回答"
        disabled={type !== 'quiz'}
        rows={answer.rows || 8}
      />
    );
  }
}

export default Essay;
