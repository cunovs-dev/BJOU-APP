import React, { Component } from 'react';
import styles from './index.less';


const getColor = count => {
  if (count >= 0 && count < 60) return '#f5222d';
  if (count >= 60 && count < 100) return '#1890ff';
  if (count === 100) return '#52c41a';
  return '#fff';
};

const getBg = count => {
  if (count >= 0 && count < 60) return '#ffa39e';
  if (count >= 60 && count < 100) return '#91d5ff';
  if (count === 100) return '#b7eb8f';
  return 'transparent';
};

class ProgressTag extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { count } = this.props;
    setTimeout(() => {
      if (this.barRef) {
        this.barRef.style.width = `${count}%`;
      }
    }, 100);
  }

  render () {
    const { count, text } = this.props;
    return (
      <div className={styles.outer}>
      <span
        className={styles.text}
        style={{ color: getColor(count) }}
      >
        {`${text}:${count}%`}
      </span>
        <div
          ref={el => (this.barRef = el)}
          className={styles.bar}
          style={{ backgroundColor: getBg(count), width: 0 }}
        />
      </div>
    );
  }
};

ProgressTag.defaultProps = {
  count: 0,
  text: '回贴率'
};

export default ProgressTag;
