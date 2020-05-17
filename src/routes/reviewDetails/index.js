/**
 * @author Lowkey
 * @date 2020/03/02 16:04:42
 * @Description:
 */
import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import { reviewListRow, finalReportRow } from 'components/row';
import ListView from 'components/listview';
import SelectBox from 'components/selectBox';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import styles from './index.less';


const PrefixCls = 'reviewDetails';
const teacher = {
  id: 1,
  name: '潘达',
  role: '辅导教师',
  tel: '13503323532',
  email: '324325@153.com'
};
const overlay = [
  {
    key: 1,
    value: 'all',
    label: '显示所有'
  },
  {
    key: 2,
    value: 'uncommitted',
    label: '未提交'
  }
];

function ReviewDetails ({ location, dispatch, reviewDetails, loading }) {
  const { name = '评阅详情', courseid, groupName = '' } = location.query,
    { listData, hasMore, scrollerTop } = reviewDetails,
    onRefresh = (callback) => {
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
    getContents = (lists) => {
      const result = [];
      result.push(
        <ListView
          layoutHeader={''}
          dataSource={lists}
          layoutRow={(rowData, sectionID, rowID) => {
            return reviewListRow(rowData, sectionID, rowID, handlerChangeRouteClick, dispatch, name);
          }}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          hasMore={hasMore}
          onScrollerTop={onScrollerTop.bind(null)}
          useBodyScroll
          scrollerTop={scrollerTop}
        />
      );
      return result;
    };

  return (
    <div className={styles.whiteBox}>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles.outer}>
        <div className={styles.title}>学习活动1.1 评价幼儿健康成长状况（5分,考勤活动)</div>
        <div>
          {finalReportRow(teacher, handlerChangeRouteClick, handlerChangeRouteClick, dispatch)}
        </div>
        <WhiteSpace />
        <SelectBox title='成员' defaultChoice="显示所有" overlay={overlay} />
        <WhiteSpace />
        {listData.length > 0 ? getContents(listData) : <NoContent isLoading={loading} />}
      </div>
    </div>
  );
}

export default connect(({ loading, reviewDetails }) => ({
  loading: loading.effects['reviewDetails/queryList'],
  reviewDetails
}))(ReviewDetails);
