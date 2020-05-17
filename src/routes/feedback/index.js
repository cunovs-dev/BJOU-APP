import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Nav from 'components/nav';
import {
  List,
  Button,
  Toast,
  WhiteSpace,
  Tabs,
  NoticeBar
} from 'components';
import { handlerChangeRouteClick } from 'utils/commonevents';
import Introduction from 'components/introduction';
import StatusBox from 'components/statusBox';
import Charts from 'components/Chart';
import { ContentSkeleton } from 'components/skeleton';
import TitleBox from 'components/titlecontainer';
import styles from './index.less';


const PrefixCls = 'feedback';

class FeedBack extends Component {
  constructor (props) {
    super(props);
    this.state = {
      startTime: 0
    };
  }

  componentDidMount () {
    const { courseid = '', cmid = '', type = 'mod', modname } = this.props.location.query;
    this.setState(() => ({
      startTime: new Date()
    }));
    this.props.dispatch({
      type: 'app/logApi',
      payload: {
        assesstime: new Date().getTime(),
        courseid,
        cmid,
        type,
        modname
      }
    });
  }

  //
  // componentWillUnmount () {
  //   const { courseid = '', cmid = '' } = this.props.location.query;
  //   this.props.dispatch({
  //     type: 'app/accessTime',
  //     payload: {
  //       startedat: this.state.startTime.getTime(),
  //       endedat: new Date().getTime(),
  //       courseid,
  //       cmid,
  //
  //     }
  //   });
  // }

  render () {
    const { name, courseid } = this.props.location.query,
      { data: { intro, completedcount, canviewanalysis, itemscount, itemsdata, anonymous, cansubmit, isopen, coursemodule, name: feedName = '', completionsubmit, id, isalreadysubmitted, axisDataKey = '数量' }, selectIndex = 0 } = this.props.feedback,
      { loadingFeedback = false } = this.props;
    return (
      <div >
        <Nav
          title={name || feedName}
          dispatch={this.props.dispatch}
          hasShadow
          renderNavRight={
            <span
              style={{ color: '#fff' }}
              onClick={handlerChangeRouteClick.bind(this, 'opinion', {
                name: '课程反馈', courseId: courseid, resourcesName: feedName || name, cmid
              }, this.props.dispatch)}
            >
              课程反馈
            </span >
          }
        />
        {
          loadingFeedback ?
            <ContentSkeleton />
            :
            <div className={styles[`${PrefixCls}-outer`]} >
              {intro !== '' ? <Introduction data={intro} courseid={courseid} dispatch={this.props.dispatch} /> : ''}
              {canviewanalysis ?
                <Tabs
                  tabs={[
                    { title: '概述' },
                    { title: '分析' },
                  ]}
                  tabBarActiveTextColor="#22609c"
                  tabBarInactiveTextColor="#b7b7b7"
                  tabBarUnderlineStyle={{ border: '1px solid #22609c' }}
                  // initialPage={activityIndex > 0 ? 1 : 0}
                  swipeable={false}
                  page={selectIndex}
                  onChange={(tab, index) => {
                    this.props.dispatch({
                      type: `${PrefixCls}/updateState`,
                      payload: {
                        selectIndex: index,
                      },
                    });
                  }}
                >
                  <div >
                    <List >
                      <List.Item
                        extra={completedcount}
                        arrow="horizontal"
                        onClick={completedcount > 0 ? handlerChangeRouteClick.bind(null, 'feedbackresult', {
                          id,
                          cmid: coursemodule,
                          anonymous,
                        }, this.props.dispatch) : null}
                      >
                        已提交的答案
                      </List.Item >
                      <List.Item extra={itemscount} >题目</List.Item >
                    </List >
                    <div className={styles[`${PrefixCls}-type`]} >
                      <TitleBox title="模式" sup="" />
                      <p >{anonymous === 1 ? '匿名方式' : '实名方式'}</p >
                    </div >
                    <div className={styles[`${PrefixCls}-outer-button`]} >
                      {
                        cansubmit ?
                          <Button
                            type="primary"
                            onClick={handlerChangeRouteClick.bind(null, 'feedbackdetails', {
                              id,
                              anonymous
                            }, this.props.dispatch)}
                          >回答问题</Button >
                          :
                          null
                      }
                      {
                        isalreadysubmitted ?
                          <StatusBox status="complete" />
                          :
                          null
                      }
                    </div >
                  </div >
                  <div >
                    <List >
                      <List.Item extra={completedcount} >已提交的答案</List.Item >
                      <List.Item extra={itemscount} >题目</List.Item >
                    </List >
                    <div className={styles[`${PrefixCls}-chart`]} >
                      {itemsdata && itemsdata.map(
                        item =>
                          <Charts
                            axisDataKey={axisDataKey}
                            data={item.data}
                            name={item.item.name || ''}
                          />
                      )}
                    </div >
                  </div >
                </Tabs >
                :
                <div >
                  <div className={styles[`${PrefixCls}-type`]} >
                    <TitleBox title="模式" sup="" />
                    <p >{anonymous === 1 ? '匿名方式' : '实名方式'}</p >
                  </div >
                  <div className={styles[`${PrefixCls}-outer-button`]} >
                    {
                      cansubmit && isopen ?
                        <Button
                          type="primary"
                          onClick={handlerChangeRouteClick.bind(null, 'feedbackdetails', {
                            id,
                            anonymous
                          }, this.props.dispatch)}
                        >回答问题</Button >
                        :
                        null
                    }
                    {
                      isopen ?
                        null
                        :
                        <StatusBox status="notopen" content="此反馈未开放" color="#ecb926" />
                    }
                    {
                      isalreadysubmitted ?
                        <StatusBox status="complete" />
                        :
                        null
                    }
                  </div >
                </div >
              }
            </div >
        }
      </div >
    );
  }
}

export default connect(({ loading, feedback }) => ({
  loadingFeedback: loading.effects[`${PrefixCls}/queryFeedback`],
  feedback,
}))(FeedBack);
