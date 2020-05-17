import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import PhotoBox from '../../../components/photobox';

const ResetType = (props) => {

  return (
    <div className={styles.container}>
      {
        props.type === 'phone' ?
        <div>
          <span className={styles.active}>手机找回</span>
          <span onClick={props.handlerClick}>邮箱找回</span>
        </div>
                               :
        <div>
          <span onClick={props.handlerClick}>手机找回</span>
          <span className={styles.active}>邮箱找回</span>
        </div>
      }
    </div>
  );
};

PhotoBox.PropTypes = {
  handlerClick: PropTypes.func.isRequired
};

PhotoBox.defaultProps = {
  handlerClick: null
};

export default ResetType;
