/**
 * @author Lowkey
 * @date 2018/10/25
 * @Description: 课程列表
 */
import React from 'react';
import PropTypes from 'prop-types';
import { List, Accordion, Icon } from 'components';
import LessonItem from 'components/lessonitem';
import { getLocalIcon } from 'utils';
import { chapterRow } from 'components/row';
import styles from './index.less';

const PrefixCls = 'courselist';

const CourseList = (props) => {
  const GetPanel = (data) => (
    cnIsArray(data) && data.map((d, i) => {
      return (
        <Accordion.Panel
          header={
            <div className={styles[`${PrefixCls}-header`]} >
              {
                props.activityIndex > 0 && props.activityIndex - 1 === i ?
                  <Icon type={getLocalIcon('/components/nike.svg')} color="#f0da24" />
                  : null
              }
              <span >{d.name}</span >
            </div >

          }
          key={i}
        >
          {d.summary !== '' ?
            <div className={styles[`${PrefixCls}-html`]} dangerouslySetInnerHTML={{ __html: d.summary }} /> : null}
          {
            d.modules && d.modules.map((p) => {
              return (
                <LessonItem
                  key={p.id}
                  data={p}
                  loadingCheck={props.loadingCheck}
                  dispatch={props.dispatch}
                  courseid={props.courseid}
                />
              );
            })
          }
        </Accordion.Panel >
      );
    })
  );

  return (
    <div className={styles[`${PrefixCls}-outer`]} >
      <Accordion
        defaultActiveKey={props.accordionIndex}
        className={styles[`${PrefixCls}-accordion`]}
        onChange={props.handlerChange}
      >
        {GetPanel(props.data)}
      </Accordion >
    </div >
  );
};

CourseList.propTypes = {
  data: PropTypes.array.isRequired,
  handlerChange: PropTypes.func.isRequired,
};

CourseList.defaultProps = {
  data: [],
};
export default CourseList;
