import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout, Flex } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { courseGKRow } from 'components/row';
import { handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';

const { Decorate } = Layout;
const PrefixCls = 'courseGK';

function CourseGK ({ location, dispatch, courseGK, loading }) {
  const { data: { courseInfos = [], studentInfo = {} }, refreshing, scrollerTop } = courseGK,
    { graduationScore = 0, examScore = 0, creditsEarned = 0 } = studentInfo,

    { name = '' } = location.query,
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
      <div className={styles.outer}>
        <Decorate />
        <div className={styles.grade}>
          <Flex>
            <Flex.Item>
              <div className={styles.gradeItem}>
                <p>{graduationScore}</p>
                <p>毕业学分</p>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={styles.itemMiddle}>
                <p>{examScore}</p>
                <p>中央学分</p>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={styles.gradeItem}>
                <p>{creditsEarned}</p>
                <p>已得学分</p>
              </div>
            </Flex.Item>
          </Flex>
        </div>
        <WhiteSpace />
        <div className={styles.content}>
          {
            loading && !refreshing ?
            <ListSkeleton />
                                   :
            courseInfos.length > 0 ?
            <Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
              onScrollerTop={onScrollerTop.bind(null)}
              scrollerTop={scrollerTop}
            >
              {cnIsArray(courseInfos) && courseInfos.map((item, i) => {
                return courseGKRow(item, handlerChangeRouteClick, i, dispatch);
              })}
            </Refresh>
                                   :
            <NoContent />
          }
        </div>
      </div>
    </div>
  );
}

export default connect(({ loading, courseGK }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  courseGK
}))(CourseGK);
