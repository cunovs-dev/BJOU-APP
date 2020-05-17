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
  Radio,
  Checkbox,
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
  Brief = Item.Brief,
  RadioItem = Radio.RadioItem,
  CheckboxItem = Checkbox.CheckboxItem;

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

  onSubmit = (questions, id) => {
    const { page } = this.props.feedbackdetails;
    this.props.form.validateFields({
      force: true,
    }, (error) => {
      if (!error) {
        const data = this.getSubmitVal(this.getPageItemsResponses(questions));
        this.props.dispatch({
          type: 'feedbackdetails/sendFeedBack',
          payload: {
            ...data,
            feedbackid: id,
            page
          }
        });
      } else {
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

  getSubmitVal = (data) => {
    const obj = {};
    Object.keys(data)
      .forEach((key, i) => {
        obj[`responses[${i}][name]`] = key;
        obj[`responses[${i}][value]`] = data[key];
      });
    return obj;
  };

  getPageItemsResponses = (items) => {
    const responses = {};

    items.forEach((itemData) => {
      if (itemData.hasvalue) {
        let name,
          value;
        const nameTemp = `${itemData.typ}_${itemData.id}`;

        if (itemData.typ == 'multichoice' && itemData.subtype == 'c') {
          name = `${nameTemp}[0]`;
          responses[name] = 0;
          itemData.choices.forEach((choice, index) => {
            name = `${nameTemp}[${index + 1}]`;
            value = choice.checked ? choice.value : 0;
            responses[name] = value;
          });
        } else {
          if (itemData.typ == 'multichoice' && itemData.subtype != 'r') {
            name = `${nameTemp}[0]`;
          } else {
            name = nameTemp;
          }

          if (itemData.typ === 'multichoice' || itemData.typ === 'multichoicerated') {
            value = itemData.value || 0;
          } else if (itemData.typ === 'numeric') {
            value = itemData.value || itemData.value == 0 ? itemData.value : '';

            if (value !== '') {
              if ((itemData.rangefrom != '' && value < itemData.rangefrom) ||
                (itemData.rangeto != '' && value > itemData.rangeto)) {
              }
            }
          } else {
            value = itemData.value || itemData.value == 0 ? itemData.value : '';
          }

          responses[name] = value;
        }
      }
    });

    return responses;
  };

  complete = () => {
    const { id } = this.props.location.query;
    this.props.dispatch({
      type: 'feedbackdetails/completeFeedBack',
      payload: {
        feedbackid: id
      }
    });
  };

  showModal = () => {
    const { questions } = this.props.feedbackdetails;
    const { id } = this.props.location.query;
    this.props.form.validateFields({
      force: false,
    }, (error) => {
      if (!error) {
        this.onSubmit(questions, id);
        alert('提交', '确定要提交吗???', [
          { text: '取消', onPress: () => console.log('ok') },
          { text: '提交', onPress: () => this.complete() },
        ]);
      } else {
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
        this.onSubmit(questions, id);
      } else {

      }
    });
  };

  handlerPrevClick = () => {
    const { page, questions } = this.props.feedbackdetails;
    const { id } = this.props.location.query;
    this.onSubmit(questions, id);
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

  renderErrorSpan = (err) => {
    if (err) {
      return err.map(e => <span style={{ color: 'red' }}>{e}</span>);
    }
  };

  renderCard = (header, content, errors) => (
    <Card full>
      <Card.Header
        title={header}
      />
      <Card.Body>
        {content}
      </Card.Body>
      <Card.Footer content={this.renderErrorSpan(errors)}/>
    </Card>
  );

  renderQuestions = (questions = []) => {
    const { getFieldDecorator, getFieldError } = this.props.form,
      result = [];
    questions.map((question) => {
      const { typ = '', name = '', otherdata = '', required = false, presentation = '', responsevalue = '', choices = [], template = '', id, value = '', rangefrom = '', rangeto = '' } = question;
      let questionKey = `${typ}_${id}`,
        questionRules = [],
        questionError = getFieldError(questionKey);
      if (required === true) {
        questionRules.push({ required, message: '标记*的题必须回答' });
      }
      switch (typ) {
        case 'info':
          result.push(
            <List key={questionKey} className={styles.info}>
              <Item multipleLine>
                {name} <Brief>{otherdata}</Brief>
              </Item>
            </List>
          );
          result.push(<WhiteSpace/>);
          break;
        case 'textfield':
          result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
            initialValue: value, // 初始值
            rules: questionRules,
          })(
            <InputItem
              placeholder="请回答"
              maxLength={presentation.split('|')[1]}
            />
          )), questionError);
          result.push(<WhiteSpace/>);
          break;
        case 'textarea':
          result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
            initialValue: value, // 初始值
            rules: questionRules,
          })(
            <TextareaItem
              rows={6}
              placeholder={'在此输入回答'}
            />
          )), questionError);
          result.push(<WhiteSpace/>);
          break;
        case 'numeric':
          if (rangefrom !== '' && rangeto !== '' && rangefrom * 1 && rangeto * 1 && (rangefrom * 1 < rangeto * 1)) {
            questionRules.push({
              min: rangefrom * 1,
              max: rangeto * 1,
              message: `输入超出范围 ，数字应在${rangefrom}~${rangeto}之间`
            });
          }
          result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
            initialValue: value, // 初始值
            rules: questionRules,
          })(
            <InputItem
              type={'money'}
              placeholder="请回答"
            />
          )), questionError);
          result.push(<WhiteSpace/>);
          break;
        case 'label':
          result.push(<div className={styles.label}><InnerHtml data={presentation}/></div>);
          break;
        case 'multichoice':
          /*          if (template === 'multichoice-d') {
                      result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
                        initialValue: value * 1, // 初始值
                        rules: questionRules,
                      })(
                        <Picker data={choices} cols={1} title={question.label} extra="请选择(可选)">
                          <List.Item arrow="horizontal" wrap>{''}</List.Item>
                        </Picker>
                      )), questionError);
                    } else {
                      result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
                        initialValue: {}, // 初始值
                        rules: questionRules,
                      })(
                        <FormCheckBox items={choices} label={question.label}/>
                      )), questionError);
                    }*/
          result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
            initialValue: {}, // 初始值
            rules: questionRules,
          })(
            <FormCheckBox items={choices} label={question.label}/>
          )), questionError);
          result.push(<WhiteSpace/>);
          break;
        case 'multichoicerated':
          result.push(this.renderCard(this.renderTitle(name, required, questionError), getFieldDecorator(questionKey, {
            initialValue: {}, // 初始值
            rules: questionRules,
          })(
            <FormRadio items={choices} label={question.label}/>
          )), questionError);
          result.push(<WhiteSpace/>);
          break;
      }
    });
    return result;
  };

  renderQuestions2 = (questions) => {
    const { getFieldProps, getFieldError, getFieldDecorator } = this.props.form;
    const result = [];
    questions && questions.map((item) => {
      const { typ = '', name = '', otherdata = '', required = false, presentation = '', responsevalue = '', choices = [], template = '', id, value = '', rangefrom = '', rangeto = '' } = item;
      if (typ === 'info') {
        result.push(
          <List key={id} className={styles.info}>
            <Item multipleLine>
              {name} <Brief>{otherdata}</Brief>
            </Item>
          </List>
        );
      }
      if (typ === 'textfield') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                <InputItem
                  {...getFieldProps(`${typ}_${id}`, {
                    initialValue: value,
                    rules: [
                      { required, message: '标记*的题必须回答' },
                    ],
                  })}
                  onChange={(val) => this.textChange(val, id)}
                  maxLength={presentation.split('|')[1]}
                  clear
                  error={!!getFieldError(`${typ}_${id}`)}
                  placeholder="请回答"
                />
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'numeric') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={
                  <span>
                    <span>{this.renderTitle(name, required)}</span>
                    <span style={{ marginLeft: '10px' }}>
                      {`(${rangefrom}~${rangeto})`}
                    </span>
                  </span>
                }
              />
              <Card.Body>
                <InputItem
                  {...getFieldProps(`${typ}_${id}`, {
                    initialValue: value,
                    rules: [
                      { required, message: '标记*的题必须回答' },
                      { pattern: /^(?:0|[1-9][0-9]?|100)$/, message: '输入超出范围' },
                    ],
                  })}
                  onChange={(val) => this.textChange(val * 1, id)}
                  clear
                  error={!!getFieldError(`${typ}_${id}`)}
                  onErrorClick={() => {
                    Toast.fail(getFieldError(`${typ}_${id}`));
                  }}
                  placeholder="请回答"
                />
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'label') {
        result.push(<div className={styles.label}><InnerHtml data={presentation}/></div>);
      }
      if (typ === 'multichoice' && template !== 'multichoice-c' && template !== 'multichoice-d') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                {cnIsArray(choices) && choices
                  .map((item, i) => (
                    <RadioItem
                      {...getFieldProps(`${typ}_${id}`, {
                        initialValue: value * 1,
                        rules: [
                          { required: false, message: '标记*的题必须回答' },
                        ],
                      })}
                      wrap
                      key={item.value}
                      checked={value * 1 === item.value}
                      onClick={() => this.radioChange(item.value, id)}
                    >
                      {item.label}
                    </RadioItem>
                  ))}
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'multichoice' && template === 'multichoice-c') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                <List className={styles.list}>
                  {cnIsArray(choices) && choices
                    .map((item, i) => (
                      <CheckboxItem
                        wrap
                        {...getFieldProps(`${typ}_${id}`)}
                        checked={item.checked}
                        onChange={(val) => this.checkboxChange(item.value, id)}
                        value={item.value + 1}
                        key={item.value}
                      >
                        {item.label}
                      </CheckboxItem>
                    ))}
                </List>
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
        return false;
      }
      if (typ === 'multichoice' && template === 'multichoice-d') {
        result.push(
          <div key={item.id} className={styles.picker}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                <Picker
                  {...getFieldProps(`${typ}_${id}`, {
                    initialValue: [value * 1],
                    rules: [
                      { required, message: '标记*的题必须回答' },
                    ],
                  })}
                  onChange={(val) => this.pickerChange(val, id)}
                  data={choices}
                  cols={1}
                  title={item.label}
                  extra="请选择(可选)"
                >
                  <List.Item arrow="horizontal">{''}</List.Item>
                </Picker>
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'multichoicerated' && template !== 'multichoice-d') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                {cnIsArray(choices) && choices
                  .map((item, i) => (
                    <RadioItem
                      {...getFieldProps(`${typ}_${id}`, {
                        initialValue: value * 1,
                        rules: [
                          { required, message: '标记*的题必须回答' },
                        ],
                      })}
                      key={item.value}
                      checked={value * 1 === item.value}
                      onClick={() => this.radioChange(item.value, id)}
                    >
                      {item.label}
                    </RadioItem>
                  ))}
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'multichoicerated' && template === 'multichoice-d') {
        result.push(
          <div key={item.id} className={styles.picker}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                <Picker
                  {...getFieldProps(`${typ}_${id}`, {
                    initialValue: [value * 1],
                    rules: [
                      { required, message: '标记*的题必须回答' },
                    ],
                  })}
                  onChange={(val) => this.pickerChange(val, id)}
                  data={choices}
                  cols={1}
                  title={item.label}
                  extra="请选择(可选)"
                >
                  <List.Item arrow="horizontal">{''}</List.Item>
                </Picker>
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
      if (typ === 'textarea') {
        result.push(
          <div key={item.id}>
            <Card full>
              <Card.Header
                title={this.renderTitle(name, required)}
              />
              <Card.Body>
                <TextareaItem
                  {...getFieldProps(`${typ}_${id}`, {
                    initialValue: value,
                    rules: [{ required, message: '标记*的题必须回答' }],
                  })}
                  onChange={(val) => this.textChange(val, id)}
                  rows={6}
                  placeholder={'在此输入回答'}
                />
              </Card.Body>
            </Card>
            <WhiteSpace/>
          </div>
        );
      }
    });
    return result;
  };

  renderTitle = (name, required, hasError) => (
    <span style={{ color: hasError && hasError.length ? 'red' : '' }}>
      {required ? <Icon type={getLocalIcon('/components/required.svg')}/> : null}
      <span>{name}</span>
    </span>
  );

  render () {
    const { name = '答题', anonymous = 1, id = '' } = this.props.location.query,
      { questions, hasprevpage, hasnextpage, page } = this.props.feedbackdetails;
    const { showBackModal = false } = this.props.app;
    return (
      <div>
        <Nav title={name} dispatch={this.props.dispatch} hasShadow isAlert/>
        <div className={styles[`${PrefixCls}-type`]}>
          <TitleBox title="模式" sup=""/>
          <p>{anonymous === 1 ? '匿名方式' : '实名方式'}</p>
        </div>
        <form className={styles.outer}>
          {this.renderQuestions(questions)}
        </form>
        <WingBlank>
          <div className={styles.button}>
            {
              hasprevpage ?
                <Button
                  onClick={this.handlerPrevClick}
                >
                  上一页
                </Button>
                :
                null
            }
            {
              hasnextpage ?
                <Button
                  type="primary"
                  onClick={this.handlerNextClick}
                >下一页
                </Button>
                :
                <Button
                  style={{ marginTop: '10px' }}
                  type="primary"
                  onClick={() => this.showModal()}
                >
                  提交答案
                </Button>
            }
          </div>
        </WingBlank>
        {showBackModal && this.showBackMoadl()}
      </div>
    );
  }
}

export default connect(({ loading, feedbackdetails, app }) => ({
  loading,
  feedbackdetails,
  app
}))(createForm()(FeedBackDetails));
