import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, List, Icon, Layout } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { progressDetailsRow } from 'components/row';
import { handlerLessonListClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';


const PrefixCls = 'progressDetails';

function ProgressDetails ({ location, dispatch, progressList }) {
  const { list } = progressList,
    { index = 0 } = location.query,
    { courses = [] } = list[index];
  return (
    <div className={styles.whiteBox}>
      <Nav title="学业进度表" dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-outer`]}>
        <WhiteSpace />
        {
          courses.length > 0 ?
          <div>
            {cnIsArray(courses) && courses.map((item) => {
              return progressDetailsRow(item);
            })}
          </div>
                             :
          <NoContent />
        }
      </div>
    </div>
  );
}

export default connect(({ progressList }) => ({
  progressList
}))(ProgressDetails);
