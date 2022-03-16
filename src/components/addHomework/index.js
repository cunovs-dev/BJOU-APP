import React from 'react';
import { Upload } from 'antd';
import { createForm } from 'rc-form';
import {
  List,
  InputItem,
  TextareaItem,
  Button,
  Toast,
  Icon,
  WhiteSpace,
  WingBlank,
  Picker,
  Modal
} from 'components';
import TitleBox from 'components/titlecontainer';
// import Record from 'components/Record';  //音频作业 目前不做了
import { getCommonDate, getLocalIcon, renderSize } from 'utils';
import styles from './index.less';

const Item = List.Item;
const alert = Modal.alert;
const Brief = Item.Brief;
const getIcon = (type) => {
  if (RegExp(/pdf/)
    .exec(type)) {
    return '/components/PDF.svg';
  } else if (RegExp(/word/)
    .exec(type)) {
    return '/components/DOCX.svg';
  } else if (RegExp(/xlsb/)
    .exec(type)) {
    return '/components/EXCEL.svg';
  } else if (RegExp(/image/)
    .exec(type)) {
    return '/components/IMAGE.svg';
  }
  return '/components/file.svg';
};

@createForm()
class AddHomework extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      fileList: [],
      hasFilesChange: false
    };
  }

  componentDidMount () {
    const { submitDataType = [] } = this.props;
    this.setState({
      fileList: this.getDefaultList(submitDataType)
    });
  }

  componentWillUnmount () {
    this.setState({
      fileList: []
    });
  }

  onSubmit = () => {
    const { assignId } = this.props;
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        const { fileList, hasFilesChange } = this.state;
        const data = {
          hasFilesChange,
          fileList: hasFilesChange ? fileList : [],
          value: {
            ...this.props.form.getFieldsValue(),
            assignmentid: assignId
            // filemanager: '426570226'
          }
        };
        this.props.onSubmit(data);
      } else {
        Toast.fail('请检查提交数据是否正确');
      }
    });
  };

  onRemove = (uid) => {
    this.setState((state) => (
      {
        fileList: state.fileList.filter(item => item.uid !== uid),
        hasFilesChange: true
      }
    ));
  };

  getDefaultList = (arr) => {
    const { fileIdPrefix = '' } = this.props;
    const res = [];
    if (arr.find(item => item.type === 'file')) {
      arr.find(item => item.type === 'file')
        .files
        .map((item, i) => (
          res.push({
            fileName: item.filename,
            filenamePrefix: fileIdPrefix,
            fileurl: item.fileurl,
            lastModified: item.timemodified * 1000,
            type: item.mimetype,
            uid: `-${i--}`
          })
        ));
      return res;
    }
    return [];
  };

  getDefaultText = (arr) => {
    if (arr.find(item => item.type === 'onlinetext')) {
      const res = arr.find(item => item.type === 'onlinetext').editorfields[0].text;
      const result = res.replace(/<br \/>/g, '\n');
      return result.replace(/<(?!\/?br\/?.+?>)[^<>]*>/gi, '');
    }
    return '';
  };

  isUploaded = (arr, obj) => {
    if (cnIsArray(arr) && arr.length > 0) {
      return arr.find((item => (item.name && !item.fileName ? item.name : item.fileName === obj.name)));
    }
    return false;
  };

  renderFileList = (files) => (
    files.map((item, i) => {
      const { fileName = '', name = '', lastModified, type, uid } = item;
      return (
        <List key={i} className={styles.fileList}>
          <List.Item
            extra={
              <div onClick={() => this.onRemove(uid)}>
                <Icon type={getLocalIcon('/components/delete.svg')} color="#22609c" />
              </div>
            }
            thumb={<Icon type={getLocalIcon(getIcon(type))} size="lg" color="#22609c" />}
            multipleLine
            onClick={() => {
            }}
          >
            {fileName || name}
            <Brief>{getCommonDate(lastModified / 1000)}</Brief>
          </List.Item>
        </List>
      );
    })
  );

  render () {
    const { getFieldProps } = this.props.form,
      { fileList } = this.state,
      { submitDataType = [], configs: { fileConfigs, textConfigs },loadingAdd } = this.props,
      { maxsubmissionsizebytes, maxfilesubmissions } = fileConfigs,
      { wordlimit } = textConfigs,
      props = {
        beforeUpload: (file) => {
          if (file.size < maxsubmissionsizebytes && fileList.length < maxfilesubmissions && !this.isUploaded(fileList, file)) {
            this.setState(state => ({
              fileList: [...state.fileList, file],
              hasFilesChange: true
            }));
          } else if (fileList.length >= maxfilesubmissions) {
            Toast.fail('上传文件数已达上限，不能再次上传。');
          } else if (this.isUploaded(fileList, file)) {
            Toast.fail('同名附件已上传，请确认是否重复或改名后再上传。');
          } else {
            Toast.fail('文件过大，不能上传。');
          }
          return false;
        },
        listType: 'picture',
        showUploadList: false
      };
    return (
      <div className={styles.outer}>
        <form className={styles.form}>
          {
            textConfigs.enabled ?
            <div>
              <TitleBox title="在线文本提交" sup="" />
              <List.Item>
                <TextareaItem
                  {...getFieldProps('onlinetext', {
                    initialValue: this.getDefaultText(submitDataType),
                    rules: [{ required: false, message: '请输入内容' }]
                  })}
                  count={wordlimit * 1}
                  rows={6}
                  placeholder={'请输入内容'}
                />
              </List.Item>
            </div>
                                :
            ''
          }
          <WhiteSpace size="lg" />
          {
            fileConfigs.enabled && maxfilesubmissions && maxsubmissionsizebytes ?
            <div>
              <TitleBox title="文件提交" sup="" />
              <WingBlank>
                <div className={styles.rule}>
                  <div>
                    {maxsubmissionsizebytes && maxfilesubmissions ? `新文件的最大尺寸:${renderSize(maxsubmissionsizebytes)},最多附件${maxfilesubmissions}` : null}
                  </div>
                </div>
                {this.renderFileList(fileList)}
                <WhiteSpace size="lg" />
                <div className={styles.upload}>{
                  (maxfilesubmissions && fileList.length < maxfilesubmissions) ? <Upload
                    {...props}
                  >
                    <Button type="primary">
                      <Icon type="add" />
                      添加文件
                    </Button>
                  </Upload> : ''
                }
                </div>
              </WingBlank>
            </div>
                                                                                :
            ''
          }
          <WhiteSpace size="lg" />
          <WingBlank>
            <Button
              loading={loadingAdd}
              type="primary"
              onClick={
                () => alert('保存更改', '确定保存本次更改?', [
                  { text: '取消', onPress: () => console.log('cancel') },
                  { text: '确定', onPress: () => this.onSubmit() }
                ])
              }
            >保存更改</Button>
          </WingBlank>
          <WhiteSpace size="lg" />
        </form>
      </div>
    );
  }
}

export default AddHomework;
