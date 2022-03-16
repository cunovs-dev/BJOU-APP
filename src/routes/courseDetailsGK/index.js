import React from 'react';
import Nav from 'components/nav';
import { Layout } from 'components';
import { connect } from 'dva';
import styles from './index.less';

const { BaseLine } = Layout;
const courseDetailsGK = ({ courseGK, loading, location, dispatch }) => {

  const getState = (state) => {
    switch (state) {
      case 1:
        return <span style={{ color: '#52C41A' }}>(已通过)</span>;
      case 2:
        return <span style={{ color: '#2B83D7' }}>(已注册)</span>;
      case 3:
        return <span style={{ color: '#FF0000' }}>(未注册)</span>;
      default:
        return '';
    }
  };
  const { name = '已选课程', index } = location.query;
  const { data = {} } = courseGK,
    { courseInfos } = data;
  const course = courseInfos[index].courseInfos;
  return (
    <div className={styles.whiteBox}>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles.content}>
        {
          cnIsArray(course) && course.map((item, i) => {
            return (
              <div className={styles.card} key={i}>
                <div className={styles.title}>
                  <span style={{ marginRight: 8 }}>{item.courseName}</span>
                  {getState(item.userCourseState || '')}
                </div>
                <div className={styles.info}>
                  <div>{`课程ID：${item.courseId}`}</div>
                  <div>{`课程性质：${item.courseNature || '-'}`}</div>
                  <div>{`得分：${item.totalScore || '-'}`}</div>
                  <div>{`课程类型：${item.courseType || '-'}`}</div>
                  <div>{`考试单位：${item.examOrg || '-'}`}</div>
                  <div>{`学分：${item.score || '-'}`}</div>
                </div>
              </div>
            );
          })
        }
      </div>
      <BaseLine />
    </div>
  );
};


export default connect(({ courseGK, loading }) => ({
  courseGK,
  loading
}))(courseDetailsGK);
