import React from 'react';
import styles from './index.less';

const InnerHtml = (props) => {
  const PrefixCls = 'innerhtml';
  const getContents = () => {
    return {
      __html: props.data,
    };
  };
  return (
    <div className={styles[`${PrefixCls}-outer`]} dangerouslySetInnerHTML={getContents()} onClick={props.handleClick} />
  );
};


InnerHtml.defaultProps = {
  data: '',
  handleClick: null,
};
export default InnerHtml;
