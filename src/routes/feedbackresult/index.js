import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Picker } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import Refresh from 'components/pulltorefresh';
import TitleBox from 'components/titlecontainer';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const Item = List.Item;
const PrefixCls = 'feedbackresult';
const getGroups = (groups) => {
  const arr = [{ label: '所有成员', value: 0 }];
  cnIsArray(groups) && groups
    .map((data, i) => {
      arr.push({
        label: data.name,
        value: data.id
      });
    });
  return arr;
};

function FeedBackResult ({ location, dispatch, feedbackresult }) {
  const { name = '答复', anonymous = 1, cmid = '', id = '' } = location.query,
    { data, refreshing, scrollerTop, defaultGroup } = feedbackresult;
  const { anonattempts = [], groups = [], attempts = [] } = data;
  const onRefresh = () => {

    },
    onScrollerTop = (top) => {
      if (typeof top !== 'undefined' && !isNaN(top * 1)) {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            scrollerTop: top,
          },
        });
      }
    },
    handlerChangeGroup = (value) => {
      dispatch({
        type: 'feedbackresult/updateState',
        payload: {
          defaultGroup: value
        }
      });
      dispatch({
        type: 'feedbackresult/query',
        payload: {
          groupid: value.join(),
          cmid,
          id,
        }
      });
    };
  return (
    <div className={styles[`${PrefixCls}-outer`]} >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <WhiteSpace />
      {
        anonymous == 1 && groups.length > 0 ?
          <Picker data={getGroups(groups)} cols={1} value={defaultGroup} onChange={handlerChangeGroup} >
            <List.Item arrow="horizontal" >小组：</List.Item >
          </Picker >
          :
          null
      }
      <div >
        <TitleBox title={anonymous === '1' ? '匿名条目' : '非匿名条目'} sup="" />
        <Refresh
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScrollerTop={onScrollerTop.bind(null)}
          scrollerTop={scrollerTop}
        >
          {
            anonymous === '1' ?
              cnIsArray(anonattempts) && anonattempts.map((item) => {
                return (
                  <List className="my-list" >
                    <Item
                      arrow="horizontal"
                      onClick={handlerChangeRouteClick.bind(null, 'feedbackresultdetails',
                        { id: item.id, name: `答案编号${item.number}`, anonymous }, dispatch)}
                    >
                      {`答复编号${item.number}`}
                    </Item >
                  </List >

                );
              })
              :
              cnIsArray(attempts) && attempts.map((item) => {
                return (
                  <List className="my-list" >
                    <Item
                      arrow="horizontal"
                      onClick={handlerChangeRouteClick.bind(null, 'feedbackresultdetails',
                        { id: item.id, name: item.fullname, anonymous }, dispatch)}
                    >
                      {item.fullname}
                    </Item >
                  </List >

                );
              })
          }
        </Refresh >
      </div >
    </div >
  );
}

export default connect(({ loading, feedbackresult }) => ({
  loading,
  feedbackresult,
}))(FeedBackResult);
