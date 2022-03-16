import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon, List, Button, NoticeBar, Modal } from 'components';
import Introduction from 'components/introduction';
import { getImages, getDurationDay, getLocalIcon, getCommonDate } from 'utils';
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
      startTime: 0,
      visible: true
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

  showAlert = (text) => {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        footer={[{ text: '我知道了', onPress: () => this.setState({ visible: false }) }]}
      >
        {text}
      </Modal>
    );
  };

  render () {
    const { data: { id, course, intro, assesstimestart = 0, assesstimefinish = 0, discussions = [], cancreatediscussions, numdiscussions = 0, maxattachments, maxbytes, blockafter, blockperiod, warnafter, name: forumName = '', groupid, type = '', _useScriptFunc = false }, scrollerTop, hasMore } = this.props.forum,
      { name = '', courseid, forumid, cmid } = this.props.location.query;
    const { groups, _useJavaScriptMessage } = this.props.app,
      onRefresh = (callback) => {
        this.props.dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            courseid,
            forumid,
            cmid,
            callback
          }
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
          }
        });
      },
      onScrollerTop = (top) => {
        if (typeof top !== 'undefined' && !isNaN(top * 1)) {
          this.props.dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              scrollerTop: top
            }
          });
        }
      },
      getContents = (lists) => {
        const cur = new Date().getTime() / 1000;
        const isAssessed = cur < assesstimefinish;
        return (
          <ListView
            layoutHeader={''}
            dataSource={lists}
            layoutRow={(rowData, sectionID, rowID) => {
              return forumRow(rowData, sectionID, rowID, handlerChangeRouteClick, this.props.dispatch, name, isAssessed, groups);
            }}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            hasMore={hasMore}
            onScrollerTop={onScrollerTop.bind(null)}
            scrollerTop={scrollerTop}
            useBodyScroll
          />
        );
      },

      getIsAssessed = () => {
        const cur = new Date().getTime() / 1000;
        if (assesstimefinish > 0) {
          return cur < assesstimefinish;
        }
        return true;
      },

    getIsStartAssessed = () => {
      const cur = new Date().getTime() / 1000;
      if (assesstimestart > 0) {
        return cur > assesstimestart;
      }
      return true;
    };

    return (
      <div>
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
            </span>
          }
        />
        {type === 'qanda' ?
         <NoticeBar
           marqueeProps={{ loop: true }}
           mode="closable"
           icon={null}
         >这是一个问题和解答讨论区。为了能看到其他人的回应，您首先需要发表您的解答。</NoticeBar> : ''}
        {blockperiod > 0 ?
         <NoticeBar
           marqueeProps={{ loop: true }}
           mode="closable"
           icon={null}
         >{`${getDurationDay(blockperiod)}内最多发 ${blockafter}个帖子`}</NoticeBar> : ''}
        <div className={styles[`${PrefixCls}-head`]}>
          <div className={styles[`${PrefixCls}-head-title`]}>
            {forumName || name}
          </div>
          {
            assesstimestart !== 0 || assesstimefinish !== 0 ?
            <div className={styles.time}>
              {`发帖开放时间：${getCommonDate(assesstimestart, true, false)}至${getCommonDate(assesstimefinish, true, false)}`}
            </div>
                                                            :
            null
          }
          <Introduction data={intro} dispatch={this.props.dispatch} courseid={course} />
        </div>
        <div className={styles[`${PrefixCls}-button`]}>
          {cancreatediscussions && getIsAssessed() && getIsStartAssessed() ? <Button
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
                                                       groupid
                                                     }, this.props.dispatch)}
                                                   >
                                                     开启一个新话题
                                                   </Button> :
           getIsAssessed() ?
           null
                           :
           <NoticeBar
             marqueeProps={{ loop: true }}
             mode="closable"
             icon={null}
           >{`发帖时间已于${getCommonDate(assesstimefinish, true, false)}截至，您不能进行发帖和回帖了`}</NoticeBar>
          }
        </div>
        <div className={styles.reset} style={{ height: this.state.height }}>
          <div className={styles[`${PrefixCls}-title`]}>
            <Icon type={getLocalIcon('/sprite/talk.svg')} />
            <div>{`话题(${numdiscussions})`}</div>
          </div>
          {
            discussions.length > 0 ?
            getContents(discussions)
                                   :
            <NoContent isLoading={this.props.loadForum} />
          }
        </div>
        {
          _useJavaScriptMessage && _useScriptFunc && this.showAlert(_useJavaScriptMessage.warn)
        }
      </div>
    );
  }
}

export default connect(({ loading, forum, app }) => ({
  loadForum: loading.effects[`${PrefixCls}/queryList`],
  forum,
  app
}))(Forum);
