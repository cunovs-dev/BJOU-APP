/**
 * @author Lowkey
 * @date 2020/03/20 09:57:25
 * @Description: 国开通知制度
 */

import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, SearchBar, Toast, List, Layout, Tabs, } from 'components';
import { getLocalIcon } from 'utils';
import { systemRow } from 'components/row';
import { handlerPortalNoticeClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import styles from './index.less';

const { Header } = Layout;
const PrefixCls = 'systemGK';

@connect(({ systemGK, loading }) => ({
  systemGK,
  loading: loading.effects['systemGK/queryList']
}))

class SystemGK extends React.Component {
  constructor (props) {
    super(props);
  }

  onSearch = (val) => {
    if (val !== '') {
      const { categoryId } = this.props.systemGK;
      this.props.dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          isRefresh: true,
          categoryId,
          title: val
        }
      });
      this.props.dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          searchVal: val
        }
      });
    } else {
      Toast.fail('请输入标题名称');
    }
  };

  onCancel = () => {
    const { categoryId } = this.props.systemGK;
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        isRefresh: true,
        categoryId
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        searchVal: ''
      }
    });
  };

  onChange = (value) => {
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        searchVal: value
      }
    });
  };

  handlerChange = (tab, index) => {
    const { categoryId = '' } = tab;
    const { dispatch } = this.props;
    dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        categoryId,
        isRefresh: true
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        selectIndex: index,
        categoryId,
        list: [],
        scrollerTop: 0,
        searchVal: ''
      }
    });
  };

  render () {
    const { [PrefixCls]: { list, paginations, scrollerTop, searchVal, selectIndex, categoryId, tabs,  }, loading, dispatch } = this.props,

      onRefresh = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            categoryId,
            title: searchVal !== '' ? searchVal : null
          },
          callback
        });
      },
      onEndReached = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            categoryId,
            title: searchVal !== '' ? searchVal : null
          },
          callback
        });
      },
      onScrollerTop = (top) => {
        if (typeof top !== 'undefined' && !isNaN(top * 1)) {
          dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              scrollerTop: top
            }
          });
        }
      },
      getContents = (lists) => {
        const { currentPage, count, pageSize } = paginations,
          hasMore = (count > 0) && ((currentPage > 1 ? currentPage - 1 : 1) * pageSize < count);
        return (
          <ListView
            layoutHeader={''}
            dataSource={lists}
            layoutRow={(rowData, sectionID, rowID) => {
              return systemRow(rowData, sectionID, rowID, handlerPortalNoticeClick, dispatch);
            }}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            hasMore={hasMore}
            onScrollerTop={onScrollerTop.bind(null)}
            scrollerTop={scrollerTop}
          />
        );
      };

    return (
      <div>
        <Header isPure />
        <div className={styles.outer}>
          <Tabs
            tabs={tabs}
            initialPage={0}
            swipeable={false}
            page={selectIndex}
            onChange={this.handlerChange}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
          />
          <SearchBar
            placeholder="标题名称"
            onSubmit={this.onSearch}
            onCancel={this.onCancel}
            onChange={this.onChange}
            value={searchVal}
          />
          {list.length > 0 && !loading ? getContents(list) : <NoContent isLoading={loading} />}
        </div>
      </div>
    );
  }
}

export default SystemGK;
