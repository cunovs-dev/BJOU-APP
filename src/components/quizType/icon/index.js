import React from 'react';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';

const ResultIcon = (props) => {
  if (props.currect === '不正确' || props.currect === '错误') {
    return (
      <Icon
        style={{ marginLeft: '10px' }}
        type={getLocalIcon('/components/incurrect.svg')}
        color="red"
        size="xs"
      />
    );
  }
  if (props.currect === '正确') {
    return (
      <Icon
        style={{ marginLeft: '10px' }}
        type={getLocalIcon('/components/currect.svg')}
        color="green"
        size="xs"
      />
    );
  }
  return null;
};

export default ResultIcon;
