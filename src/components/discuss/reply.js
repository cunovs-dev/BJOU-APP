/**
 * @author Lowkey
 * @date 2018/10/29
 * @Description:
 */
import React from 'react';
import styles from './reply.less';
import { Modal, Icon } from 'components';
import { getImages, getLocalIcon, getErrorImg } from 'utils';


const alert = Modal.alert;

function Replay (props) {
  const createMarkup = () => {
    return {
      __html: props.contents,
    };
  };
  const delReplay = () => {
    const alertInstance = alert('', '确定删除此条回复?', [
      {
        text: '取消',
        onPress: () => console.log('cancel'),
        style: 'default',
      },
      {
        text: '确定',
        onPress: () => console.log('cancel'),
      },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      alertInstance.close();
    }, 10000);
  };
  return (
    <div className={styles['reply-box']}>
      <div className={styles['reply-content']}>
        <div className={styles['reply-content-title']}>
          <img src={getImages(props.userPhoto, '')}
            alt=""
            onError={getErrorImg}
          />
          <h5>
            <a>{props.name}</a>
            <span><Icon type={getLocalIcon('/buttons/reply2.svg')} size="xxs" /></span>
            <a>{props.rname}</a>
          </h5>
        </div>
        <div className={'page-content'} style={{ overflow: 'hidden' }}>
          {props.contents}
        </div>
        <div className={styles['reply-container']} />
        <div className={styles['reply-others']}>
          <p className={styles['reply-times']}>
            {props.date}
          </p>
          <div className={styles['reply-btns']}>
            <a
              className={styles['reply-praise-btn']}
            >
              <span>0</span>
              <Icon type={getLocalIcon('/buttons/praise.svg')} />
            </a>
            <a className={styles['reply-reply-btn']}
              onClick={props.makeDiscuss.bind(null, `回复${props.name}`, props.id)}
            >
              <Icon type={getLocalIcon('/buttons/reply.svg')} />
            </a>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Replay;
