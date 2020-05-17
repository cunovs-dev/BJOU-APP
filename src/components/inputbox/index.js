import React, { Component } from 'react';
import { Button, Icon, Toast } from 'antd-mobile';
import { getLocalIcon } from 'utils';
import ReactDOM from 'react-dom';
import styles from './index.less';

const PrefixCls = 'inputbox';

class InputBox extends Component {
  constructor (props) {
    super(props);
  }


  handleTextSubmit () {
    const input = ReactDOM.findDOMNode(this.lv);
    if (input.value !== '') {
      this.props.handlerSubmit({
        content: input.value,
      });
      input.value = '';
    } else {
      Toast.fail('不能发送空消息');
    }
  }


  render () {
    return (
      <div className={styles[`${PrefixCls}-outer`]} >
        <div className={styles[`${PrefixCls}-outer-inputbox`]} >
          <input type="text" ref={el => this.lv = el} />
          <div >
            <Button
              type="primary"
              size="small"
              inline
              onClick={this.handleTextSubmit.bind(this)}
            >发送</Button >
          </div >
        </div >
      </div >
    );
  }
}

export default InputBox;
