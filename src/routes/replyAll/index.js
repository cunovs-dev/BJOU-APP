import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon, List, Layout, WhiteSpace } from 'components';
import { getImages, getLocalIcon, getCommonDate, getErrorImg } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import TitleBox from 'components/titlecontainer';
import { forumAllRow } from 'components/row';
import Enclosure from 'components/enclosure';
import InnerHtml from 'components/innerhtml';
import styles from './index.less';

const PrefixCls = 'replyAll';

class ReplyAll extends React.Component {
  getParent = (data, id) => data.find(item => item.id === parseInt(id, 10));

  render () {
    const { data = {} } = this.props.forumDetails,
      { id: parentId } = this.props.location.query;
    const { id = '', message = '', attachments = '', subject = '', canreply = true, userfullname = '', created = '', userpictureurl = '', aggregatelabel, aggregatestr = '', count = '' } = this.getParent(data, parentId);
    this.getParent(data, parentId)
    const { data: { maxattachments, maxbytes } } = this.props.forum;
    return (
      <div style={{ minHeight: '100vh' }} >
        <Nav title={'全部回复'} dispatch={this.props.dispatch} />
        <div className={styles[`${PrefixCls}-master`]} >
          <div className={styles[`${PrefixCls}-master-man`]} >
            <img src={getImages(userpictureurl, '')} onError={(el => getErrorImg(el, 'user'))} />
            <span >
              <span className={styles[`${PrefixCls}-master-man-username`]} >{userfullname}</span >
              <span className={styles[`${PrefixCls}-master-man-time`]} >{getCommonDate(created)}</span >
            </span >
          </div >
          <div >
            <InnerHtml data={message} handleClick={this.handleDivClick} />
            {
              attachments !== '' ?
                <Enclosure data={attachments} />
                :
                null
            }
            {
              aggregatelabel ?
                <div className={styles[`${PrefixCls}-master-grade`]} >
                  {`${aggregatelabel}${aggregatestr === '' ? '-' : aggregatestr}${count ? `(${count})` : ''}`}
                </div >
                :
                null
            }
          </div >
          {
            canreply ?
              <div className={styles[`${PrefixCls}-master-reply`]} >
                <div
                  className={styles[`${PrefixCls}-master-reply-btn`]}
                  onClick={handlerChangeRouteClick.bind(null, 'sendForum', {
                    maxattachments,
                    maxbytes,
                    id,
                    subject,
                    type: 'reply',
                  }, this.props.dispatch)}
                >
                  <Icon type={getLocalIcon('/components/xiaoxi.svg')} />
                  <span style={{ marginLeft: '3px' }} >回复</span >
                </div >
              </div > : null}
        </div >
        <WhiteSpace size="xs" />
        <TitleBox title="回复" sup="" />
        <List >
          {/*{*/}
          {/*cnIsArray(this.getChildren(this.getParent(data, parentId))) && this.getChildren(this.getParent(data, parentId)).length > 0 ?*/}
          {/*this.getChildren(this.getParent(data, parentId))*/}
          {/*.map(item => forumAllRow(item, handlerChangeRouteClick, this.props.dispatch))*/}
          {/*:*/}
          {/*''*/}
          {/*}*/}
        </List >
      </div >
    );
  }
}


export default connect(({ replyAll, forumDetails, forum }) => ({
  replyAll,
  forumDetails,
  forum
}))(ReplyAll);
