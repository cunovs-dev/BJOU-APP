/**
 * @author Lowkey
 * @date 2020/03/10 13:31:44
 * @Description: 滑块验证简单版（纯前端） 居然不用了。。。。
 *
 */
import React from 'react';
import { Icon } from 'antd-mobile';
import { getLocalIcon } from 'utils';
import styles from './index.less';

class SlideVerification extends React.Component {
  static defaultProps = {
    text: '拖动滑块验证',
    movedColor: 'linear-gradient(313deg, rgba(65, 209, 102, 1) 0%, rgba(90, 232, 118, 1) 100%)',
    successTips: '完成验证',
    barBackground: '#fff',
    success: null
  };


  constructor (props) {
    super(props);
    this.barRef = ref => {
      this.barDom = ref;
    };
    this.containerRef = ref => {
      this.containerDom = ref;
    };
    this.state = {
      isTouchDown: false,
      x1: 0,
      x2: 0,
      diff: 0,
      isSuccess: false
    };
  }


  componentDidMount () {
    this.props.onRef(this);
    document.body.addEventListener('touchmove', this.handlerTouchMove.bind(this), { passive: false });
  }

  componentWillUnmount () {
    document.body.removeEventListener('touchmove', this.handlerTouchMove.bind(this), { passive: false });
  }

  handlerTouchMove = (e) => {
    if (!this.state.isTouchDown || this.state.isSuccess || !this.props.isValidate) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let diff = e.touches[0].pageX - this.state.x1;

    if (diff < 0) {
      diff = 0;
    }
    if (diff >= this.containerDom.offsetWidth - this.barDom.offsetWidth) {
      diff = this.containerDom.offsetWidth - this.barDom.offsetWidth;
      this.props.success && this.props.success();
      this.setState({
        isSuccess: true
      });
    }
    this.setState({
      diff
    });
  };

  handlerTouchStart = (e) => {
    this.props.onValidate();
    if (this.state.isSuccess) {
      return;
    }
    this.setState({
      isTouchDown: true,
      x1: e.nativeEvent.touches[0].pageX
    });
  };

  handlerTouchEnd = () => {
    if (this.state.isSuccess) {
      return;
    }
    this.setState({
      isTouchDown: false,
      diff: 0
    });
  };

  reset = () => {
    this.setState({
      isTouchDown: false,
      x1: 0,
      x2: 0,
      diff: 0,
      isSuccess: false
    });
  };


  render () {
    const { text, movedColor, barBackground, successTips } = this.props;
    const { diff, isTouchDown, isSuccess } = this.state;
    /** 滑条样式 */
    const slideStyle = {
      background: movedColor,
      width: `${diff}px`,
      opacity: isTouchDown ? 1 : 0,
      transitionDuration: !isTouchDown ? '.3s' : '0s'
    };
    /** 滑块样式 */
    const barStyle = {
      background: barBackground,
      transitionDuration: !isTouchDown ? '.3s' : '0s',
      left: `${diff}px`
    };
    /** 成功文本样式 */
    const textStyle = {
      opacity: this.isSuccess ? 1 : 0,
      transitionDuration: !isTouchDown ? '.3s' : '0s'
    };
    return (
      <div className={styles.container} ref={this.containerRef}>
        <div className={styles.text}>{text}</div>
        <div className={styles.slide} style={slideStyle}>
          {isSuccess ? successTips : null}
        </div>
        <div
          className={styles.bar}
          onTouchStart={this.handlerTouchStart}
          onTouchEnd={this.handlerTouchEnd}
          style={barStyle}
          ref={this.barRef}
        >
          {
            isSuccess ?
            <Icon type={getLocalIcon('/components/slideSuccess.svg')} color="green" />
                      :
            <Icon type={getLocalIcon('/components/slide.svg')} color="#ddd" />
          }
        </div>
      </div>
    );
  }
}

export default SlideVerification;
