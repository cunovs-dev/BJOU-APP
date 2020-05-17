/**
 * @author Lowkey
 * @date 2019/02/28 11:58:51
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon, List, Button, NoticeBar, WingBlank, WhiteSpace, Card } from 'components';
import { getImages, getErrorImg, getLocalIcon, getCommonDate, getDurationTime } from 'utils';
import InnerHtml from 'components/innerhtml';
import Examination from './components/examination';
import styles from './index.less';


const PrefixCls = 'quizReview';

@connect(({ quizReview, loading, quiz }) => ({ // babel装饰器语法糖
  quizReview,
  quiz,
  loading
}))
class QuizReview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }


  componentDidMount () {

  }

  getState = (state) => {
    if (state === 'finished') {
      return '完成';
    }
    return '-';
  };

  getGrade = (num) => {
    const { data = {}, } = this.props.quiz, { decimalpoints = 1 } = data;
    const multiplier = Math.pow(10, decimalpoints);
    return Math.round(num * multiplier) / multiplier;
  };

  render () {
    const { name = '回顾' } = this.props.location.query,
      { data: { grade, attempt = [], additionaldata = [] }, questions } = this.props.quizReview,
      { timestart = 0, state = '', timefinish = 0 } = attempt
    const props = {
      questions
    };
    return (
      <div >
        <Nav title={name} dispatch={this.props.dispatch} />
        <div className={styles.feedBack} >
          <List className="my-list" >
            <List.Item extra={timestart ? getCommonDate(timestart) : '-'} >开始时间</List.Item >
            <List.Item extra={this.getState(state)} >状态</List.Item >
            <List.Item extra={getCommonDate(timefinish)} >完成于</List.Item >
            <List.Item extra={getDurationTime(timestart, timefinish)} >耗时</List.Item >
            <List.Item extra={this.getGrade(grade) || '还未评分'} >成绩</List.Item >
          </List >
          <WhiteSpace size="xs"/>
          {
            additionaldata.length > 0 ?
              <Card >
                <Card.Header
                  title={additionaldata[0].title || '反馈'}
                />
                <Card.Body >
                  <InnerHtml data={additionaldata[0].content} />
                </Card.Body >
              </Card >
              :
              null
          }
        </div >
        <WhiteSpace />
        <div className={styles.outer} >
          <Examination {...props} />
        </div >
      </div >
    );
  }
}


export default QuizReview;
