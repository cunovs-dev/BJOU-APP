/**
 * @author Lowkey
 * @date 2020/03/16 15:21:18
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import { InputItem, WhiteSpace, Icon, Toast } from 'components';
import { getLocalIcon, pattern } from 'utils';
import { _cg } from 'utils/cookie';
import mobile from 'themes/images/login/mobile.png';
import lock from 'themes/images/login/lock.png';
import styles from './index.less';


class LoginPhoneForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  onRef = (ref) => {
    this.child = ref;
  };

  getItemsValue = () => (this.props.form.getFieldsValue());


  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { loadPwd, firstIcon, secondIcon, firstKey, secondKey, initialValue, moveInput } = this.props;
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
            placeholder="请输入手机号码"
            onFocus={() => moveInput()}
            {...getFieldProps(firstKey, {
              initialValue,
              rules:
                [
                  { required: true, message: '请输入手机号码' },
                  { pattern: pattern('phone'), message: '手机号码格式有误！' }
                ]
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
            onFocus={() => moveInput()}
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
      </div>
    );
  }
}

LoginPhoneForm.propTypes = {
  moveInput: PropTypes.func.isRequired
};

LoginPhoneForm.defaultProps = {
  loadPwd: '',
  firstIcon: mobile,
  secondIcon: lock,
  firstKey: 'username',
  secondKey: 'password',
  initialValue: ''
};


export default (createForm()(LoginPhoneForm));
