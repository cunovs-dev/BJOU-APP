import React from 'react';
import { Toast } from 'components';
import Nav from 'components/nav';
import { connect } from 'dva';
import ChatRoom from 'components/chatroom';

let Index = 0;
const Conversation = ({ location, dispatch, conversation, app }) => {
  const { name, fromuserid, avatar } = location.query;
  const { chartArr = [] } = conversation,
    { users: { userid, useravatar } } = app;
  const onSubmit = ({ content }) => {
      let key = `${Index++}`;
      const params = { details: content, isMySelf: true, key };
      if (content !== '') {
        dispatch({
          type: 'conversation/appendConversation',
          payload: {
            params: { ...params, state: 1 }
          }
        });
        dispatch({
          type: 'conversation/sendTalk',
          payload: {
            text: content,
            touserid: fromuserid,
            key,
            isMySelf: true,
            state: 1
          }
        });
      }
    },
    appendItems = (lists, id) => {
      const result = [];
      lists.map(list => {
        let isMySelf = list.hasOwnProperty('isMySelf') ? list.isMySelf : list.useridfrom * 1 === id * 1;
        result.push({ ...list, isMySelf });
      });
      return result;
    },
    props = {
      handlerSubmit: onSubmit,
      dispatch
    },
    getSelfAvatar = () => {

    };
  return (
    <div>
      <Nav title={name} dispatch={dispatch} hasShadow />
      <ChatRoom
        {...props}
        localArr={appendItems(chartArr, userid)}
        selfavatar={useravatar}
        avatar={avatar}
      />
    </div>
  );
};

Conversation.propTypes = {};
Conversation.defaultProps = {};
export default connect(({ loading, conversation, app }) => ({ loading, conversation, app }))(Conversation);
