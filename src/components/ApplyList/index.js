import React from 'react';
import { Icon, List } from 'components';
import { getLocalIcon } from 'utils';
import PropTypes from 'prop-types';
import styles from './index.less';

const ApplyList = (props) => {
  const { applyType, courseName, applyShowType, applyId, applyState } = props.params;
  const getStyle = (type = 'bgColor') => {
    switch (applyShowType) {
      case 1:
        return { bgColor: '#e1f4ff', icon: <Icon type={getLocalIcon('/apply/exemption.svg')} /> }[type];
      case 2:
        return { bgColor: '#e7e2fb', icon: <Icon type={getLocalIcon('/apply/editor.svg')} /> }[type];
      case 3:
        return { bgColor: '#ffe6d3', icon: <Icon type={getLocalIcon('/apply/studentStatus.svg')} /> }[type];
      default :
        return { bgColor: '#ffe6d3', icon: <Icon type={getLocalIcon('/apply/editor.svg')} /> }[type];
    }
  };
  const getState = () => {
    switch (applyState) {
      case '申请中':
        return '#ff5656';
      case '已完成':
        return '#2ff72f';
      default :
        return '#ff5656';
    }
  };
  return (
    <div key={applyId} className={styles.container} style={{ background: getStyle() }}>
      <div className={styles.content}>
        {getStyle('icon')}
        <div className={styles.type}>
          <div className={styles.text}>
            <div>{applyType}</div>
            <div className={styles.course}>{courseName}</div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.circle} style={{ borderColor: getState() }}>
          <div className={styles.inner} style={{ borderColor: getState(), color: getState() }}>
            {applyState}
          </div>
        </div>
      </div>
    </div>
  );
};
ApplyList.PropTypes = {
  params: PropTypes.object.isRequired
};

ApplyList.defaultProps = {
  params: {}
};
export default ApplyList;
