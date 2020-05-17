import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'components/nav';
import { SearchBar, WhiteSpace, Accordion, List } from 'components';
import { connect } from 'dva';
import { contactsRow } from 'components/row';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'contacts';

const Contacts = ({ location, dispatch, contacts }) => {
  const { name } = location.query,
    { onLine = [], offLine = [] } = contacts;
  return (
    <div >
      <Nav title={name} dispatch={dispatch} hasShadow />
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-searchbox`]} >
        {/* <SearchBar placeholder="搜索联系人" /> */}
      </div >
      <div className={styles[`${PrefixCls}-contactsbox`]} >
        <Accordion defaultActiveKey="0" className="my-accordion" >
          <Accordion.Panel header={<span style={{ color: '#22609c' }} >{`在线(${onLine.length})`}</span >} >
            {contactsRow(onLine, handlerChangeRouteClick, dispatch)}
          </Accordion.Panel >
          <WhiteSpace />
          <Accordion.Panel header={`离线(${offLine.length})`} >
            {contactsRow(offLine, handlerChangeRouteClick, dispatch)}
          </Accordion.Panel >
        </Accordion >
      </div >
    </div >
  );
};

Contacts.propTypes = {};
Contacts.defaultProps = {};
export default connect(({ loading, contacts }) => ({ loading, contacts }))(Contacts);
