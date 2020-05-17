import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const icon = {
  complete: '/components/wancheng.svg',
  unuseful: '/components/unuseful.svg',
  notopen: '/components/notopen.svg',
};

const StatusBox = (props) => (
  <div className={styles.outer} style={{ borderColor: props.color }} >
    <Icon type={getLocalIcon(icon[props.status])} color={props.color} />
    <span >{props.content}</span >
  </div >
);
StatusBox.PropTypes = {
  status: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,

};

StatusBox.defaultProps = {
  status: 'complete ',
  color: '#1eb259',
  content: '您已经完成此活动'
};
export default StatusBox;
