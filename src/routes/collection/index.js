import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import ListView from 'components/listview';
import { collectionRow } from 'components/row';
import { handlerPortalNoticeClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import styles from './index.less';


const PrefixCls = 'collection';

function Collection ({ location, dispatch, collection, loading }) {
  const { list, paginations, scrollerTop } = collection,
    { name = '我的收藏' } = location.query,
    onRefresh = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          isRefresh: true
        },
        callback
      });
    },
    onEndReached = (callback) => {
      dispatch({
        type: `${PrefixCls}/queryList`,
        callback
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
      const { currentPage, count, pageSize } = paginations,
        hasMore = (count > 0) && ((currentPage > 1 ? currentPage - 1 : 1) * pageSize < count);
      const result = [];
      result.push(
        <ListView
          layoutHeader={''}
          dataSource={lists}
          layoutRow={(rowData, sectionID, rowID) => {
            return collectionRow(rowData, sectionID, rowID, handlerPortalNoticeClick, dispatch);
          }}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          hasMore={hasMore}
          useBodyScroll
          onScrollerTop={onScrollerTop.bind(null)}
          scrollerTop={scrollerTop}
        />
      );

      return result;
    };
  return (
    <div className={styles.whiteBox}>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-outer`]}>
        {cnIsArray(list) && list.length > 0 ? getContents(list) : <NoContent isLoading={loading} />}
      </div>
    </div>
  );
}

export default connect(({ loading, collection }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  collection
}))(Collection);
