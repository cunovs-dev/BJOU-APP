/**
 * @author Lowkey
 * @date 2020/03/16 11:39:18
 * @Description:
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { InputItem, WhiteSpace, Button, Toast, Icon } from 'components';
import { routerRedux } from 'dva/router';
import Nav from 'components/nav';
import { getLocalIcon, pattern, getValideError } from 'utils';
import user from 'themes/images/login/user.png';
import styles from './index.less';

class QueryUser extends React.Component {
  moveInput = () => { // 解决android键盘挡住input
    this.refs.button.scrollIntoView(true);
  };

  handlerPrev = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  onSubmit = () => {
    this.props.form.validateFields({
      force: true,
      first: true
    }, (error) => {
      if (!error) {
        this.props.dispatch({
          type: 'resetPassword/queryAccount',
          payload: {
            ...this.props.form.getFieldsValue()
          }
        });
      } else {
        Toast.fail(getValideError(error));
      }
    });
  };

  render () {
    const { loading } = this.props;
    const { getFieldProps, getFieldError, getFieldsValue } = this.props.form;
    console.log(getFieldsValue(['accountName']).accountName === undefined);
    return (
      <div>
        <Nav title="找回密码" dispatch={this.props.dispatch} />
        <div className={styles.title}>账号输入</div>
        <form className={styles.form}>
          <div className={styles.user}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${user})`
              }}
            />
            <InputItem
              placeholder="请输入账号"
              onFocus={() => this.moveInput()}
              {...getFieldProps('accountName', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入账号' }
                ]
              })}
              clear
              error={!!getFieldError('accountName')}
              onErrorClick={() => {
                Toast.fail(getFieldError('accountName'));
              }}
            />
          </div>
          <WhiteSpace size="lg" />
          <div className={styles.button} ref="button">
            <Button className={styles.prev} onClick={this.handlerPrev} inline>
              返回
            </Button>
            <Button
              className={styles.next}
              loading={loading}
              inline
              type="primary"
              disabled={getFieldsValue(['accountName']).accountName === ''}
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
  loading: loading.effects['resetPassword/queryAccount'] || loading.effects['resetPassword/queryResetTypes']
}))(createForm()(QueryUser));
