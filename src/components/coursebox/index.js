
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const PrefixClis = 'coursebox';

const CourseBox = (props) => {
  return (
    <div className={styles[`${PrefixClis}-outer`]} style={{ background: props.bgColor }}>
      <div className={styles[`${PrefixClis}-outer-text`]} style={{ color: props.color }}>
        {props.text}
      </div>
      <div className={styles[`${PrefixClis}-outer-info`]}>
        <div className={styles[`${PrefixClis}-outer-info-box`]}>
          <span style={{ color: props.color }}><Icon type={getLocalIcon('/components/rmb.svg')} size="xxs" /></span>
          <span style={{ color: props.color, marginLeft: '5px' }}>{props.price}</span>
        </div>
        <div className={styles[`${PrefixClis}-outer-info-box`]}>
          <span style={{ color: props.color }}><Icon type={getLocalIcon('/components/people.svg')} size="xxs" /></span>
          <span style={{ color: props.color, marginLeft: '10px' }}>{props.number}</span>
        </div>
      </div>
    </div>
  );
};

CourseBox.defaultProps = {
  color: '#fff',
  bgColor: '#00aaff',
  title: '',
  price: '免费',
  number: 0,
};
CourseBox.propTypes = {
  color: PropTypes.string
};

export default CourseBox;
