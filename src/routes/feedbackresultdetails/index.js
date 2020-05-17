import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Icon, Card, NoticeBar } from 'components';
import { getLocalIcon } from 'utils';
import Nav from 'components/nav';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'feedbackresult';

function FeedBackResult ({ location, dispatch, feedbackresult }) {
  const { name = '', id = '', anonymous } = location.query,
    { data } = feedbackresult;
  const { anonattempts, attempts } = data,
    getAnswer = () => {
      if (anonymous === '2') {
        return attempts.find(item => item.id == id).responses;
      } else if (anonymous === '1') {
        return anonattempts.find(item => item.id == id).responses;
      }
      return [];
    };
  return (
    <div >
      <Nav title={name} hasShadow dispatch={dispatch} />
      <NoticeBar mode="closable" icon={null} marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} >只显示10条最新的回答，查看完整的回答请去PC端下载</NoticeBar >
      <WhiteSpace />
      <div className={styles[`${PrefixCls}-outer`]} >
        {getAnswer() && getAnswer()
          .map(item => (
            <Card full style={{ marginBottom: '10px' }} >
              <Card.Header
                title={item.name}
              />
              <Card.Body >
                {item.printval}
              </Card.Body >
            </Card >
          ))}
      </div >
    </div >
  );
}

export default connect(({ loading, feedbackresult }) => ({
  loading,
  feedbackresult,
}))(FeedBackResult);
