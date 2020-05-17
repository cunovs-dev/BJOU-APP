/**
 * @author Lowkey
 * @date 2019/03/12 15:46:01
 * @Description:
 */

import React from 'react';
import { Icon, ActivityIndicator } from 'antd-mobile';
import { getLocalIcon } from 'utils';
import PropTypes from 'prop-types';
import styles from './index.less';

const getIcon = (state, tracking) => {
  const newState = parseInt(state, 10);
  if (tracking === '2') {
    if (newState === 1) {
      return <Icon type={getLocalIcon('/checkbox/completion-auto-pass.svg')} />;
    } else if (newState === 2) {
      return <Icon type={getLocalIcon('/checkbox/completion-auto-pass.svg')} />;
    } else if (newState === 3) {
      return <Icon type={getLocalIcon('/checkbox/completion-auto-fail.svg')} />;
    }
    return <Icon type={getLocalIcon('/checkbox/completion-auto-n.svg')} />;
  } else {
    if (newState === 1) {
      return <Icon type={getLocalIcon('/checkbox/completion-manual-y.svg')} />;
    } else if (newState === 2) {
      return <Icon type={getLocalIcon('/checkbox/completion-manual-y.svg')} />;
    } else if (newState === 3) {
      return <Icon type={getLocalIcon('/checkbox/completion-auto-fail.svg')} />;
    }
    return <Icon type={getLocalIcon('/checkbox/completion-manual-n.svg')} />;
  }
};

class Checkbox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: -1
    };
  }

  downLoading = (i = -1) => {
    this.setState(() => ({
      loading: i
    }));
  };

  render () {
    const { state, tracking = '1', id } = this.props;
    if (tracking === '2') {
      return (
        <div className={styles.outer} >
          {getIcon(state, tracking)}
        </div >
      );
    } else if (tracking === '1') {
      return (
        <div
          className={styles.outer}
          onClick={(e) => this.props.handlerClick(this.downLoading, e)}
        >
          {this.state.loading === parseInt(id, 10) ? <ActivityIndicator animating /> : getIcon(state, tracking)}
        </div >
      );
    }
  }
}

Checkbox.defaultProps = {
  loading: false
};
Checkbox.propTypes = {
  handlerClick: PropTypes.func.isRequired,
};
export default Checkbox;
