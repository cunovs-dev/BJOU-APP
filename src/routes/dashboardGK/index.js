/**
 * @author Lowkey
 * @date 2020/03/12 17:16:16
 * @Description: 国开首页  还是加个路由吧。
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout, WhiteSpace, Icon, List, Tabs, Badge, Grid, ActionSheet } from 'components';
import Refresh from 'components/pulltorefresh';
import { noticeGKRow } from 'components/row';
import { moduleGridsGK } from 'utils/defaults';
import { getLocalIcon } from 'utils';
import {
  handlerChangeRouteClick,
  handlerPortalNoticeClick
} from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}
const PrefixCls = 'dashboardGK';
const DashboardGK = ({ dashboardGK, loading, dispatch }) => {
  const { Header, BaseLine } = Layout,
    { list, refreshing = false, scrollerTop, infoGK = {}, studentIds, currentId } = dashboardGK,
    { headImg = '' } = infoGK,
    onRefresh = (type) => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          refreshing: true
        }
      });
      dispatch({
        type: `${PrefixCls}/${type}`,
        payload: {
          categoryId: 'gktzgg'
        }
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

    gridClick = ({ path, text, queryType = 'normal' }) => {
      handlerChangeRouteClick(path, {
        name: text,
        queryType
      }, dispatch);
    },

    showActionSheet = () => {
      const BUTTONS = [...studentIds, '取消'];
      ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
          'data-seed': 'logId',
          wrapProps
        },
        (buttonIndex) => {
          if (buttonIndex !== BUTTONS.length - 1) {
            dispatch({
              type: `${PrefixCls}/changeCode`,
              payload: {
                code: BUTTONS[buttonIndex]
              }
            });
          }
        }
      );
    };
  return (
    <div className={styles.outer}>
      <Header
        headImg={headImg}
        handlerClick={() => handlerChangeRouteClick('homepage', {}, dispatch)}
      />
      {
        cnIsArray(studentIds) && studentIds.length > 1 ?
        <div className={styles.studentBox}>
          <List.Item
            onClick={showActionSheet}
            thumb={<Icon type={getLocalIcon('/sprite/studentID.svg')} />}
            extra={<Icon type={getLocalIcon('/sprite/exchange.svg')} color="#2B83D7" size="sm" />}
          >
            <span className={styles.studentId}>学号</span>
            <span>{currentId}</span>
          </List.Item>
        </div>
                                                       :
        null
      }

      <div className={styles.grid}>
        <Grid
          data={moduleGridsGK}
          hasLine={false}
          columnNum={3}
          renderItem={renderItem}
          onClick={gridClick}
        />
      </div>
      <WhiteSpace size="xs" />
      <div className={styles.listTitle}>
        <div>
          通知公告
        </div>
        <div className={styles.more} onClick={() => handlerChangeRouteClick('systemGK', {}, dispatch)}>
          <span>更多</span>
          <Icon type={getLocalIcon('/sprite/right-square.svg')} />
        </div>
        <div className={styles.bottom} />
      </div>
      <div>
        <div className={styles.list}>
          {loading && !refreshing ?
           <ListSkeleton />
                                  :
           cnIsArray(list) && list.length > 0 ?
           <Refresh
             refreshing={refreshing}
             onRefresh={() => onRefresh('queryList')}
             onScrollerTop={() => onScrollerTop()}
             scrollerTop={scrollerTop}
           >
             {list.map((item) => {
               return noticeGKRow(item, handlerPortalNoticeClick, dispatch);
             })}
             <BaseLine />
           </Refresh>
                                              :
           <NoContent />
          }
        </div>
      </div>

    </div>
  );
};

DashboardGK.propTypes = {};

export default connect(({ dashboardGK, loading }) => ({
  dashboardGK,
  loading: loading.effects[`${PrefixCls}/query`]
}))(DashboardGK);
