/**
 * @author Lowkey
 * @date 2018/10/24
 * @Description:
 */
import React from 'react';
import { Icon } from 'components/index';
import PropTypes from 'prop-types';
import styles from './index.less';
import { getLocalIcon, getDefaultBg } from 'utils';
import defaultUserIcon from '../../themes/images/default/userIcon.png';

const PrefixCls = 'selfheader';

class SelfHeader extends React.Component {
  state = {
    opacity: 0,
    isScroll: false,
  }

  componentWillMount () {
    this._isMounted = true;
    if (this._isMounted) {
      document.body.onscroll = () => {
        let sTop = document.documentElement.scrollTop || document.body.scrollTop;
        let currentOpacity = Math.min(100, sTop / 200);
        this.setState({
          opacity: this.state.opacity = currentOpacity,
          isScroll: true,
        });
        if (currentOpacity === 0) {
          this.setState({
            isScroll: false,
          });
        }
      };
    }
  }

  componentWillUnmount () {
    this._isMounted = false;
  }

  render () {
    const bgColor = this.state.isScroll ? '#ddd' : '#fff',
      color = this.state.isScroll ? '#fff' : '#666';
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <div className={styles[`${PrefixCls}-outer-bg`]} style={{ backgroundImage: `url(${getDefaultBg('')})` }} />
        <div className={styles[`${PrefixCls}-outer-content`]}>
          <img src={defaultUserIcon} alt="" />
          <div className={styles[`${PrefixCls}-outer-content-userInfo`]}>
            <span className={styles[`${PrefixCls}-outer-content-userInfo-name`]}>张三</span>
            <span className={styles[`${PrefixCls}-outer-content-userInfo-integral`]}>积分: 10</span>
          </div>
        </div>
      </div>
    );
  }
}

SelfHeader.defaultProps = {};
SelfHeader.propTypes = {};
export default SelfHeader;
