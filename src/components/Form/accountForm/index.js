/**
 * @author Lowkey
 * @date 2020/03/16 15:21:18
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { InputItem, WhiteSpace, Icon, Toast } from 'components';
import { getLocalIcon } from 'utils';
import { _cg } from 'utils/cookie';
// import SlideVerification from 'components/SlideVerification';
import user from 'themes/images/login/user.png';
import lock from 'themes/images/login/lock.png';
import styles from './index.less';


class AccountForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isValidate: false
    };
  }

  onValidate = () => {
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        this.setState({
          isValidate: true
        });
      } else {
        Toast.fail('请确认信息是否正确', 2);
      }
    });
  };

  onRef = (ref) => {
    this.child = ref;
  };

  getItemsValue = () => {
    const { captchaCode, username } = this.props.form.getFieldsValue();
    if (captchaCode && captchaCode !== '') {
      return {
        ...this.props.form.getFieldsValue(),
        capathkey: username
      };
    }
    return this.props.form.getFieldsValue();
  };

  getStatus = () => (this.child.state.isSuccess);

  resetSlide = () => {
    const { moveInput } = this.props;
    moveInput.bind(this);
    // this.child.reset();
  };

  renderCaptchaImg = () => {
    const { firstKey, secondKey, form } = this.props;
    form.validateFields([firstKey, secondKey], {
      force: true
    }, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'login/queryCaptchaImg',
          payload: {
            capatcaKey: form.getFieldsValue([firstKey])[firstKey]
          }
        });
      } else {
        Toast.fail('请确认信息是否正确', 2);
      }
    });
  };

  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { loadPwd, firstIcon, secondIcon, firstKey, secondKey, login } = this.props,
      { captchaImg = '' } = login;
    return (
      <div>
        <div className={styles.user}>
          <div
            className={styles.icon}
            style={{
              backgroundImage: `url(${firstIcon})`
            }}
          />
          <InputItem
            placeholder="请输入学号/手机号/邮箱"
            onFocus={this.resetSlide}
            {...getFieldProps(firstKey, {
              initialValue: _cg('userloginname'),
              rules: [{ required: true, message: '请输入学号/手机号/邮箱' }]
            })}
            clear
            error={!!getFieldError(firstKey)}
            onErrorClick={() => {
              Toast.fail(getFieldError(firstKey));
            }}
          />
        </div>
        <WhiteSpace size="lg" />
        <div className={styles.pwd}>
          <div
            className={styles.icon}
            style={{
              backgroundImage: `url(${secondIcon})`
            }}
          />
          <InputItem
            type="password"
            placeholder="密码"
            onFocus={() => this.resetSlide()}
            {...getFieldProps(secondKey, {
              initialValue: loadPwd,
              rules: [{ required: true, message: '密码必须输入' }]
            })}
            clear
            error={!!getFieldError(secondKey)}
            onErrorClick={() => {
              Toast.fail(getFieldError(secondKey));
            }}
          />
        </div>
        <WhiteSpace size="lg" />
        {
          captchaImg !== '' ?
          <div className={styles.captcha}>
            <InputItem
              placeholder="验证码"
              onFocus={() => this.resetSlide()}
              {...getFieldProps('captchaCode', {
                initialValue: loadPwd,
                rules: [{ required: true, message: '验证码必须输入' }, {}]
              })}
              clear
              error={!!getFieldError('captchaCode')}
              onErrorClick={() => {
                Toast.fail(getFieldError('captchaCode'));
              }}
            />
            <img src={captchaImg} alt="" onClick={this.renderCaptchaImg} />
          </div>
                            :
          null
        }

        {/* <SlideVerification */}
        {/* onValidate={this.onValidate} */}
        {/* isValidate={this.state.isValidate} */}
        {/* onRef={this.onRef} */}
        {/* /> */}
      </div>
    );
  }
}

AccountForm.propTypes = {
  moveInput: PropTypes.func.isRequired
};

AccountForm.defaultProps = {
  loadPwd: '',
  firstIcon: user,
  secondIcon: lock,
  firstKey: 'username',
  secondKey: 'password'
};


export default connect(({ login }) => ({
  login
}))(createForm()(AccountForm));
