/**
 * @author Lowkey
 * @date 2020/03/04 17:47:05
 * @Description:
 */

import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import ArrowHead from 'components/arrowHead';
import GroupSelect from 'components/group';
import SelectBox from 'components/selectBox';
import ReportWeekBox from 'components/ReportWeekBox';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import styles from './index.less';


const PrefixCls = 'attendanceReport';
const overlay = [
  {
    key: 1,
    value: 'all',
    label: '仅显示不合格'
  },
  {
    key: 2,
    value: 'submitted',
    label: '已提交'
  },
  {
    key: 3,
    value: 'uncommitted',
    label: '未提交'
  }
];

function AttendanceReport ({ location, dispatch, attendanceReport, fetching }) {
  const { name = '考勤周报', fullname = '', startdate, enddate } = location.query,
    { listData, hasMore, scrollerTop } = attendanceReport;

  const onRefresh = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          callback,
          isRefresh: true,
          courseid
        }
      });
    },
    onEndReached = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          callback,
          courseid
        }
      });
    },
    onScrollerTop = (top) => {
      if (typeof top !== 'undefined' && !isNaN(top * 1)) {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            scrollerTop: top
          }
        });
      }
    },
    getContents = (lists) => (
      <ListView
        layoutHeader={''}
        dataSource={lists}
        layoutRow={(rowData) => {
          return <ReportWeekBox data={rowData} dispatch={dispatch} onClick={handlerChangeRouteClick} />;
        }}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        hasMore={hasMore}
        onScrollerTop={onScrollerTop.bind(null)}
        useBodyScroll
        scrollerTop={scrollerTop}
      />
    );
  return (
    <div className={styles.whiteBox}>
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <div>
        <div className={styles[`${PrefixCls}-outer`]}>
          <ArrowHead>
            <div className={styles.title}>课程名称</div>
            <div className={styles.info}>
              <div>{`开课时间：${'2019-09-02'}~2020-01-13 (共 19 周)`}</div>
              <div>{`周全勤天数要求：${'1天/周'}`}</div>
              <div>{`考勤合格标准：${'未达标周数小于 10周'}`}</div>
            </div>
          </ArrowHead>
        </div>
        <GroupSelect />
        <WhiteSpace />
        <SelectBox title='周次（3）' defaultChoice="仅显示不合格" overlay={overlay} />
        <WhiteSpace />
        <div className={styles.list}>
          {listData.length > 0 ? getContents(listData) : <NoContent isLoading={fetching} />}
        </div>
      </div>
    </div>
  );
}

export default connect(({ loading, attendanceReport }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  attendanceReport
}))(AttendanceReport);
