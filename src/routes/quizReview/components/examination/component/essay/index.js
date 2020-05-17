import React from 'react';
import { connect } from 'dva';
import { TextareaItem } from 'components';
import styles from './index.less';

class Essay extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {

  }


  render () {
    const { answer } = this.props;
    return (
      <TextareaItem
        value={answer.value}
        disabled
        placeholder="请回答"
        autoHeight
      />
    );
  }
}

export default Essay;
