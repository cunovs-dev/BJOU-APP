import React from 'react';
import PropTypes from 'prop-types';
import { getTitle } from 'utils';
import { WhiteSpace, Modal, Toast } from 'components';
import { handleElementTagAClick, handlerDivInnerHTMLClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'discription';

class Discription extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount () {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
  }

  render () {
    const { dispatch, content, courseId } = this.props,

      getContents = () => {
        return {
          __html: content,
        };
      },
      handleDivClick = (e) => {
        e.stopPropagation();
        //处理绑定的script脚本
        // if (cnExecCallbackFn) {
        //   let targetEl = e.target,
        //     counts = 0;
        //   while (targetEl != null && !targetEl.hasAttribute('exec_script_func')) {
        //     targetEl = targetEl.parentElement;
        //     if (counts++ >= 3) {
        //       break;
        //     }
        //   }
        //   if (targetEl != null && targetEl.hasAttribute('exec_script_func') === true) {
        //     cnExecFunction(targetEl.getAttribute('exec_script_func'));
        //   }
        // }
        if (e.target.tagName === 'IMG') {
          let videoUrl = e.target.getAttribute('video-data-url');
          if (videoUrl) {
            cnPlayVideo(videoUrl, (res) => {
              if (res.success === false) {
                Modal.alert(res.message);
              } else if (res.message) {
                Toast.info(res.message);
              }
            });
            return;
          }
        }
        handlerDivInnerHTMLClick(e, courseId, dispatch);
      },
      onClose = () => {
        dispatch({
          type: `${pathname}/updateState`,
          payload: {
            isOpen: false,
          },
        });
      };

    return (

      <div >
        <div className={styles[`${PrefixCls}-outer`]} >
          <WhiteSpace size="sm" />
          <div className={styles[`${PrefixCls}-outer-content`]} >
            <div dangerouslySetInnerHTML={getContents()} onClick={handleDivClick} ref={ref => {
              this.contentElement = ref;
            }} />
          </div >
        </div >
      </div >
    );
  }
}

Discription.propTypes = {
  dispatch: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

export default Discription;
