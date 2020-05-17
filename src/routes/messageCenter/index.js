import React from 'react';
import { parse } from 'qs';
import Nav from 'components/nav';
import { connect } from 'dva';
import { List, Badge, Icon, Tabs } from 'antd-mobile';
import ReactDOM from 'react-dom';
import ListView from 'components/listview';
import { handlerMessageClick, handlerChangeRouteClick } from 'utils/commonevents';
import { messageListRow, messageRow, sysNoticeRow } from 'components/row';
import { ListSkeleton } from 'components/skeleton';
import { getImages, getLocalIcon, getOffsetTopByBody, getCommonDate, pattern } from 'utils';
import NoContent from 'components/nocontent';
import styles from './index.less';

const PrefixCls = 'messageCenter';

@connect(({ messageCenter, app, loading }) => ({ // babel装饰器语法糖
  messageCenter,
  loadingMessage: loading.effects['messageCenter/queryMessage'],
  loadingTalk: loading.effects['messageCenter/queryTalkMessage'],
  loadingSys: loading.effects['messageCenter/querySysNotice'],
  app,
}))

class MessageCenter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: cnhtmlHeight,
      color: 'black',
      sign: true,
    };
  }

  componentDidMount () {
    const { selectIndex } = this.props.messageCenter;
    if (selectIndex === 1) {
      this.props.dispatch({
        type: `${PrefixCls}/queryTalkMessage`,
        payload: {
          isRefresh: true,
        },
      });
    }
    if (selectIndex === 2) {
      this.props.dispatch({
        type: `${PrefixCls}/querySysNotice`,
        payload: {
          isRefresh: true,
        },
      });
    }
    const element = ReactDOM.findDOMNode(this.vl),
      currentHeight = element.offsetHeight,
      currentH = getOffsetTopByBody(ReactDOM.findDOMNode(this.vll));
    this.setState({
      height: cnhtmlHeight - currentHeight - currentH,
    });
  }


  render () {
    const {
        messageList, talkList, sysList, paginations, count: { newsCount, noticeCount, notReadNoticeCount }, selectIndex = 0, type, scrollerTop, hasMoreMessage, hasMoreTalk, isload,
      } = this.props.messageCenter,
      { loadingMessage, loadingTalk, loadingSys } = this.props,
      { users: { userid } } = this.props.app,
      onTabsChange = (tabs, index) => {
        const currentType = [
          'queryMessage',
          'queryTalkMessage',
          'querySysNotice'
        ];
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            selectIndex: index,
            type: currentType[index],
            isRefresh: true,
            talkList: [],
            isload: false

          },
        });
        if (index === 1) {
          this.props.dispatch({
            type: `${PrefixCls}/queryTalkMessage`,
            payload: { isRefresh: true }
          });
        }
        if (index === 2) {
          this.props.dispatch({
            type: `${PrefixCls}/querySysNotice`,
            payload: { isRefresh: true }
          });
        }
      },
      onRefresh = (callback) => {
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            readstart: 0,
            unreadstart: 0,
            nowPage: 0,
            isload: true
          }
        });
        this.props.dispatch({
          type: `${PrefixCls}/${type}`,
          payload: {
            isRefresh: true,
            callback
          },
        });
      },
      onEndReached = (callback) => {
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            isload: true
          }
        });
        this.props.dispatch({
          type: `${PrefixCls}/${type}`,
          payload: {
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

      getMessage = (lists) => {
        const result = [];
        result.push(
          <div style={{ padding: '0 12px', marginTop: '10px' }} >
            <ListView
              layoutHeader={''}
              dataSource={lists}
              layoutRow={(rowData, sectionID, rowID) => {
                return messageRow(rowData, sectionID, rowID, handlerMessageClick, this.props.dispatch, userid);
              }}
              onEndReached={onEndReached}
              onRefresh={onRefresh}
              hasMore={hasMoreMessage}
              onScrollerTop={onScrollerTop.bind(null)}
              scrollerTop={scrollerTop}
              useBodyScroll
            />
          </div >
        );

        return result;
      },
      getTalkMessage = (lists) => {
        const result = [];
        result.push(
          <div style={{ padding: '0 12px', marginTop: '10px' }} >
            <ListView
              layoutHeader={''}
              dataSource={lists}
              layoutRow={(rowData, sectionID, rowID) => {
                return messageListRow(rowData, sectionID, rowID, handlerChangeRouteClick, this.props.dispatch);
              }}
              onEndReached={onEndReached}
              onRefresh={onRefresh}
              hasMore={hasMoreTalk}
              onScrollerTop={onScrollerTop.bind(null)}
              scrollerTop={scrollerTop}
              useBodyScroll
            />
          </div >
        );

        return result;
      },
      getSysMessage = (lists) => {
        const { sysNowPage, sysTotal, sysPageSize } = paginations,
          hasMoreNotice = (sysTotal > 0) && ((sysNowPage > 1 ? sysNowPage - 1 : 1) * sysPageSize < sysTotal),
          result = [];
        result.push(
          <div style={{ padding: '0 12px', marginTop: '10px' }} >
            <ListView
              layoutHeader={''}
              dataSource={lists}
              layoutRow={(rowData, sectionID, rowID) => {
                return sysNoticeRow(rowData, sectionID, rowID, handlerChangeRouteClick, this.props.dispatch);
              }}
              onEndReached={onEndReached}
              onRefresh={onRefresh}
              hasMore={hasMoreNotice}
              onScrollerTop={onScrollerTop.bind(null)}
              scrollerTop={scrollerTop}
              useBodyScroll
            />
          </div >
        );

        return result;
      };
    return (
      <div className={styles.whiteBox} >
        <div ref={el => this.vl = el} >
          <Nav title="消息中心" dispatch={this.props.dispatch} />
        </div >
        <Tabs
          className={styles[`${PrefixCls}-tabs`]}
          style={{ height: this.state.height }}
          ref={el => this.vll = el}
          initialPage={0}
          page={selectIndex}
          swipeable={false}
          onChange={onTabsChange}
          tabBarInactiveTextColor="#b7b7b7"
          tabBarUnderlineStyle={{ border: '1px solid #22609c' }}
          tabs={[
            { title: <Badge overflowCount={99} text={noticeCount} >课程活动</Badge > },
            { title: <Badge overflowCount={99} text={newsCount} >消息</Badge > },
            { title: <Badge overflowCount={99} text={notReadNoticeCount} >系统通知</Badge > },
          ]}
        >
          {loadingMessage && !isload ?
            <ListSkeleton />
            :
            <div className={styles.reset} >{messageList.length > 0 ? getMessage(messageList) : <NoContent />}</div >}

          {loadingTalk && !isload ?
            <ListSkeleton />
            :
            <div className={styles.reset} >{talkList.length > 0 ? getTalkMessage(talkList) : <NoContent />}</div >
          }
          {loadingSys && !isload ?
            <ListSkeleton />
            :
            <div
              className={styles.reset} >{cnIsArray(sysList.data) && sysList.data.length > 0 ? getSysMessage(sysList.data) :
              <NoContent />}</div >
          }
          {/*<div className={styles.reset} ><NoContent /></div >*/}
        </Tabs >
      </div >
    );
  }
}

export default MessageCenter;
