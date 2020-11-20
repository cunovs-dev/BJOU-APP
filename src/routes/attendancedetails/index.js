import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon, getAttendanceTime } from 'utils';
import Nav from 'components/nav';
import AttendanceHead from 'components/attendancehead';
import Refresh from 'components/pulltorefresh';
import WeekBox from 'components/weekbox';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { ContentSkeleton } from 'components/skeleton';
import styles from './index.less';
import { refreshAttendance } from '../../services/app';


const PrefixCls = 'attendancedetails';


function AttendanceDetails ({ location, dispatch, attendancedetails, fetching }) {
  const { name = '考勤详情', fullname = '', startdate, enddate, courseid = '' } = location.query,
    { data, refreshing } = attendancedetails;
  const { update_timer = '' } = data;
  const headProps = {
      fullname,
      startdate,
      enddate,
      attendance: data
    },
    onRefresh = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: true
        }
      });
      dispatch({
        type: `${PrefixCls}/refreshAttendance`,
        payload: {
          courseid
        }
      });
    };
  return (
    <div>
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-time`]}>
        <span>
          {
            update_timer !== '' ?
            <span>
              数据更新时间：
              <span
                style={{ color: `${getAttendanceTime(parseInt(update_timer, 10)).color}` || '' }}> {`${getAttendanceTime(parseInt(update_timer, 10)).time || '未知'}`}</span>
                  </span>
                                :
            null
          }
        </span>
        <span className={styles[`${PrefixCls}-time-btn`]} onClick={() => onRefresh()}>
          更新考勤状态
          <Icon type={getLocalIcon('/sprite/refresh.svg')} size="xxs" color="#2B83D7" />
        </span>
      </div>
      <Refresh
        refreshing={refreshing}
        onRefresh={() => onRefresh()}
      >
        {
          fetching ?
          <ContentSkeleton />
                   :
          <div className={styles[`${PrefixCls}-outer`]}>
            <AttendanceHead {...headProps} />
            <WeekBox attendance={data} />
          </div>
        }
      </Refresh>
    </div>
  );
}

export default connect(({ loading, attendancedetails }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  attendancedetails
}))(AttendanceDetails);
