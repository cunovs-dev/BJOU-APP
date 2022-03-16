/**
 * @author Lowkey
 * @date 2019/02/26 11:00:23
 * @Description:
 */
import React from 'react';
import { handlerCourseClick, handlerDivInnerHTMLClick, handlerChangeRouteClick } from 'utils/commonevents';
import { getOffsetTopByBody, getLocalIcon, getImages, pattern } from 'utils';
import InnerHtml from 'components/innerhtml';
import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import styles from './index.less';

const PrefixCls = 'lessonitem';

const LessonItem = (props) => {
  //  tracking 0 未设置跟踪 1 手动 2自动
  const { id, modname, name, modicon, description, availabilityinfo = '', stats = {}, tracking } = props.data,
    { courseid, loadingCheck } = props,
    { state = 0 } = stats,
    dispatch = props.dispatch,
    handlerCheckboxClick = (callback, e) => {
      e.stopPropagation();
      callback(parseInt(id, 10));
      dispatch({
        type: 'lessondetails/manualCompletion',
        payload: {
          cmid: id,
          completed: parseInt(state, 10) === 0 ? '1' : '0'
        },
        callback
      });
    },
    handDivClick = (e) => {
      e.stopPropagation();
      handlerDivInnerHTMLClick(e, courseid, dispatch);
    },
    handlerDiscriptionClick = (e) => {
      e.stopPropagation();
      handlerChangeRouteClick('details', {
        name: '描述详情',
        type: 'discription',
        content: description,
        courseid
      }, dispatch);
    };
  if (modname !== 'label') {
    return (
      <div
        className={styles[`${PrefixCls}-outer`]}
        onClick={availabilityinfo === '' ? handlerCourseClick.bind(null, props.data, courseid, dispatch) : null}
      >
        <div className={styles[`${PrefixCls}-outer-top`]}>
          <div className={styles[`${PrefixCls}-outer-top-icon`]}>
            <img
              src={getImages(modicon.replace(pattern('svg'), 'fordson'))}
              alt=""
              className={classNames({ [styles.disabled]: availabilityinfo !== '' })}
            />
          </div>
          <div
            className={classNames(styles[`${PrefixCls}-outer-top-content`], { [styles.disabled]: availabilityinfo !== '' })}
          >
            <div className={styles[`${PrefixCls}-outer-top-content-title`]}>
              {name}
            </div>
            {
              tracking !== 0
                ?
                (
                  <div className={styles[`${PrefixCls}-outer-top-content-check`]}>
                    <Checkbox
                      state={state}
                      tracking={tracking}
                      id={id}
                      handlerClick={(callback, e) => handlerCheckboxClick(callback, e)}
                    />
                  </div>
                )
                : ''
            }
          </div>
        </div>
        {
          description ?
            <div className={styles[`${PrefixCls}-outer-describe`]}>
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                onClick={(e) => handlerDiscriptionClick(e)}
              />
              <div className={styles[`${PrefixCls}-outer-describe-mask`]} onClick={(e) => handlerDiscriptionClick(e)}>
              更多
              </div>
            </div>
            :
            ''
        }
        {availabilityinfo !== '' ?
          <div
            className={styles[`${PrefixCls}-outer-available`]}
            dangerouslySetInnerHTML={{ __html: availabilityinfo }}
            onClick={handDivClick}
          /> : ''}
      </div>
    );
  } else if (modname === 'label') {
    return (
      <div className={styles[`${PrefixCls}-label`]}>
        <InnerHtml data={description} handleClick={handDivClick} />
        {
          tracking !== 0
            ?
            (
              <div className={styles[`${PrefixCls}-outer-top-content-check`]}>
                <Checkbox
                  state={state}
                  loadingCheck={loadingCheck}
                  tracking={tracking}
                  id={id}
                  handlerClick={handlerCheckboxClick}
                />
              </div>
            )
            : ''
        }
      </div>
    );
  }
};
LessonItem.defaultProps = {
  icon: '',
  title: '课件',
  type: 'pdf'

};
LessonItem.propTypes = {};
export default LessonItem;
