/**
 * @author Lowkey
 * @date 2020/03/19 15:13:02
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import ApplyList from '../ApplyList';

const MobileTable = (props) => {
  const { data, thead, type } = props,
    renderHead = () => (
      thead.map((item, i) => (<div style={{ width: item.width }} key={i}>{item.label}</div>))
    );
  return (
    <div className={styles.container}>
      <div className={styles.thead}>
        <div className={styles.tr}>
          {renderHead()}
        </div>
      </div>
      <div className={styles.tbody}>
        {
          type === 'grade' ?
          data.map((item, i) => (
            <div className={styles.tr} key={i}>
              <div>{item.courseName}</div>
              <div>{`${new Date(item.examDate).getFullYear()}-${new Date(item.examDate).getMonth() + 1}`}</div>
              <div>{item.normalScore || '-'}</div>
              <div>{item.rollScore || '-'}</div>
              <div>{item.totalScore || '-'}</div>
              <div style={{ color: item.state === '及格' ? 'green' : 'red' }}>{item.state}</div>
            </div>
          ))
                           :
          data.map((item, i) => (
            <div className={styles.tr} key={i}>
              <div>{item.courseNature}</div>
              <div>{item.requiredScore}</div>
              <div>{item.totalScore}</div>
              <div style={{ color: item.isPass === '满足' ? 'green' : 'red' }}>{item.isPass}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
MobileTable.defaultProps = {
  thead: [{ label: '课程名称', width: '30%' }, { label: '考试时间', width: '20%' }, {
    label: '平时成绩',
    width: '10%'
  }, { label: '卷面成绩', width: '10%' }, { label: '综合成绩', width: '10%' }, { label: '状态', width: '20%' }],
  type: 'grade'
};
export default MobileTable;
