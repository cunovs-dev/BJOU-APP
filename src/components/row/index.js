/* eslint-disable indent,react/jsx-indent-props,react/jsx-max-props-per-line,react/jsx-closing-bracket-location */
/**
 * @author Lowkey
 * @date 2018/10/25
 * @Description: 吐了
 */
import React, { Fragment } from 'react';
import { List, Icon, Progress, Button, Card, Badge, WhiteSpace } from 'antd-mobile';
import Enclosure from 'components/enclosure';
import Tag from 'components/tag';
import {
  getErrorImg,
  getImages,
  getLocalIcon,
  getCommonDate,
  changeLessonDate,
  getTaskIcon,
  isToday,
  getMessageTime
} from 'utils';
import InnerHtml from 'components/innerhtml';
import classNames from 'classnames';
import styles from './index.less';


const PrefixCls = 'row',
  Item = List.Item,
  Brief = Item.Brief;
const isPass = (grade) => {
  if (grade >= 60) {
    return true;
  }
  return false;
};
module.exports = {

  chapterRow: ({ title, time, id, type }, onClick) => {
    /**
     * @author Lowkey
     * @date 2018/10/25
     * @Description: 课程播放列表
     */
    return (
      <div key={id} className={styles[`${PrefixCls}-chapter-outer`]} onClick={onClick}>
        <div className={styles[`${PrefixCls}-chapter-outer-left`]}>
          <span>
            <Icon
              style={{ verticalAlign: 'middle' }}
              type={type === 'video' ? getLocalIcon('/row/video.svg') : getLocalIcon('/row/homework.svg')}
            />
          </span>
          <span className={styles[`${PrefixCls}-chapter-outer-left-title`]}>
            {title}
          </span>
        </div>
        <div className={styles[`${PrefixCls}-chapter-outer-right`]}>
          {time}
        </div>
      </div>
    );
  },
  contactsRow: (data, Click, dispatch) => {
    // 联系人列表
    return (
      <List className={styles[`${PrefixCls}-contacts`]}>
        {cnIsArray(data) && data.map((item, i) => {
          return (
            <Item
              key={item.id}
              thumb={getImages(item.profileimageurlsmall, 'user')}
              arrow="horizontal"
              onClick={Click.bind(null, 'conversation', {
                fromuserid: item.id,
                name: item.fullname,
                avatar: item.profileimageurlsmall
              }, dispatch)}
            >
              {item.fullname}
            </Item>
          );
        })}
      </List>
    );
  },
  taskRow: (item, click, handDivClick) => {
    // 任务列表
    const { id, coursename, modulename, name, timestart, availabilityinfo = '' } = item;
    return (
      <div key={id} className={styles[`${PrefixCls}-task`]} onClick={availabilityinfo === '' ? click : null}>
        <div className={styles[`${PrefixCls}-task-title`]}>
          {coursename}
          <div className={styles[`${PrefixCls}-task-title-time`]}>
            <span style={{ color: isToday(timestart) ? '#e20f09' : '#ff9a1b' }}>
              {`截止时间：${changeLessonDate(timestart)}`}
            </span>
          </div>
        </div>
        <div className={styles[`${PrefixCls}-task-content`]}>
          <span><Icon type={getLocalIcon(getTaskIcon(modulename))} size="xs" /></span>
          <span>{name}</span>
        </div>
        {availabilityinfo !== '' ?
         <div
           className={styles[`${PrefixCls}-task-available`]}
           dangerouslySetInnerHTML={{ __html: availabilityinfo }}
           onClick={handDivClick}
         /> : ''}
      </div>
    );
  },
  taskLessonRow: (item, click, dispatch) => {
    // 全部任务列表
    const { id, fullname, enddate, master, courseImage } = item;

    return (
      <div key={id} className={styles[`${PrefixCls}-tasklesson`]} onClick={click.bind(null, item, dispatch)}>
        <div className={styles[`${PrefixCls}-tasklesson-title`]}>{fullname}</div>
        <div className={styles[`${PrefixCls}-tasklesson-container`]}>
          <div className={styles[`${PrefixCls}-tasklesson-img`]}
               style={{ backgroundImage: `url(${getImages(courseImage)})` }} />
          <div className={styles[`${PrefixCls}-tasklesson-content`]}>
            <div className={styles[`${PrefixCls}-tasklesson-content-teacher`]}>{`责任教师：${master.fullname}`}</div>
            <div
              className={styles[`${PrefixCls}-tasklesson-content-time`]}>{`结课日期：${changeLessonDate(enddate)}`}</div>
          </div>
        </div>
      </div>
    );
  },
  closeLessonRow: (item,onClick,dispatch) => {
    // 已开课程列表
    const { fullname, master, id, graderaw = 0, attendance = {}, courseImage = '', isAttendance = false } = item,
      { stat = 0 } = attendance;
    return (
      <div key={id} className={styles[`${PrefixCls}-closelesson`]} >
        <div className={styles[`${PrefixCls}-closelesson-title`]}>{fullname}</div>
        <div className={styles[`${PrefixCls}-closelesson-container`]}>
          <div className={styles[`${PrefixCls}-closelesson-img`]}
               style={{ backgroundImage: `url(${getImages(courseImage)})` }} />
          <div className={styles[`${PrefixCls}-closelesson-content`]}>
            <div className={styles[`${PrefixCls}-closelesson-content-teacher`]}>
              {`责任教师：${master.fullname}`}
            </div>
            <div className={styles[`${PrefixCls}-closelesson-content-info`]}>
              {
                isAttendance ?
                stat ?
                <div style={{ color: '#1eb259' }}>考勤：达标</div>
                     :
                <div style={{ color: '#f34e14' }}>考勤：未达标</div>
                             :
                null
              }
              {
                <div style={{ color: isPass(graderaw) ? '#1eb259' : '#f34e14' }}>{`成绩：${graderaw}`}</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
  openingLessonRow: (item, onClick, onProgressClick, dispatch) => {
    // 在开课程列表
    const { fullname = '', graderaw = 0, id, master, enddate, isAttendance = false, hasFinalExam = false, courseImage } = item;
    return (
      <div key={id} className={styles[`${PrefixCls}-openinglessonout`]} onClick={onClick.bind(null, item, dispatch)}>
        <div className={styles[`${PrefixCls}-openinglessonout-title`]}>{fullname}</div>
        <div className={styles[`${PrefixCls}-openinglesson`]}>
          <div
            className={styles[`${PrefixCls}-openinglesson-img`]}
            style={{ backgroundImage: `url(${getImages(courseImage)})` }} />
          <div className={styles[`${PrefixCls}-openinglesson-content`]}>
            <div className={styles[`${PrefixCls}-openinglesson-content-teacher`]}>{`责任教师：${master.fullname}`}</div>
            <div className={styles[`${PrefixCls}-openinglesson-content-time`]}>
              {`结课日期：${changeLessonDate(enddate)}`}
            </div>
            <div className={styles[`${PrefixCls}-openinglesson-content-type`]}>
              {hasFinalExam ?
               <div className={styles[`${PrefixCls}-openinglesson-content-type-ending`]}>终考课</div> : ''}
              {isAttendance ?
               <div className={styles[`${PrefixCls}-openinglesson-content-type-attendance`]}>考勤课</div> : ''}
            </div>
          </div>
        </div>
        <div className={styles[`${PrefixCls}-openinglessonout-progress`]}
             onClick={onProgressClick}
        >
          <div className={styles[`${PrefixCls}-openinglessonout-progress-left`]}>
            <Progress percent={Math.min(graderaw, 100)}
                      position="normal"
                      barStyle={{ borderColor: isPass(graderaw) ? '#1eb259' : '#f34e14' }}
                      appearTransition
            />
          </div>
          <div className={styles[`${PrefixCls}-openinglessonout-progress-right`]}
               style={{ color: isPass(graderaw) ? '#1eb259' : '#f34e14' }}
          >
            {`${graderaw}分`}
          </div>
        </div>
      </div>
    );
  },
  achievementRow: (item, onClick) => {
    const { fullname, id, enddate, courseImage, graderaw, openState } = item;
    // 成绩列表
    return (
      <div key={id} className={styles[`${PrefixCls}-achievement`]} onClick={onClick}>
        <div className={styles[`${PrefixCls}-achievement-title`]}>{fullname}</div>
        <div className={styles[`${PrefixCls}-achievement-container`]}>
          <div className={styles[`${PrefixCls}-courseImage`]}
               style={{ backgroundImage: `url(${getImages(courseImage)})` }} />
          <div className={styles[`${PrefixCls}-achievement-content`]}>
            <div
              className={styles[`${PrefixCls}-attendanceRow-content-status`]}>{openState === '0' ? `结课日期：${changeLessonDate(enddate)}` : '已结束'}
            </div>
            <div className={styles[`${PrefixCls}-achievement-grade`]}>{`课程总得分：${graderaw}`}</div>
            <Tag
              text={isPass(graderaw) ? '合格' : '不合格'}
              color={isPass(graderaw) ? '#1eb259' : '#f34e14'}
              size="xs" />
          </div>
        </div>
        <WhiteSpace />
      </div>
    );
  },
  achievementDetailsRow: (item, onClick, dispatch) => {
    const { title = '', grade = '', id = '', itemType = '', grademax = '-', instance = '', enddate = '' } = item;
    return (
      <div
        key={id || (`${itemType}_${cnId()}`)}
        className={classNames(styles[`${PrefixCls}-achievementdetails`], { [styles.disabled]: id === '' })}
        onClick={id === '' ? '' : onClick.bind(null, item, dispatch)}
      >
        <div className={styles[`${PrefixCls}-achievementdetails-top`]}>
          <span><Icon type={getLocalIcon(getTaskIcon(itemType))} size="xs" /></span>
          <span className={classNames({ [styles.disabled]: id === '' })}>{title}</span>
        </div>
        <div className={styles[`${PrefixCls}-achievementdetails-bottom`]}>
          <div className={styles[`${PrefixCls}-achievementdetails-bottom-total`]}>{`总分:${grademax}`}</div>
          <div
            className={classNames(styles[`${PrefixCls}-achievementdetails-bottom-my`], { [styles.disabled]: id === '' })}>{`我的得分:${grade}`}</div>
        </div>
        <div className={styles[`${PrefixCls}-achievementdetails-date`]}>
          {enddate > 0 ? `截止时间：${getCommonDate(enddate)}` : '截止时间:未设置'}
        </div>
      </div>
    );
  },
  teachersRow: (item, onClick, dispatch) => {
    // 老师列表
    const { fullname, id, master, mentors } = item;
    return (
      <div key={id} className={styles[`${PrefixCls}-teachers-outer`]}>
        <Card>
          <Card.Header
            title={fullname}
          />
          <Card.Body>
            {
              master.length > 0 ?
              <div>
                {master.map((items) => (
                  <div key={items.id} className={styles[`${PrefixCls}-teachers`]}
                       onClick={onClick.bind(null, 'userpage', { userid: items.id }, dispatch)}>
                    <div className={styles[`${PrefixCls}-teachers-img`]}>
                      <img src={getImages(items.avatar, 'user')} alt="" />
                    </div>
                    <div className={styles[`${PrefixCls}-teachers-content`]}>
                      <div className={styles[`${PrefixCls}-teachers-content-top`]}>
                        <div className={styles[`${PrefixCls}-teachers-content-top-title`]}>
                          {items.fullname && (items.fullname.length < 10 ? items.fullname : `${items.fullname.substr(0, 9)}...`) || ''}
                        </div>
                        <div className={styles[`${PrefixCls}-teachers-content-top-type`]}>
                          责任教师
                        </div>
                      </div>
                      <div className={styles[`${PrefixCls}-teachers-content-bottom`]}>
                        <Button
                          onClick={onClick.bind(null, 'conversation', {
                            fromuserid: items.id,
                            name: items.fullname,
                            avatar: items.avatar
                          }, dispatch)}
                          type="primary"
                          inline
                          size="small"
                        >发消息</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                                :
              '责任教师：未知'
            }
            {
              mentors.length > 0 ?
              <div>
                {mentors.map((items) => (
                  <div key={items.id} className={styles[`${PrefixCls}-teachers`]}
                       onClick={onClick.bind(null, 'userpage', { userid: items.id }, dispatch)}>
                    <div className={styles[`${PrefixCls}-teachers-img`]}>
                      <img src={getImages(items.userData && items.userData.avatar, 'user')} alt="" />
                    </div>
                    <div className={styles[`${PrefixCls}-teachers-content`]}>
                      <div className={styles[`${PrefixCls}-teachers-content-top`]}>
                        <div className={styles[`${PrefixCls}-teachers-content-top-title`]}>
                          {items.userData && items.userData.fullname}
                        </div>
                        <div className={styles[`${PrefixCls}-teachers-content-top-type`]}>
                          {items.roleData && items.roleData.roleName}
                        </div>
                      </div>
                      <div className={styles[`${PrefixCls}-teachers-content-bottom`]}>
                        <Button
                          onClick={onClick.bind(null, 'conversation', {
                            fromuserid: items.id,
                            name: items.userData && items.userData.fullname,
                            avatar: items.userData && items.userData.avatar
                          }, dispatch)}
                          type="primary"
                          inline
                          size="small"
                        >发消息</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                                 :
              null
            }
          </Card.Body>
        </Card>
        <WhiteSpace size="lg" />
      </div>
    );
  },
  groupRow: (item, onClick) => {
    // 小组
    const { name, id, course } = item;
    return (
      <div key={id}>
        <Item arrow="horizontal" onClick={onClick}>
          {course}
          <Brief>{name}</Brief>
        </Item>
        <WhiteSpace />
      </div>
    );
  },
  groupListRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    // 小组成员列表
    const { fullname, profileimageurl, id, roleName } = rowData;
    return (
      <div key={id} className={styles[`${PrefixCls}-groupList`]}
           onClick={onClick.bind(null, 'userpage', { userid: id }, dispatch)}>
        <div className={styles[`${PrefixCls}-groupList-img`]}>
          <img src={getImages(profileimageurl, 'user')} alt="" onError={(el => getErrorImg(el, 'user'))} />
        </div>
        <div className={styles[`${PrefixCls}-groupList-content`]}>
          <div className={styles[`${PrefixCls}-groupList-content-top`]}>
            <div className={styles[`${PrefixCls}-groupList-content-top-title`]}>
              {fullname}
            </div>
            <div className={styles[`${PrefixCls}-groupList-content-top-role`]}>
              {roleName}
            </div>
          </div>
          <div className={styles[`${PrefixCls}-groupList-content-bottom`]}>
            <Button
              onClick={onClick.bind(null, 'conversation', {
                fromuserid: id,
                name: fullname,
                avatar: profileimageurl
              }, dispatch)}
              type="primary"
              inline
              size="small"
            >
              发消息
            </Button>
          </div>
        </div>
      </div>
    );
  },
  attendanceRow: (item, onClick) => {
    // 考勤列表
    const { fullname, id, enddate, courseImage, attendance: { weekStat } } = item;
    return (
      <div key={id} className={styles[`${PrefixCls}-attendanceRow`]} onClick={onClick}>
        <div className={styles[`${PrefixCls}-attendanceRow-title`]}>{fullname}</div>
        <div className={styles[`${PrefixCls}-attendanceRow-container`]}>
          <div className={styles[`${PrefixCls}-courseImage`]}
               style={{ backgroundImage: `url(${getImages(courseImage)})` }} />
          <div className={styles[`${PrefixCls}-attendanceRow-content`]}>
            <div className={styles[`${PrefixCls}-attendanceRow-content-status`]}>
              <span>本周考勤:</span>
              <Tag
                text={weekStat ? '达标' : '未达标'}
                color={weekStat ? '#1eb259' : '#f34e14'}
                size="xs"
              />
            </div>
            <span
              className={styles[`${PrefixCls}-attendanceRow-content-time`]}>{`结课日期：${changeLessonDate(enddate)}`}</span>
          </div>
        </div>
        <WhiteSpace />
      </div>
    );
  },
  forumRow: (rowData, sectionID, rowID, onClick, dispatch, names, group) => {
    const getGroups = (groups = [], id) => {
      const groupById = groups.find(item => item.id === id);
      return groupById && groupById.name || '';
    };
    const { name, id, subject, pinned, userfullname, userpictureurl, message, created, discussion, groupid, numreplies, numunread = 0 } = rowData;
    const creatDate = new Date(created * 1000).toLocaleString('zh');
    return (
      <List.Item
        wrap
        key={id}
        className={styles[`${PrefixCls}-forum`]}
        onClick={onClick.bind(null, 'forumDetails', {
          discussionid: discussion,
          names
        }, dispatch)}
      >
        <div className={styles[`${PrefixCls}-forum-user`]}>
          <img
            src={getImages(userpictureurl, 'user')}
            style={{ marginRight: '10px' }}
            onError={(el => getErrorImg(el, 'user'))}
          />
          <div className={styles[`${PrefixCls}-forum-user-info`]}>
            <div>
              <div>{userfullname}</div>
            </div>
            <div>
              {/* <div >{getGroups(group, groupid)}</div > */}
              {/* <Badge text={numunread} /> */}
            </div>
          </div>
        </div>
        <div className={styles[`${PrefixCls}-forum-content`]}>
          {pinned ?
           <div style={{ marginRight: '8px' }}><Tag text="置顶" color="#f34e14" size="xs" inline />
           </div> : null}
          <div className={styles[`${PrefixCls}-forum-content-text`]}>{name}</div>
        </div>
        <div className={styles[`${PrefixCls}-forum-foot`]}>
          <div className={styles[`${PrefixCls}-forum-foot-message`]}>
            <Icon type={getLocalIcon('/components/xiaoxi.svg')} size="xs" />
            <span>{numreplies}</span>
          </div>
          <div className={styles[`${PrefixCls}-forum-foot-time`]}>
            {creatDate}
          </div>
        </div>
      </List.Item>
    );
  },
  forumAllRow: (item, handlerMoreClick, dispatch, maxattachments, maxbytes) => {
    const renderChild = (item, handlerMoreClick, dispatch, maxattachments, maxbytes) => {
      const { canreply, id, created, children = [], message, subject, userfullname, attachment = '', attachments } = item;
      return (
        <div key={id} className={styles[`${PrefixCls}-child`]}>
          <div className={styles[`${PrefixCls}-child-info`]}>
            <div>{userfullname}</div>
            <div>{getCommonDate(created)}</div>
          </div>
          <div className={styles[`${PrefixCls}-child-content`]}>
            <InnerHtml data={message} />
            {
              attachment !== '' ?
              <Enclosure key={id} data={attachments} />
                                :
              null
            }
          </div>
          <div className={styles[`${PrefixCls}-child-describe`]}>
            {canreply ?
             <div className={styles[`${PrefixCls}-child-reply`]}>
               <Icon type={getLocalIcon('/components/xiaoxi.svg')} />
               <span style={{ marginLeft: '3px' }} onClick={handlerMoreClick.bind(null, 'sendForum', {
                 maxattachments,
                 maxbytes,
                 id,
                 subject,
                 type: 'reply'
               }, dispatch)}>{`回复(${children.length})`}</span>
             </div>
                      :
             null}
          </div>
          {
            children.length > 0 ?
            <div className={styles[`${PrefixCls}-child-more`]}
                 onClick={handlerMoreClick.bind(null, 'replyAll', {}, dispatch)}>查看更多</div>
                                :
            null
          }

        </div>
      );
    };
    const { canreply, id, created, children, message, subject, userfullname, userpictureurl, attachment = '', attachments } = item,
      silceArr = (num) => (children.slice(0, num));
    return (
      <Item wrap key={id} className={styles[`${PrefixCls}-forumDetails`]} onError={(el => getErrorImg(el, 'user'))}>
        <div className={styles[`${PrefixCls}-forumDetails-info`]}>
          <img src={getImages(userpictureurl, '')} style={{ marginRight: '10px' }} />
          <div>{userfullname}</div>
        </div>
        <div className={styles[`${PrefixCls}-forumDetails-content`]}>
          <InnerHtml data={message} />
          {
            attachment !== '' ?
            <Enclosure key={id} data={attachments} />
                              :
            null
          }
        </div>
        <div className={styles[`${PrefixCls}-forumDetails-describe`]}>
          <div>{getCommonDate(created)}</div>
          {canreply ?
           <div className={styles[`${PrefixCls}-forumDetails-reply`]}>
             <Icon type={getLocalIcon('/components/xiaoxi.svg')} />
             <span style={{ marginLeft: '3px' }} onClick={handlerMoreClick.bind(null, 'sendForum', {
               maxattachments,
               maxbytes,
               id,
               subject,
               type: 'reply'
             }, dispatch)}>{`回复(${children.length})`}</span>
           </div>
                    :
           null}
        </div>
        {children.length > 0 ?
         <div className={styles[`${PrefixCls}-forumDetails-children`]}>
           {silceArr(2)
             .map(item => renderChild(item, handlerMoreClick, dispatch, maxattachments, maxbytes))}
           {children.length > 0 ? <span>展开</span> : null}
         </div>
                             : null}
      </Item>
    );
  },
  messageListRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { avatar, details, smallmessage, timecreated, userName, useridfrom, unread } = rowData;
    // 通知列表
    return (
      <div key={useridfrom} className={styles[`${PrefixCls}-message`]}
           onClick={onClick.bind(null, 'conversation', {
             fromuserid: useridfrom,
             name: userName,
             avatar,
             unread
           }, dispatch)}>
        <Badge dot={unread}>
          <div className={styles[`${PrefixCls}-message-img`]}>
            <img src={getImages(avatar, 'user')} alt="" onError={(el => getErrorImg(el, 'user'))} />
          </div>
        </Badge>
        <div className={styles[`${PrefixCls}-message-content`]}>
          <div className={styles[`${PrefixCls}-message-content-top`]}>
            <div className={styles[`${PrefixCls}-message-content-top-title`]}>
              {userName}
            </div>
            <div className={styles[`${PrefixCls}-message-content-top-date`]}>
              {getMessageTime(timecreated)}
            </div>
          </div>
          <div className={styles[`${PrefixCls}-message-content-details`]}>
            {smallmessage}
          </div>
        </div>
      </div>
    );
  },
  commentsRow: (item, onClick, dispatch) => {
    const { content, fullname, userid, time, id } = item;
    return (
      <Card
        key={id}
        style={{ marginBottom: '10px' }}
        onClick={onClick.bind(null, 'userpage', { userid }, dispatch)}
      >
        <Card.Header
          title={fullname}
          extra={time}
        />
        <Card.Body>
          <InnerHtml data={content} />
        </Card.Body>
      </Card>
    );
  },
  messageRow: (rowData, sectionID, rowID, onClick, dispatch, userid) => {
    const { id, jumping = true, cmid, state, name, timecreated } = rowData;
    return (
      <List.Item
        key={id}
        wrap
        arrow={jumping ? 'horizontal' : null}
        className={styles[`${PrefixCls}-messagelist`]}
        onClick={
          onClick.bind(null, rowData, {
            cmid,
            userid
          }, dispatch)
        }
      >
        <div className={styles[`${PrefixCls}-messagelist-details`]}>
          {state === 'unread' ? <Badge text={'未读'} style={{ marginRight: 12 }} /> : null}
          {name}
        </div>
        <div className={styles[`${PrefixCls}-messagelist-date`]}>{getCommonDate(timecreated)}</div>
      </List.Item>
    );
  },
  sysNoticeRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { noticeId, noticeTitle, noticeContent, noticeCrateDate, readState, noticeType, extraParam = '' } = rowData;
    const path = noticeType === '1' ? 'opiniondetails' : 'details',
      params = noticeType === '1' && JSON.parse(extraParam) ?
        {
          id: JSON.parse(extraParam).feedbackId,
          noticeId
        }
                                                            :
        {
          name: '通知详情',
          type: 'detailsText',
          noticeId,
          content: noticeContent
        };
    return (
      <List.Item
        key={noticeId}
        wrap
        className={styles[`${PrefixCls}-messagelist`]}
        onClick={onClick.bind(null, path, params, dispatch)}
      >
        <div className={styles[`${PrefixCls}-messagelist-details`]}>
          {readState === '0' ? <Badge text={'未读'} style={{ marginRight: 12 }} /> : null}
          {noticeTitle}
        </div>
        <div className={styles[`${PrefixCls}-messagelist-date`]}>{getCommonDate(noticeCrateDate / 1000)}</div>
      </List.Item>
    );
  },
  opinionRow: (rowData, onClick, dispatch) => {
    const { submitType, submitDate, submitContent, currentStatus, opinionId } = rowData;
    return (
      <List.Item
        key={opinionId}
        wrap
        extra={<Tag
          text={currentStatus === '1' ? '已回复' : '未回复'}
          color={currentStatus === '1' ? 'green' : 'red'}
          size="xs" />}
        className={styles[`${PrefixCls}-messagelist`]}
        onClick={onClick.bind(null, 'opiniondetails', {
          name: '我的反馈',
          id: opinionId
        }, dispatch)}
      >
        <div className={styles[`${PrefixCls}-messagelist-details`]}>
          {/* {state === 'unread' ? <Badge text={'未读'} style={{ marginRight: 12 }} /> : null} */}
          {submitType}
        </div>
        <div className={styles[`${PrefixCls}-messagelist-date`]}>{getCommonDate(submitDate / 1000)}</div>
      </List.Item>
    );
  },
  appealRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { submitUserName, opinionId, submitDate, currentStatus, groupName, submitUser } = rowData;
    return (
      <List.Item
        key={opinionId}
        wrap
        className={styles[`${PrefixCls}-appeallist`]}
        onClick={onClick.bind(null, 'appealdetails', {
          name: '反馈详情',
          opinionId,
          submitUser,
          currentStatus
        }, dispatch)}
      >
        <div className={styles[`${PrefixCls}-appeallist-top`]}>
          <div>{submitUserName}</div>
          <Tag
            text={currentStatus === '1' ? '已回复' : '未回复'}
            color={currentStatus === '1' ? 'green' : 'red'}
            size="xs" />
        </div>
        <div className={styles[`${PrefixCls}-appeallist-content`]}>{groupName}</div>
        <div className={styles[`${PrefixCls}-appeallist-date`]}>{getCommonDate(submitDate / 1000)}</div>
      </List.Item>
    );
  },
  finalReportRow: (item, onClick, onRightClick, dispatch) => {
    const { name = '', role = '', id, tel, email, state, visit } = item;
    return (
      <div className={styles[`${PrefixCls}-finalReportList`]} key={id}>
        <List.Item
          className={styles[`${PrefixCls}-finalReportList-item`]}
          multipleLine
          extra={
            <div
              className={styles[`${PrefixCls}-finalReportList-extra`]}
              onClick={onRightClick}
            >
              <Icon type={getLocalIcon('/row/mail.svg')} size="lg" color="#22609c" />
              <span>站内信</span>
            </div>
          }
          key={id}
          wrap
          thumb={getImages('', 'user')}
          onClick={onClick}
        >
          <div className={styles[`${PrefixCls}-finalReportList-item-top`]}>
            <span> {name}</span>
            <a href={`tel:${tel}`}>{tel}</a>
          </div>
          <Tag
            text={role}
            color={'#1eb259'}
            size="xs" />
          <div className={styles[`${PrefixCls}-finalReportList-item-email`]}>{`邮箱:${email}`}</div>
        </List.Item>
        {
          state !== undefined ?
          <div className={styles[`${PrefixCls}-finalReportList-bottom`]}>
            <Tag
              text={state === 0 ? '未提交' : '已提交'}
              color={state === 0 ? '#f34e14' : '#1eb259'}
              size="xs" />
          </div>
                              :
          null
        }
        {
          visit !== undefined ?
          <div className={styles[`${PrefixCls}-finalReportList-bottom`]}>
            {`上次访问至今：${visit}`}
          </div>
                              :
          null
        }
      </div>
    );
  },
  reviewListRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { name, studentId, id, grade, commentary } = rowData;
    return (
      <div key={id} className={styles[`${PrefixCls}-reviewList`]}
           onClick={onClick.bind(null, 'userpage', { userid: id }, dispatch)}>
        <div className={styles[`${PrefixCls}-reviewList-top`]}>
          <div className={styles[`${PrefixCls}-reviewList-top-content`]}>
            <img src={getImages('', 'user')} alt="" onError={(el => getErrorImg(el, 'user'))} />
            <div className={styles[`${PrefixCls}-reviewList-top-content-info`]}>
              <div className={styles[`${PrefixCls}-reviewList-top-content-info-title`]}>
                {name}
              </div>
              <div className={styles[`${PrefixCls}-reviewList-top-content-info-id`]}>
                {`学号：${studentId}`}
              </div>
            </div>
          </div>
          <div className={styles[`${PrefixCls}-reviewList-top-grade`]}>
            {`${grade}分`}
          </div>
        </div>
        <div className={styles[`${PrefixCls}-reviewList-bottom`]}>
          {`评语：${commentary}`}
        </div>
      </div>
    );
  },
  memberRow: (rowData, sectionID, rowID, onClick, onRightClick, dispatch) => {
    const { name = '', studentId = '', id, tel, email, role = '学生', state, visit } = rowData;
    return (
      <div className={styles[`${PrefixCls}-memberList`]} key={id}>
        <List.Item
          className={styles[`${PrefixCls}-memberList-item`]}
          multipleLine
          key={id}
          wrap
          thumb={getImages('', 'user')}
          onClick={onClick}
        >
          <div className={styles[`${PrefixCls}-memberList-item-top`]}>
            <div className={styles[`${PrefixCls}-memberList-item-top-name`]}>
              <span>
                {name}
              </span>
              <Tag
                text={role}
                color={'#1eb259'}
                size="xs" />
            </div>
            <span className={styles[`${PrefixCls}-memberList-item-top-id`]}>
              {`学号：${studentId}`}
            </span>
          </div>
          <div className={styles[`${PrefixCls}-memberList-item-middle`]}>
            <div className={styles[`${PrefixCls}-memberList-item-middle-left`]}>
              <a href={`tel:${tel}`}>{tel}</a>
              <div className={styles[`${PrefixCls}-finalReportList-item-email`]}>{`邮箱：${email}`}</div>
            </div>
            <div>
              <div
                className={styles[`${PrefixCls}-memberList-item-middle-right`]}
                onClick={onRightClick}
              >
                <Icon type={getLocalIcon('/row/mail.svg')} size="lg" color="#22609c" />
                <span>站内信</span>
              </div>
            </div>
          </div>
        </List.Item>
        {
          visit !== undefined ?
          <div className={styles[`${PrefixCls}-finalReportList-bottom`]}>
            {`上次访问至今：${visit}`}
          </div>
                              :
          null
        }
      </div>
    );
  },

  memberAchievementRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { name = '', studentId = '', id, grade } = rowData;
    return (
      <List.Item
        className={styles[`${PrefixCls}-memberAchievementList`]}
        multipleLine
        key={id}
        wrap
        thumb={getImages('', 'user')}
        extra={
          <div
            className={styles[`${PrefixCls}-memberAchievementList-extra`]}
          >
            <p>课程总分</p>
            <span>{grade}</span>
          </div>
        }
        onClick={onClick}
      >
        <div className={styles[`${PrefixCls}-memberAchievementList-content`]}>
          <div className={styles[`${PrefixCls}-memberAchievementList-content-title`]}>{name}</div>
          <div className={styles[`${PrefixCls}-memberAchievementList-content-id`]}>{`学号:${studentId}`}</div>
        </div>
      </List.Item>
    );
  },
  memberAchievementDetailsRow: (item, onClick, dispatch) => {
    const { name = '', grade = '', id = '', react = '', itemType = '' } = item;
    return (
      <div
        key={id}
        className={classNames(styles[`${PrefixCls}-memberAchievementDetails`], { [styles.disabled]: id === '' })}
        onClick={id === '' ? '' : onClick.bind(null, item, dispatch)}
      >
        <div className={styles[`${PrefixCls}-memberAchievementDetails-top`]}>
          <span><Icon type={getLocalIcon(getTaskIcon(itemType))} size="xs" /></span>
          <span className={classNames({ [styles.disabled]: id === '' })}>{name}</span>
        </div>
        <div className={styles[`${PrefixCls}-memberAchievementDetails-grade`]}>
          成绩:
          <span>{grade}</span>
        </div>
        <div className={styles[`${PrefixCls}-memberAchievementDetails-react`]}>
          {`反馈：${react}`}
        </div>
      </div>
    );
  },

  systemRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { title = '', createDate = '', state = '', informationId = '', isTop } = rowData;
    const day = new Date(createDate).getDate() < 10 ? `0${new Date(createDate).getDate()}` : new Date(createDate).getDate();
    const date = (new Date(createDate).getMonth() + 1) < 10 ? `${new Date(createDate).getFullYear()}.0${new Date(createDate).getMonth() + 1}` : `${new Date(createDate).getFullYear()}.${new Date(createDate).getMonth() + 1}`;
    return (
      <div className={styles[`${PrefixCls}-system`]} key={informationId}>
        <List.Item
          wrap
          // extra={
          //   <Tag
          //     text={state === '1' ? '已读' : '未读'}
          //     color={state === '1' ? 'green' : 'blue'}
          //     size="xs" />
          // }
          onClick={(e) => onClick(rowData, dispatch, e)}
        >
          <div className={styles[`${PrefixCls}-system-content`]}>
            <div className={styles[`${PrefixCls}-system-content-date`]}>
              <span>{day}</span>
              <span>{date}</span>
            </div>
            <div className={styles[`${PrefixCls}-system-content-title`]}>
              {
                isTop === 1
                ?
                <Tag
                  inline
                  text="置顶"
                  color="red"
                  size="xs" />
                :
                null
              }
              {title}
            </div>
          </div>
        </List.Item>
      </div>
    );
  },

  progressRow: (item, index, onClick, dispatch) => {
    const { semesterYear = '', courses = [] } = item;
    // 移动端和pc端共用一个接口，但展示方式不一样 ，数据要做处理
    const year = parseInt(semesterYear, 10);
    const season = semesterYear.replace(/[ \d]/g, '');
    const passed = courses.filter(ev => ev.isPass === 1).length || 0;
    let totalScore;
    totalScore = courses.reduce((totalPrice, _) => totalPrice + parseInt(_.course.courseScore, 10), 0);

    return (
      <div className={styles[`${PrefixCls}-progress`]} key={index}>
        <List.Item
          wrap
          className={styles[`${PrefixCls}-progress-list`]}
          arrow="horizontal"
          key={index}
          extra={<span>{`${passed}门已通过`}</span>}
          onClick={() => onClick('progressDetails', { index }, dispatch)}
        >
          <div className={styles[`${PrefixCls}-progress-content`]}>
            <div className={styles[`${PrefixCls}-progress-content-date`]}>
              <span>{year}</span>
              <span>{`${season}`}</span>
            </div>
            <div className={styles[`${PrefixCls}-progress-content-lesson`]}>
              {`${courses.length}门课程`}
            </div>
            <div className={styles[`${PrefixCls}-progress-content-grade`]}>
              {`总得分：${totalScore}`}
            </div>
          </div>
        </List.Item>
      </div>
    );
  },

  timetableRow: (item, index, onClick, courseIdNumbers, dispatch) => {
    const { courseName = '', courseNumber = '', responsibleTeacher = '', courseTeacher = '', startDate = '', endDate = '', courseState, examScore, courseNumberStudy = '' } = item;
    const getCourseState = () => {
      let res = '';
      switch (courseState) {
        case 1:
          res = <span style={{ color: '#189c00' }}>[在开]</span>;
          break;
        case 2:
          res = <span style={{ color: '#ff6900' }}>[将开]</span>;
          break;
        case 3:
          res = <span style={{ color: '#000000' }}>[已开]</span>;
          break;
        default:
          res = '';
      }
      return res;
    };
    return (
      <div
        key={index}
        className={styles[`${PrefixCls}-timetable`]}>
        <div className={styles[`${PrefixCls}-timetable-title`]}>{courseName}</div>
        <div>
          {`课程编号：${courseNumber}`}{getCourseState()}
        </div>
        <div>{`责任教师: ${courseTeacher || '-'}`}</div>
        <div>{`辅导教师: ${responsibleTeacher || '-'}`}</div>
        <div>{`开课时间: ${changeLessonDate(startDate / 1000) || '-'}至${changeLessonDate(endDate / 1000) || '-'}`}</div>
        <div className={styles[`${PrefixCls}-timetable-last`]}>
          <div>{`形考成绩: ${examScore || '-'}`}</div>
          <Button disabled={courseState !== 1 || !courseIdNumbers.hasOwnProperty(courseNumberStudy)}
                  className={styles[`${PrefixCls}-timetable-btn`]}
                  onClick={courseState === 1 ? () => onClick({ id: courseIdNumbers[courseNumberStudy] }, dispatch) : null}
                  type="ghost"
                  size="small">进入学习</Button>
        </div>
      </div>
    );
  },
  collectionRow: (rowData, sectionID, rowID, onClick, dispatch) => {
    const { title = '', createDate = '', informationSource = '', informationId = '', isTop } = rowData;
    const day = new Date(createDate).getDate() < 10 ? `0${new Date(createDate).getDate()}` : new Date(createDate).getDate();
    const date = (new Date(createDate).getMonth() + 1) < 10 ? `${new Date(createDate).getFullYear()}.0${new Date(createDate).getMonth() + 1}` : `${new Date(createDate).getFullYear()}.${new Date(createDate).getMonth() + 1}`;
    return (
      <div className={styles[`${PrefixCls}-collection`]} key={informationId}>
        <List.Item
          wrap
          onClick={(e) => onClick(rowData, dispatch, e)}
        >
          <div className={styles[`${PrefixCls}-collection-content`]}>
            <div className={styles[`${PrefixCls}-collection-content-date`]}>
              <span>{day}</span>
              <span>{date}</span>
            </div>
            <div className={styles[`${PrefixCls}-collection-content-title`]}>
              {
                isTop === 1
                ?
                <Tag
                  inline
                  text="置顶"
                  color="red"
                  size="xs" />
                :
                null
              }
              <span>{`[${informationSource}]`}</span>
              {`${title}`}
            </div>
          </div>
        </List.Item>
      </div>
    );
  },

  noticeGKRow: (item, onClick, dispatch) => {
    const { title = '', informationDetail = '', informationSource = '', informationId = '', isTop } = item;
    return (
      <div className={styles[`${PrefixCls}-noticeGK`]} key={informationId}
           onClick={(e) => onClick(item, dispatch, e)}>
        <div className={styles[`${PrefixCls}-noticeGK-title`]}>
          {
            isTop === 1
            ?
            <Tag
              inline
              text="置顶"
              color="red"
              size="xs" />
            :
            null
          }
          <span>{`[${informationSource}]`}</span>
          {title}
        </div>
        <div className={styles[`${PrefixCls}-noticeGK-info`]}>
          {informationDetail.replace(/<[^>]+>/g, '')}
        </div>
      </div>
    );
  },
  progressDetailsRow: (item) => {
    const { course: { courseName = '', courseScore, examType = '', courseNumber = '', courseNature = '', progressId }, isPass = '', examScore = '' } = item;
    return (
      <div className={styles[`${PrefixCls}-progressDetails`]} key={progressId}>
        <div className={styles[`${PrefixCls}-progressDetails-title`]}>{courseName}</div>
        <div>{`课程性质: ${courseNature}`}</div>
        <div>{`课程编号：${courseNumber}`}</div>
        <div>{`学分: ${courseScore}`}</div>
        <div>{`考试形式: ${examType || '-'}`}</div>
        <div>{`成绩: ${examScore}`}</div>
        <div>
          <span>是否通过: </span>
          <span style={{ color: `${isPass === 1 ? 'green' : 'red'}` }}>{isPass === 1 ? '通过' : '未通过'}</span>
        </div>
      </div>
    );
  },
  courseGKRow: (item, onClick, index, dispatch) => {
    const { module = '', minimumCredit = 0, centralMinimumCredit = 0, modulePassCredits = 0 } = item;
    return (
      <div key={index} className={styles[`${PrefixCls}-courseGK`]} onClick={() => onClick('courseDetailsGK', {
        name: module,
        index
      }, dispatch)}>
        <div className={styles[`${PrefixCls}-courseGK-top`]}>
          <div>{module}</div>
          <Icon type="right" color="#ddd" />
        </div>
        <div className={styles[`${PrefixCls}-courseGK-content`]}>
          <div className={styles[`${PrefixCls}-courseGK-content-item`]}>
            <p>{minimumCredit || '-'}</p>
            <p>最低学分</p>
          </div>
          <div className={styles[`${PrefixCls}-courseGK-content-item`]}>
            <p>{centralMinimumCredit || '-'}</p>
            <p>中央最低学分</p>
          </div>
          <div className={styles[`${PrefixCls}-courseGK-content-item`]}>
            <p>{modulePassCredits || '-'}</p>
            <p>模块通过学分</p>
          </div>
        </div>
      </div>
    );
  }
};

