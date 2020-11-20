/* eslint-disable no-return-assign */
/**
 * @author Lowkey
 * @date 2020/03/13 16:14:16
 * @Description: 手机登录
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { WhiteSpace, Button, Toast } from 'components';
import { Link } from 'dva/router';
import LoginPhoneForm from 'components/Form/loginPhoneForm';
import LoginWay from '../components/LoginWay';
import styles from './index.less';


class PhoneLogin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: false
    };
    this.timer = null;
  }

  onSubmit = () => {
    this.props.dispatch({
      type: 'login/authentication',
      payload: this.formRef.getItemsValue()
    });
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };


  render () {
    return (
      <form className={styles.form}>
        <LoginPhoneForm
          loadPwd={this.props.login.loadPwd}
          moveInput={this.moveInput}
          wrappedComponentRef={(form) => this.formRef = form}
        />
        <WhiteSpace size="lg" />
        <Link
          to="/resetPassword"
          className={styles.forget}
        >
          忘记密码?
        </Link>
        <WhiteSpace size="lg" />
        <div ref="button">
          {
            this.props.login.buttonState ? (
              <Button
                type="primary"
                onClick={this.onSubmit.bind(this)}
              >
                登录
              </Button>
            ) : <Button loading type="primary" disabled>
              <span style={{ color: '#fff' }}>登录中...</span>
            </Button>
          }
        </div>
        <WhiteSpace size="lg" />
        <LoginWay links="accountLogin" />
      </form>
    );
  }
}


export default connect(({ login, loading, app }) => ({
  login,
  loading,
  app
}))(createForm()(PhoneLogin));
