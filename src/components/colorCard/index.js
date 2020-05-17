/**
 * @author Lowkey
 * @date 2020/02/27 15:23:29
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import bg from './titleBg.png';
import styles from './index.less';

const PrefixCls = 'colorCard';

const ColorCard = (props) => {
  return (
    <div
      className={styles[`${PrefixCls}-outer`]}
      onClick={props.handlerClick}
    >
      <div
        className={styles[`${PrefixCls}-outer-title`]}
        style={{ backgroundImage: `url(${bg})` }}
      >
        {props.title}
      </div>
      <div className={styles[`${PrefixCls}-outer-content`]}>
        {props.children}
      </div>
    </div>
  );
};

ColorCard.defaultProps = {
  title: '',
  children: '',
  handleClick: null
};
ColorCard.propTypes = {
  handlerClick: PropTypes.func.isRequired
};

export default ColorCard;
