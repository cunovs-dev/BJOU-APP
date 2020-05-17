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
  Picker
} from 'components';
import { getCommonDate, getLocalIcon, renderSize } from 'utils';
import styles from './index.less';

const Item = List.Item;
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
class UpLoad extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  onAddSubmit = () => {
    const { course = '', id, type, groups, discussionid } = this.props;
    this.props.form.validateFields({
      force: true,
    }, (error) => {
      if (!error) {
        const { fileList } = this.state;
        let data = {};
        if (type === 'add') {
          data = {
            fileList,
            value: {
              ...this.props.form.getFieldsValue(),
              courseid: course,
              forumid: id,
              groupid: groups[0].value,
              discussion: discussionid
            }
          };
        } else {
          data = {
            fileList,
            value: {
              ...this.props.form.getFieldsValue(),
              postid: id,
              discussion: discussionid
            }
          };
        }

        this.props.onSubmit(data);
      } else {
        Toast.fail('请检查提交数据是否正确');
      }
    });
  };

  onReplySubmit = () => {
    const { course, id } = this.props;
    this.props.form.validateFields({
      force: true,
    }, (error) => {
      if (!error) {
        const { fileList } = this.state;
        const data = {
          fileList,
          value: {
            ...this.props.form.getFieldsValue(),
            courseid: course,
            forumid: id
          }
        };
        this.props.onSubmit(data);
      } else {
        Toast.fail('');
      }
    });
  };

  onRemove = (uid) => {
    this.setState((state) => (
      { fileList: state.fileList.filter(item => item.uid !== uid) }
    ));
  };

  renderFileList = (files) => (
    files.map((item, i) => {
      const { name, lastModified, type, uid } = item;
      return (
        <List key={i} className={styles.fileList} >
          <List.Item
            extra={
              <div onClick={() => this.onRemove(uid)} >
                <Icon type={getLocalIcon('/components/delete.svg')} color="#22609c" />
              </div >
            }
            thumb={<Icon type={getLocalIcon(getIcon(type))} size="lg" color="#22609c" />}
            multipleLine
          >
            {name}
            <Brief >{getCommonDate(lastModified / 1000)}</Brief >
          </List.Item >
        </List >
      );
    })
  );

  isUploaded = (arr, obj) => {
    if (cnIsArray(arr) && arr.length > 0) {
      return arr.find((item => item.name === obj.name));
    }
    return false;
  };


  render () {
    const { getFieldProps, getFieldError } = this.props.form,
      { fileList } = this.state,
      { maxattachments, maxbytes, groups, loading = false, type, subject } = this.props,
      props = {
        beforeUpload: (file) => {
          if (file.size < maxbytes && fileList.length < maxattachments && !this.isUploaded(fileList, file)) {
            this.setState(state => ({
              fileList: [...state.fileList, file],
            }));
          } else if (fileList.length >= maxattachments) {
            Toast.fail('上传文件数已达上限，不能再次上传。');
          } else if (this.isUploaded(fileList, file)) {
            Toast.fail('同名附件已上传，请确认是否重复或改名后再上传。');
          } else {
            Toast.fail('文件过大，不能上传');
          }

          return false;
        },
        listType: 'picture',
        fileList,
        showUploadList: false,
      };
    return (
      <div >
        <form className={styles.form} >
          <List.Item >
            <InputItem
              {...getFieldProps('subject', {
                initialValue: type === 'add' ? '' : `${subject}`,
                rules: [{ required: true, message: '主题必须输入' },
                ],
              })}
              clear
              error={!!getFieldError('subject') && Toast.fail(getFieldError('subject'))}
              placeholder="请输入"
            >
              主题
            </InputItem >
            <TextareaItem
              {...getFieldProps('message', {
                initialValue: '',
                rules: [{ required: true, message: '请输入内容' }],
              })}
              rows={10}
              placeholder={'请输入内容'}
            />
          </List.Item >
          {
            type === 'add' && cnIsArray(groups) && groups.length > 0 ?
              <div className={styles.group} >
                <List className="my-list" >
                  <List.Item wrap >
                    {groups[0].label || ''}
                  </List.Item >
                </List >
              </div >
              :
              null
          }
          <WhiteSpace size="sm" />
          {
            parseInt(maxattachments, 10) < 1
              ?
              null
              :
              <div className={styles.rule} >
                <div >
                  {maxbytes && maxattachments > 0 ? `新文件的最大尺寸:${renderSize(maxbytes)},最多附件${maxattachments}` : null}
                </div >
              </div >
          }
          {this.renderFileList(fileList)}
          <WhiteSpace size="lg" />
          {parseInt(maxattachments, 10) < 1
            ?
            null
            :
            <div className={styles.upload} >
              <Upload
                {...props}
              >
                <WingBlank >
                  <Button type="primary" >
                    <Icon type="add" />
                    添加文件
                  </Button >
                </WingBlank >
              </Upload >
            </div >}
          <WhiteSpace size="lg" />
          <WingBlank >
            <Button loading={loading} type="primary" onClick={this.onAddSubmit.bind(this)} >提交</Button >
          </WingBlank >
        </form >
        <WhiteSpace size="lg" />
      </div >
    );
  }
}

UpLoad.defaultProps = {};
UpLoad.propTypes = {};

export default UpLoad;
