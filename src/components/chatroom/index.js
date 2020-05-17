import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import InputBox from 'components/inputbox';
import { getMessageTime } from 'utils';
import { ReceiveBubble, ReplyBubble } from './chatbubble/index';
import styles from './index.less';

const PrefixCls = 'chatroom';
let defaultTimer = 0;

class ChatRoom extends Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount () {
    setTimeout(() => {
      if (ReactDOM.findDOMNode(this.lv)) {
        const currentHeight = cnhtmlHeight - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.setState({
          height: currentHeight,
        });
        this.scrollToBottom(ReactDOM.findDOMNode(this.lv));
      }
    }, 10);
  }

  componentDidUpdate () {
    this.scrollToBottom(ReactDOM.findDOMNode(this.lv));
  }

  scrollToBottom (el) {
    setTimeout(() => {
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 200);
  }

  render () {
    const { avatar = '', selfavatar = '' } = this.props;
    const props = {
        onSubmit: this.props.onSubmit,
        val: this.props.val,
        dispatch: this.props.dispatch,
      },
      getShowTimer = (messageTimer = '') => {
        const current = new Date(messageTimer * 1000).getMinutes();
        if (messageTimer && defaultTimer !== (current - 1)) {
          defaultTimer = current;
          return <div className={styles[`${PrefixCls}-timer`]} ><span >{getMessageTime(messageTimer)}</span ></div >;
        }
        return '';
      };
    return (
      <div >
        <div
          className={styles[`${PrefixCls}-outer`]}
          ref={el => this.lv = el}
          style={{ height: this.state.height }}
        >
          <div className={styles[`${PrefixCls}-outer-content`]} ref={el => this.contentEl = el} >
            {this.props.localArr && this.props.localArr.map((data, i) => {
              const { isMySelf = false, timecreated = '', ...others } = data,
                props = {
                  timecreated,
                  ...others,
                  selfavatar,
                  avatar
                },
                result = [getShowTimer(timecreated)];
              result.push(isMySelf ? <ReplyBubble {...props} /> : <ReceiveBubble {...props} />);
              return result;
            })}
          </div >
          <div style={{ clear: 'both' }} />
          <InputBox {...props} handlerSubmit={this.props.handlerSubmit} />
        </div >
      </div >
    );
  }
}

ChatRoom.defaultProps = {};
ChatRoom.propTypes = {
  handlerSubmit: PropTypes.func.isRequired,
};
export default ChatRoom;
