/**
 * @author Lowkey
 * @date 2020/03/02 13:38:33
 * @Description:
 */

import React from 'react';
import { List, Icon, Modal, Button } from 'antd-mobile';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const renderDefaultSup = () => (
  <div className={styles.filter}>
    <span>筛选</span>
    <Icon type={getLocalIcon('/components/filter.svg')} color="#22609c" />
  </div>
);

class FilterModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handlerFilterClick = () => {
    this.setState({
      visible: true
    });
  };

  handlerCancelClick = () => {
    this.setState({
      visible: false
    });
  };

  handlerOkClick = () => {
    this.setState({
      visible: false
    });
  };

  render () {
    return (
      <div className={styles.outer}>
        <List>
          <List.Item extra={<span onClick={this.handlerFilterClick}>{this.props.sup}</span>}>
            <span className={styles.title}>
              {this.props.title}
            </span>
          </List.Item>
        </List>
        <Modal
          className={styles.modal}
          visible={this.state.visible}
          transparent
          popup
          maskClosable={false}
        >
          <div className={styles.content}>
            {this.props.form}
          </div>
          <div className={styles.modalFoot}>
            <Button inline size="small" style={{ marginRight: '20px' }} onClick={this.handlerCancelClick}>取消</Button>
            <Button type="primary" inline size="small" onClick={this.handlerOkClick}>确定</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

FilterModal.propTypes = {};
FilterModal.defaultProps = {
  content: '',
  sup: renderDefaultSup(),
  handlerClick: null
};
export default FilterModal;
