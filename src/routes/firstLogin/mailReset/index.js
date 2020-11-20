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
import { config, cookie, getValideError } from 'utils';
import styles from './index.less';

const { userTag: { portalToken } } = config,
  { _cg } = cookie;

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
        this.props.dispatch({
          type: 'firstLogin/updatePhoneOrEmail',
          payload: {
            access_token: _cg(portalToken),
            ...this.formRef.getItemsValue()
          }
        });
      } else {
        Toast.fail(getValideError(error));
      }
    });
  };

  codeClick = () => {
    const { userId = '' } = this.props.location.query;
    const { email = '' } = this.formRef.getItemsValue();
    this.props.dispatch({
      type: 'firstLogin/sendCodeWithToken',
      payload: {
        access_token: _cg(portalToken),
        userId,
        email
      }
    });
  };

  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  render () {
    const { loading } = this.props;
    return (
      <div>
        <Nav title="绑定邮箱" dispatch={this.props.dispatch} />
        <form className={styles.form}>
          <MailForm
            emailNumber=""
            moveInput={this.moveInput}
            wrappedComponentRef={(form) => this.formRef = form}
            codeClick={this.codeClick}
          />
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <div ref="button">
            <Button
              className={styles.next}
              loading={loading}
              type="primary"
              onClick={this.onSubmit}
            >
              绑定
            </Button>
          </div>
          <WhiteSpace size="lg" />
        </form>
      </div>
    );
  }
}


export default connect(({ firstLogin, loading }) => ({
  firstLogin,
  loading: loading.effects['firstLogin/updatePhoneOrEmail']
}))(createForm()(MailReset));
