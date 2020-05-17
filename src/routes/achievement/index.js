import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Toast } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import { achievementRow } from 'components/row';
import { ListSkeleton } from 'components/skeleton';
import Refresh from 'components/pulltorefresh';
import NoContent from 'components/nocontent';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';


const PrefixCls = 'achievement';

function Achievement ({ location, dispatch, achievement, loading }) {
  const { listData, scrollerTop, refreshing } = achievement;
  const onRefresh = () => {

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
    <div className={styles[`${PrefixCls}-outer`]} >
      <Nav title="我的成绩" hasShadow dispatch={dispatch} />
      <div >
        <WhiteSpace />
        <Refresh
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScrollerTop={onScrollerTop.bind(null)}
          scrollerTop={scrollerTop}
        >
          {
            loading ?
              <ListSkeleton />
              :
              listData.length > 0 ? listData.map(item => achievementRow(item, item.openState === '0' ? handlerChangeRouteClick.bind(null, 'achievementdetails', {
                  courseid: item.id,
                  grade: item.graderaw || 0
                }, dispatch) : () => (Toast.fail('暂时不能查看已结课成绩'))))
                :
                <NoContent />
          }
        </Refresh >
      </div >
    </div >
  );
}

export default connect(({ loading, achievement }) => ({
  loading: loading.effects['achievement/queryList'],
  achievement,
}))(Achievement);
