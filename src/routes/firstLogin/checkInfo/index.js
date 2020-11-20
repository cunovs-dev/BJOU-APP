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
import { getLocalIcon } from 'utils';
import phone from 'themes/images/login/mobile.png';
import mail from 'themes/images/login/mail.png';
import styles from './index.less';

class CheckInfo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isDisabled: true
    };
  }

  onSubmit = () => {
    const { phoneNumber = '未绑定', mailNumber = '未绑定' } = this.props.firstLogin;
    const { userId = '' } = this.props.location.query;
    if (phoneNumber !== '未绑定' && mailNumber !== '未绑定') {
      this.props.dispatch(routerRedux.push({
        pathname: '/firstLogin/setPassword',
        query: {
          userId
        }
      }));
    } else {
      Toast.fail('请绑定手机号和邮箱');
    }
  };

  handlerBindClick = (type) => {
    const { userId = '' } = this.props.location.query;
    if (type === 'phone') {
      this.props.dispatch(routerRedux.push({
        pathname: '/firstLogin/phoneReset',
        query: {
          userId
        }
      }));
    } else if (type === 'mail') {
      this.props.dispatch(routerRedux.push({
        pathname: '/firstLogin/mailReset',
        query: {
          userId
        }
      }));
    }
  };

  render () {
    const { loading } = this.props;
    const { isDisabled } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    const { phoneNumber = '未绑定', mailNumber = '未绑定' } = this.props.firstLogin;
    return (
      <div>
        <Nav title="初次登录" dispatch={this.props.dispatch} />
        <div className={styles.title}>初次登录系统，需要确认手机和邮箱，并修改初始密码</div>
        <form className={styles.form}>
          <div className={styles.phone}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${phone})`
              }}
            />
            <InputItem
              disabled
              placeholder="请输入账号"
              {...getFieldProps('phone', {
                initialValue: phoneNumber
              })}
            />
            <div className={styles.status} onClick={() => this.handlerBindClick('phone')}>
              {phoneNumber !== '未绑定' ? '修改' : '绑定'}
            </div>
          </div>
          <WhiteSpace size="lg" />
          <div className={styles.mail}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${mail})`
              }}
            />
            <InputItem
              disabled
              placeholder="请输入账号"
              {...getFieldProps('mail', {
                initialValue: mailNumber
              })}
            />
            <div className={styles.status} onClick={() => this.handlerBindClick('mail')}>
              {mailNumber !== '未绑定' ? '修改' : '绑定'}
            </div>
          </div>
          <WhiteSpace size="lg" />
          <Button
            className={styles.next}
            loading={loading}
            type="primary"
            disabled={phoneNumber === '未绑定' || mailNumber === '未绑定'}
            onClick={this.onSubmit}
          >
            下一步
          </Button>
          <WhiteSpace size="lg" />
        </form>
      </div>
    );
  }
}


export default connect(({ firstLogin, loading }) => ({
  firstLogin,
  loading: loading.effects['firstLogin/queryResetTypes']
}))(createForm()(CheckInfo));
