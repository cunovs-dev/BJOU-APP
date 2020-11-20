/**
 * @author Lowkey
 * @date 2020/03/16 11:39:18
 * @Description:
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { InputItem, WhiteSpace, WingBlank, Button, Toast, ActivityIndicator, Icon } from 'components';
import MailForm from 'components/Form/mailForm';
import Nav from 'components/nav';
import { getValideError } from 'utils';
import ResetType from '../components';
import styles from './index.less';


class MailReset extends React.Component {
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
    this.formRef.props.form.validateFields(['code'], {
      force: true,
      first: true
    }, (error) => {
      if (!error) {
        const { userId = '' } = this.props.location.query;
        const { code } = this.formRef.getItemsValue();
        this.props.dispatch({
          type: 'resetPassword/verifyCode',
          payload: {
            userId,
            code
          }
        });
      } else {
        Toast.fail(getValideError(error));
      }
    });
  };

  codeClick = () => {
    const { userId = '' } = this.props.location.query;
    this.props.dispatch({
      type: 'resetPassword/sendCode',
      payload: {
        receiveType: 'email',
        userId
      }
    });
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  handlerPrev = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  handlerClick = () => {
    this.props.dispatch(routerRedux.replace({
      pathname: '/resetPassword/phoneReset',
      query: {
        ...this.props.location.query
      }
    }));
  };

  render () {
    const { loading } = this.props;
    const { email = '', phone = '' } = this.props.location.query;
    return (
      <div>
        <Nav title="找回密码" dispatch={this.props.dispatch} />
        {
          phone !== '' && email !== ''
          ?
          <ResetType type="email" handlerClick={this.handlerClick} />
          :
          null
        }
        <form className={styles.form}>
          <MailForm
            emailNumber={email}
            disabled
            moveInput={this.moveInput}
            wrappedComponentRef={(form) => this.formRef = form}
            codeClick={this.codeClick}
          />
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <div className={styles.button} ref="button">
            <Button className={styles.prev} inline onClick={this.handlerPrev}>
              上一步
            </Button>
            <Button
              className={styles.next}
              loading={loading}
              inline
              type="primary"
              onClick={this.onSubmit}
            >
              下一步
            </Button>
          </div>
          <WhiteSpace size="lg" />
        </form>
      </div>
    );
  }
}


export default connect(({ login, loading }) => ({
  login,
  loading: loading.effects['resetPassword/verifyCode']
}))(createForm()(MailReset));
