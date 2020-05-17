/**
 * @author Lowkey
 * @date 2020/02/28 16:58:23
 * @Description:
 */
import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import { finalReportRow } from 'components/row';
import Nav from 'components/nav';
import ArrowHead from 'components/arrowHead';
import Refresh from 'components/pulltorefresh';
import SelectBox from 'components/selectBox';
import NoContent from 'components/nocontent';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';


const PrefixCls = 'finalReport';

const overlay = [
  {
    key: 1,
    value: 'all',
    label: '显示所有'
  },
  {
    key: 2,
    value: 'submitted',
    label: '已提交'
  },
  {
    key: 3,
    value: 'uncommitted',
    label: '未提交'
  }
];


function FinalReport ({ location, dispatch, finalReport }) {
  const { name = '辅导情况' } = location.query,
    { listData, scrollerTop = 0, refreshing = false } = finalReport,
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
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-outer`]}>
        <div className={styles.head}>
          <ArrowHead>
            <div className={styles.title}>课程名称</div>
            <div className={styles.content}>
              <div>{`开课日期：${'2020年1月20日'}`}</div>
              <div>{`结课日期：${'2020年9月20日'}`}</div>
            </div>
          </ArrowHead>
        </div>
        <WhiteSpace />
        <SelectBox defaultChoice="显示所有" overlay={overlay} />
        <WhiteSpace />
        <div className={styles.listContainer}>
          {
            listData.length > 0 ?
            <Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
              onScrollerTop={onScrollerTop.bind(null)}
              scrollerTop={scrollerTop}
            >
              {cnIsArray(listData) && listData.map((item) => {
                return finalReportRow(item, handlerChangeRouteClick, (e) => {
                  e.stopPropagation();
                  handlerChangeRouteClick('userPage', {}, dispatch, e);
                }, dispatch);
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

export default connect(({ loading, finalReport }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  finalReport
}))(FinalReport);
