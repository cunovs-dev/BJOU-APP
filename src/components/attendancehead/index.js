import React from 'react';
import PropTypes from 'prop-types';
import { changeLessonDate } from 'utils';
import styles from './index.less';
import Huise from './huise.png';

const PrefixCls = 'DaiJianTou';

class AttendanceHead extends React.Component {
  constructor (props) {
    super(props);
  }

  getPassedNum = (arr) => {
    const { weekStat } = this.props.attendance;
    let num = 0;
    arr.map((item, i) => {
      if (item.stat === 1) {
        num += 1;
      }
    });
    if (weekStat) {
      num += 1;
    }
    return num;
  };

  getNoPassedNum = (arr) => arr.filter(item => item.stat === 0).length;

  render () {
    const { fullname, startdate, enddate, attendance } = this.props,
      { day_pass: dayPass = '', weeks = '', passed_weeks: passedWeeks = [] } = attendance;
    return (
      <div >
        <div className={styles[`${PrefixCls}-population`]} >
          <div className={styles[`${PrefixCls}-population-title`]} >{fullname}</div >
          <div className={styles[`${PrefixCls}-population-content`]} >
            <div className={styles[`${PrefixCls}-population-content-left`]} >
              <div >开课时间:{`${changeLessonDate(startdate)}-${changeLessonDate(enddate)}`}</div >
              <div >{`周全勤天数要求:${dayPass}次/周`}</div >
              <div >实际教学周数:{weeks}</div >
            </div >
            <div className={styles[`${PrefixCls}-population-content-right`]} >
              <div style={{ backgroundImage: `url(${Huise})` }}
                   className={styles[`${PrefixCls}-population-content-right-imag`]}
              >
                <div className={styles[`${PrefixCls}-population-content-right-imag-content`]} >
                  <div style={{ fontSize: '0.6rem' }} >{this.getPassedNum(passedWeeks)}</div >
                  <div style={{ paddingTop: '0rem' }} >达标</div >
                </div >
              </div >
              <div className={styles[`${PrefixCls}-population-content-right-imag-tips`]} >
                {`未达标周次${this.getNoPassedNum(passedWeeks)}`}
              </div >
            </div >
          </div >
        </div >
        <div className={styles[`${PrefixCls}-disan`]} />
      </div >
    );
  }
}

export default AttendanceHead;
