/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const PrefixCls = 'infobox';

const InfoBox = (props) => {
  return (
    <div className={styles[`${PrefixCls}-outer`]} onClick={props.handleClick}>
      <div className={styles[`${PrefixCls}-outer-image`]} style={{ backgroundImage: `url(${props.image})` }} />
      <div className={styles[`${PrefixCls}-outer-content`]}>
        <h3>{props.text}</h3>
        <div className={styles[`${PrefixCls}-outer-info`]}>
          <div className={styles[`${PrefixCls}-outer-info-box`]}>
            <span style={{ color: 'red' }}><Icon type={getLocalIcon('/components/rmb.svg')} size="xxs" /></span>
            <span style={{ color: 'red', marginLeft: '5px' }}>{props.price}</span>
          </div>
          <div className={styles[`${PrefixCls}-outer-info-box`]}>
            <span ><Icon type={getLocalIcon('/components/people.svg')} size="xxs" /></span>
            <span style={{ marginLeft: '10px' }}>{props.number}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

InfoBox.defaultProps = {
  image: '',
  title: 'hxi',
  price: '免费',
  number: '212',
};
InfoBox.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default InfoBox;
