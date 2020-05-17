/**
 * @author Lowkey
 * @date 2020/03/31 15:43:34
 * @Description: 验证吗
 */
import React from 'react';
import { createForm } from 'rc-form';
import PropTypes from 'prop-types';
import { InputItem, Button, Toast, Popover } from 'components';
import styles from './index.less';


class VerificationCode extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCodeSending: false,
      count: 60,
      isDisabled: false,
      visible: false
    };
    this.timer = null;
  }

  componentDidMount () {
    this.props.onRef(this);
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  onValidateCodeClick = (opt) => {
    const { codeClick } = this.props;
    this.startCountDown();
    this.setState({
      isCodeSending: true,
      isDisabled: true
    });
    codeClick(opt.props.value);
  };

  getItemsValue = () => (this.props.form.getFieldsValue());

  countDown = () => {
    this.setState({
      count: --this.state.count
    });
    if (this.state.count < 1) {
      clearInterval(this.timer);
      this.setState({
        isCodeSending: false,
        isDisabled: false,
        count: 60
      });
    }
  };
  startCountDown = () => {
    const that = this;
    this.timer = setInterval(() => {
      that.countDown();
    }, 1000);
  };

  getType = (receiveType) => {
    if (receiveType === 'phone') {
      return '短信验证码';
    } else if (receiveType === 'email') {
      return '邮箱验证码';
    } else {
      return '未知';
    }
  };

  renderOverlay = () => {
    const { overlay } = this.props;
    const arr = [];
    cnIsArray(overlay) && overlay.map((item, i) => (
      arr.push(
        (
          <Popover.Item
            key={i}
            value={item.receiveType}>{this.getType(item.receiveType)}</Popover.Item>
        )
      )
    ));
    return arr;
  };


  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { codeKey } = this.props;
    return (
      <div className={styles.codeBox}>
        <div className={styles.code}>
          <InputItem
            {...getFieldProps(codeKey, {
              initialValue: '',
              rules: [{ required: true, message: '验证码必须输入' }]
            })}
            placeholder="请输入验证码"
            clear
            error={!!getFieldError(codeKey)}
            onErrorClick={() => {
              Toast.fail(getFieldError(codeKey));
            }}
          >
            验证码
          </InputItem>
        </div>
        <Popover
          overlayClassName={styles.overlay}
          overlayStyle={{ color: 'currentColor' }}
          visible={this.state.visible}
          overlay={this.renderOverlay()}
          align={{
            overflow: { adjustY: 0, adjustX: 0 },
            offset: [0, 5]
          }}
          onSelect={this.onValidateCodeClick}
        >
          <Button
            type="ghost"
            inline
            size="small"
            className={styles.codeBtn}
            disabled={this.state.isDisabled}
          >
            {
              this.state.isCodeSending ?
              <span>{`${this.state.count}s重新获取`}</span>
                                       :
              <span>获取验证码</span>
            }
          </Button>
        </Popover>
      </div>
    );
  }
}

VerificationCode.propTypes = {
  codeClick: PropTypes.func.isRequired
};

VerificationCode.defaultProps = {
  codeKey: 'code',
  overlay: [{
    key: 1,
    receiveNumber: 'phone',
    receiveType: '短信验证码'
  },
    {
      key: 2,
      receiveNumber: 'mail',
      receiveType: '邮箱验证码'
    }]
};

export default createForm()(VerificationCode);
