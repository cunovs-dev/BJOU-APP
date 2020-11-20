/* WKC
 * Modal通知消息的弹出窗口,内容是用ref取的 */
import React from 'react';
import { Modal, NoticeBar, Icon } from 'antd-mobile';
import { getLocalIcon, deleteHtmlTag } from 'utils';


class Notice extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <NoticeBar
        marqueeProps={{ loop: true }}
        mode="closable"
        style={{ background: '#fdeeb9' }}
        action={<Icon onClick={this.props.handlerClose} type="cross" size="xs" />}
      >
        <div
          onClick={this.props.handlerClick}
          style={{ width: '100%' }}
          // dangerouslySetInnerHTML={{ __html: this.props.content }}
        >
          {deleteHtmlTag(this.props.content)}
        </div>
      </NoticeBar>
    );
  }
}

Notice.propTypes = {};
Notice.defaultProps = {
  content: '',
  handlerClick: null,
  handlerClose: null
};
export default Notice;
