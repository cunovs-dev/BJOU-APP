/**
 * @author Lowkey
 * @date 2020/03/16 11:39:18
 * @Description:
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { InputItem, WhiteSpace, WingBlank, Button, Toast, ActivityIndicator, Icon } from 'components';
import { routerRedux } from 'dva/router';
import PhoneForm from 'components/Form/phoneForm';
import Nav from 'components/nav';
import ResetType from '../components';
import styles from './index.less';

class PhoneReset extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: true
    };
    this.timer = null;
  }


  onSubmit = () => {
    this.formRef.props.form.validateFields(['code'], {
      force: true
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
        Toast.fail('请检查输入的信息');
      }
    });
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  handlerClick = () => {
    this.props.dispatch(routerRedux.replace({
      pathname: '/resetPassword/mailReset',
      query: {
        ...this.props.location.query
      }
    }));
  };

  handlerPrev = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  codeClick = () => {
    const { userId = '' } = this.props.location.query;
    this.props.dispatch({
      type: 'resetPassword/sendCode',
      payload: {
        userId,
        receiveType: 'phone'
      }
    });
  };

  render () {
    const { loading } = this.props;
    const { phone = '', email = '' } = this.props.location.query;
    const { isDisabled } = this.state;
    return (
      <div>
        <Nav title="找回密码" dispatch={this.props.dispatch} />
        {
          phone !== '' && email !== ''
          ?
          <ResetType type="phone" handlerClick={this.handlerClick} />
          :
          null
        }
        <form className={styles.form}>
          <PhoneForm
            phoneNumber={phone}
            disabled
            moveInput={this.moveInput}
            wrappedComponentRef={(form) => this.formRef = form}
            codeClick={this.codeClick}
          />
          <WhiteSpace size="lg" />
          <div className={styles.button} ref="button">
            <Button className={styles.prev} onClick={this.handlerPrev} inline>
              上一步
            </Button>
            <Button
              className={styles.next}
              loading={loading}
              inline
              type="primary"
              // disabled={isDisabled}
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


export default connect(({ resetPassword, loading }) => ({
  resetPassword,
  loading: loading.effects['resetPassword/verifyCode']
}))(createForm()(PhoneReset));
