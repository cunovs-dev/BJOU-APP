import React from 'react';
import { Modal } from 'components';

const alert = Modal.alert;
const commonMoadl = (message = '未知错误，请稍后再试。') => {
  const alertInstance = alert('操作失败', message, [
    { text: '知道了', onPress: () => console.log('ok') },
  ]);
  setTimeout(() => {
    alertInstance.close();
  }, 15000);
};

export default commonMoadl;
