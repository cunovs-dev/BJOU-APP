import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { ListSkeleton } from 'components/skeleton';
import { attendanceRow } from 'components/row';
import NoContent from 'components/nocontent';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';


const PrefixCls = 'attendance';


function Attendance ({ location, dispatch, attendance, loading }) {
  const { name = '我的考勤' } = location.query,
    { listData, refreshing, scrollerTop } = attendance;
  const onRefresh = () => {

    },
    onScrollerTop = (top) => {
      if (typeof top !== 'undefined' && !isNaN(top * 1)) {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            scrollerTop: top,
          },
        });
      }
    };
  return (
    <div className={styles.whiteBox} >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <Refresh
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScrollerTop={onScrollerTop.bind(null)}
        scrollerTop={scrollerTop}
      >
        {
          loading ?
            <ListSkeleton />
            :
            cnIsArray(listData) && listData.length > 0 ?
              listData.map((item) => {
                return attendanceRow(item, handlerChangeRouteClick.bind(null, 'attendancedetails',
                  {
                    name: '考勤详情',
                    courseid: item.id,
                    enddate: item.enddate,
                    startdate: item.startdate,
                    fullname: item.fullname
                  }
                  , dispatch));
              })
              :
              <NoContent />
        }
      </Refresh >
    </div >
  );
}

export default connect(({ loading, attendance }) => ({
  loading: loading.effects['attendance/queryList'],
  attendance,
}))(Attendance);
