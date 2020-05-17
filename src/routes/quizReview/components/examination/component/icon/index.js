import React from 'react';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';

const ResultIcon = (props) => {
  if (props.currect === '不正确') {
    return <Icon type={getLocalIcon('/components/incurrect.svg')} color="red" />;
  }
  if (props.currect === '正确') {
    return <Icon type={getLocalIcon('/components/currect.svg')} color="green" />;
  }
  return null;
};

export default ResultIcon;
