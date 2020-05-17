/**
 * @author Lowkey
 * @date 2018/11/05 11:56:05
 * @Description:
 */
import React from 'react';
import { Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import { getLocalIcon } from 'utils';
import classNames from 'classnames';
import styles from './index.less';

const PrefixCls = 'animationbutton';

class AnimationButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
      isActive: false,
    };
  }

  componentWillMount () {

  }

  handlerClick = (isActive) => {
    if (isActive) {
      this.setState({
        height: 0,
        isActive: false,
      });
    } else {
      this.setState({
        height: this.props.height,
        isActive: true,
      });
    }
  };

  render () {
    const display = this.state.isActive ? 'flex' : 'none';
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <div
          className={styles[`${PrefixCls}-outer-box`]}
          style={{ height: this.state.height }}
        >
          <div className={styles[`${PrefixCls}-outer-box-container`]} style={{ display }}>
            <div onClick={this.props.handlerDiscussClick}>
              <Icon type={getLocalIcon('/buttons/discuss.svg')} />
              <p>评论</p>
            </div>
            <div onClick={this.props.handlerNoteClick}>
              <Icon type={getLocalIcon('/buttons/note.svg')} />
              <p>笔记</p>
            </div>
          </div>
        </div>
        <div
          className={classNames(styles[`${PrefixCls}-outer-icon`], { [styles.rotate]: this.state.isActive })}
          onClick={this.handlerClick.bind(this, this.state.isActive)}
        >
          <Icon type={getLocalIcon('/buttons/add.svg')} />
        </div>
      </div>
    );
  }
}

AnimationButton.defaultProps = {
  height: 0,
};
AnimationButton.propTypes = {
  height: PropTypes.number,
  handlerDiscussClick: PropTypes.func.isRequired,
  handlerNoteClick: PropTypes.func.isRequired,
};
export default AnimationButton;
