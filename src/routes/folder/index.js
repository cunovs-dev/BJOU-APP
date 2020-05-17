import React from 'react';
import { connect } from 'dva';
import Nav from 'components/nav';
import FolderList from 'components/folderList';
import { List } from 'components';

const Comp = ({ location, dispatch, folder }) => {
  const { name = '', cmid = '' } = location.query;
  const { contents } = folder;
  return (
    <div >
      <Nav title={name} dispatch={dispatch} />
      <FolderList data={contents} fileIdPrefix={cmid} />
    </div >
  );
};

export default connect(({ loading, folder }) => ({
  loading,
  folder,
}))(Comp);
