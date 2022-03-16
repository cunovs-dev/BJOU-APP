import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { closeLessonRow } from 'components/row';
import { handlerLessonListClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'closed';

function Closed ({ location, dispatch, closed, loading }) {
  const { list, refreshing, scrollerTop } = closed,
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
    <div className={styles[`${PrefixCls}-outer`]}>
      <Nav title="已开课程" isGoBack={false} hasShadow navFixed={false} />
      <div>
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
              return closeLessonRow(item, handlerLessonListClick, dispatch);
            })}
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </Refresh>
                          :
          <NoContent />
        }
      </div>
    </div>
  );
}

export default connect(({ loading, closed }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  closed
}))(Closed);
