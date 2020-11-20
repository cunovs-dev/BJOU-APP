/**
 * @author Lowkey
 * @date 2020/03/20 09:57:25
 * @Description: 国开通知制度
 */

import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, SearchBar, Toast, List, Layout } from 'components';
import { getLocalIcon } from 'utils';
import { systemRow } from 'components/row';
import Nav from 'components/nav';
import { handlerPortalNoticeClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import ListView from 'components/listview';
import styles from '../../themes/default.less';

const PrefixCls = 'schoolCalendarList';

@connect(({ schoolCalendarList, loading }) => ({
  schoolCalendarList,
  loading: loading.effects['schoolCalendarList/queryList']
}))

class SchoolCalendarList extends React.Component {
  constructor (props) {
    super(props);
  }

  onSearch = (val) => {
    const { queryType = '' } = this.props.location.query;
    if (val !== '') {
      this.props.dispatch({
        type: `${PrefixCls}/queryList`,
        payload: {
          isRefresh: true,
          categoryId: queryType,
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
    const { queryType = '' } = this.props.location.query;
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        isRefresh: true,
        categoryId: queryType
      }
    });
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        searchVal: ''
      }
    });
  };

  handlerChange = (value) => {
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        searchVal: value
      }
    });
  };

  render () {
    const { [PrefixCls]: { list, paginations, scrollerTop, searchVal }, loading, dispatch } = this.props,
      { queryType = '', name = '' } = this.props.location.query,
      onRefresh = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            categoryId: queryType,
            title: searchVal !== '' ? searchVal : null
          },
          callback
        });
      },
      onEndReached = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            categoryId: queryType,
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
      <div className={styles.whiteBox}>
        <Nav title={name} dispatch={dispatch} />
        <SearchBar
          placeholder="标题名称"
          onSubmit={this.onSearch}
          onCancel={this.onCancel}
          onChange={this.handlerChange}
          value={searchVal}
        />
        {list.length > 0 && !loading ? getContents(list) : <NoContent isLoading={loading} />}
      </div>
    );
  }
}

export default SchoolCalendarList;
