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
import NotesModal from '../components/notesmodal';
import LoginWay from '../components/LoginWay';
import styles from './index.less';


class AccountLogin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      notesVisible: false
    };
  }

  onSubmit = () => {
    const { props: { form } } = this.formRef;
    form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'login/authentication',
          payload: this.formRef.getItemsValue()
        });
      } else {
        Toast.fail('请确认信息是否正确', 2);
      }
    });
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  notesModalClick = () => {
    this.setState({
      notesVisible: false
    });
  };

  showModal = () => {
    this.props.dispatch({
      type: 'login/queryLoginTips'
    });
    this.setState({
      notesVisible: true
    });
  };


  render () {
    const { content = '' } = this.props.login;
    const { loadingTips } = this.props;
    return (
      <form className={styles.form}>
        <AccountForm
          loadPwd={this.props.login.loadPwd}
          moveInput={this.moveInput}
          wrappedComponentRef={(form) => this.formRef = form}
        />
        <div className={styles.tips}>
          <span onClick={this.showModal}>
           登录提示
          </span>
          <Link
            to="/resetPassword"
            className={styles.forget}
          >
            忘记密码?
          </Link>
        </div>
        <WhiteSpace size="lg" />
        <div ref="button">
          {
            this.props.login.buttonState ? (
              <Button
                type="primary"
                onClick={this.onSubmit.bind(this)}
              >
                门户登录
              </Button>
            ) : <Button loading type="primary" disabled>
              <span style={{ color: '#fff' }}>登录中...</span>
            </Button>
          }
        </div>
        <WhiteSpace size="lg" />
        <LoginWay links="oldLogin" />
        <NotesModal visible={this.state.notesVisible} handleClick={this.notesModalClick}
                    content={loadingTips ? '加载中...' : content} />
      </form>
    );
  }
}


export default connect(({ login, loading, app }) => ({
  login,
  loadingTips: loading.effects['login/queryLoginTips'],
  app
}))(createForm()(AccountLogin));
