/**
 * @author Lowkey
 * @date 2019/02/28 11:58:51
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, Button, NoticeBar, WingBlank, WhiteSpace, Modal, Toast } from 'components';
import { handlerChangeRouteClick } from 'utils/commonevents';
import CountDown from 'components/countdown';
import TitleBox from 'components/titlecontainer';
import Nocontent from 'components/nocontent';
import styles from './index.less';


const alert = Modal.alert;
const PrefixCls = 'quizComplete';

@connect(({ quizComplete, loading, quizDetails }) => ({ // babel装饰器语法糖
  quizComplete,
  loadingPage: loading.effects[`${PrefixCls}/querySummary`],
  sending: loading.effects[`quizDetails/sendQuiz`],
  quizDetails
}))
class QuizComplete extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }


  componentDidMount () {

  }


  onSubmit = () => {
    const { attemptid = '' } = this.props.location.query;
    this.props.dispatch({
      type: 'quizDetails/sendQuiz',
      payload: {
        attemptid,
        timeup: 0,
        finishattempt: 1
      }
    });
  };

  warningClick = () => {
    Toast.fail('只能按顺序答题');
  };

  showModal = () => {
    alert('提交', '测验一旦提交，答案将不可更改，请确认是否要提交。', [
      { text: '取消', onPress: () => console.log() },
      { text: '提交', onPress: () => this.onSubmit() },
    ]);
  };

  render () {
    const { name = '完成', attemptid = '', quizid = '', timelimit } = this.props.location.query,
      { questions } = this.props.quizComplete,
      { loadingPage = false } = this.props;
    const { page = 0, navmethod = '', data: { options = {} } } = this.props.quizDetails;
    const { endtime } = options;
    return (
      <div >
        <Nav title={name} dispatch={this.props.dispatch} />
        {
          loadingPage ?
            <Nocontent isLoading={loadingPage} />
            :
            <div >
              <div >
                <TitleBox title="答题情况报告" sup="" />
                <List >
                  {
                    cnIsArray(questions) && questions.map(item =>
                      (<List.Item
                        key={item.slot}
                        extra={item.status}
                        arrow={navmethod !== 'sequential' ? 'horizontal' : null}
                        onClick={
                          navmethod !== 'sequential' ? handlerChangeRouteClick.bind(null, 'quizDetails', {
                              quizid,
                              attemptid,
                              page: item.page,
                              state: 'inprogress',
                              name,
                              navmethod,
                              timelimit
                            }, this.props.dispatch)
                            :
                            null
                        }
                      >
                        {item.type !== 'description' ? `题目${item.number}` : '信息'}
                      </List.Item >)
                    )
                  }
                </List >
              </div >
              <WhiteSpace size="lg" />
              <WingBlank >
                <Button onClick={handlerChangeRouteClick.bind(null, 'quizDetails', {
                  quizid,
                  attemptid,
                  page,
                  state: 'inprogress',
                  name,
                  navmethod,
                  timelimit
                }, this.props.dispatch)}
                >返回试题</Button >
                <WhiteSpace />
                {endtime > 0 && timelimit > 0 ? <CountDown endTime={endtime && endtime} handler={this.onSubmit} /> : null}
                <Button loading={this.props.sending} type="primary" onClick={this.showModal} >提交所有答案并结束</Button >
              </WingBlank >
              <WhiteSpace size="lg" />
            </div >
        }
      </div >
    );
  }
}


export default QuizComplete;
