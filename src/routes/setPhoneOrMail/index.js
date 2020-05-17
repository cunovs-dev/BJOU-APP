/**
 * @author Lowkey
 * @date 2020/03/31 16:43:14
 * @Description: 设置邮箱或手机号
 */
import React from 'react';
import { connect } from 'dva';
import Nav from 'components/nav';
import { createForm } from 'rc-form';
import { WhiteSpace, Button, List, InputItem, Toast } from 'components';
import { pattern, config, cookie } from 'utils';
import styles from './index.less';

const { userTag: { portalToken, portalUserId } } = config,
  { _cg } = cookie;

@connect(({ setPhoneOrMail }) => ({
  setPhoneOrMail
}))
@createForm()
class SetPhoneOrMail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: false
    };
    this.timer = null;
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }


  onValidateCodeClick = (key) => {

    this.props.form.validateFields([key], {
      force: true

    }, (error) => {
      if (!error) {
        this.startCountDown();
        this.setState({
          isCodeSending: true,
          isDisabled: true
        });
        this.props.dispatch({
          type: 'setPhoneOrMail/sendCodeWithToken',
          payload: {
            access_token: _cg(portalToken),
            userId: _cg(portalUserId),
            ...this.props.form.getFieldsValue([key])
          }
        });
      } else {
        Toast.fail('请输入正确的手机号', 2);
      }
    });
  };


  startCountDown = () => {
    const that = this;
    this.timer = setInterval(() => {
      that.countDown();
    }, 1000);
  };

  countDown = () => {
    this.setState({
      count: --this.state.count
    });
    if (this.state.count < 1) {
      clearInterval(this.timer);
      this.setState({
        isCodeSending: false,
        isDisabled: false,
        count: 60
      });
    }
  };

  handlerClick = () => {
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'setPhoneOrMail/updatePhoneOrEmail',
          payload: {
            userId: _cg(portalUserId),
            ...this.props.form.getFieldsValue()
          }
        });
      } else {
        Toast.fail('请输入正确的手机号', 2);
      }
    });
  };

  render () {
    const { codeType = '' } = this.props.location.query,
      { getFieldProps, getFieldError } = this.props.form;
    const placeholder = codeType === 'phone' ? '请输入新手机号码' : '请输入新邮箱';
    const key = codeType === 'phone' ? 'phone' : 'email';
    const name = codeType === 'phone' ? '修改手机号码' : '修改邮箱';
    const currentPattern = codeType === 'phone' ?
      { pattern: pattern('phone'), message: '手机号码格式有误！' }
                                                :
      { pattern: pattern('email'), message: '邮箱格式有误！' };
    return (
      <div className={styles.container}>
        <Nav title={name} dispatch={this.props.dispatch} />
        <List>
          <InputItem
            placeholder={placeholder}
            {...getFieldProps(key, {
              initialValue: '',
              rules: [
                { required: true, message: placeholder },
                currentPattern
              ]
            })}
            clear
            error={!!getFieldError(key)}
            onErrorClick={() => {
              Toast.fail(getFieldError(key));
            }}
          >
            {codeType === 'phone' ?
             '新手机'
                                  :
             '新邮箱'
            }
          </InputItem>
          <div className={styles.codeBox}>
            <div className={styles.code}>
              <InputItem
                {...getFieldProps('code', {
                  initialValue: '',
                  rules: [{ required: true, message: '验证码必须输入' }]
                })}
                placeholder="请输入验证码"
                clear
                error={!!getFieldError('code')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('code'));
                }}
              >
                验证码
              </InputItem>
            </div>
            <Button
              type="ghost"
              inline
              size="small"
              className={styles.codeBtn}
              disabled={this.state.isDisabled}
              onClick={() => this.onValidateCodeClick(key)}
            >
              {
                this.state.isCodeSending ?
                <span>{`${this.state.count}s重新获取`}</span>
                                         :
                <span>获取验证码</span>
              }
            </Button>
          </div>
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.wrapper}>
          <Button
            className={styles.btn}
            type="primary"
            onClick={this.handlerClick}
          >完成</Button>
        </div>
      </div>
    );
  }
}

export default SetPhoneOrMail;
