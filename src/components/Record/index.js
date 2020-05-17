/**
 * @author Lowkey
 * @date 2020/04/13 10:36:58
 * @Description: 录音
 */
import React from 'react';
import { Icon } from 'components/index';
import TitleBox from 'components/titlecontainer';
import classNames from 'classnames';
import { getLocalIcon } from 'utils';
import styles from './index.less';

let int;
const getParseString = (time) => {
  return time < 10 ? `0${time}` : time.toString();
};

class Record extends React.Component {
  constructor (props) {
    super();
    this.state = {
      isRecording: false,
      limit: 5,
      minutes: '00',
      second: '00',
      timeRemaining: 0
    };
  }

  componentWillUnmount () {
    this.stopTimer();
  }

  handlerClick = () => {
    if (!this.state.isRecording) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
    this.setState({
      isRecording: !this.state.isRecording
    });
  };

  addSeconds () { // 计时器
    if (this.state.timeRemaining < this.state.limit) {
      this.setState({
        timeRemaining: this.state.timeRemaining += 1,
        second: getParseString(parseInt(this.state.timeRemaining % 60, 10)),
        minutes: getParseString(parseInt(this.state.timeRemaining / 60, 10) % 60)
      });
    } else {
      this.stopTimer();
    }
  }

  startTimer () { // 启动计时器
    int = setInterval(() => {
      this.addSeconds();
    }, 1000);
  }

  stopTimer () { // 关闭计时器
    clearInterval(int);
    this.setState({
      minutes: '00',
      second: '00',
      timeRemaining: 0,
      isRecording: false
    });
  }

  render () {
    const text = this.state.isRecording ? '停止' : '开始录音';
    const { second, minutes } = this.state;
    return (
      <div className={styles.outer}>
        <TitleBox
          title={this.state.isRecording ? '正在录音' : '上传录音'}
          sup={<span className={styles.sup}>{this.state.isRecording ? `${minutes}:${second}` : ''}</span>}
        />

        <div
          className={classNames(styles.button, { [styles.active]: this.state.isRecording })}
          onClick={this.handlerClick}
        >
          {text}
        </div>
      </div>
    );
  }
}

Record.defaultProps = {};
Record.propTypes = {};
export default Record;
