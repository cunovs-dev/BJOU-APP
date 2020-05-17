/**
 * @author Lowkey
 * @date 2019/04/02 14:39:52
 * @Description:
 */
import React from 'react';
import { Icon } from 'components';
import { getLocalIcon, getCommonDate } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const getStatus = (type) => {
  const res = {
    inprogress: '进行中',
    finished: '完成',
    abandoned: '从未提交',
    overdue: '逾期'
  };
  return res[type];
};
const Status = (props) => {
  const attempts = props.data,
    maxgrade = props.maxgrade,
    sumgrades = props.sumgrades,
    decimalpoints = props.decimalpoints;
  return (
    <div className={styles.status} >
      <div className={styles.title} >
        <span ><Icon type={getLocalIcon('/sprite/statusbar.svg')} color="#22609c" /></span >
        <span >您上次答题的状态</span >
      </div >
      <div className={styles.box} >
        <div className={styles.header} >
          <div >试卷</div >
          <div >状态</div >
          <div >{`成绩/${maxgrade}`}</div >
        </div >
        {cnIsArray(attempts) && attempts.map((item, i) => {
          const getGrade = () => {
            let num = item.sumgrades * maxgrade / sumgrades;
            if (num >= 0.00005) {
              const multiplier = Math.pow(10, decimalpoints);
              num = Math.round(num * multiplier) / multiplier;
            } else {
              num = 0;
            }
            return num;
          };
          return (
            <div
              key={i}
              className={styles.header}
              onClick={item.state === 'finished'
                ? handlerChangeRouteClick.bind(null, 'quizReview', {
                  attemptid: item.id,
                }, props.dispatch)
                :
                null
              }
            >
              <div >{item.attempt}</div >
              <div >
                <span className={styles.state}>{getStatus(item.state)}</span >
                <span >{item.timefinish > 0 ? getCommonDate(item.timefinish) : '-'}</span >
              </div >
              {item.state === 'finished' ?
                <div >
                  {!isNaN(item.sumgrades) ? `${getGrade()}/${maxgrade}` : '未评分'}
                </div >
                :
                '未评分'}
            </div >
          );
        })}
      </div >
    </div >
  );
};
export default Status;
