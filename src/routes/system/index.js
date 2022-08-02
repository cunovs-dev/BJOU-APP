/**
 * @author Lowkey
 * @date 2020/03/17 15:02:54
 * @Description: 统治制度
 */

import React from 'react';
import { connect } from 'dva';
import {
  WhiteSpace,
  Icon,
  List,
  Layout,
  Toast,
  SegmentedControl,
  WingBlank,
  Tabs,
  SearchBar,
  Popover
} from 'components';
import { getLocalIcon } from 'utils';
import { systemRow } from 'components/row';
import { handlerPortalNoticeClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import styles from './index.less';

const { Header } = Layout;
const PrefixCls = 'system';

@connect(({ system, loading }) => ({
  system,
  loading: loading.effects['system/queryList'] || loading.effects['system/queryNoticeTabs']
}))

class System extends React.Component {
  constructor (props) {
    super(props);
    // this.state = {
    //   visible: false,
    // };
  }

  onSelect = (opt) => {
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        categoryId: opt.props.value,
        isRefresh: true
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        categoryId: opt.props.value,
        searchVal: ''
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

  onSearch = (val) => {
    if (val !== '') {
      const { categoryId } = this.props.system;
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
    const { categoryId } = this.props.system;
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

  render () {
    const { [PrefixCls]: { list, paginations, scrollerTop, selectIndex, categoryId, tabs, searchVal = '' }, loading, dispatch } = this.props,
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

      },
      renderOverlay = () => {
        return [
          <Popover.Item
            disabled={categoryId === 'bktzgg'}
            key="bktzgg"
            value="bktzgg"
          >
            通知公告
          </Popover.Item>,
          <Popover.Item
            disabled={categoryId === 'yxtz'}
            key="yxtz"
            value="yxtz"
          >
            学院通知
          </Popover.Item>
        ];
      },

      renderTabs = () => {
        return [
          {
            title:
              <div className={styles.tab}>
                <span>{categoryId === 'bktzgg' ? '通知公告' : '学院通知'}</span>
                <Popover
                  overlayClassName="fortest"
                  overlayStyle={{ color: 'currentColor' }}
                  visible={this.state.visible}
                  overlay={renderOverlay()}
                  align={{
                    overflow: { adjustY: 0, adjustX: 0 },
                    offset: [10, 10]
                  }}
                  onSelect={this.onSelect}
                >
                  <Icon type={getLocalIcon('/sprite/down.svg')} color="#ddd" />
                </Popover>
              </div>
          },
          { title: <div>规章制度</div> }
        ];
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

export default System;
