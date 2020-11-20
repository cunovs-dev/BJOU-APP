import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { openingLessonRow } from 'components/row';
import { handlerLessonListClick, handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'opening';

function Opening ({ location, dispatch, opening, loading }) {
  const { name = '在开课程' } = location.query,
    { list, refreshing, scrollerTop } = opening,
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
    <div >
      <Nav title={name} isGoBack={false} hasShadow navFixed={false} />
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-outer`]} >
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
                  return openingLessonRow(item, handlerLessonListClick, (e) => {
                    e.stopPropagation();
                    handlerChangeRouteClick('achievementdetails', {
                      name: item.name,
                      courseid: item.id,
                      grade: item.graderaw,
                    }, dispatch, e);
                  }, dispatch);
                })}
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
              </Refresh >
              :
              <NoContent />
        }
      </div >
    </div >
  );
}

export default connect(({ loading, opening }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  opening,
}))(Opening);
