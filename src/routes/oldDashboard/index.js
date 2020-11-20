import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout, WhiteSpace, Icon, List, Tabs } from 'components';
import Refresh from 'components/pulltorefresh';
import { taskRow, taskLessonRow } from 'components/row';
import { getLocalIcon } from 'utils';
import {
  handlerLessonListClick,
  handlerChangeRouteClick,
  handlerCourseClick,
  handlerDivInnerHTMLClick
} from 'utils/commonevents';
import Notice from 'components/noticebar/index';
import TimeLine from 'components/timeline/index';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';

const PrefixCls = 'oldDashboard';
const OldDashboard = ({ oldDashboard, loadingTask, loadingAllTask, dispatch }) => {
  const tabs = [
    { title: '本周未完成任务' },
    { title: '全部未完成任务' }
  ];

  const { OldHeader, BaseLine } = Layout,
    { taskList, taskAllList, refreshing = false, selectIndex = 0, count = '', sysNotice, lessonTop, taskTop } = oldDashboard,
    moreMessage = (text) => {
      dispatch(routerRedux.push({
        pathname: '/details',
        query: {
          type: 'detailsText',
          content: text,
          name: '通知详情'
        }
      }));
    },
    handlerClose = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: false
        }
      });
    },
    onTabsChange = (tab, index) => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          selectIndex: index

        }
      });
      if (index === 1) {
        dispatch({
          type: `${PrefixCls}/queryAllTask`
        });
      }
    },
    onRefresh = (type) => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: true
        }
      });
      dispatch({
        type: `${PrefixCls}/${type}`
      });
    },
    onScrollerTaskTop = (top) => {
      if (typeof top !== 'undefined' && !isNaN(top * 1)) {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            taskTop: top
          }
        });
      }
    },
    onScrollerLessonTop = (top) => {
      if (typeof top !== 'undefined' && !isNaN(top * 1)) {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            lessonTop: top
          }
        });
      }
    };
  return (
    <div className={styles[`${PrefixCls}-outer`]}>
      <OldHeader
        count={count}
        handlerClick={handlerChangeRouteClick.bind(null, 'messageCenter', { name: '消息中心' }, dispatch)}
      />
      {JSON.stringify(sysNotice) !== '{}' && sysNotice.noticeContent && sysNotice.noticeContent !== '' ?
        <Notice
          content={sysNotice.noticeContent}
          handlerClose={() => handlerClose()}
          handlerClick={() => moreMessage(sysNotice.noticeContent)}
        />
        :
        null
      }
      <Tabs
        tabs={tabs}
        initialPage={0}
        swipeable={false}
        page={selectIndex}
        onChange={onTabsChange}
        tabBarInactiveTextColor="#b7b7b7"
        tabBarUnderlineStyle={{ border: '1px solid #22609c' }}
      >
        <div>
          <TimeLine />
          <WhiteSpace />
          <div className={styles[`${PrefixCls}-tasklist`]}>
            {loadingTask && !refreshing ?
              <ListSkeleton />
              :
              cnIsArray(taskList) && taskList.length > 0 ?
                <Refresh
                  refreshing={refreshing}
                  onRefresh={onRefresh.bind(null, 'query')}
                  onScrollerTop={onScrollerTaskTop.bind(null)}
                  scrollerTop={taskTop}
                >
                  {taskList.map((item) => {
                    return taskRow(item, handlerCourseClick.bind(null, item, item.courseid, dispatch), (e) => handlerDivInnerHTMLClick(e, item.courseid, dispatch));
                  })}
                  <BaseLine />
                </Refresh>
                :
                <NoContent />
            }
          </div>
        </div>
        <div className={styles[`${PrefixCls}-tasklist`]}>
          <WhiteSpace />
          {loadingAllTask && !refreshing ?
            <ListSkeleton />
            :
            cnIsArray(taskAllList) && taskAllList.length > 0 ?
              <Refresh
                refreshing={refreshing}
                onRefresh={onRefresh.bind(null, 'queryAllTask')}
                onScrollerTop={onScrollerLessonTop.bind(null)}
                scrollerTop={lessonTop}
              >
                {taskAllList.map((item) => {
                  return taskLessonRow(item, handlerLessonListClick, dispatch);
                })}
                <BaseLine />
              </Refresh>
              :
              <NoContent />
          }
        </div>
      </Tabs>
    </div>
  );
};

OldDashboard.propTypes = {};

export default connect(({ oldDashboard, loading }) => ({
  oldDashboard,
  loadingTask: loading.effects[`${PrefixCls}/query`],
  loadingAllTask: loading.effects[`${PrefixCls}/queryAllTask`]
}))(OldDashboard);
