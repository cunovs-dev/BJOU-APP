import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Badge, Icon, List, Layout, NoticeBar, WhiteSpace } from 'components';
import Enclosure from 'components/enclosure';
import { getImages, getLocalIcon, getCommonDate, getErrorImg } from 'utils';
import InnerHtml from 'components/innerhtml';
import TitleBox from 'components/titlecontainer';
import { handlerChangeRouteClick, handlerDivInnerHTMLClick } from 'utils/commonevents';
import { forumDetailsRow } from 'components/row';
import RenderChild from 'components/renderChild';
import { routerRedux } from 'dva/router';
import Refresh from 'components/pulltorefresh';
import styles from './index.less';

const PrefixCls = 'forumDetails';
const { BaseLine } = Layout;

class ForumDetails extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0
    };
  }

  componentWillMount () {
    document.documentElement.scrollTop = 0;
  }

  componentDidMount () {


  }

  Click = (name) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/replyAll',
      query: {
        name: { name }
      }
    }));
  };

  handleDivClick = (e) => {
    handlerDivInnerHTMLClick(e, 'courseid', this.props.dispatch);
  };

  onRefresh = (type) => {
    const { discussionid } = this.props.location.query;
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        refreshing: true
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/${type}`,
      payload: {
        discussionid
      }
    });
  };

  onScrollerTop = (top) => {
    const { dispatch } = this.props;
    if (typeof top !== 'undefined' && !isNaN(top * 1)) {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          scrollerTop: top
        }
      });
    }
  };

  render () {
    const { names = '', discussionid = '', isAssessed = true } = this.props.location.query;
    const { parent, replyList, refreshing, scrollerTop } = this.props.forumDetails;
    const { id = '', message = '', attachments = '', subject = '', canreply = true, userfullname = '', created = '', userpictureurl = '', aggregatelabel, aggregatestr = '', count = '' } = parent;
    const { data: { maxattachments, maxbytes } } = this.props.forum;
    const props = {
      dispatch: this.props.dispatch,
      handlerMoreClick: handlerChangeRouteClick,
      maxattachments,
      maxbytes,
      isAssessed
    };
    return (
      <div>
        <Nav title={names} dispatch={this.props.dispatch} />
        {/*{canreply ? '' :*/}
        {/*<NoticeBar*/}
        {/*marqueeProps={{ loop: true }}*/}
        {/*mode="closable"*/}
        {/*icon={null}*/}
        {/*>*/}
        {/*话题已被冻结，不再接受新回复*/}
        {/*</NoticeBar >*/}
        {/*}*/}
        <Refresh
          refreshing={refreshing}
          onRefresh={this.onRefresh.bind(null, 'query')}
          onScrollerTop={this.onScrollerTop.bind(null)}
          scrollerTop={scrollerTop}
        >
          <div className={styles[`${PrefixCls}-master`]}>
            <div className={styles[`${PrefixCls}-master-man`]}>
              <img src={getImages(userpictureurl, '')} onError={(el => getErrorImg(el, 'user'))} />
              <span>
                <span className={styles[`${PrefixCls}-master-man-username`]}>{userfullname}</span>
                <span className={styles[`${PrefixCls}-master-man-time`]}>{getCommonDate(created)}</span>
              </span>
            </div>
            <div className={styles[`${PrefixCls}-master-subject`]}>{subject}</div>
            <div>
              <InnerHtml data={message} handleClick={this.handleDivClick} />
              {
                parent.attachments !== '' ?
                <Enclosure data={attachments} />
                                          :
                null
              }
              {
                aggregatelabel ?
                <div className={styles[`${PrefixCls}-master-grade`]}>
                  {`${aggregatelabel}${aggregatestr === '' ? '-' : aggregatestr}${count ? `(${count})` : ''}`}
                </div>
                               :
                null
              }
            </div>
            {
              canreply && isAssessed === 'true' ?
              <div className={styles[`${PrefixCls}-master-reply`]}>
                <div
                  className={styles[`${PrefixCls}-master-reply-btn`]}
                  onClick={handlerChangeRouteClick.bind(null, 'sendForum', {
                    maxattachments,
                    maxbytes,
                    id,
                    subject,
                    type: 'reply',
                    discussionid
                  }, this.props.dispatch)}
                >
                  <Icon type={getLocalIcon('/components/xiaoxi.svg')} />
                  <span style={{ marginLeft: '3px' }}>回复</span>
                </div>
              </div> : null}
          </div>
          <WhiteSpace />
          <TitleBox title="回复" sup="" />
          <div className={styles[`${PrefixCls}-replyList`]}>
            <List>
              {
                cnIsArray(replyList) && replyList.length > 0 ?
                replyList.map((item) => <RenderChild {...props} item={item} />)
                                                             :
                null
              }
            </List>
          </div>
          <BaseLine />
        </Refresh>
      </div>
    );
  }
}


export default connect(({ forumDetails, forum }) => ({
  forumDetails,
  forum
}))(ForumDetails);
