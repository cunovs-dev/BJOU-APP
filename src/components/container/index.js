/**
 * @author Lowkey
 * @date 2018/10/11
 * @Description: 盒子列表父元素
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const PrefixCls = 'container';

function Container (props) {
  return (
    <div className={styles[`${PrefixCls}-outer`]}>
      <div className={styles[`${PrefixCls}-outer-title`]}>
        <div>{props.title}</div>
        <span onClick={props.handlerClick}>更多></span>
      </div>
      <div className={styles[`${PrefixCls}-outer-children`]}>{props.children}</div>
    </div>
  );
}

Container.defaultProps = {
  title: '',
};
Container.propTypes = {
  title: PropTypes.string.isRequired,
};
export default Container;
