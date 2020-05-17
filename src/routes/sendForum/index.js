import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'components/nav';
import UpLoad from 'components/upLoad';
import { connect } from 'dva';

const getGroups = (groups, id) => {
  const arr = [];
  cnIsArray(groups) && groups.filter(item => item.courseid === id)
    .map((data) => {
      arr.push({
        label: data.name || '',
        value: parseInt(data.id, 10)
      });
    });
  return arr;
};

class SendForum extends React.Component {
  constructor (props) {
    super(props);
  }

  onSubmit = (data) => {
    const { fileList, value } = data;
    if (fileList.length > 0) {
      this.props.dispatch({
        type: 'sendForum/uploadFile',
        payload: data,
      });
    } else {
      this.props.dispatch({
        type: 'sendForum/AddNewForum',
        payload: value,
      });
    }
  };

  render () {
    const { maxattachments = 0, maxbytes = 0, id, course, type = 'add', subject = '', discussionid } = this.props.location.query,
      { itemid } = this.props.sendForum,
      { sending } = this.props,
      { groups } = this.props.app;
    const props = {
      maxattachments,
      maxbytes,
      id,
      course,
      groups: getGroups(groups, course),
      onSubmit: this.onSubmit,
      itemid,
      loading: sending,
      type,
      subject,
      discussionid
    };
    return (
      <div >
        <Nav title={type === 'add' ? '开启一个新话题' : '回复'} dispatch={this.props.dispatch} />
        <UpLoad {...props} />
      </div >
    );
  }
}

SendForum.defaultProps = {};
SendForum.propTypes = {};

export default connect(({ loading, sendForum, forum, app }) => ({
  sending: loading.effects['sendForum/uploadFile'],
  sendForum,
  forum,
  loading,
  app
}))(SendForum);
