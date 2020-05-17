/**
 * @author Lowkey
 * @date 2019/02/14 17:19:26
 * @Description:
 */
import React from 'react';
import { DateChange, getLocalIcon } from 'utils';
import { Icon } from 'antd-mobile';
import styles from './index.less';

const PrefixCls = 'timeline';

const TimeLine = () => {
  return (
    <div className={styles[`${PrefixCls}-outer`]}>
        <Icon type={getLocalIcon('/dashboard/calendar.svg')} size="xs" color="#22609c" />
      <div className={styles[`${PrefixCls}-outer-time`]}>
        {DateChange()}
      </div>
    </div>
  );
};
export default TimeLine;
