import React from 'react';
import PropTypes from 'prop-types';
import WxImageViewer from 'react-wx-images-viewer';
import { getTitle } from 'utils';
import { WhiteSpace, Modal, Toast } from 'components';
import { handleElementTagAClick, handlerDivInnerHTMLClick, handlerChangeRouteClick } from 'utils/commonevents';
import Nav from '../nav';
import styles from './index.less';

const PrefixCls = 'page';

class CoursePage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  componentWillMount () {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
  }

  execCallbackFnc () {

  }

  showAlert = (text) => {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        footer={[{ text: '我知道了', onPress: () => this.setState({ visible: false }) }]}
      >
          {text}
      </Modal>
    );
  };

  render () {
    const { propDatas, dispatch, pathname, cmid, alertInfo } = this.props;
    const { data: { content = '', cm = {}, name: pageName = '加载中...', _useScriptFunc = false }, isOpen = false, viewImages = [], viewImageIndex = -1, queryName = '' } = propDatas,
      { course: courseId = '' } = cm,
      getContents = () => {
        return {
          __html: content
        };
      },
      handleDivClick = (e) => {
        e.stopPropagation();
        //处理绑定的script脚本
        if (cnExecFunction) {
          let targetEl = e.target,
            counts = 0;
          while (targetEl != null && !targetEl.hasAttribute('exec_script_func')) {
            targetEl = targetEl.parentElement;
            if (counts++ >= 3) {
              break;
            }
          }
          if (targetEl != null && targetEl.hasAttribute('exec_script_func') === true) {
            cnExecFunction(targetEl.getAttribute('exec_script_func'));
          }
        }
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
          let src = e.target.src,
            curImageIndex = -1;
          if (src && (curImageIndex = viewImages.indexOf(src)) !== -1) {
            dispatch({
              type: `${pathname}/updateState`,
              payload: {
                isOpen: true,
                viewImageIndex: curImageIndex
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
            isOpen: false
          }
        });
      };

    return (

      <div>
        <Nav
          title={getTitle(queryName || pageName)}
          dispatch={dispatch}
          renderNavRight={
            <span
              style={{ color: '#fff' }}
              onClick={handlerChangeRouteClick.bind(this, 'opinion', {
                name: '课程反馈', courseId, resourcesName: pageName || queryName, cmid
              }, dispatch)}
            >
              课程反馈
            </span>
          }
        />
        <div className={styles[`${PrefixCls}-outer`]}>
          <div className={styles[`${PrefixCls}-outer-title`]}>
            {queryName || pageName}
          </div>
          <WhiteSpace size="sm" />
          <div className={styles[`${PrefixCls}-outer-content`]}>
            <div dangerouslySetInnerHTML={getContents()} onClick={handleDivClick} ref={ref => {
              this.contentElement = ref;
            }} />
          </div>
        </div>
        {
          isOpen && viewImageIndex !== -1 ?
          <WxImageViewer onClose={onClose} urls={viewImages} index={viewImageIndex} /> : ''
        }
        {
          alertInfo && _useScriptFunc && this.showAlert(alertInfo.info)
        }
      </div>
    );
  }
}

CoursePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  propDatas: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired
};

export default CoursePage;
