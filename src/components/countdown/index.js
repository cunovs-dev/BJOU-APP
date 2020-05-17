import React from 'react';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import classNames from 'classnames';
import styles from './index.less';

const getParseString = (time) => {
  return time < 10 ? `0${time}` : time.toString();
};

class CountDown extends React.Component {
  constructor (props) {
    super(props);
    this.TimeRemaining = this.getTimeRemaining();
    this.state = {
      timeRemaining: this.TimeRemaining,
      isUrgent: false
    };
  }

  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.timerID);
  }

  getTimeRemaining () {
    if (this.props.endTime > 0) {
      return (this.props.endTime) * 1000 - (new Date().getTime());
    }
  }

  autoSubmit = () => {
    const { handler } = this.props;
    handler('auto');
  };

  tick () {
    let timeR = this.state.timeRemaining;
    if (timeR <= 0) {
      clearInterval(this.timerID);
      this.setState({
        isUrgent: false
      });
      this.autoSubmit();
    } else if (timeR < 60000 && !this.state.isUrgent) {
      this.setState({
        isUrgent: true
      });
    } else {
      this.updateTR(timeR);
    }
  }

  updateTR () {
    this.setState({
      timeRemaining: this.state.timeRemaining -= 1000
    });
  }

  render () {
    const timer = [{
      id: 0,
      type: 'hours',
      number: '00',
      label: '小时',
    },
      {
        id: 1,
        type: 'minutes',
        number: '00',
        label: '分钟',
      },
      {
        id: 2,
        type: 'seconds',
        number: '00',
        label: '秒',
      }];
    let totalSeconds = Math.round(this.state.timeRemaining / 1000);
    timer.forEach(time => {
      switch (time.type) {
        case 'seconds':
          time.number = getParseString(parseInt(totalSeconds % 60, 10));
          break;
        case 'minutes':
          time.number = getParseString(parseInt(totalSeconds / 60, 10) % 60);
          break;
        case 'hours':
          time.number = getParseString(parseInt(totalSeconds / 3600, 10));
          break;
      }
    });
    return (
      <div className={classNames(styles.CountdownTimer, { [styles.urgent]: this.state.isUrgent })} >
        <div className={classNames({ [styles.icon]: this.state.timeRemaining !== 0 })} ><Icon
          type={getLocalIcon('/components/countdown.svg')}
          color="#22609c"
        /></div >
        {this.state.timeRemaining > 0 ? <div className={styles.box} >
          剩余时间：
          {timer.map(time =>
            (<div key={time.id} >
              <span className={styles.number} >{`${time.number}`}</span >
              {time.type != 'seconds' ? <span >:</span > : null}
            </div >)
          )}
        </div > : <div className={styles.timeUp} >时间到了!</div >}
      </div >
    );
  }
}

export default CountDown;
