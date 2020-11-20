import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { routerRedux } from 'dva/router';
import { Loader, Card, List, Radio, Checkbox, Button, WhiteSpace, WingBlank, Modal } from 'components';
import CountDown from 'components/countdown';
import Choose from 'components/quizType/choose';
import { FormRadio, FormCheckBox } from 'components/formtags';
import Essay from 'components/quizType/essay';
import Match from 'components/quizType/match';
import Multianswer from 'components/quizType/multianswer';
import ShortAnswer from 'components/quizType/shortanswer';
import Gapselect from 'components/quizType/gapselect';
import styles from './index.less';

const alert = Modal.alert;

@connect(({ quizDetails, loading, app }) => ({ // babel装饰器语法糖
  quizDetails,
  app,
  loading: loading.effects['quizDetails/queryLastTimeExamination'],
}))

@createForm()
class Examination extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {
    this.props.onRef(this);
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
  }

  checkSubmitData = (src) => {
    let target = {},
      attributes = [];
    if (src && (attributes = Object.keys(src)).length) {
      attributes.map(attribute => {
        const value = src[attribute];
        if (value !== '') {
          if (cnIsArray(value)) {
            target[attribute] = value[0];
          } else if (Object.prototype.toString.call(value) === '[object Object]') {
            target = { ...target, ...src[attribute] };
          } else {
            target[attribute] = value;
          }
        }
      });
    }
    return target;
  };

  onSubmit = (type) => {
    const { answer } = this.props.quizDetails;
    this.props.form.validateFields({
      force: true,
    }, (error, values) => {
      if (!error) {
        let data = this.getSubmitVal({
          ...this.checkSubmitData(values), ...this.getPageItemsResponses(answer)
        });
        //console.log('Examination:75', data, answer);
        this.props.hanlerSubmit(data, type);
      } else {
        Toast.fail('请检查表单');
      }
    });
  };

  onBackSubmit = () => {
    const { answer } = this.props.quizDetails;
    this.props.form.validateFields({
      force: true,
    }, (error, values) => {
      if (!error) {
        let data = this.getSubmitVal({
          ...this.checkSubmitData(values), ...this.getPageItemsResponses(answer)
        });
        //.log('Examination:92', data);
        this.props.hanlerSubmit(data);
        this.props.dispatch({
          type: 'app/updateBackModal',
          payload: {
            showBackModal: false
          }
        });
        this.props.dispatch(routerRedux.goBack());
      } else {
        Toast.fail('请检查表单');
      }
    });
  };

  onRef = (ref) => {
    this.child = ref;
  };


  getPageItemsResponses = (anwser) => {
    const responses = {};
    anwser && anwser.map(dataItem => {
      if (dataItem.type === 'multichoice' || dataItem.type === 'truefalse') {
        dataItem.choose.map(item => {
          if (item.type === 'radio' && item.checked === true) {
            // responses[item.name] = item.value;
          }
          if (item.type === 'checkbox') {
            // responses[item.name] = item.checked;
          }
        });
        responses[dataItem.formulation] = dataItem.sequencecheck;
      } else if (dataItem.type === 'shortanswer') {
        // responses[anwser.choose.name] = anwser.choose.value;
        responses[dataItem.formulation] = dataItem.sequencecheck;
      } else if (dataItem.type === 'essay') {
        // responses[anwser.choose.format] = anwser.choose.formatVal;
        // responses[anwser.choose.name] = anwser.choose.value;
        responses[dataItem.formulation] = dataItem.sequencecheck;
      } else {
        responses[dataItem.formulation] = dataItem.sequencecheck;
      }
    });
    return responses;
  };

  getSubmitVal = (data) => {
    const obj = {};
    Object.keys(data)
      .forEach((key, i) => {
        obj[`data[${i}][name]`] = key;
        obj[`data[${i}][value]`] = data[key];
      });
    return obj;
  };

  getQuestion = (obj) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    if (obj.type === 'truefalse' || obj.type === 'multichoice' || obj.type === 'multichoiceset') {
      const { choose = [], slot } = obj;
      const { name, type } = choose[0];
      if (type === 'radio') {
        let initialValue = '';
        choose.map(item => {
          const { checked = false, value = '' } = item;
          if (checked === true) initialValue = value;
        });
        return getFieldDecorator(name, {
          initialValue, // 初始值
        })(<FormRadio key={`${name}_${slot}`} items={choose} />);
      } else {
        const initialValue = {};
        choose.map(item => {
          const { checked = false, id = '' } = item;
          initialValue[id] = checked;
        });
        return getFieldDecorator(`selectAnswer_${slot}`, {
          initialValue, // 初始值
        })(<FormCheckBox key={`${name}_${slot}`} items={choose} />);
      }
    } else if (obj.type === 'essay') {
      return <Essay answer={obj.choose} dispatch={this.props.dispatch} form={this.props.form} />;
    } else if (obj.type === 'shortanswer') {
      return <ShortAnswer answer={obj.choose} dispatch={this.props.dispatch} form={this.props.form} />;
    } else if (obj.type === 'match') {
      return <Match answer={obj.choose} onRef={this.onRef} form={this.props.form} />;
    } else if (obj.type === 'multianswer') {
      return <Multianswer answer={obj.html} onRef={this.onRef} form={this.props.form} dispatch={this.props.dispatch} />;
    } else if (obj.type === 'gapselect') {
      return <Gapselect answer={obj.html} onRef={this.onRef} form={this.props.form} dispatch={this.props.dispatch} />;
    }
  };

  getButton = (nextPage, navmethod) => {
    const { page } = this.props.quizDetails;
    if (navmethod === 'sequential') {
      if (nextPage > 0) {
        return (
          <WingBlank ><Button type="primary" onClick={this.handlerNextClick} >下一题</Button ></WingBlank >
        );
      }
      return (
        <WingBlank >
          <Button
            type="primary"
            onClick={this.onSubmit.bind(null, 'finish')}
          >
            提交
          </Button >
        </WingBlank >
      );
    } else {
      if (nextPage === 1) {
        return (
          <Button type="primary" onClick={this.handlerNextClick} >下一题</Button >
        );
      } else if (nextPage > 0) {
        return (
          <div className={styles.button} >
            <Button type="primary" inline onClick={this.handlerPrevClick} >上一题</Button >
            {
              nextPage > 0 ?
                <Button type="primary" inline onClick={this.handlerNextClick} >下一题</Button >
                :
                <Button type="primary" inline onClick={this.onSubmit.bind(null, 'finish')} >提交</Button >
            }
          </div >
        );
      } else {
        if (page > 0) {
          return (
            <div className={styles.button} >
              <Button type="primary" inline onClick={this.handlerPrevClick} >上一题</Button >
              <Button type="primary" inline onClick={this.onSubmit.bind(null, 'finish')} >提交</Button >
            </div >
          );
        }
        return <Button type="primary" onClick={this.onSubmit.bind(null, 'finish')} >提交</Button >;
      }
    }
    // return (
    //   nextPage === 1 ?
    //     <Button type="primary" onClick={this.handlerNextClick} >下一题</Button >
    //     :
    //     <div className={styles.button} >
    //       <Button type="primary" inline onClick={this.handlerPrevClick} >上一题</Button >
    //       {
    //         nextPage > 0 ?
    //           <Button type="primary" inline onClick={this.handlerNextClick} >下一题</Button >
    //           :
    //           <Button type="primary" inline onClick={this.onSubmit.bind(null, 'finish')} >提交</Button >
    //       }
    //     </div >
    // );
  };


  showBackMoadl = () => {
    alert('结束本次答题？', '点击确定退出答题', [
      {
        text: '取消',
        onPress: () => this.props.dispatch({
          type: 'app/updateBackModal',
          payload: {
            showBackModal: false
          }
        })
      },
      { text: '确定', onPress: () => this.onBackSubmit() },
    ]);
  };

  handlerNextClick = () => {
    const { data: { nextpage = 1 }, attemptid } = this.props.quizDetails;
    const { quizid = '' } = this.props;
    this.onSubmit();
    this.props.dispatch({
      type: 'quizDetails/updateState',
      payload: {
        page: nextpage
      }
    });
    this.props.dispatch({
      type: 'quizDetails/queryLastTimeExamination',
      payload: {
        attemptid,
        quizid,
        page: nextpage
      }
    });
  };

  handlerPrevClick = () => {
    const { page, attemptid = '', } = this.props.quizDetails;
    const { quizid = '' } = this.props;
    this.onSubmit();
    this.props.dispatch({
      type: 'quizDetails/updateState',
      payload: {
        page: parseInt(page, 10) - 1
      }
    });
    this.props.dispatch({
      type: 'quizDetails/queryLastTimeExamination',
      payload: {
        attemptid,
        quizid,
        page: parseInt(page, 10) - 1
      }
    });
  };

  navigatorClick = (page) => {
    const { attemptid = '', } = this.props.quizDetails;
    const { quizid = '' } = this.props;
    this.onSubmit();
    this.props.dispatch({
      type: 'quizDetails/updateState',
      payload: {
        page
      }
    });
    this.props.dispatch({
      type: 'quizDetails/queryLastTimeExamination',
      payload: {
        attemptid,
        quizid,
        page
      }
    });
  };


  render () {
    const { data: { nextpage = 1, options = {} }, answer } = this.props.quizDetails;
    const { navmethod = '', timelimit = 0 } = this.props;
    const { endtime } = options;
    const { showBackModal = false } = this.props.app;
    return (
      <div className={styles.outer} >
        {endtime > 0 && timelimit > 0 ? <CountDown endTime={endtime} handler={this.onSubmit} /> : null}
        {
          answer && answer.map((item, i) => {
            console.log(item)
            const { info: { title, state, grade, qtext, prompt } } = item;
            return (
              <form key={i} >
                <Card >
                  <Card.Header
                    title={title}
                    extra={
                      <div className={styles.state} >
                        <span >{state}</span >
                        <span >{grade}</span >
                      </div >
                    }
                  />
                  <Card.Body >
                    {item.type !== 'gapselect' ?
                      <div className={styles.question} dangerouslySetInnerHTML={{ __html: qtext }} /> : ''}
                    <div className={styles.prompt} >{prompt}</div >
                    <WhiteSpace size="lg" />
                    {this.getQuestion(item)}
                  </Card.Body >
                </Card >
                <WhiteSpace size="lg" />
              </form >
            );
          })
        }
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        {this.getButton(nextpage, navmethod, answer)}
        {showBackModal && this.showBackMoadl()}
      </div >
    );
  }
}

export default Examination;
