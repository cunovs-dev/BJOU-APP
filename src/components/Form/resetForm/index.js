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
import { getRule } from 'utils';
import lock from 'themes/images/login/lock.png';
import styles from './index.less';


@connect(({ resetPassword }) => ({
  resetPassword
}))
@createForm()
class ResetForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  getItemsValue = () => (this.props.form.getFieldsValue());

  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { firstIcon, secondIcon, firstKey, secondKey, moveInput } = this.props,
      { rules = {} } = this.props.resetPassword;
    const { complexityRule = [], maxLength = 8, minLength = 6 } = rules;
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
            type="password"
            placeholder="请输入新密码"
            onFocus={moveInput.bind(this)}
            {...getFieldProps(firstKey, {
              rules: [
                { required: true, message: '密码不能为空' },
                { min: minLength, message: `用户名不能小于${minLength}个字符` },
                { max: maxLength, message: `用户名不能大于${maxLength}个字符` },
                {
                  validator: (rule, value) => {
                    if (getRule(complexityRule, value).result) {
                      return Promise.resolve();
                    }
                    return Promise.reject(`密码必须包含${getRule(complexityRule, value).message}`);
                  }
                }
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
            placeholder="请再次输入新密码"
            onFocus={moveInput.bind(this)}
            {...getFieldProps(secondKey, {
              rules: [
                { required: true, message: '密码不能为空' },
                { min: 1, message: '密码小于1个字符' },
                {
                  validator: (rule, value) => {
                    const { password } = this.props.form.getFieldsValue([firstKey]);
                    if (!value || password === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('密码不一致');
                  }
                }
              ]
            })}
            clear
            error={!!getFieldError(secondKey)}
            onErrorClick={() => {
              Toast.fail(getFieldError(secondKey));
            }}
          />
        </div>
      </div>
    );
  }
}

ResetForm.propTypes = {
  moveInput: PropTypes.func.isRequired
};

ResetForm.defaultProps = {
  firstIcon: lock,
  secondIcon: lock,
  firstKey: 'password',
  secondKey: 'newPassword'
};


export default ResetForm;
