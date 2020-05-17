/**
 * @author Lowkey
 * @date 2020/03/16 11:39:18
 * @Description:
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InputItem, WhiteSpace, Button, Toast, Icon } from 'components';
import Nav from 'components/nav';
import { getLocalIcon, pattern } from 'utils';
import mobile from 'themes/images/login/mobile.png';
import message from 'themes/images/login/message.png';
import styles from './index.less';


class PhoneForm extends React.Component {
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


  onValidateCodeClick = () => {
    const { codeClick, phoneKey } = this.props;
    this.props.form.validateFields([phoneKey], {
      force: true

    }, (error) => {
      if (!error) {
        this.setState({
          isCodeSending: true,
          isDisabled: true
        });
        this.startCountDown();
        codeClick(this.props.form.getFieldsValue([phoneKey]));
      } else {
        Toast.fail('请输入正确的手机号', 3);
      }
    });
  };

  getItemsValue = () => (this.props.form.getFieldsValue());

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

  startCountDown = () => {
    const that = this;
    this.timer = setInterval(() => {
      that.countDown();
    }, 1000);
  };

  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { firstIcon, secondIcon, phoneKey, codeKey, moveInput, hasNav, phoneNumber, disabled } = this.props;
    return (
      <div>
        {
          hasNav ?
          <Nav title="重置密码" dispatch={this.props.dispatch} />
                 :
          null
        }
        <div>
          <div className={styles.phone}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${firstIcon})`
              }}
            />
            <InputItem
              placeholder="请输入手机号码"
              onFocus={() => moveInput()}
              {...getFieldProps(phoneKey, {
                initialValue: phoneNumber,
                rules:
                  disabled
                  ?
                  null
                  :
                    [
                      { required: true, message: '请输入手机号码' },
                      { pattern: pattern('phone'), message: '手机号码格式有误！' }
                    ]
              })}
              disabled={disabled}
              clear
              error={!!getFieldError(phoneKey)}
              onErrorClick={() => {
                Toast.fail(getFieldError(phoneKey));
              }}
            />
          </div>
          <WhiteSpace size="lg" />
          <div className={styles.codeBox}>
            <div className={styles.code}>
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${secondIcon})`
                }}
              />
              <InputItem
                placeholder="短信验证码"
                onFocus={() => moveInput()}
                {...getFieldProps(codeKey, {
                  initialValue: '',
                  rules: [{ required: true, message: '短信验证码必须输入' }]
                })}
                clear
                error={!!getFieldError(codeKey)}
                onErrorClick={() => {
                  Toast.fail(getFieldError(codeKey));
                }}
              />
            </div>
            <Button
              type="ghost"
              inline
              size="small"
              className={styles.codeBtn}
              onClick={this.onValidateCodeClick}
              disabled={this.state.isDisabled}
            >
              {
                this.state.isCodeSending ?
                <span>{`${this.state.count}s重新获取`}</span>
                                         :
                <span>获取验证码</span>
              }
            </Button>
          </div>
        </div>
        <WhiteSpace size="lg" />
      </div>
    );
  }
}

PhoneForm.propTypes = {
  moveInput: PropTypes.func.isRequired,
  codeClick: PropTypes.func.isRequired
};

PhoneForm.defaultProps = {
  firstIcon: mobile,
  secondIcon: message,
  phoneKey: 'phone',
  codeKey: 'code',
  hasNav: false,
  phoneNumber: '',
  disabled: false
};

export default createForm()(PhoneForm);
