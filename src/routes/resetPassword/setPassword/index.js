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
import ResetForm from 'components/Form/resetForm';
import Nav from 'components/nav';
import styles from './index.less';


class SetPassword extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: false
    };
    this.timer = null;
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'resetPassword/queryPasswordRule',
    });
  }

  onSubmit = () => {
    const { code = '', userId = '' } = this.props.location.query;
    this.formRef.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        const { password } = this.formRef.getItemsValue();
        this.props.dispatch({
          type: 'resetPassword/resetPassword',
          payload: {
            userId,
            password,
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

  handlerPrev = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  render () {
    const { loading } = this.props;
    return (
      <div>
        <Nav title="找回密码" dispatch={this.props.dispatch} />
        <div className={styles.title}>重置密码</div>
        <form className={styles.form}>
          <ResetForm
            moveInput={this.moveInput}
            wrappedComponentRef={(form) => this.formRef = form}
          />
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
              完 成
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
  loading: loading.effects['resetPassword/resetPassword']
}))(createForm()(SetPassword));
