import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Nav from 'components/nav';
import VerificationCode from 'components/VerificationCode';
import { WhiteSpace, Button, List, InputItem, Toast } from 'components';
import { config, cookie, pattern, getRule, getValideError } from 'utils';
import styles from './index.less';


const { userTag: { portalUserId } } = config,
  { _cg } = cookie;

@connect(({ setPassword, loading }) => ({
  setPassword
}))
@createForm()
class SetPassword extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: false
    };
    this.timer = null;
  }

  onValidateCodeClick = (val) => {
    this.props.dispatch({
      type: 'setPassword/sendCode',
      payload: {
        userId: _cg(portalUserId),
        receiveType: val
      }
    });
  };

  onRef = (ref) => {
    this.child = ref;
  };

  getType = (receiveType) => {
    if (receiveType === 'phone') {
      return '当前手机';
    } else if (receiveType === 'email') {
      return '当前邮箱';
    } else {
      return '未知';
    }
  };

  setPassword = () => {
    this.props.dispatch({
      type: 'setPassword/resetPassword',
      payload: {
        userId: _cg(portalUserId),
        ...this.props.form.getFieldsValue(),
        ...this.child.getItemsValue()
      }
    });
  };

  handlerClick = () => {
    this.props.form.validateFields({
      force: true,
      first: true
    }, (error) => {
      if (!error) {
        const { password = '' } = this.props.form.getFieldsValue();
        this.props.dispatch({
          type: 'setPassword/validRule',
          payload: {
            characters: password
          },
          callback: this.setPassword
        });
      } else {
        Toast.fail(getValideError(error));
      }
    });
  };

  render () {
    const { name = '' } = this.props.location.query,
      { getFieldProps, getFieldError } = this.props.form,
      { data } = this.props.setPassword;
    // const { complexityRule = [], maxLength = 8, minLength = 6 } = rules;
    return (
      <div className={styles.container}>
        <Nav title={name} dispatch={this.props.dispatch} />
        <List>
          {
            cnIsArray(data) && data.map((item, i) => (
              <InputItem key={i} disabled value={item.receiveNumber}>{this.getType(item.receiveType)}</InputItem>
            ))
          }
          <VerificationCode
            codeClick={this.onValidateCodeClick}
            onRef={this.onRef}
            overlay={data}
          />
          <div className={styles.line}>
            <InputItem
              type="password"
              placeholder="请输入新密码"
              {...getFieldProps('password', {
                initialValue: '',
                rules: [
                  { required: true, message: '密码不能为空' }
                  // { min: minLength, message: `密码不能小于${minLength}个字符` }, 改为后台验证了。。。
                  // { max: maxLength, message: `密码不能大于${maxLength}个字符` },
                  // {
                  //   validator: (rule, value) => {
                  //     if (getRule(complexityRule, value).result) {
                  //       return Promise.resolve();
                  //     }
                  //     return Promise.reject(`密码缺少${getRule(complexityRule, value).message}`);
                  //   }
                  // }
                ]
              })}
              clear
              error={!!getFieldError('password')}
              onErrorClick={() => {
                Toast.fail(getFieldError('password'), 3);
              }}
            >
              新密码
            </InputItem>
          </div>
          <InputItem
            type="password"
            placeholder="请再次输入新密码"
            {...getFieldProps('confirm', {
              initialValue: '',
              rules: [
                { required: true, message: '请确认密码' },
                {
                  validator: (rule, value) => {
                    const { password } = this.props.form.getFieldsValue(['password']);
                    if (!value || password === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('密码不一致');
                  }
                }
              ]
            })}
            clear
            error={!!getFieldError('confirm')}
            onErrorClick={() => {
              Toast.fail(getFieldError('confirm'));
            }}
          >
            确认密码
          </InputItem>
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.wrapper}>
          <Button
            className={styles.btn}
            type="primary"
            onClick={this.handlerClick}
          >确认</Button>
        </div>
      </div>
    );
  }
}

export default SetPassword;
