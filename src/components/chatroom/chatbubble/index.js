import React from 'react';
import { getImages, getErrorImg } from 'utils';
import { Css3Loading, LoadingFail } from 'components/loading';
import styles from './index.less';

const PrefixCls = 'bubble',
  showStatus = (status = 0) => {
    return status === 0 ? '' : status === 1 ? <Css3Loading /> : <LoadingFail />;
  };
module.exports = {
  ReceiveBubble: (props) => {
    const { details, avatar } = props;
    return (
      <div className={styles[`${PrefixCls}-left`]} >
        <span className={styles[`${PrefixCls}-left-iconbox`]} >
          <img src={getImages(avatar, 'user')} onError={(el => getErrorImg(el, 'user'))} />
        </span >
        <div className={styles[`${PrefixCls}-left-contentbox`]} >
          {details}
        </div >
      </div >
    );
  },

  ReplyBubble: (props) => {
    // status : 0 发送成功 , 1 发送中 , 2 发送失败
    const { details, selfavatar, state = 0 } = props;
    return (
      <div className={styles[`${PrefixCls}-right`]} >
        <span className={styles[`${PrefixCls}-right-iconbox`]} >
          <img src={getImages(selfavatar, 'user')} onError={(el => getErrorImg(el, 'user'))}  />
        </span >
        <div className={styles[`${PrefixCls}-right-contentbox`]} >
          {details}
        </div >
        <div className={styles[`${PrefixCls}-right-loading`]} >{showStatus(state)}</div >
      </div >
    );
  },

};
