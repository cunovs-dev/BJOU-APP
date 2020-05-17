import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { timetableRow } from 'components/row';
import { handlerLessonListClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'timetable';

function Timetable ({ location, dispatch, timetable, loading }) {
  const { list, refreshing, scrollerTop } = timetable,
    { name = '课程表' } = location.query,
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
      <Nav title={name} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-outer`]}>
        <WhiteSpace />
        {
          loading && !refreshing ?
          <ListSkeleton />
                                 :
          list.length > 0 ?
          <Refresh
            refreshing={refreshing}
            onRefresh={onRefresh}
            onScrollerTop={onScrollerTop.bind(null)}
            scrollerTop={scrollerTop}
          >
            {cnIsArray(list) && list.map((item) => {
              return timetableRow(item.course || {}, handlerLessonListClick, dispatch);
            })}
            <WhiteSpace size="lg" />
          </Refresh>
                          :
          <NoContent />
        }
      </div>
    </div>
  );
}

export default connect(({ loading, timetable }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  timetable
}))(Timetable);
