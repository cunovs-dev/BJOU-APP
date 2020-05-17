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
import mail from 'themes/images/login/mail.png';
import styles from './index.less';


class MailForm extends React.Component {
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
    const { codeClick, emailKey } = this.props;
    this.props.form.validateFields([emailKey], {
      force: true

    }, (error) => {
      if (!error) {
        this.setState({
          isCodeSending: true,
          isDisabled: true
        });
        this.startCountDown();
        codeClick(this.props.form.getFieldsValue([emailKey]));
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
      { firstIcon, secondIcon, emailKey, codeKey, moveInput, hasNav, emailNumber, disabled } = this.props;
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
              placeholder="请输入邮箱号"
              onFocus={() => moveInput()}
              {...getFieldProps(emailKey, {
                initialValue: emailNumber,
                // rules: [
                //   { required: true, message: '请输入邮箱号' },
                //   { pattern: pattern('email'), message: '邮箱格式有误！' }
                // ]
              })}
              clear
              disabled={disabled}
              error={!!getFieldError(emailKey)}
              onErrorClick={() => {
                Toast.fail(getFieldError(emailKey));
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
                placeholder="邮箱验证码"
                onFocus={() => moveInput()}
                {...getFieldProps(codeKey, {
                  initialValue: '',
                  rules: [{ required: true, message: '邮箱验证码必须输入' }]
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
      </div>
    );
  }
}

MailForm.propTypes = {
  moveInput: PropTypes.func.isRequired,
  codeClick: PropTypes.func.isRequired
};

MailForm.defaultProps = {
  firstIcon: mail,
  secondIcon: mail,
  emailKey: 'email',
  codeKey: 'code',
  hasNav: false,
  emailNumber: '',
  disabled: false
};

export default createForm()(MailForm);
