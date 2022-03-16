import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'components';
import Photoheader from 'components/photoheader';
import { handlerGradeItemClick } from 'utils/commonevents';
import Refresh from 'components/pulltorefresh';
import NoContent from 'components/nocontent';
import { achievementDetailsRow } from 'components/row';
import styles from './index.less';

const PrefixCls = 'achievementdetails';
const AchievementDetails = ({ location, dispatch, achievementdetails, app, loading }) => {
  const { gradeItems, refreshing, scrollerTop, courseid: retrunCourseid = '', coursename, graderaw = '' } = achievementdetails,
    { groups } = app,
    { name, courseid } = location.query,
    getGroups = (group, id) => {
      const arr = [];
      const newArr = groups.filter(item => item.courseid.toString() === id.toString());
      if (cnIsArray(groups) && groups.length > 0 && newArr.length > 0) {
        newArr.map((data) => {
          arr.push({
            label: data.name,
            value: data.id
          });
        });
        return arr[0].label;
      }
      return '';
    },
    onRefresh = () => {
      dispatch({
        type: `${PrefixCls}/refreshGrade`,
        payload: {
          courseid
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
    };
  return (
    <div className={styles.whiteBox}>
      <Photoheader hasBg={false} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-outer`]}>
        <div className={styles[`${PrefixCls}-outer-head`]}>
          <div className={styles[`${PrefixCls}-outer-head-info`]}>
            <div className={styles[`${PrefixCls}-outer-head-info-title`]}>{name || coursename}</div>
            <div
              className={styles[`${PrefixCls}-outer-head-info-group`]}
            >{getGroups(groups, courseid || retrunCourseid)}</div>
          </div>
          <div className={styles[`${PrefixCls}-outer-head-achievement`]}>
            <div className={styles[`${PrefixCls}-outer-head-achievement-num`]}>
              <span>课程总分：</span>
              {`${graderaw}`}
            </div>
          </div>
        </div>
      </div>
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-outer-list`]}>
        <Refresh
          refreshing={refreshing}
          onRefresh={onRefresh}
          scrollerTop={scrollerTop}
          onScrollerTop={onScrollerTop.bind(null)}
        >
          {
            cnIsArray(gradeItems) && gradeItems.length > 0 ?
            gradeItems.map((item) => {
              return achievementDetailsRow(item, handlerGradeItemClick, dispatch);
            })
                                                           :
            <NoContent isLoading={loading} />
          }
        </Refresh>
      </div>
    </div>
  );
};
export default connect(({ loading, achievementdetails, app }) => ({
  loading: loading.effects[`${PrefixCls}/queryList`],
  achievementdetails,
  app
}))(AchievementDetails);
