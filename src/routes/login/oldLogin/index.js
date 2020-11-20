import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { InputItem, WhiteSpace, WingBlank, Button, Toast, ActivityIndicator, Icon, Modal } from 'components';
import { getLocalIcon } from 'utils';
import { _cg } from 'utils/cookie';
import { routerRedux } from 'dva/router';
import user from 'themes/images/login/user.png';
import pwd from 'themes/images/login/lock.png';
import LoginWay from '../components/LoginWay';
import styles from './index.less';


const PrefixCls = 'oldLogin';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  onSubmit = () => {
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'oldLogin/login',
          payload: {
            ...this.props.form.getFieldsValue()
          },
          callback: this.showModal
        });
      } else {
        Toast.fail('请确认信息是否正确', 2);
      }
    });
  };
  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  onOk = () => {
    this.props.dispatch({
      type: 'oldLogin/updateState',
      payload: {
        showModal: false
      }
    });
    this.props.dispatch(routerRedux.push({
      pathname: '/login/accountLogin',
    }));
  };


  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      userKey = 'username',
      powerKey = 'password',
      { oldLogin: { showModal, text } } = this.props;
    return (
      <div className={styles[`${PrefixCls}-container`]}>
        <div className={styles[`${PrefixCls}-logobox`]}>
          <form className={styles[`${PrefixCls}-form`]}>
            <WingBlank size="md">
              <div className={styles[`${PrefixCls}-user`]}>
                <InputItem
                  placeholder="用户名"
                  onFocus={this.moveInput.bind(this)}
                  {...getFieldProps(userKey, {
                    initialValue: _cg('userloginname'),
                    rules: [{ required: true, message: '用户名必须输入' }, {
                      min: 1,
                      message:
                        '用户名小于1个字符'
                    }]
                  })}
                  clear
                  error={!!getFieldError(userKey)}
                  onErrorClick={() => {
                    Toast.fail(getFieldError(userKey));
                  }}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${user})`
                    }}
                  />
                </InputItem>
              </div>
            </WingBlank>
            <WhiteSpace size="lg"/>
            <WingBlank size="md">
              <div className={styles[`${PrefixCls}-pwd`]}>
                <InputItem
                  type="password"
                  placeholder="密码"
                  onFocus={this.moveInput.bind(this)}
                  {...getFieldProps(powerKey, {
                    initialValue: this.props.oldLogin.loadPwd,
                    rules: [{ required: true, message: '密码必须输入' }, {
                      min: 1,
                      message:
                        '密码小于1个字符'
                    }]
                  })}
                  clear
                  error={!!getFieldError(powerKey)}
                  onErrorClick={() => {
                    Toast.fail(getFieldError(powerKey));
                  }}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${pwd})`
                    }}
                  />
                </InputItem>
              </div>
              <WhiteSpace size="lg" />
            </WingBlank>
            <WingBlank size="md">
              <div ref="button">
                {
                  this.props.oldLogin.buttonState ? (
                    <Button
                      type="primary"
                      className={styles.button}
                      onClick={this.onSubmit.bind(this)}
                    >
                      学习平台登录
                    </Button>
                  ) : <Button loading type="primary" className="am-button-borderfix" disabled>
                    <span style={{ color: '#fff' }}>登录中...</span>
                  </Button>
                }
              </div>
            </WingBlank>
            <WhiteSpace size="lg" />
          </form>
          <LoginWay links="accountLogin" />
        </div>
        <Modal
          visible={showModal}
          transparent
          maskClosable={false}
          footer={[{ text: '确定', onPress: () => this.onOk() }]}
        >
          {text}
        </Modal>
      </div>
    );
  }
}


export default connect(({ oldLogin, loading, app }) => ({
  oldLogin,
  loading,
  app
}))(createForm()(Login));
