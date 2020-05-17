/**
 * @author Lowkey
 * @date 2020/03/16 15:21:18
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import { InputItem, WhiteSpace, Icon, Toast } from 'components';
import { getLocalIcon } from 'utils';
import { _cg } from 'utils/cookie';
import SlideVerification from 'components/SlideVerification';
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

  getItemsValue = () => (this.props.form.getFieldsValue());

  getStatus = () => (this.child.state.isSuccess);

  resetSlide = () => {
    const { moveInput } = this.props;
    moveInput.bind(this);
    this.child.reset();
  };

  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { loadPwd, firstIcon, secondIcon, firstKey, secondKey, initialValue } = this.props;
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
            placeholder="请输入用户名/学号/邮箱"
            onFocus={this.resetSlide}
            {...getFieldProps(firstKey, {
              initialValue,
              rules: [{ required: true, message: '用户名必须输入' }, {
                min: 1,
                message:
                  '用户名小于1个字符'
              }]
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
              rules: [{ required: true, message: '密码必须输入' }, {
                min: 1,
                message:
                  '密码小于1个字符'
              }]
            })}
            clear
            error={!!getFieldError(secondKey)}
            onErrorClick={() => {
              Toast.fail(getFieldError(secondKey));
            }}
          />
        </div>
        <WhiteSpace size="lg" />
        <SlideVerification
          onValidate={this.onValidate}
          isValidate={this.state.isValidate}
          onRef={this.onRef}
        />
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
  secondKey: 'password',
  initialValue: _cg('userloginname')
};


export default (createForm()(AccountForm));
