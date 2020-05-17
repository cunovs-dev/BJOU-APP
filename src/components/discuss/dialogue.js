/**
 * @author Lowkey
 * @date 2018/10/29
 * @Description:
 */
import React from 'react';
import { Modal, Icon } from 'components';
import { routerRedux } from 'dva/router';
import { getImages, getLocalIcon, getErrorImg } from 'utils';
import Replay from './reply';
import styles from './dialogue.less';

const alert = Modal.alert;

function Dialogue (props, dispatch) {
  const { items = [] } = props,
    children = [];
  const makeDiscuss = (name, commentId = '') => {
    props.dispatch(routerRedux.push({
      pathname: '/reply',
      query: {
        name,
        commentId
      },
    }));
  };
  const getChildren = (items, children) => {
    items.map(item => {
      children.push(item);
      if (item.items && item.items.length) {
        getChildren(item.items, children);
      }
    });
  };
  getChildren(items, children);
  const delDisscuss = () => {
    const alertInstance = alert('', '确定删除此条评论?', [
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
    <div className={styles['dialogue-box']} key={props.id}>
      <div className={styles['dialogue-title-box']}>
        <img className={styles['dialogue-image']}
          src={getImages(props.userPhoto, '')}
          alt=""
          onError={getErrorImg}
        />
        <div className={styles['dialogue-info']}>
          <h5 className={styles['dialogue-author']}>{props.name}</h5>
          <p className={styles['dialogue-times']}>
            {props.date}
          </p>
        </div>
      </div>
      <div className={styles['dialogue-content']}>
        <div className={'page-content'} style={{ overflow: 'hidden' }}>
          {props.contents}
        </div>
        <div className={styles['dialogue-btns']}>
          <a
            className={styles['dialogue-praise-btn']}
          >
            <span>0</span>
            <Icon type={getLocalIcon('/buttons/praise.svg')} />
          </a>
          <a className={styles['dialogue-reply-btn']}
            onClick={makeDiscuss.bind(null, `回复${props.name}`, props.id)}
          >
            <Icon type={getLocalIcon('/buttons/reply.svg')} />
          </a>
        </div>
        <div className={styles['dialogue-reply-box']}>
          {children && children.map((data) => {
            return (<Replay
              key={data.id}
              {...data}
              makeDiscuss={makeDiscuss}
            />);
          })}
        </div>
      </div>
    </div>
  );
}

export default Dialogue;
