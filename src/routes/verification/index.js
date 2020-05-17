import React from 'react';
import { connect } from 'dva';
import Nav from 'components/nav';
import VerificationCode from 'components/VerificationCode';
import { WhiteSpace, Button, List, InputItem, Toast } from 'components';
import { config, cookie, pattern } from 'utils';
import styles from './index.less';

let child;
const { userTag: { portalUserId } } = config,
  { _cg } = cookie;
const Verification = ({ dispatch, location, verification }) => {
  const { name = '' } = location.query,
    { data } = verification,
    onValidateCodeClick = (val) => {
      dispatch({
        type: 'verification/sendCode',
        payload: {
          userId: _cg(portalUserId),
          receiveType: val
        }
      });
    },

    onRef = (ref) => {
      child = ref;
    },

    handlerClick = () => {
      if (child.getItemsValue()) {
        const { code } = child.getItemsValue();
        if (code !== '') {
          dispatch({
            type: 'verification/verifyCode',
            payload: {
              userId: _cg(portalUserId),
              code
            }
          });
        } else {
          Toast.fail('请输入验证码');
        }
      }
    },

    getType = (receiveType) => {
      if (receiveType === 'phone') {
        return '当前手机';
      } else if (receiveType === 'email') {
        return '当前邮箱';
      } else {
        return '未知';
      }
    };
  return (
    <div className={styles.container}>
      <Nav title={name} dispatch={dispatch} />
      <List>
        {
          cnIsArray(data) && data.map((item, i) => (
            <InputItem key={i} disabled value={item.receiveNumber}>{getType(item.receiveType)}</InputItem>
          ))
        }
        <VerificationCode
          codeClick={onValidateCodeClick}
          overlay={data}
          onRef={onRef}
        />
      </List>
      <WhiteSpace size="lg" />
      <WhiteSpace size="lg" />
      <WhiteSpace size="lg" />
      <div className={styles.wrapper}>
        <Button
          className={styles.btn}
          type="primary"
          onClick={handlerClick}
        >下一步</Button>
      </div>
    </div>
  );
};
export default connect(({ loading, verification }) => ({
  loading,
  verification
}))(Verification);
