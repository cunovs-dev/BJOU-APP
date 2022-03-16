/* WKC
2018.10.11 17:52 */
/**
 * @author Lowkey
 * @date 2019/2/18
 * @Description: 教师端路由 ， 第三个Tab 课程管理
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, WhiteSpace, Badge, Icon, Toast, Popover, Grid } from 'components';
import TitleBox from 'components/titlecontainer';
import LessonItem from 'components/lessonitem';
import Introduction from 'components/introduction';
import CourseList from 'components/courselist';
import InnerHtml from 'components/innerhtml';
import ReactDOM from 'react-dom';
import Refresh from 'components/pulltorefresh';
import { getOffsetTopByBody, getLocalIcon, getImages, cookie } from 'utils';
import { masterGrids } from 'utils/defaults';
import Notice from 'components/noticebar';
import { handlerChangeRouteClick, handlerDivInnerHTMLClick } from 'utils/commonevents';
import Photoheader from 'components/photoheader';
import PhotoBox from 'components/photobox';
import NoContent from 'components/nocontent';
import styles from './index.less';

const { _cg, _cs } = cookie;
const PrefixCls = 'lessondetails';
const tabs = [
  { title: <Badge>课程导学</Badge> },
  { title: <Badge>课程学习</Badge> },
  { title: <Badge>课程管理</Badge> }
];

const isMaster = (master, userId) => {
  return master && master.find(item => item.id === userId);
};

@connect(({ lessondetails, loading, app }) => ({ // babel装饰器语法糖
  lessondetails,
  loadingData: loading.effects['lessondetails/queryDetails'],
  loadingCheck: loading.effects['lessondetails/updateDetails'],
  app
}))

class LessonDetails extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      pullHeight: cnhtmlHeight,
      startTime: 0
    };
  }

  componentWillMount () {
    document.documentElement.scrollTop = 0;
  }

  componentDidMount () {
    this.timer = setTimeout(() => {
      const hei = this.state.pullHeight - getOffsetTopByBody(ReactDOM.findDOMNode(this.ptr));
      this.setState(() => ({
        pullHeight: hei
      }));
    }, 300);
    const { courseid = '', cmid = '', type = 'mod', modname } = this.props.location.query;
    this.setState(() => ({
      startTime: new Date()
    }));
    this.props.dispatch({
      type: 'app/logApi',
      payload: {
        assesstime: new Date().getTime(),
        courseid,
        cmid: '',
        type: 'course',
        modname: ''
      }
    });
    this.props.dispatch({
      type: 'lessondetails/queryAppealCount',
      payload: {
        courseId: courseid
      }
    });
  }

  componentWillUnmount () {
    clearTimeout(this.timer);
  }

  renderItem = (el) => {
    const { appealCount = 0 } = this.props.lessondetails;
    const { icon = '', text = '', badge = false } = el;
    return (
      badge ?
      <div className={styles.items}>
        <Badge text={appealCount} overflowCount={99}>
          <img className={styles.img} src={icon} alt="" />
        </Badge>
        <div className={styles.text}>{text}</div>
      </div>
            :
      <div className={styles.items}>
        <img className={styles.img} src={icon} alt="" />
        <div className={styles.text}>{text}</div>
      </div>
    );
  };

  gridClick = ({ path, text }) => {
    const { courseid = '' } = this.props.location.query;
    handlerChangeRouteClick(path, {
      name: text,
      courseid
    }, this.props.dispatch);
  };

  onSelect = ({ key }) => {
    if (key === '1') {
      const { courseid = '' } = this.props.location.query;
      handlerChangeRouteClick('opinion', {
        name: '课程反馈', courseId: courseid
      }, this.props.dispatch);
    }
  };

  render () {
    const { courseid = '' } = this.props.location.query,
      { data: { summary = '', section0Summary = '', summaryformat = 0, master, tutor, courseImage, guide, resources, id = '', attendanceRule = '', attendance = {}, format = 'weeks', enddate, startdate, fullname, isAttendance, _useScriptFlag = false, _useScriptFunc = false, openState = '0' }, refreshing, scrollerTop, selected, activityIndex, accordionIndex } = this.props.lessondetails,
      { weekStat = 0, config = {}, stat = 0 } = attendance,
      { day_pass = '0' } = config,
      { users: { userid }, _useJavaScriptMessage } = this.props.app,
      dispatch = this.props.dispatch,
      props = {
        courseid,
        dispatch,
        loadingCheck: this.props.loadingCheck
      };
    const handlerChange = (key) => {
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            accordionIndex: key
          }
        });
        if (key.length > 0) {
          _cs(`defaultActive${courseid}`, key.slice(-1));
        }
      },
      onRefresh = () => {
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            refreshing: true
          }
        });
        this.props.dispatch({
          type: `${PrefixCls}/refreshLessonDetails`,
          payload: {
            userid,
            courseid
          }
        });
      },
      onScrollerTop = (top) => {
        if (typeof top !== 'undefined' && !isNaN(top * 1)) {
          this.props.dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              scrollerTop: top
            }
          });
        }
      },
      handDivClick = (e) => {
        e.stopPropagation();
        handlerDivInnerHTMLClick(e, courseid || id, dispatch);
      };
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <Photoheader
          dispatch={this.props.dispatch}
          children={
            isMaster(master, userid) ?
            null
                                     :
            <Popover
              mask
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={this.state.visible}
              overlay={[
                (<Popover.Item key="1">课程反馈</Popover.Item>)
              ]}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [-10, 0]
              }}
              onSelect={this.onSelect}
            >
              <div style={{
                height: '100%',
                padding: '0 15px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center'
              }}
              >
                <Icon type="ellipsis" color="#fff" />
              </div>
            </Popover>
          }
        />
        <PhotoBox
          handlerChartClick={handlerChangeRouteClick}
          bg={getImages(courseImage)}
          master={master}
          tutor={tutor}
          dispatch={this.props.dispatch}
          weekStat={weekStat}
          stat={stat}
          daypass={day_pass}
          attendanceClick={handlerChangeRouteClick.bind(null, 'attendancedetails', {
            name: '考勤详情',
            courseid,
            enddate,
            startdate,
            fullname
          }, this.props.dispatch)}
          isTeacher={!!isMaster(master, userid)}
          hasAttendance={isAttendance}
          openState={openState}
        />
        {
          _useScriptFlag || _useScriptFunc
          ?
          <Notice content={_useJavaScriptMessage.info} />
          :
          null
        }
        <div className={styles[`${PrefixCls}-tagbox`]}>
          <Tabs
            tabs={isMaster(master, userid) ? tabs : tabs.slice(0, tabs.length - 1)}
            tabBarActiveTextColor="#22609c"
            tabBarInactiveTextColor="#b7b7b7"
            tabBarUnderlineStyle={{ border: '1px solid #22609c' }}
            page={selected}
            swipeable={false}
            destroyInactiveTab
            prerenderingSiblingsNumber={0}
            onChange={(tab, index) => {
              this.props.dispatch({
                type: `${PrefixCls}/updateState`,
                payload: {
                  selected: index
                }
              });
            }}
          >
            <div className={styles[`${PrefixCls}-tagbox-item`]}>
              <Refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
                onScrollerTop={onScrollerTop.bind(null)}
                scrollerTop={scrollerTop}
              >
                {this.props.loadingData && !refreshing ?
                 <NoContent isLoading={this.props.loadingData} />
                                                       :
                 <div className={styles[`${PrefixCls}-lessonInfo`]}>
                   <WhiteSpace size="xs" />
                   <div className={styles[`${PrefixCls}-lessonInfo-title`]}>{fullname}</div>
                   {
                     summaryformat && summary !== '' ?
                     <div>
                       <TitleBox title="课程简介" sup="" />
                       <Introduction data={summary} dispatch={this.props.dispatch} courseid={courseid} />
                     </div>
                                                     :
                     null
                   }
                   <WhiteSpace size="xs" />
                   {summaryformat && section0Summary !== '' ?
                    <InnerHtml data={section0Summary} handleClick={handDivClick} /> : null}
                   {
                     attendanceRule !== '' ?
                     <div>
                       <TitleBox title="考勤要求" sup="" />
                       <InnerHtml data={attendanceRule} />
                     </div>
                                           :
                     null
                   }
                   <div>
                     {cnIsArray(guide) && guide.map((data, i) => {
                       return <LessonItem key={data.id} data={data} {...props} />;
                     })}
                   </div>
                 </div>}
              </Refresh>
            </div>
            <div>
              <Refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
                onScrollerTop={onScrollerTop.bind(null)}
                scrollerTop={scrollerTop}
              >
                {this.props.loadingData && !refreshing ?
                 <NoContent isLoading={this.props.loadingData} />
                                                       : <div>
                   <CourseList
                     data={resources}
                     format={format}
                     activityIndex={activityIndex}
                     accordionIndex={_cg(`defaultActive${courseid}`) || accordionIndex}
                     {...props}
                     handlerChange={handlerChange}
                   />
                 </div>}
              </Refresh>
            </div>
            <div>
              <Grid
                data={masterGrids}
                hasLine={false}
                columnNum={3}
                renderItem={this.renderItem}
                onClick={this.gridClick}
              />
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default LessonDetails;
