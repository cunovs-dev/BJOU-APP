import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Picker,
  List
} from 'components';
import styles from './index.less';

const getGroups = (groups) => {
  const arr = [];
  cnIsArray(groups) && groups
    .map((data, i) => {
      arr.push({
        label: data.name,
        value: data.id
      });
    });
  return arr;
};

class GroupSelect extends Component {

  state = {
    val: []
  };

  changeType = (val) => {
    this.setState({
      val
    });
    this.props.onOk(val);
  };

  render () {
    const { groups } = this.props.app;
    return (
      <List className={styles.outer} >
        <Picker
          data={getGroups(groups)}
          cols={1}
          value={this.state.val}
          onOk={this.changeType}
        >
          <List.Item arrow="horizontal" >选择小组：</List.Item >
        </Picker >
      </List >
    );
  }
}
GroupSelect.PropTypes = {
  onOk: PropTypes.func.isRequired,

};

GroupSelect.defaultProps = {

};
export default connect(({ app }) => ({
  app,
}))(GroupSelect);
