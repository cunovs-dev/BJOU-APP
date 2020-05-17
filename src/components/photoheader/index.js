/* eslint-disable no-undef */
/**
 * @author Lowkey
 * @date 2018/2/18
 * @Description:
 */
import React from 'react';
import { Icon } from 'components/index';
import PropTypes from 'prop-types';
import { getLocalIcon } from 'utils';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const PrefixCls = 'photoheader';

class PhotoHeader extends React.Component {
  constructor (props) {
    super();
  }

  render () {
    const hanleBackClick = () => {
      this.props.dispatch(routerRedux.goBack());
    };

    return (
      <div className={styles[`${PrefixCls}-transparentouter`]} >
        <div
          className={styles[`${PrefixCls}-transparentouter-backBtn`]}
          style={this.props.hasBg ? {} : { background: 'transparent' }}
          onClick={hanleBackClick}
        >
          <Icon style={{ verticalAlign: 'middle' }} type="left" size={this.props.size} color="#fff" />
        </div >
        {this.props.children === null ?
          ''
          :
          <div className={styles[`${PrefixCls}-transparentouter-rightBtn`]} >
            {this.props.children}
          </div >
        }
      </div >
    );
  }
}

PhotoHeader.defaultProps = {
  name: '',
  hasBg: true,
  size: 'md',
  children: null
};
PhotoHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
export default PhotoHeader;
