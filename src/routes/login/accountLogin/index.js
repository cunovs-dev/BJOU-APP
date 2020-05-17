/* eslint-disable no-return-assign */
/**
 * @author Lowkey
 * @date 2020/03/13 16:14:16
 * @Description: 改测嵌套路由
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { InputItem, WhiteSpace, Button, Toast, Icon } from 'components';
import { Link } from 'dva/router';
import AccountForm from 'components/Form/accountForm';
import LoginWay from '../components/LoginWay';
import styles from './index.less';


class AccountLogin extends React.Component {
  constructor (props) {
    super(props);
  }

  onSubmit = () => {
    const { state: { isValidate }, getStatus } = this.formRef;
    if (isValidate && getStatus()) {
      this.props.dispatch({
        type: 'login/authentication',
        payload: this.formRef.getItemsValue()
      });
    } else if (!getStatus()) {
      Toast.fail('请完成滑块验证', 2);
    } else {
      Toast.fail('请输入正确的信息', 2);
    }
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };


  render () {
    return (
      <form className={styles.form}>
        <AccountForm
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
        <LoginWay links="phoneLogin" />
      </form>
    );
  }
}


export default connect(({ login, loading, app }) => ({
  login,
  loading,
  app
}))(createForm()(AccountLogin));
