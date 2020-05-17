/**
 * @author Lowkey
 * @date 2020/03/12 17:16:16
 * @Description: 首页修改 again and again
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout, WhiteSpace, Icon, List, Tabs, Badge, Grid } from 'components';
import Refresh from 'components/pulltorefresh';
import { taskRow, taskLessonRow } from 'components/row';
import { getLocalIcon } from 'utils';
import {
  handlerLessonListClick,
  handlerChangeRouteClick,
  handlerCourseClick,
  handlerDivInnerHTMLClick
} from 'utils/commonevents';
import Notice from 'components/noticebar';
import TimeLine from 'components/timeline/index';
import bell from '../../themes/images/others/bell.png';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';
import { _cg } from '../../utils/cookie';

const PrefixCls = 'dashboard';
const Dashboard = ({ dashboard, loadingTask, loadingAllTask, dispatch }) => {
  const tabs = [
    { title: '本周未完成任务' },
    { title: '全部未完成任务' }
  ];

  const { Header, BaseLine } = Layout,
    { taskList, taskAllList, refreshing = false, selectIndex = 0, count, sysNotice, lessonTop, taskTop, menus, payState } = dashboard,
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
    },
    renderItem = (el) => {
      const { icon = '', text = '', badge = false } = el;
      return (
        badge ?
        (
          <div className={styles.items}>
            <Badge text={0} overflowCount={99}>
              <img className={styles.img} src={icon} alt="" />
            </Badge>
            <div className={styles.text}>{text}</div>
          </div>
        )
              :
        (
          <div className={styles.items}>
            <img className={styles.img} src={icon} alt="" />
            <div className={styles.text}>{text}</div>
          </div>
        )
      );
    },

    gridClick = ({ path, text, queryType }) => {
      handlerChangeRouteClick(path, {
        name: text,
        queryType
      }, dispatch);
    };
  return (
    <div className={styles.outer}>
      <Header
        headImg={_cg('portalHeadImg')}
        payState={payState}
        handlerClick={() => handlerChangeRouteClick('homepage', {}, dispatch)}
      />
      <div className={styles.content}>
        <div className={styles.grid}>
          {sysNotice.noticeContent && sysNotice.noticeContent !== '' ?
           <div className={styles.systemNotice}>
             <Notice content={sysNotice.noticeContent} handlerClick={() => moreMessage(sysNotice.noticeContent)} />
           </div>
                                                                     :
           null
          }
          <Grid
            data={menus}
            hasLine={false}
            columnNum={4}
            renderItem={renderItem}
            onClick={gridClick}
          />
        </div>
        <WhiteSpace size="xs" />
        <List className="notice">
          <List.Item
            thumb={bell}
            arrow="horizontal"
            onClick={() => handlerChangeRouteClick('messageCenter', { name: '消息中心' }, dispatch)}
            extra={''}
          >
            {`您有${count}条未读消息`}
          </List.Item>
        </List>
        <WhiteSpace size="xs" />
        <Tabs
          tabs={tabs}
          initialPage={0}
          swipeable={false}
          page={selectIndex}
          onChange={onTabsChange}
          tabBarInactiveTextColor="#b7b7b7"
          tabBarUnderlineStyle={{ border: '1px solid #2B83D7' }}
        >
          <div>
            <div className={styles.tasklist}>
              {loadingTask && !refreshing ?
               <ListSkeleton />
                                          :
               cnIsArray(taskList) && taskList.length > 0 ?
               <Refresh
                 refreshing={refreshing}
                 onRefresh={() => onRefresh('query')}
                 onScrollerTop={() => onScrollerTaskTop()}
                 scrollerTop={taskTop}
               >
                 {taskList.map((item) => {
                   return taskRow(item, () => handlerCourseClick(item, item.courseid, dispatch), (e) => handlerDivInnerHTMLClick(e, item.courseid, dispatch));
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
               onRefresh={() => onRefresh('queryAllTask')}
               onScrollerTop={() => onScrollerLessonTop()}
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
    </div>
  );
};

Dashboard.propTypes = {};

export default connect(({ dashboard, loading }) => ({
  dashboard,
  loadingTask: loading.effects[`${PrefixCls}/query`],
  loadingAllTask: loading.effects[`${PrefixCls}/queryAllTask`]
}))(Dashboard);
