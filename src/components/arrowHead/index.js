import React from 'react';
import { changeLessonDate } from 'utils';
import styles from './index.less';

const PrefixCls = 'arrowHead';

const ArrowHead = (props) => {

  return (
    <div>
      <div className={styles[`${PrefixCls}-population`]}>
        {props.children}
      </div>
      <div className={styles[`${PrefixCls}-disan`]} />
    </div>
  );
};

export default ArrowHead;
