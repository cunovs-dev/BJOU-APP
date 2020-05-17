import React from 'react';
import styles from './baseline.less';

function BaseLine () {
  return (
    <div className={styles.baseline}>
      <p className={styles['baseline-content']}>
        <span>——————</span>
        <span>到底了</span>
        <span>——————</span>
      </p>
    </div>
  );
}
export default BaseLine;
