import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon, List, Button, NoticeBar } from 'components';
import Introduction from 'components/introduction';
import { getImages, getDurationDay, getLocalIcon } from 'utils';
import { forumRow } from 'components/row';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const PrefixCls = 'forum';

class Forum extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
      startTime: 0
    };
  }

  componentDidMount () {
    const { courseid = '', cmid = '', type = 'mod', modname } = this.props.location.query;
    this.setState(() => ({
      startTime: new Date()
    }));
    this.props.dispatch({
      type: 'app/logApi',
      payload: {
        assesstime: new Date().getTime(),
        courseid,
        cmid,
        type,
        modname
      }
    });
    localStorage.removeItem('replyOpen');
  }

  componentWillUnmount () {

  }

  render () {
    const { data: { id, course, intro, discussions = [], cancreatediscussions, numdiscussions = 0, maxattachments, maxbytes, blockafter, blockperiod, warnafter, name: forumName = '', groupid, type = '' }, scrollerTop, hasMore } = this.props.forum,
      { name = '', courseid, forumid, cmid } = this.props.location.query;
    const { groups } = this.props.app,
      onRefresh = (callback) => {
        this.props.dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            courseid,
            forumid,
            cmid,
            callback
          },
        });
      },
      onEndReached = (callback) => {
        this.props.dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            courseid,
            forumid,
            cmid,
            callback
          },
        });
      },
      onScrollerTop = (top) => {
        if (typeof top !== 'undefined' && !isNaN(top * 1)) {
          this.props.dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              scrollerTop: top,
            },
          });
        }
      },
      getContents = (lists) => {
        const result = [];
        result.push(
          <ListView
            layoutHeader={''}
            dataSource={lists}
            layoutRow={(rowData, sectionID, rowID) => {
              return forumRow(rowData, sectionID, rowID, handlerChangeRouteClick, this.props.dispatch, name, groups);
            }}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            hasMore={hasMore}
            onScrollerTop={onScrollerTop.bind(null)}
            scrollerTop={scrollerTop}
            useBodyScroll
          />,
        );

        return result;
      };
    return (
      <div >
        <Nav
          title={forumName || name}
          dispatch={this.props.dispatch}
          renderNavRight={
            <span
              style={{ color: '#fff' }}
              onClick={handlerChangeRouteClick.bind(this, 'opinion', {
                name: '课程反馈', courseId: courseid, resourcesName: forumName || name, cmid
              }, this.props.dispatch)}
            >
              课程反馈
            </span >
          }
        />
        {type === 'qanda' ?
          <NoticeBar
            marqueeProps={{ loop: true }}
            mode="closable"
            icon={null}
          >这是一个问题和解答讨论区。为了能看到其他人的回应，您首先需要发表您的解答</NoticeBar > : ''}
        {blockperiod > 0 ?
          <NoticeBar
            marqueeProps={{ loop: true }}
            mode="closable"
            icon={null}
          >{`${getDurationDay(blockperiod)}内最多发 ${blockafter}个帖子`}</NoticeBar > : ''}
        <div className={styles[`${PrefixCls}-head`]} >
          <div className={styles[`${PrefixCls}-head-title`]} >
            {forumName || name}
          </div >
          <Introduction data={intro} dispatch={this.props.dispatch} courseid={course} />
        </div >
        <div className={styles[`${PrefixCls}-button`]} >
          {cancreatediscussions ? <Button
            type="primary"
            inline
            size="small"
            style={{ backgroundColor: '#ff9a18', border: 0 }}
            onClick={handlerChangeRouteClick.bind(null, 'sendForum', {
              maxattachments,
              maxbytes,
              id,
              course,
              type: 'add',
              groupid,
            }, this.props.dispatch)}
          >
            开启一个新话题
          </Button > : null}
        </div >
        <div className={styles.reset} style={{ height: this.state.height }} >
          <div className={styles[`${PrefixCls}-title`]} >
            <Icon type={getLocalIcon('/sprite/talk.svg')} />
            <div >{`话题(${numdiscussions})`}</div >
          </div >
          {
            discussions.length > 0 ?
              getContents(discussions)
              :
              <NoContent isLoading={this.props.loadForum} />
          }
        </div >
      </div >
    );
  }
}

export default connect(({ loading, forum, app }) => ({
  loadForum: loading.effects[`${PrefixCls}/queryList`],
  forum,
  app
}))(Forum);
