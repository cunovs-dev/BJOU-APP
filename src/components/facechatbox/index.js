/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const PrefixCls = 'facechatbox';

const FaceChatBox = (props) => {
  return (
    <div className={styles[`${PrefixCls}-outer`]} onClick={props.handleClick}>
      <div className={styles[`${PrefixCls}-outer-img`]}>
        <div className={styles[`${PrefixCls}-outer-img-image`]} style={{ backgroundImage: `url(${props.image})` }}>
          <div className={styles[`${PrefixCls}-mask`]}>
            <h3>{props.title}</h3>
            <span>{`创建人：${props.founder}`}</span>
          </div>
        </div>

      </div>
      <div className={styles[`${PrefixCls}-outer-price`]}>
        {/* <div className={styles[`${PrefixCls}-outer-price-box`]}> */}
        {/* <span style={{ color: 'red' }}><Icon type={getLocalIcon('/components/rmb.svg')} size="xxs" /></span> */}
        {/* <span style={{ color: 'red', marginLeft: '5px' }}>{props.price}</span> */}
        {/* </div> */}
        <div className={styles[`${PrefixCls}-outer-price-box`]}>
          <span><Icon type={getLocalIcon('/components/people.svg')} size="xxs" /></span>
          <span style={{ marginLeft: '10px' }}>{props.number}</span>
        </div>
      </div>
    </div>
  );
};

FaceChatBox.defaultProps = {
  image: '',
  title: '嘿嘿嘿',
  price: '免费',
  number: '231',
  time: '34:13'
};
FaceChatBox.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default FaceChatBox;
