import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import { appealRow } from 'components/row';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'appeallist';


function AppealList ({ location, dispatch, appeallist, loading }) {
  const { name = '学生反馈', courseid } = location.query,
    { listData, hasMore, scrollerTop } = appeallist,
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
      const result = [];
      result.push(
        <ListView
          layoutHeader={''}
          dataSource={lists}
          layoutRow={(rowData, sectionID, rowID) => {
            return appealRow(rowData, sectionID, rowID, handlerChangeRouteClick, dispatch);
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
    <div className={styles.whiteBox} >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-outer`]} >
        {listData.length > 0 ? getContents(listData) : <NoContent isLoading={loading} />}
      </div >
    </div >
  );
}

export default connect(({ loading, appeallist }) => ({
  loading: loading.effects['appeallist/queryList'],
  appeallist,
}))(AppealList);
