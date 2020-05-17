import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import AttendanceHead from 'components/attendancehead';
import WeekBox from 'components/weekbox';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { ContentSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'attendancedetails';


function AttendanceDetails ({ location, dispatch, attendancedetails, fetching }) {
  const { name = '考勤详情', fullname = '', startdate, enddate } = location.query,
    { data } = attendancedetails;
  const headProps = {
    fullname,
    startdate,
    enddate,
    attendance: data
  };
  return (
    <div >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      {
        fetching ?
          <ContentSkeleton />
          :
          <div className={styles[`${PrefixCls}-outer`]} >
            <AttendanceHead {...headProps} />
            {parseInt(enddate, 10) * 1000 < new Date().getTime() ? null : <WeekBox attendance={data} />}
          </div >
      }
    </div >
  );
}

export default connect(({ loading, attendancedetails }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  attendancedetails,
}))(AttendanceDetails);
