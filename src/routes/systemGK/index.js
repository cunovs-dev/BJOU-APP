/**
 * @author Lowkey
 * @date 2020/03/20 09:57:25
 * @Description: 国开通知制度
 */

import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout } from 'components';
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
    this.state = {};
  }

  render () {
    const { [PrefixCls]: { list, paginations, scrollerTop }, loading, dispatch } = this.props,

      onRefresh = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            isRefresh: true,
            categoryId: 'gktzgg'
          },
          callback
        });
      },
      onEndReached = (callback) => {
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            categoryId: 'gktzgg'
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
      };

    return (
      <div>
        <Header isPure />
        <div className={styles.outer}>
          <div className={styles.listTitle}>
            <div>
              通知公告
            </div>
            <div className={styles.bottom} />
          </div>
          {list.length > 0 ? getContents(list) : <NoContent isLoading={loading} />}
        </div>
      </div>
    );
  }
}

export default SystemGK;
