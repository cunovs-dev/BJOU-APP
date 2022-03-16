/**
 * @author Lowkey
 * @date 2019/02/28 11:58:51
 * @Description: 修改 wkc
 */
import React, { PureComponent } from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon, List, Button, NoticeBar, WingBlank, WhiteSpace, Modal } from 'components';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { getImages, getErrorImg, getLocalIcon } from 'utils';
import { ContentSkeleton } from 'components/skeleton';
import Introduction from 'components/introduction';
import StatusBox from 'components/statusBox';
import Status from './components/status';
import GradeBox from './components/gradebox';
import styles from './index.less';

const PrefixCls = 'quiz';
const alert = Modal.alert;

@connect(({ quiz, loading, app }) => ({ // babel装饰器语法糖
  quiz,
  app,
  loading: loading.effects[`${PrefixCls}/queryQuiz`]
}))
class Quiz extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      startTime: 0,
      visible: true
    };
  }

  componentDidMount () {
    const { courseid, quizid, cmid, type = 'mod', modname } = this.props.location.query;
    this.props.dispatch({
      type: 'quiz/queryQuiz',
      payload: {
        courseid,
        quizid,
        cmid
      }
    });

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

  getMethod = (type) => {
    switch (type) {
      case 1:
        return '最高分';
      case 2:
        return '平均分';
      case 3:
        return '第一次答题';
      case 4:
        return '最后一次答题';
      default:
        return '-';
    }
  };

  showModal = () => {
    const { name } = this.props.location.query,
      { data: { id, navmethod = '', options = {}, timelimit = 0 }, info = {} } = this.props.quiz;
    const { dispatch } = this.props;
    const { accessrules = [] } = options;
    alert('限时测验', '您一旦开始做答，系统将自动计时。您需在计时结束前提交答案，或者计时结束时系统将自动提交答案。您确定现在开始做答吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '开始',
        onPress: (e) => handlerChangeRouteClick('quizDetails',
          {
            quizid: id,
            name,
            ...info,
            timelimit,
            navmethod
          },
          dispatch, e)
      }
    ]);
  };

  showAlert = (text) => {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        footer={[{ text: '我知道了', onPress: () => this.setState({ visible: false }) }]}
      >
        {text}
      </Modal>
    );
  };

  render () {
    const { name, cmid } = this.props.location.query,
      { data: { id, intro, options = {}, supportedMsg, buttontext, hasquestions, visiblebutton, attempts = [], feedbacktext, hasfeedback, finalgrade, grademethod, maxgrade, isfinished, preventnewattemptreasons = [], courseid, name: quizName = '', navmethod = '', timelimit = 0, sumgrades, decimalpoints, _useScriptFunc = false }, info = {} } = this.props.quiz,
      { preventaccessreasons = [] } = options,
      { loading, dispatch } = this.props;
    const { _useJavaScriptMessage } = this.props.app;
    const method = this.getMethod(grademethod);
    const gradePros = {
      isfinished,
      maxgrade,
      finalgrade,
      method,
      hasfeedback,
      feedbacktext,
      decimalpoints,
      dispatch: this.props.dispatch
    };
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <Nav
          title={name || quizName}
          dispatch={dispatch}
          renderNavRight={
            <span
              style={{ color: '#fff' }}
              onClick={handlerChangeRouteClick.bind(this, 'opinion', {
                name: '课程反馈', courseId: courseid, resourcesName: quizName || name, cmid
              }, dispatch)}
            >
              课程反馈
            </span>
          }
        />
        {loading ? <ContentSkeleton /> : <div>
          {hasquestions === 0 ?
           <NoticeBar
             marqueeProps={{ loop: true }}
             mode="closable"
             icon={null}
           >
             尚未添加试题
           </NoticeBar> : ''}
          {intro !== '' ?
           <div className={styles[`${PrefixCls}-describe`]}>
             <Introduction data={intro} courseid={courseid} dispatch={this.props.dispatch} />
           </div>
                        : ''}
          <div className={styles[`${PrefixCls}-info`]}>
            {cnIsArray(options.accessrules) && options.accessrules.map((item, i) => {
              return <div key={i}>{item}</div>;
            })}
          </div>
          <div className={styles[`${PrefixCls}-method`]}>
            <span>评分方法</span>
            <span>{this.getMethod(grademethod)}</span>
          </div>
          {
            cnIsArray(attempts) && attempts.length > 0
            ?
            <Status
              data={attempts}
              decimalpoints={decimalpoints}
              maxgrade={maxgrade}
              sumgrades={sumgrades}
              dispatch={dispatch}
            />
            :
            ''
          }
          {finalgrade >= 0 ? <GradeBox {...gradePros} /> : null}
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <WingBlank>
            {visiblebutton && !supportedMsg ?
             <Button
               type="primary"
               onClick={timelimit > 0 ? this.showModal : handlerChangeRouteClick
                 .bind(null, 'quizDetails',
                   {
                     quizid: id,
                     name,
                     ...info,
                     navmethod,
                     timelimit
                   },
                   dispatch)}
             >{buttontext}</Button> : ''}
          </WingBlank>
          {!visiblebutton && preventnewattemptreasons.length > 0 ?
            /* <NoticeBar
               marqueeProps={{ loop: true }}
               mode="closable"
               icon={null}
             >
               {preventnewattemptreasons[0]}
             </NoticeBar > */
           <StatusBox status={'unuseful'} content={preventnewattemptreasons[0]} color="#d24747" />
                                                                 :
           ''
          }
          {preventaccessreasons.length > 0 ?
           <StatusBox status={'unuseful'} content={preventaccessreasons[0]} color="#d24747" />
                                           :
           ''}
          {
            supportedMsg ?
            <StatusBox status={'unuseful'} content={supportedMsg} color="#d24747" />
                         :
            ''
          }
        </div>}
        {
          _useJavaScriptMessage && _useScriptFunc && this.showAlert(_useJavaScriptMessage.warn)
        }
      </div>
    );
  }
}

export default Quiz;
