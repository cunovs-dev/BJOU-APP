import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'components';
import Nav from 'components/nav';
import { handlerGradeItemClick } from 'utils/commonevents';
import Refresh from 'components/pulltorefresh';
import TitleBox from 'components/titlecontainer';
import { memberAchievementDetailsRow } from 'components/row';
import UserInfo from 'components/userInfo';
import styles from './index.less';

const PrefixCls = 'memberAchievementDetails';
const info= {
  email:'3434343@214.com',
  tel:'131334324'
}
const MemberAchievementDetails = ({ location, dispatch, memberAchievementDetails, app }) => {
  const { listData, refreshing, scrollerTop, courseid: retrunCourseid = '', coursename, graderaw = '' } = memberAchievementDetails,
    { groups } = app,
    { name = '成绩详情', grade, courseid } = location.query,
    getGroups = (group, id) => {
      const arr = [];
      if (cnIsArray(groups) && groups.length > 0) {
        groups.filter(item => item.courseid.toString() === id.toString())
          .map((data) => {
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
        <div className={styles.title}>
          20191202 学前儿童科学教育
        </div>
        <UserInfo
          name="张小"
          group="小组1五"
          info={info}
          grade={77}
          dispatch={dispatch}
        />
      </div>
      <WhiteSpace />
      <TitleBox title="成绩项" sup='' />
      <WhiteSpace />
      <div className={styles.list}>
        <Refresh
          refreshing={refreshing}
          onRefresh={onRefresh}
          scrollerTop={scrollerTop}
          onScrollerTop={onScrollerTop.bind(null)}
        >
          {cnIsArray(listData) && listData.map((item) => {
            return memberAchievementDetailsRow(item, handlerGradeItemClick, dispatch);
          })}
        </Refresh>
      </div>
    </div>
  );
};
export default connect(({ loading, memberAchievementDetails, app }) => ({
  loading,
  memberAchievementDetails,
  app
}))(MemberAchievementDetails);
