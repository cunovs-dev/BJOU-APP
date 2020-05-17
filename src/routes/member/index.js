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
import { memberRow, finalReportRow } from 'components/row';
import GroupSelect from 'components/group';
import ListView from 'components/listview';
import SelectBox from 'components/selectBox';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import styles from './index.less';


const PrefixCls = 'member';
const teacher = {
  id: 1,
  name: '潘达',
  role: '辅导教师',
  tel: '13503323532',
  email: '324325@153.com',
  visit: '44小时3分'
};
const overlay = [
  {
    key: 1,
    value: 'visit',
    label: '上次访问时间'
  },
  {
    key: 2,
    value: 'uncommitted',
    label: '默认排序'
  }
];

function Member ({ location, dispatch, member, loading }) {
  const { name = '评阅详情', courseid, groupName = '' } = location.query,
    { listData, hasMore, scrollerTop } = member,
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
            return memberRow(rowData, sectionID, rowID, handlerChangeRouteClick, handlerChangeRouteClick, dispatch);
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
      <GroupSelect />
      <WhiteSpace size="sm" />
      <div className={styles.outer}>
        <div>
          {finalReportRow(teacher, handlerChangeRouteClick, handlerChangeRouteClick, dispatch)}
        </div>
        <WhiteSpace />
        <SelectBox title='成员' defaultChoice="上次访问时间" overlay={overlay} />
        <WhiteSpace />
        {listData.length > 0 ? getContents(listData) : <NoContent isLoading={loading} />}
      </div>
    </div>
  );
}

export default connect(({ loading, member }) => ({
  loading: loading.effects['member/fetch'],
  member
}))(Member);
