import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { progressRow } from 'components/row';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'progressList';

function ProgressList ({ location, dispatch, progressList, loading }) {
  const { list, refreshing, scrollerTop, grade, totalGrade } = progressList,
    { name = '学业进度' } = location.query,
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
        <WhiteSpace size="lg" />
        <div className={styles[`${PrefixCls}-outer-title`]}>
          {`获取毕业证的学分条件：已得学分/总学分（${grade}/${totalGrade}）`}
        </div>
        <WhiteSpace size="lg" />
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
            {cnIsArray(list) && list.map((item, i) => {
              return progressRow(item, i, handlerChangeRouteClick, dispatch);
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

export default connect(({ loading, progressList }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  progressList
}))(ProgressList);
