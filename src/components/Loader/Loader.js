/**
 * @author Lowkey
 * @date 2018/11/27 17:53:35
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Loader.less';

const Loader = ({ spinning = false }) => {
  return (

    <div className={classNames(styles.ldsCss, styles.ngScope, { [styles.hidden]: !spinning })} >
      <div style={{ width: ' 100 % ', height: '100 % ' }} className={styles.ldsRolling} >
        <div />
      </div >
    </div >

  );
};


Loader.propTypes = {
  spinning: PropTypes.bool,
};

export default Loader;
