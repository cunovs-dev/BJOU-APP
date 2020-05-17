import React from 'react';
import { Icon, WhiteSpace } from 'components';
import { getLocalIcon } from 'utils';
import Tag from 'components/tag';
import styles from './index.less';

const PrefixCls = 'weekbox',
  grid = [
    { day1: 0 },
    { day2: 0 },
    { day3: 0 },
    { day4: 0 },
    { day5: 0 },
    { day6: 0 },
    { day7: 0 }
  ];

const getGrid = (obj) => {
  const arr = [];
  Object.keys(obj)
    .map((items, i) => {
      let o = {};
      o[items] = obj[items];
      arr.push(o);
    });
  return arr;
};

const getWeekAttendance = (obj) => {
  let num = 0;
  Object.keys(obj)
    .map((items) => {
      if (parseInt(obj[items], 10) === 1) {
        num += 1;
      }
    });
  return num;
};

class ReportWeekBox extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { data } = this.props,
      { name, state, studentId, attendance, absent } = data;
    return (
      <div className={styles[`${PrefixCls}-population`]} key={studentId}>
        <div className={styles[`${PrefixCls}-firstLine`]}>
          <div className={styles[`${PrefixCls}-firstLine-title`]}>
            <div className={styles[`${PrefixCls}-firstLine-title-name`]}>{name}</div>
            <div className={styles[`${PrefixCls}-firstLine-title-id`]}>{`学号:${studentId}`}</div>
          </div>
          <div className={styles[`${PrefixCls}-firstLine-details`]}>
            <span>{`缺勤周数：${absent}`}</span>
            <Tag
              text={state === '1' ? '合格' : '不合格'}
              color={state === '1' ? 'green' : 'red'}
              size="xs" />
          </div>
        </div>
        <div style={{ paddingBottom: '0.2rem' }}>
          <div className={styles[`${PrefixCls}-week`]}>
            {grid.map((item, index) => (
              <div key={index} className={styles[`${PrefixCls}-week-div`]}>
                {['一', '二', '三', '四', '五', '六', '日'][index]}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ReportWeekBox;
