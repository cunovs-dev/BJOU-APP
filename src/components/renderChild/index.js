import React from 'react';
import { List, Icon } from 'components';
import InnerHtml from 'components/innerhtml';
import Enclosure from 'components/enclosure';
import classNames from 'classnames';
import {
  getErrorImg,
  getImages,
  getLocalIcon,
  getCommonDate
} from 'utils';
import styles from './index.less';

const PrefixCls = 'renderChild';

class RenderChild extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      openLists: {},
      isOpen: localStorage.getItem('replyOpen') || false
      //
    };
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  handlerAllClick = () => {
    const { item: { id } } = this.props,
      { openLists } = this.state;
    if (!openLists.hasOwnProperty(id)) {
      openLists[id] = true;
      this.setState({
        openLists: openLists,
        isOpen: true
      });
      localStorage.setItem('replyOpen', true);
    }
  };

  renderChild = (item, handlerMoreClick, dispatch, maxattachments, maxbytes, hasBorder) => {
    const { isOpen } = this.state;
    const { canreply, id, created, children = [], message, subject, userpictureurl, userfullname, attachment = '', attachments, aggregatelabel, aggregatestr = '', count = '', num } = item;
    if (num < 3 || isOpen) {
      return (
        <div
          key={id}
          className={classNames(styles[`${PrefixCls}-child`], { [styles[`${PrefixCls}-bottom-border`]]: hasBorder === true })}>
          <div className={styles[`${PrefixCls}-child-info`]}>
            <div className={styles[`${PrefixCls}-child-info-container`]}>
              <img
                src={getImages(userpictureurl, '')}
                alt=""
                style={{ marginRight: '10px' }}
                onError={(el => getErrorImg(el, 'user'))}
              />
              <div className={styles[`${PrefixCls}-forumDetails-info-title`]}>
                <div>{subject}</div>
                <div>{`由 ${userfullname} 发布`}</div>
              </div>
            </div>
            <div>{`#${item.level}`}</div>
          </div>
          <div className={styles[`${PrefixCls}-child-content`]}>
            <InnerHtml data={message} />
            {
              attachment !== '' ?
              <Enclosure key={id} data={attachments} />
                                :
              null
            }
            {
              aggregatelabel ?
              <div className={styles[`${PrefixCls}-forumDetails-grade`]}>
                {`${aggregatelabel}${aggregatestr === '' ? '-' : aggregatestr}${count ? `(${count})` : ''}`}
              </div>
                             :
              null
            }
          </div>
          <div className={styles[`${PrefixCls}-child-describe`]}>
            {getCommonDate(created)}
            {canreply ?
             <div className={styles[`${PrefixCls}-child-reply`]}>
               <Icon type={getLocalIcon('/components/xiaoxi.svg')} size="xs" />
               <span
                 style={{ marginLeft: '3px' }}
                 onClick={handlerMoreClick.bind(null, 'sendForum', {
                   maxattachments,
                   maxbytes,
                   id,
                   subject,
                   type: 'reply'
                 }, dispatch)}
               >
                {`回复`}
              </span>
             </div>
                      :
             null}
          </div>
          {
            children.length > 0 ?
            children.map(items => this.renderChild(items, handlerMoreClick, dispatch, maxattachments, maxbytes))
              /*<div
                className={styles[`${PrefixCls}-child-more`]}
                onClick={handlerMoreClick.bind(null, 'replyAll', { id }, dispatch)}
              >
                查看更多
              </div >*/
                                :
            null
          }
        </div>
      );
    }
  };

  render () {
    const { item, handlerMoreClick, dispatch, maxattachments, maxbytes, isAssessed } = this.props;
    const { canreply, id, created, children, message, subject, userfullname, userpictureurl, attachment = '', attachments, aggregatelabel, aggregatestr = '', count = '' } = item;
    const { openLists, isOpen } = this.state;
    const showLists = item.totalCounts <= 2 || (openLists.hasOwnProperty(id) && openLists[id] === true) ? children : children.slice(0, 2);
    return (
      <List.Item
        wrap
        key={id}
        className={styles[`${PrefixCls}-forumDetails`]}
        onError={(el => getErrorImg(el, 'user'))}
      >
        <div className={styles[`${PrefixCls}-forumDetails-info`]}>
          <img src={getImages(userpictureurl, '')} alt="" style={{ marginRight: '10px' }}
               onError={(el => getErrorImg(el, 'user'))} />
          <div className={styles[`${PrefixCls}-forumDetails-info-title`]}>
            <div>{subject}</div>
            <div>{`由 ${userfullname} 发布`}</div>
          </div>
        </div>
        <div className={styles[`${PrefixCls}-forumDetails-content`]}>
          <InnerHtml data={message} />
          {
            attachment !== '' ?
            <Enclosure key={id} data={attachments} />
                              :
            null
          }
          {
            aggregatelabel ?
            <div className={styles[`${PrefixCls}-forumDetails-grade`]}>
              {`${aggregatelabel}${aggregatestr === '' ? '-' : aggregatestr}${count ? `(${count})` : ''}`}
            </div>
                           :
            null
          }
        </div>
        <div className={styles[`${PrefixCls}-forumDetails-describe`]}>
          <div>{getCommonDate(created)}</div>
          {canreply && isAssessed === 'true' ?
           <div className={styles[`${PrefixCls}-forumDetails-reply`]}>
             <Icon type={getLocalIcon('/components/xiaoxi.svg')} size="xs" />
             <span
               style={{ marginLeft: '3px' }}
               onClick={handlerMoreClick.bind(null, 'sendForum', {
                 maxattachments,
                 maxbytes,
                 id,
                 subject,
                 type: 'reply'
               }, dispatch)}
             >{`回复`}</span>
           </div>
                                             :
           null}
        </div>
        {children.length > 0 ?
         <div className={styles[`${PrefixCls}-forumDetails-children`]}>
           {
             children.map((items, index) => this.renderChild(items, handlerMoreClick, dispatch, maxattachments, maxbytes, index === children.length - 1))}
         </div>
                             : null}
        {item.totalCounts > 3 && !isOpen ?
         <span
           className={styles.all}
           onClick={this.handlerAllClick}
         >
            <Icon type="down" />
           {`展开全部`}
                </span>
                                         :
         null
        }
      </List.Item>
    );
  }
}

export default RenderChild;
