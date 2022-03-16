import React from 'react';
import Nav from 'components/nav';
import { ActivityIndicator, Modal, Toast } from 'components';
import { routerRedux } from 'dva/router';
import AddHomework from 'components/addHomework';
import { connect } from 'dva';
import styles from '../../themes/default.less';

const alert = Modal.alert;

class HomeWorkAdd extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount () {
    document.documentElement.scrollTop = 0;
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
  }

  onSubmit = (data = {}) => {
    let { fileList = [], value = {}, hasFilesChange = false } = data;
    if (!hasFilesChange && fileList.length === 0 && Object.keys(value).length <= 1) {
      this.props.dispatch(routerRedux.goBack());
      Toast.success('保存成功');
      return;
    }
    if (fileList.length > 0) {
      const { coursesId = '' } = this.props.location.query;
      fileList = fileList.map(f => {
        if (typeof f === 'object' && f.filenamePrefix) {
          f.filenamePrefix = f.filenamePrefix.startsWith(coursesId + '_') ? f.filenamePrefix : `${coursesId}${f.filenamePrefix}`;
        }
        return f;
      });
      this.props.dispatch({
        type: 'homeworkadd/updateState',
        payload: {
          animating: true
        }
      });
      this.props.dispatch({
        type: 'homeworkadd/uploadFile',
        payload: {
          ...data,
          fileList
        }
      });
    } else {
      const clearAllFile = hasFilesChange === true ? { itemid: 0, filemanager: 1 } : {};
      const { onlinetext } = value;
      const str = onlinetext.replace(/\n/g, '<br/>').replace(/( )/g, '\u3000');

      this.props.dispatch({
        type: 'homeworkadd/addHomework',
        payload: {
          ...value,
          onlinetext: str,
          ...clearAllFile
        },
        cb: () => {
          this.props.dispatch({
            type: 'homeworkadd/updateState',
            payload: {
              animating: true
            }
          });
        }
      });
    }
  };

  onBackSubmit = () => {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
    this.props.dispatch(routerRedux.goBack());
  };

  getInfo = (configs) => {
    const fileConfigs = {},
      textConfigs = {};
    cnIsArray(configs) && configs.map((item, i) => {
      if (item.plugin === 'file') {
        fileConfigs[item.name] = item.value;
      } else if (item.plugin === 'onlinetext') {
        textConfigs[item.name] = item.value;
      }
    });
    return { fileConfigs, textConfigs };
  };

  showBackMoadl = () => {
    alert('离开？', '离开后不会保存当前操作！', [
      {
        text: '取消',
        onPress: () => this.props.dispatch({
          type: 'app/updateBackModal',
          payload: {
            showBackModal: false
          }
        })
      },
      { text: '确定', onPress: () => this.onBackSubmit() }
    ]);
  };

  render () {
    const { assignId, submitStatus } = this.props.location.query,
      { itemid, animating } = this.props.homeworkadd,
      { data = {} } = this.props.homework,
      { configs = [], submitDataType } = data;
    const { showBackModal = false, users: currentUser = {} } = this.props.app;
    const props = {
      configs: this.getInfo(configs),
      assignId,
      onSubmit: this.onSubmit,
      itemid,
      submitDataType,
      fileIdPrefix: currentUser.hasOwnProperty('userid') ? `_${currentUser.userid}_` : '',
      loadingAdd: this.props.loadingAdd
    };

    const title = submitStatus === 'new' ? '添加提交' : '编辑提交';
    return (
      <div className={styles.whiteBg}>
        <Nav title={title} dispatch={this.props.dispatch} isAlert />
        <AddHomework {...props} />
        <ActivityIndicator
          toast
          text="正在上传..."
          animating={animating}
        />
        {showBackModal && this.showBackMoadl()}
      </div>
    );
  }
}

export default connect(({ loading,homeworkadd, homework, app}) => ({
  loading,
  loadingAdd:loading.effects['homeworkadd/addHomework'],
  homeworkadd,
  homework,
  app
}))(HomeWorkAdd);
