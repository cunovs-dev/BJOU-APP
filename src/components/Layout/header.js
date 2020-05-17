/**
 * @author Lowkey
 * @date 2020/03/13 12:15:25
 * @Description: @ _ @
 */
import React from 'react';
import { getPortalAvatar, getErrorImg, config } from 'utils';
import Tag from 'components/tag';
import styles from './header.less';

const { api: { EnclosureDownload } } = config;
const Header = (props) => {
  return (
    <div className={styles.logoOuter}>
      <img src={require('themes/images/logo.png')} alt="" />
      {
        !props.isPure ?
        <div className={styles.info} onClick={props.handlerClick}>
          {
            props.payState !== null
            ?
            <Tag
              text={props.payState === 1 ? '已缴费' : '未缴费'}
              color={props.payState ? '#1eb259' : '#f34e14'}
              size="xs"
            />
            :
            null
          }
          <img
            className={styles.avatar}
            src={getPortalAvatar(EnclosureDownload, props.headImg)}
            alt=""
            onError={(el => getErrorImg(el, 'user'))}
            onClick={props.handlerClick}
          />
        </div>
                      :
        null
      }
      <div className={styles.bottom} />
    </div>
  );
};

Header.defaultProps = {
  handlerClick: null,
  payState: null,
  useravatar: '',
  isPure: false,
  headImg: null
};

export default Header;

