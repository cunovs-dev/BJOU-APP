import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import { groupListRow } from 'components/row';
import ListView from 'components/listview';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import styles from './index.less';


const PrefixCls = 'groupdetails';


function GroupDetails ({ location, dispatch, groupdetails, loading }) {
  const { name = '小组成员', courseid, groupName = '' } = location.query,
    { listData, hasMore, scrollerTop } = groupdetails,
    onRefresh = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          callback,
          isRefresh: true,
          courseid
        },
      });
    },
    onEndReached = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          callback,
          courseid
        },
      });
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
    },
    getContents = (lists) => {
      return (
        <ListView
          layoutHeader={''}
          dataSource={lists}
          layoutRow={(rowData, sectionID, rowID) => {
            return groupListRow(rowData, sectionID, rowID, handlerChangeRouteClick, dispatch, name);
          }}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          hasMore={hasMore}
          onScrollerTop={onScrollerTop.bind(null)}
          useBodyScroll
          scrollerTop={scrollerTop}
        />
      );
    };
  return (
    <div className={styles.whiteBox} >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <div className={styles.outer} >
        <div className={styles.title} >{groupName}</div >
        <WhiteSpace />
        {listData.length > 0 ? getContents(listData) : <NoContent isLoading={loading} />}
      </div >
    </div >
  );
}

export default connect(({ loading, groupdetails }) => ({
  loading: loading.effects['groupdetails/queryList'],
  groupdetails,
}))(GroupDetails);
