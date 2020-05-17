import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import ArrowHead from 'components/arrowHead';
import ColorCard from 'components/colorCard';
import ProgressTag from 'components/progressTag';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { ContentSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'coach';


function Coach ({ location, dispatch, coach, fetching }) {
  const { name = '辅导情况', fullname = '', startdate, enddate } = location.query,
    { data } = coach;
  const headProps = {
    fullname,
    startdate,
    enddate,
    attendance: data
  };
  return (
    <div className={styles.whiteBox}>
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      {
        fetching ?
          <ContentSkeleton />
          :
          <div className={styles[`${PrefixCls}-outer`]}>
            <ArrowHead>
              <div className={styles.title}>课程名称</div>
              <div className={styles.content}>
                <div className={styles.item}>
                  <span>{`回帖率：${'30%'}`}</span>
                  <span>{`及时回帖率：${'30%'}`}</span>
                </div>
                <div className={styles.item}>
                  <span>{`作业评阅率：${'30%'}`}</span>
                  <span>{`作业及时评阅率：${'60%'}`}</span>
                </div>
              </div>
            </ArrowHead>
            <WhiteSpace />
            <div>
              <ColorCard title="李刚">
                <div className={styles.teacherContnt}>
                  <div className={styles.item}>
                    <ProgressTag text="回贴率" count={40} />
                    <ProgressTag text="及时回贴率" count={90} />
                  </div>
                  <WhiteSpace size="lg" />
                  <div className={styles.item}>
                    <ProgressTag text="作业评阅率" count={60} />
                    <ProgressTag text="作业及时评阅率" count={80} />
                  </div>
                </div>
              </ColorCard>
            </div>
          </div>
      }
    </div>
  );
}

export default connect(({ loading, coach }) => ({
  fetching: loading.effects[`${PrefixCls}/fetch`],
  coach
}))(Coach);
