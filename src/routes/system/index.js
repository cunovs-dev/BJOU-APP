/**
 * @author Lowkey
 * @date 2020/03/17 15:02:54
 * @Description: 统治制度
 */

import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout, SegmentedControl, WingBlank, Tabs, Popover } from 'components';
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
  loading: loading.effects['system/queryList']
}))

class System extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      noticeType: props.system.categoryId,
      visible: false
    };
  }

  onSelect = (opt) => {
    this.setState({
      noticeType: opt.props.value,
      visible: false
    });
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        categoryId: opt.props.value,
        isRefresh: true
      }
    });
  };

  handlerChange = (tab, index) => {
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        categoryId: index === 1 ? 'gzzd' : this.state.noticeType,
        isRefresh: true
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        selectIndex: index,
        list: [],
        scrollerTop: 0
      }
    });
  };

  render () {
    const { [PrefixCls]: { list, paginations, scrollerTop, selectIndex }, loading, dispatch } = this.props,
      { noticeType } = this.state,
      onRefresh = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            categoryId: selectIndex === 1 ? 'gzzd' : noticeType
          },
          callback
        });
      },
      onEndReached = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            categoryId: selectIndex === 1 ? 'gzzd' : noticeType
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
        const result = [];
        result.push(
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

        return result;
      },
      renderOverlay = () => {

        return [
          <Popover.Item disabled={noticeType === 'bktzgg'} key="bktzgg" value="bktzgg">通知公告</Popover.Item>,
          <Popover.Item disabled={noticeType === 'xytz'}
                        key="xytz"
                        value="xytz"
          >学院通知</Popover.Item>
        ];
      },

      renderTabs = () => {
        return [
          {
            title:
              <div className={styles.tab}>
                <span>{this.state.noticeType === 'bktzgg' ? '通知公告' : '学院通知'}</span>
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
            tabs={renderTabs()}
            initialPage={0}
            page={selectIndex}
            onChange={this.handlerChange}
          />
          {list.length > 0 ? getContents(list) : <NoContent isLoading={loading} />}
        </div>
      </div>
    );
  }
}

export default System;
