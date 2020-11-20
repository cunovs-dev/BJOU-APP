import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import Refresh from 'components/pulltorefresh';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import { teachersRow } from 'components/row';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';


const PrefixCls = 'teachers';

function Teachers ({ location, dispatch, teachers, loading }) {
  const { listData, refreshing, scrollerTop } = teachers,
    onRefresh = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: true
        }
      });
      dispatch({
        type: `${PrefixCls}/queryList`
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
    };
  return (
    <div className={styles.whiteBox}>
      <Nav title="我的老师" hasShadow dispatch={dispatch} />
      <WhiteSpace size="lg" />
      <div className={styles[`${PrefixCls}-outer`]}>
        {
          loading && !refreshing ?
          <ListSkeleton />
                                :
          listData.length > 0 ?
          <Refresh
            refreshing={refreshing}
            onRefresh={onRefresh}
            onScrollerTop={onScrollerTop.bind(null)}
            scrollerTop={scrollerTop}
          >
            {cnIsArray(listData) && listData.map((item) => {
              return teachersRow(item, handlerChangeRouteClick, dispatch);
            })
            }
            <WhiteSpace size="lg" />
          </Refresh>
                              :
          <NoContent />
        }

      </div>

    </div>
  );
}

export default connect(({ loading, teachers }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  teachers
}))(Teachers);
