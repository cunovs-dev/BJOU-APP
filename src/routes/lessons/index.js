import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, List, Layout, SegmentedControl, WingBlank } from 'components';
import { getLocalIcon } from 'utils';
import Refresh from 'components/pulltorefresh';
import Nav from 'components/nav';
import { openingLessonRow, closeLessonRow } from 'components/row';
import { handlerLessonListClick, handlerChangeRouteClick } from 'utils/commonevents';
import NoContent from 'components/nocontent';
import { ListSkeleton } from 'components/skeleton';
import styles from './index.less';

const PrefixCls = 'lessons';

@connect(({ lessons, loading }) => ({
  lessons,
  loading: loading.effects['lessons/queryList']
}))

class Lessons extends React.Component {
  constructor (props) {
    super(props);
  }

  handlerChange = (e) => {
    this.props.dispatch({
      type: `${PrefixCls}/queryList`,
      payload: {
        queryType: e.nativeEvent.selectedSegmentIndex
      }
    });
    this.props.dispatch({
      type: 'lessons/updateState',
      payload: {
        selectedIndex: e.nativeEvent.selectedSegmentIndex,
      }
    });
  };

  render () {
    const { name = '课程' } = this.props.location.query,
      { [PrefixCls]: { list, refreshing, scrollerTop, selectedIndex }, loading, dispatch } = this.props,
      onRefresh = () => {
        dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            refreshing: true
          }
        });
        dispatch({
          type: `${PrefixCls}/queryList`,
          payload: {
            queryType: selectedIndex
          }
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
      };
    return (
      <div>
        <Nav title={name} isGoBack={false} navFixed={false} />
        <WhiteSpace />
        <div className={styles[`${PrefixCls}-outer`]}>
          <WingBlank size="lg" className="sc-example">
            <SegmentedControl
              values={['在开课程', '已开课程']}
              onChange={(e) => this.handlerChange(e)}
              selectedIndex={selectedIndex}
            />
          </WingBlank>
          <WhiteSpace />
          {
            loading && !refreshing ?
            <ListSkeleton />
                                   :
            list && list.length > 0 ?
            <Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
              onScrollerTop={(top) => onScrollerTop(top)}
              scrollerTop={scrollerTop}
            >
              {cnIsArray(list) && list.map((item) => {
                if (selectedIndex === 1) {
                  return closeLessonRow(item, handlerLessonListClick, dispatch);
                }
                return openingLessonRow(item, handlerLessonListClick, (e) => {
                  e.stopPropagation();
                  handlerChangeRouteClick('achievementdetails', {
                    name: item.name,
                    courseid: item.id,
                    grade: item.graderaw
                  }, dispatch, e);
                }, dispatch);
              })}
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
            </Refresh>
                                    :
            <NoContent />
          }
        </div>
      </div>
    );
  }
}

export default Lessons;
