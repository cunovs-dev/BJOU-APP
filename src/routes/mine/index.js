/* eslint-disable indent */
import React from 'react';
import { connect } from 'dva';
import { Button, Flex, WingBlank, WhiteSpace, List, Icon, Modal, Badge, ActivityIndicator, Toast } from 'components';
import { getImages, getErrorImg, getLocalIcon, renderSize } from 'utils';
import CarouselGrid from 'components/carouselgrid';
import { handlerChangeRouteClick, handleGridClick } from 'utils/commonevents';
import { routerRedux } from 'dva/router';
import { baseURL, api } from 'utils/config';
import styles from './index.less';

const PrefixCls = 'mine';
const { HelpUrl } = api;

function Mine ({ location, dispatch, mine, app }) {
  const { users: { username, useravatar }, isLogin } = app,
    { gridDatas } = mine;
  const handleLogin = () => {
      dispatch(routerRedux.push({
        pathname: '/login',
      }));
    },
    handlerHelpClick = () => {
      if (cnOpen) {
        cnOpen(HelpUrl());
      }
    };
  return (
    <div >
      <div className={styles[`${PrefixCls}-top`]} >
        <div className={styles[`${PrefixCls}-top-content`]} >
          <img src={getImages(useravatar, 'user')} alt="" onError={(el => getErrorImg(el, 'user'))} />
          <div className={styles[`${PrefixCls}-top-content-info`]} >
            <div className={styles[`${PrefixCls}-top-content-info-username`]} onClick={isLogin ? null : handleLogin} >
              {isLogin ? username : '登录'}
            </div >
          </div >
        </div >
        <div className={styles[`${PrefixCls}-top-homepage`]} >
          <Button
            onClick={handlerChangeRouteClick.bind(this, 'homepage', {}, dispatch)}
            type="ghost"
            inline
            size="small"
            style={{ color: '#fff', borderColor: '#fff', padding: '0 10px' }}
            icon={<Icon type={getLocalIcon('/mine/homepage.svg')} color="#fff" size="xs" />
            }
          >个人主页</Button >
        </div >
      </div >
      <WhiteSpace />
      <CarouselGrid
        datas={gridDatas}
        dispatch={dispatch}
        hasLine={false}
        handleClick={handleGridClick}
        isCarousel={false}
      />
      <WhiteSpace size="lg" />
      <div className={styles[`${PrefixCls}-info`]} >
        <List >
          <List.Item
            thumb={<Icon type={getLocalIcon('/sprite/phone.svg')} />}
            onClick={handlerChangeRouteClick.bind(this, 'contacts', { name: '我的联系人' }, dispatch)}
            arrow="horizontal"
          >
            我的联系人
          </List.Item >

          <List.Item
            thumb={<Icon type={getLocalIcon('/mine/help.svg')} />}
            arrow="horizontal"
            onClick={handlerHelpClick}
          >
            使用帮助
          </List.Item >
        </List >
        <WhiteSpace size="lg" />
        <List >
          <List.Item
            onClick={handlerChangeRouteClick.bind(this, 'set', { name: '设置' }, dispatch)}
            thumb={<Icon type={getLocalIcon('/mine/set.svg')} />}
            arrow="horizontal"
          >
            设置
          </List.Item >
        </List >
      </div >
    </div >
  );
}

export default connect(({ mine, app, login }) => ({
  mine,
  app,
  login,
}))(Mine);
