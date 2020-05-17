/**
 * @author Lowkey
 * @date 2019/04/02 14:39:52
 * @Description:
 */
import React from 'react';
import { Icon, WhiteSpace, Tabs, Button, WingBlank, List, Modal } from 'components';
import Tag from 'components/tag';
import TitleBox from 'components/titlecontainer';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { getCommonDate, getLocalIcon, getSurplusDay, getImages, isUsefulPic } from 'utils';
import FeedBack from '../feedkack';
import SelfFiles from '../selfFiles';
import styles from './index.less';

const alert = Modal.alert;
const PrefixCls = 'status',
  tabs = [
    { title: '提交的作业' },
    { title: '成绩' },
  ],
  getSubmitStatus = (status) => {
    switch (status) {
      case 'new' :
        return <Tag text="没有提交作业" color="#f34e14" size="xs" />;
      case 'draft' :
        return <Tag text="草稿(未提交)" color="#ec9c00" size="xs" />;
      case 'submitted' :
        return <Tag text="已提交" color="#1eb259" size="xs" />;
      case 'marked' :
        return <Tag text="已评分" color="#1eb259" size="xs" />;
      case 'reonpened' :
        return <Tag text="已开启重交" color="#ff9a1b" size="xs" />;
      default :
        return <Tag text="未知" color="#ff9a1b" size="xs" />;
    }
  },

  getStyle = (type, data, timemodified = 0) => {
    if (type === 'submitted') {
      if (data * 1000 < new Date() && data > timemodified) {
        return { color: '#1eb259' };
      } else if (data * 1000 < new Date() && data < timemodified) {
        return { color: '#f34e14' };
      }
      return null;
    }
    return null;
  },

  getGradeStatus = (status) => {
    switch (status) {
      case 'inmarking' :
        return <Tag text="评分中" color="#ff9a1b" size="xs" />;
      case 'draft' :
        return <Tag text="草稿(未提交)" color="#ec9c00" size="xs" />;
      case 'readyforreview' :
        return <Tag text="已评分" color="#1eb259" size="xs" />;
      case 'inreview' :
        return <Tag text="正在检查评分结果" color="#ff9a1b" size="xs" />;
      case 'readyforrelease' :
        return <Tag text="准备公布评分" color="#ff9a1b" size="xs" />;
      case 'released' :
        return <Tag text="已公布评分" color="#1eb259" size="xs" />;
      case 'graded' :
        return <Tag text="已评分" color="#1eb259" size="xs" />;
      case 'notgraded' :
        return <Tag text="未评分" color="#f34e14" size="xs" />;
      default :
        return <Tag text="未评分" color="#f34e14" size="xs" />;
    }
  };
const Status = (props) => {
  const { submitStatus, gradingstatus, duedate = 0, cutoffdate = 0, allowsubmissionsfromdate = 0, extensionduedate = 0, timemodified = 0, submitDataType, grade = {}, fileIdPrefix, canedit, cansubmit, coursesId, cmid } = props,
    handlerSubmit = (id) => {
      props.dispatch({
        type: 'homework/sendAssing',
        payload: {
          assignmentid: id,
          cmid,
          coursesId
        }
      });
    },
    showModal = (id) => {
      alert('提交', '本作业一旦提交，您将不能再作任何修改', [
        { text: '取消', onPress: () => console.log() },
        { text: '提交', onPress: () => handlerSubmit(id) },
      ]);
    };
  return (
    <div className={styles[`${PrefixCls}-status`]} >
      <div className={styles[`${PrefixCls}-status-head`]} >
        <div className={styles[`${PrefixCls}-status-head-left`]} >
          <Icon type={getLocalIcon('/sprite/statusbar.svg')} color="#22609c" />
          <span style={{ marginLeft: '8px' }} >提交状态</span >
        </div >
        <div className={styles[`${PrefixCls}-status-head-right`]} >
          <span >{getSubmitStatus(submitStatus)}</span >
          <span >{getGradeStatus(gradingstatus)}</span >
        </div >
      </div >
      {
        gradingstatus === 'graded'
          ? <Tabs
            tabs={tabs}
            initialPage={0}
            tabBarInactiveTextColor="#b7b7b7"
            tabBarUnderlineStyle={{ border: '1px solid #22609c' }}
          >
            <div className={styles.common} >
              {submitStatus !== 'new'
                ? <SelfFiles data={submitDataType} fileIdPrefix={fileIdPrefix} dispatch={props.dispatch} />
                :
                ''
              }
              <WhiteSpace />
              {
                duedate > 0 ?
                  <div className={styles[`${PrefixCls}-status-time`]} >
                    <span >
                      <Icon type={getLocalIcon('/components/enddate.svg')} size="xs" />
                      <span >截止时间</span >
                    </span >
                    <span >{getCommonDate(duedate)}</span >
                  </div >
                  :
                  null
              }
              {
                extensionduedate > 0 ?
                  <div className={styles[`${PrefixCls}-status-time`]} >
                    <span >
                      <Icon type={getLocalIcon('/components/enddate.svg')} size="xs" />
                      <span >宽限时间</span >
                    </span >
                    <span >{getCommonDate(extensionduedate)}</span >
                  </div >
                  :
                  null
              }
              {
                duedate > 0 ?
                  <div className={styles[`${PrefixCls}-status-time`]} >
                    <span >
                      <Icon type={getLocalIcon('/components/surplus.svg')} size="xs" />
                      <span >剩余时间</span >
                    </span >
                    {getSurplusDay(extensionduedate > duedate ? extensionduedate : duedate, submitStatus, timemodified)}
                  </div >
                  :
                  null
              }
              <div className={styles[`${PrefixCls}-status-time`]} >
                <span ><Icon type={getLocalIcon('/components/modify.svg')} size="xs" /><span >最后修改</span ></span >
                <span >{submitStatus !== 'new' ? getCommonDate(timemodified) : '-'}</span >
              </div >
              <WhiteSpace size="lg" />
              <WingBlank >
                {
                  canedit ?
                    <Button
                      type="primary"
                      onClick={(e) => (handlerChangeRouteClick(
                        'homeworkadd',
                        { assignId: props.assignId, coursesId },
                        props.dispatch, e))}
                    >
                      {submitStatus === 'new' ? '添加提交' : '编辑提交的作业'}
                    </Button >
                    :
                    null
                }
                <WhiteSpace size="lg" />
                {
                  cansubmit ?
                    <div >
                      <Button
                        type="warning"
                        onClick={(e) => showModal(props.assignId)}
                      >
                        添加提交
                      </Button >
                      <div className={styles.send} >*本作业一旦提交，您将不能再作任何修改</div >
                    </div >
                    :
                    null

                }
              </WingBlank >
            </div >
            <div className={styles.feedback} >
              <div >
                <TitleBox title="最终成绩" sup={<div className={styles.grade} >{grade.gradefordisplay}</div >} />
              </div >
              <FeedBack data={grade.feedbackplugins} fileIdPrefix={fileIdPrefix} />
              <TitleBox title="评分人" sup="" />
              <List className={styles[`${PrefixCls}-list`]} >
                <List.Item
                  arrow="horizontal"
                  thumb={
                    isUsefulPic(grade.gradeUser.avatar) ?
                      getImages(grade.gradeUser.avatar, 'user')
                      :
                      ''
                  }
                  multipleLine
                  onClick={(e) => {
                    if (grade.gradeUserId) {
                      handlerChangeRouteClick('userpage', { userid: grade.gradeUserId }, props.dispatch, e);
                    }
                  }}
                >
                  {grade.gradeUser.fullname}
                  <List.Item.Brief >{getCommonDate(grade.timemodified)}</List.Item.Brief >
                </List.Item >
              </List >
            </div >
          </Tabs >
          :
          <div >
            {submitStatus !== 'new'
              ?
              <SelfFiles data={submitDataType} fileIdPrefix={fileIdPrefix} dispatch={props.dispatch} />
              :
              ''
            }
            <WhiteSpace />
            {
              duedate > 0 ?
                <div className={styles[`${PrefixCls}-status-time`]} >
                  <span >
                    <Icon type={getLocalIcon('/components/enddate.svg')} size="xs" />
                    <span >截止时间</span >
                  </span >
                  <span >{getCommonDate(duedate)}</span >
                </div >
                :
                null
            }
            {
              extensionduedate > 0 ?
                <div className={styles[`${PrefixCls}-status-time`]} >
                  <span >
                    <Icon type={getLocalIcon('/components/enddate.svg')} size="xs" />
                    <span >宽限时间</span >
                  </span >
                  <span >{getCommonDate(extensionduedate)}</span >
                </div >
                :
                null
            }
            {
              duedate > 0 ?
                <div className={styles[`${PrefixCls}-status-time`]} >
                  <span ><Icon type={getLocalIcon('/components/surplus.svg')} size="xs" /><span >剩余时间</span ></span >
                  <span
                    style={getStyle(submitStatus, duedate, timemodified)}
                  > {getSurplusDay(extensionduedate > duedate ? extensionduedate : duedate, submitStatus, timemodified)}
                  </span >
                </div >
                :
                null
            }
            <div className={styles[`${PrefixCls}-status-time`]} >
              <span ><Icon type={getLocalIcon('/components/modify.svg')} size="xs" /><span >最后修改</span ></span >
              <span >{submitStatus !== 'new' ? getCommonDate(timemodified) : '-'}</span >
            </div >
            <WhiteSpace size="lg" />
            <WingBlank >
              {
                canedit ?
                  <Button
                    type="primary"
                    onClick={(e) => (handlerChangeRouteClick(
                      'homeworkadd',
                      { assignId: props.assignId, coursesId },
                      props.dispatch, e))}
                  >
                    {submitStatus === 'new' ? '添加提交' : '编辑提交的作业'}
                  </Button >
                  :
                  null
              }
              <WhiteSpace size="lg" />
              {
                cansubmit ?
                  <div >
                    <Button
                      type="warning"
                      onClick={(e) => showModal(props.assignId)}
                    >
                      添加提交
                    </Button >
                    <div className={styles.send} >*本作业一旦提交，您将不能再作任何修改</div >
                  </div >
                  :
                  null

              }
            </WingBlank >
          </div >
      }
    </div >
  );
};
export default Status;
