/**
 * @author Lowkey
 * @date 2020/02/28 16:58:23
 * @Description:
 */
/* eslint-disable indent */
import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import { finalReportRow } from 'components/row';
import Nav from 'components/nav';
import Refresh from 'components/pulltorefresh';
import NoContent from 'components/nocontent';
import ColorCard from 'components/colorCard';
import FilterModal from 'components/filterModal';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';


const PrefixCls = 'review';

function Review ({ location, dispatch, review }) {
  const { name = '辅导情况' } = location.query,
    { listData, scrollerTop = 0, refreshing = false } = review,
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
      <div className={styles.modal}><FilterModal /></div>
      <div className={styles[`${PrefixCls}-outer`]}>
        <WhiteSpace />
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
              {cnIsArray(listData) && listData.map((item, i) => {
                return (
                  <ColorCard
                    key={i}
                    title={
                      <div className={styles.top}>
                        <div className={styles.title}>学习活动1.1 评价幼儿健康成长状况（5分,考
                          勤活动
                        </div>
                        <div className={styles.group}>3-6岁儿童学习与发展-18春学前教育石景山怀柔通州学院</div>
                        <div className={styles.info}>
                          <span>{`学生数：${'32'}`}</span>
                          <span>{`类型：${'讨论区'}`}</span>
                        </div>
                        <div className={styles.date}>{`截止时间：${'2020年3月4日'}`}</div>
                      </div>
                    }
                  >
                    <div className={styles.contnt}>
                      <div className={styles.item}>
                        <div>{`已提交数：${'30'}`}</div>
                        <div>{`已评分数：${'30'}`}</div>
                      </div>
                      <WhiteSpace size="lg" />
                      <div className={styles.item}>
                        <div>{`未评分数：${'2'}`}</div>
                        <div>{`未按时评分数：${'0'}`}</div>
                      </div>
                      <WhiteSpace size="lg" />
                      <div className={styles.teacher}>
                        <span>辅导教师</span>
                        <div>李振</div>
                      </div>
                      <WhiteSpace size="lg" />
                      <div className={styles.details}
                           onClick={handlerChangeRouteClick.bind(null, 'reviewDetails', {}, dispatch)}>查看评阅详情
                      </div>
                    </div>
                  </ColorCard>
                );
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

export default connect(({ loading, review }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  review
}))(Review);
