/**
 * @author Lowkey
 * @date 2018/10/18
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { classnames, config, getLocalIcon, cookie, oldAPP } from 'utils';
import { bkTabBars, gkTabBars, defaultTabBars } from 'utils/defaults';
import { Loader, TabBar, Icon, Modal, ActivityIndicator, Checkbox } from 'components';
import './app.less';

let isFirst = true;
const { _cg, _cs, _cr } = cookie;
const AgreeItem = Checkbox.AgreeItem;

const getBars = () => {
  if (oldAPP()) {
    return defaultTabBars;
  } else {
    return _cg('orgCode') === 'bjou_student' ? bkTabBars : gkTabBars;
  }
};

const App = ({ children, dispatch, app, loading, lessondetails, location }) => {
  let tabBars = getBars();
  let { pathname } = location;
  const { updates = {}, showModal, downloadProgress } = app,
    { upgraded = false, urls = '', appVerSion, updateInfo = '' } = updates;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  pathname = pathname.endsWith('/index.html') ? '/' : pathname; // Android配置首页自启动
  const menusArray = [];
  tabBars.map((_) => {
    menusArray.push(_.route);
  });
  cnSetStatusBarStyle(pathname);

  const handlerIgnoreClick = (e) => {
    if (e.target.checked) {
      _cs('localVersion', appVerSion);
    } else {
      _cr('localVersion');
    }
  };
  const getContent = (content, ignore) => {
    return (
      <div>
        <div
          style={{ maxHeight: '60vh', overflowY: 'scroll', textAlign: 'left' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {
          !ignore
          &&
          <div className="ignore">
            <AgreeItem onChange={handlerIgnoreClick}>
              此版本不再提示
            </AgreeItem>
          </div>
        }
      </div>
    );
  };

  const update = (url) => {
    if (upgraded && url !== '') {
      return (<Modal
        visible
        transparent
        maskClosable={false}
        title={`V${appVerSion}` || cnVersionInfo.title}
        footer={[{ text: '立刻升级', onPress: () => cnUpdate(url) }]}
      >
        <div>
          {getContent(updateInfo, upgraded) || cnVersionInfo.content}
        </div>
      </Modal>);
    }
    if (isFirst && url !== '' && !(_cg('localVersion') === appVerSion)) {
      Modal.alert(`V${appVerSion}` || cnVersionInfo.title, getContent(updateInfo, upgraded) || cnVersionInfo.content, [
        {
          text: '以后再说',
          onPress: () => dispatch({
            type: 'app/updateState',
            payload: {
              showModal: false
            }
          }),
          style: 'default'
        },
        { text: '现在升级', onPress: () => cnUpdate(url) }
      ]);
      isFirst = false;
    }
  };
  if (pathname !== '/' && pathname !== '/dashboard' && pathname !== '/dashboardGK' && pathname !== '/oldDashboard' && menusArray.length && !menusArray.includes(pathname)) {
    return (<div>
      <Loader spinning={loading.effects[`${pathname.startsWith('/') ? pathname.substr(1) : pathname}/query`]} />
      {children}
      <ActivityIndicator
        toast
        text={downloadProgress}
        animating={downloadProgress !== 0}
      />
    </div>);
  }

  return (
    <div className="tabbarbox" style={{ height: cnhtmlHeight }}>
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#2B83D7"
        barTintColor="white"
        hidden={false}
        prerenderingSiblingsNumber={0}
      >
        {tabBars.map((_, index) => {
          const props = Object.assign({
            key: index,
            selectedIcon: _.icon,
            selected: pathname === _.route,
            onPress: () => {
              const { appends = {}, route, key } = _;
              dispatch(routerRedux.push({
                  pathname: route,
                  query: {
                    ...appends
                  }
                }
              ));
            }
          }, _);
          props.icon = (<div style={{
            width: '0.44rem',
            height: '0.44rem',
            background: `url(${props.icon}) center center /  0.42rem 0.42rem no-repeat`
          }}
          />);

          props.selectedIcon = (<div style={{
            width: '0.44rem',
            height: '0.44rem',
            background: `url(${props.selectedIcon}) center center /  0.42rem 0.42rem no-repeat`
          }}
          />);
          return (
            <TabBar.Item {...props}>
              {pathname === _.route ? children : ''}
            </TabBar.Item>
          );
        })}
      </TabBar>
      {showModal && update(urls)}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func,
  icon: PropTypes.string
};

export default connect(({ app, lessondetails, loading }) => ({ app, lessondetails, loading }))(App);
