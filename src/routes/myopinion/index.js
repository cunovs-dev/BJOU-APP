import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { opinionRow } from 'components/row';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'myopinion';

function MyOpinion ({ location, dispatch, myopinion, loading }) {
  const { list, refreshing, scrollerTop } = myopinion,
    { name = '我的反馈' } = location.query,
    onRefresh = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: true,
        },
      });
      dispatch({
        type: `${PrefixCls}/queryList`,
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
    };
  return (
    <div className={styles.whiteBox} >
      <Nav title={name} dispatch={dispatch} hasShadow />
      <div className={styles[`${PrefixCls}-outer`]} >
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
                  return opinionRow(item, handlerChangeRouteClick, dispatch);
                })}
                <WhiteSpace size="lg" />
              </Refresh >
              :
              <NoContent />
        }
      </div >
    </div >
  );
}

export default connect(({ loading, myopinion }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  myopinion,
}))(MyOpinion);
