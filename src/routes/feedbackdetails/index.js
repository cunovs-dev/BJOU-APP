import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Nav from 'components/nav';
import { FormRadio, FormCheckBox } from 'components/formtags';
import {
  List,
  Button,
  Toast,
  WhiteSpace,
  WingBlank,
  Tabs,
  InputItem,
  Picker,
  TextareaItem,
  Card,
  Icon,
  Modal
} from 'components';
import { routerRedux } from 'dva/router';
import { getLocalIcon } from 'utils';
import TitleBox from 'components/titlecontainer';
import InnerHtml from 'components/innerhtml';
import styles from './index.less';

const alert = Modal.alert;
const PrefixCls = 'feedbackdetails',
  Item = List.Item,
  Brief = Item.Brief;

class FeedBackDetails extends Component {
  constructor (props) {
    super(props);
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
  }

  onSubmit = (id) => {
    const { page } = this.props.feedbackdetails;
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const data = this.checkFieldValues(values);
        this.props.dispatch({
          type: 'feedbackdetails/sendFeedBack',
          payload: {
            ...data,
            feedbackid: id,
            page
          }
        });
      } else {
        this.scrollToField(error);
        Toast.fail('请检查表单');
      }
    });
  };

  onBackSubmit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
    dispatch(routerRedux.goBack());
  };

  complete = (values = '') => {
    const { id } = this.props.location.query,
      doComplete = () => {
        this.props.dispatch({
          type: 'feedbackdetails/completeFeedBack',
          payload: {
            feedbackid: id
          }
        });
      };
    if (values) {
      const { page } = this.props.feedbackdetails;
      this.props.dispatch({
        type: 'feedbackdetails/sendFeedBack',
        payload: {
          ...values,
          feedbackid: id,
          page
        },
        callback: () => {
          doComplete();
        }
      });
    } else {
      doComplete();
    }
  };

  checkFieldValues = (values) => {
    let result = {},
      startIndex = 0;
    const { questions } = this.props.feedbackdetails,
      questionsRquired = {};
    questions.map(question => {
      const { typ = '', required = false, id } = question;
      questionsRquired[`${typ}_${id}`] = required;
    });
    Object.keys(values)
      .map(attVal => {
        const value = values[attVal];
        if (cnIsArray(value)) {
          result[`responses[${startIndex}][name]`] = `${attVal}[0]`;
          result[`responses[${startIndex++}][value]`] = value.length > 0 ? value[0] : 0;
        } else if (typeof value === 'object') {
          Object.keys(value)
            .map((attChild, index) => {
              if (index === 0) {
                result[`responses[${startIndex}][name]`] = `${attVal}[0]`;
                result[`responses[${startIndex++}][value]`] = 0;
              }
              result[`responses[${startIndex}][name]`] = `${attVal}[${index + 1}]`;
              result[`responses[${startIndex++}][value]`] = value[attChild] === true ? index + 1 : 0;
            });
        } else {
          const isRadio = /^(multichoice|multichoicerated)_/.test(attVal);
          result[`responses[${startIndex}][name]`] = `${attVal}${isRadio && questionsRquired[attVal] === true ? '[0]' : ''}`;
          result[`responses[${startIndex++}][value]`] = value === '' && isRadio ? 0 : value;
        }
      });
    return result;
  };

  scrollToField = (error) => {
    const { errors = [{}] } = error[Object.keys(error)[0]],
      { field } = errors[0];
    let fieldEl = '';
    if (field && (fieldEl = document.getElementById(`${PrefixCls}_${field}`))) {
      fieldEl.scrollIntoView(false);
    }
  };

  showModal = () => {
    this.props.form.validateFields({
      force: true,
    }, (error, values) => {
      if (!error) {
        alert('提交', '确定要提交吗???', [
          { text: '取消', onPress: () => console.log('ok') },
          {
            text: '提交',
            onPress: () => {
              // console.log(this.checkFieldValues(values));
              this.complete(this.checkFieldValues(values));
            }
          },
        ]);
      } else {
        this.scrollToField(error);
        Toast.fail('您的回答中存在未填项');
      }
    });
  };

  handlerNextClick = () => {
    const { page, questions } = this.props.feedbackdetails;
    const { id } = this.props.location.query;
    this.props.form.validateFields({}, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'feedbackdetails/updateState',
          payload: {
            page: page + 1
          }
        });
        this.props.dispatch({
          type: 'feedbackdetails/query',
          payload: {
            id,
            page
          }
        });
        this.onSubmit(id);
      } else {

      }
    });
  };

  handlerPrevClick = () => {
    const { page } = this.props.feedbackdetails;
    const { id } = this.props.location.query;
    this.onSubmit(id);
    this.props.dispatch({
      type: 'feedbackdetails/updateState',
      payload: {
        page: page - 1
      }
    });

    this.props.dispatch({
      type: 'feedbackdetails/query',
      payload: {
        id,
        page
      }
    });
  };

  radioChange = (value, id) => {
    this.props.dispatch({
      type: 'feedbackdetails/updateVal',
      payload: {
        value,
        id
      }
    });
  };

  checkboxChange = (value, id) => {
    this.props.dispatch({
      type: 'feedbackdetails/updateCheckVal',
      payload: {
        value,
        id
      }
    });
  };

  pickerChange = (value, id) => {
    const val = value.join('');
    this.props.dispatch({
      type: 'feedbackdetails/updateVal',
      payload: {
        value: val,
        id
      }
    });
  };

  textChange = (value, id) => {
    this.props.dispatch({
      type: 'feedbackdetails/updateVal',
      payload: {
        value,
        id
      }
    });
  };

  showBackMoadl = () => {
    alert('结束本次答题？', '退出后不保存当前答案！', [
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

  renderCard = (key, header, content) => {
    const { getFieldError } = this.props.form,
      errors = getFieldError(key);
    return (
      <div id={`${PrefixCls}_${key}`}
        className={`${styles[`${PrefixCls}-list`]} ${errors ? styles[`${PrefixCls}-hasError`] : ''}`}
      >
        <WingBlank size="sm" >
          <Card >
            <Card.Header
              title={header}
            />
            <Card.Body >
              {content}
            </Card.Body >
            <Card.Footer
              content={errors}
            />
          </Card >
        </WingBlank >
      </div >);
  };

  renderQuestions = (questions = []) => {
    const { getFieldDecorator, getFieldError } = this.props.form,
      result = [],
      questionsRquired = {};
    questions.map((question, index) => {
      const { typ = '', name = '', otherdata = '', required = false, presentation = '', choices = [], template = '', id, value = '' } = question;
      let questionKey = `${typ}_${id}`,
        questionRules = [],
        questionError = getFieldError(questionKey);
      questionsRquired[questionKey] = required;
      if (required === true) {
        questionRules.push({ required, message: '标记*的题必须回答' });
      }
      switch (typ) {
        case 'info':
          result.push(
            <List key={questionKey} className={styles.info} >
              <Item multipleLine >
                {name} <Brief >{otherdata}</Brief >
              </Item >
            </List >
          );
          result.push(<WhiteSpace />);
          break;
        case 'textfield':
          result.push(this.renderCard(questionKey, this.renderTitle(name, required), getFieldDecorator(questionKey, {
            initialValue: value, // 初始值
            rules: questionRules,
          })(
            <InputItem
              placeholder="请回答"
              maxLength={presentation.split('|')[1]}
            />
          )));
          result.push(<WhiteSpace />);
          break;
        case 'textarea':
          result.push(this.renderCard(questionKey, this.renderTitle(name, required), getFieldDecorator(questionKey, {
            initialValue: value, // 初始值
            rules: questionRules,
          })(
            <TextareaItem
              rows={6}
              placeholder={'在此输入回答'}
            />
          ), questionError));
          result.push(<WhiteSpace />);
          break;
        case 'numeric':
          const presentations = presentation.split('|');
          let numericTitle = this.renderTitle(name, required);
          if (presentations.length === 2) {
            const minSum = presentations[0] !== '' ? presentations[0] * 1 : -1,
              maxSum = presentations[1] !== '' ? presentations[1] * 1 : -1;
            if (minSum !== -1 && maxSum !== -1 && maxSum > minSum) {
              questionRules.push({
                validator: (rule, val, callback) => {
                  let message = '';
                  if (required === true ? true : val !== '') {
                    if (!/^[\d]+$/.exec(val)) {
                      message = '输入值必须为整数';
                    } else if (val < minSum || val > maxSum) {
                      message = `输入值应在${minSum}~${maxSum}之间`;
                    }
                  }
                  callback(message === '' ? [] : message);
                }
              });
              numericTitle = (<span >
                <span >{numericTitle}</span >
                <span style={{ marginLeft: '10px' }} >
                  {`(${minSum}~${maxSum})`}
                </span >
              </span >);
            }
          }
          result.push(this.renderCard(questionKey, numericTitle, getFieldDecorator(questionKey, {
            initialValue: value * 1 || '', // 初始值
            rules: questionRules,
          })(
            <InputItem
              type={'money'}
              placeholder="请回答"
            />
          )));
          result.push(<WhiteSpace />);
          break;
        case 'label':
          result.push(<div className={styles.label} ><InnerHtml data={presentation} /></div >);
          break;
        case 'multichoice':
        case 'multichoicerated':
          const items = choices.filter(c => (required === true ? c.value !== 0 : true));
          if (template === 'multichoice-c') {
            result.push(this.renderCard(questionKey, this.renderTitle(name, required), getFieldDecorator(questionKey, {
              initialValue: '', // 初始值
              rules: questionRules,
            })(
              <FormCheckBox items={choices} label={question.label} keys={`comp_${questionKey}`} />
            )));
            result.push(<WhiteSpace />);
          } else if (template === 'multichoice-r') {
            result.push(this.renderCard(questionKey, this.renderTitle(name, required), getFieldDecorator(questionKey, {
              initialValue: '', // 初始值
              rules: questionRules,
            })(
              <FormRadio items={items} label={question.label} keys={`comp_${questionKey}`} />
            )));
          } else if (template === 'multichoice-d') {
            result.push(
              <div
                className={styles.picker}
              >{this.renderCard(questionKey, this.renderTitle(name, required), getFieldDecorator(questionKey, {
                  initialValue: [], // 初始值
                  rules: questionRules,
                })(
                  <Picker data={items} cols={1} >
                    <List.Item arrow="horizontal" wrap >{question.label}</List.Item >
                  </Picker >
                ))}</div >);
          }
          result.push(<WhiteSpace />);
          break;
      }
    });
    return result;
  };

  renderTitle = (name, required) => (
    <span >
      {required ? <Icon type={getLocalIcon('/components/required.svg')} /> : null}
      <span >{name}</span >
    </span >
  );

  render () {
    const { name = '答题', anonymous = 1, id = '' } = this.props.location.query,
      { questions, hasprevpage, hasnextpage, page } = this.props.feedbackdetails,
      { loadingQuestions = false } = this.props;
    const { showBackModal = false } = this.props.app;
    // anonymous变为了字符"1"
    return (
      <div >
        <Nav title={name} dispatch={this.props.dispatch} hasShadow isAlert />
        <div className={styles[`${PrefixCls}-type`]} >
          <TitleBox title="模式" sup="" />
          <p >{anonymous == 1 ? '匿名方式' : '实名方式'}</p >
        </div >
        {this.renderQuestions(questions)}
        <WingBlank >
          <div className={styles.button} >
            {
              hasprevpage ?
                <Button
                  onClick={this.handlerPrevClick}
                >
                  上一页
                </Button >
                :
                null
            }
            {
              !loadingQuestions ?
                hasnextpage ?
                  <Button
                    type="primary"
                    onClick={this.handlerNextClick}
                  >下一页
                  </Button >
                  :
                  <Button
                    style={{ marginTop: '10px' }}
                    type="primary"
                    onClick={() => this.showModal()}
                  >
                    提交答案
                  </Button >
                :
                null
            }
          </div >
        </WingBlank >
        {showBackModal && this.showBackMoadl()}
      </div >
    );
  }
}

export default connect(({ loading, feedbackdetails, app }) => ({
  loadingQuestions: loading.effects[`${PrefixCls}/query`],
  feedbackdetails,
  app
}))(createForm()(FeedBackDetails));
