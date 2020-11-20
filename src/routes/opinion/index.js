import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Nav from 'components/nav';
import {
  List,
  InputItem,
  TextareaItem,
  Button,
  Toast,
  WhiteSpace,
  Picker,
  ImagePicker,
  whiteSpace,
  // Drawer,
  Radio,
  WingBlank
} from 'components';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { replaceSystemEmoji, bkIdentity, oldAPP } from 'utils';
import TitleBox from 'components/titlecontainer';
import styles from './index.less';

const RadioItem = Radio.RadioItem;

const PrefixCls = 'opinion',
  type = [
    {
      label: '课程内容',
      value: '课程内容'
    },
    {
      label: '平台功能',
      value: '平台功能'
    },
    {
      label: '使用问题',
      value: '使用问题'
    },
    {
      label: '其它',
      value: '其它'
    }
  ],

  gkType = [
    {
      label: '平台功能',
      value: '平台功能'
    },
    {
      label: '使用问题',
      value: '使用问题'
    },
    {
      label: '其它',
      value: '其它'
    }
  ];

class Opinion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      files: [],
      multiple: false,
      isShowLessons: false,
      courseVal: '',
      courseName: '请选择课程名称'
    };
  }

  changeValue = (obj) => {
    for (let i in obj) {
      if (typeof (obj[i]) === 'string') {
        obj[i] = replaceSystemEmoji(obj[i]);
      }
      if (typeof (obj[i]) === 'undefined') {
        delete obj[i];
      }
    }
    return obj;
  };

  onChange = (files) => {
    let reg = /image/,
      result = [];
    files.map((data, i) => {
      if (!reg.test(data.file.type)) {
        Toast.fail('这不是图片哟！！！', 2);
      } else {
        result.push(data);
      }
    });
    this.setState({
      files: result
    });
  };

  getKey = (name) => name;

  getUploadFiles = () => {
    const uploadFiles = {},
      uploadKey = [];
    this.state.files.map((file, i) => {
      if (file.file) {
        let key = this.getKey(`opinionFile_${i}`);
        uploadKey.push(key);
        uploadFiles[key] = file.file;
      }
    });
    return {
      uploadFiles,
      uploadKey: uploadKey.join(',')
    };
  };

  onSubmit = () => {
    const { files } = this.state,
      { groups } = this.props.app;
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        const courseId = this.props.location.query.courseId || this.props.form.getFieldsValue().courseId;
        const { cmid, resourcesName } = this.props.location.query;
        const data = {
            ...this.props.form.getFieldsValue(),
            ...this.getInfos(groups, courseId),
            cmid,
            resourcesName
          },
          { uploadFiles, uploadKey } = this.getUploadFiles();
        if (files.length > 0) {
          this.props.dispatch({
            type: 'opinion/sendOpinionFiles',
            payload: {
              uploadFiles,
              uploadKey,
              ...this.changeValue(data)
            }
          });
        } else {
          this.props.dispatch({
            type: 'opinion/sendOpinion',
            payload: {
              ...this.changeValue(data)
            }
          });
        }
      } else {
        Toast.fail('意见类型或课程名称必须输入');
      }
    });
  };

  courseChange = (val, name) => {
    this.setState({
      courseVal: val,
      courseName: name,
      isShowLessons: false
    });
  };

  getInfos = (groups, id) => {
    if (!cnIsArray(groups) || !id) {
      return {};
    }
    const obj = groups.find(item => item.courseid.toString() === id.toString());
    delete obj.courseid;
    return obj;
  };

  getCourses = (data = []) => {
    const arr = [];
    data.map(item => arr.push({
      value: item.id,
      label: item.fullname
    }));
    return arr;
    // const { form: { getFieldProps } } = this.props;
    // return arr.map(item => (
    //   <form >
    //     <div className={styles.radio} >
    //       <RadioItem
    //         {...getFieldProps('submitCourseId', {
    //           initialValue: '',
    //         })}
    //         wrap
    //         checked={item.value === this.state.courseVal}
    //         key={item.value}
    //         onClick={() => this.courseChange(item.value, item.label)}
    //       >
    //         {item.label}
    //       </RadioItem >
    //     </div >
    //   </form >
    // ));
  };

  courseClick = () => {
    this.setState({
      isShowLessons: true
    });
  };

  changeType = (val) => {
    this.setState({
      isShowLessons: val.join() === '课程内容',
      courseVal: '',
      courseName: '请选择课程名称'
    });
  };

  render () {
    const { name = '意见反馈', courseId = '', resourcesName = '' } = this.props.location.query,
      { getFieldProps } = this.props.form;
    const { courseData } = this.props.app;
    const { files, isShowLessons, courseName } = this.state;
    return (
      <div>
        <Nav
          title={name}
          dispatch={this.props.dispatch}
          hasShadow
          renderNavRight={
            <span
              className={styles.feedback}
              onClick={handlerChangeRouteClick.bind(this, 'myopinion', { name: '我的反馈' }, this.props.dispatch)}
            >
              我的反馈
            </span>
          }
        />
        <div className={styles[`${PrefixCls}-outer`]}>
          <div className={styles[`${PrefixCls}-outer-title`]}>
            {
              courseId !== '' ?
              '针对该课程内容或资源有什么问题，请您反馈给我们，我们将第一时间进行调整。'
                              :
              '在使用过程中，遇到了什么问题或是有什么建议，请反馈给我们，我们根据您的反馈进行改进。'
            }
          </div>
          <form>
            <List>
              <Picker
                data={bkIdentity() || oldAPP() ? type : gkType}
                cols={1}
                disabled={courseId !== ''}
                {...getFieldProps('submitType', {
                  initialValue: courseId !== '' ? ['课程内容'] : '',
                  rules: [{ required: true, message: '请选择意见类型' }]
                })}
                onOk={this.changeType}
              >
                <List.Item arrow="horizontal">意见类型：</List.Item>
              </Picker>
            </List>
            {
              (isShowLessons || courseId !== '') && courseData.length > 0 ?
              <List className={styles.lesson}>
                <Picker
                  data={this.getCourses(courseData)}
                  cols={1}
                  disabled={courseId !== ''}
                  {...getFieldProps('courseId', {
                    initialValue: courseId !== '' ? [`${courseId}`] : '',
                    rules: [{ required: true, message: '请选择课程名称' }]
                  })}
                >
                  <List.Item arrow="horizontal">课程名称：</List.Item>
                </Picker>
              </List>
                                                                          :
              null
            }

            {
              resourcesName !== '' ?
              <div className={styles.resource}>
                {resourcesName}
              </div>
                                   :
              null
            }

            <List.Item className={styles[`${PrefixCls}-outer-content`]}>
              <TextareaItem
                {...getFieldProps('submitContent', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入您的意见' }]
                })}
                rows={7}
                placeholder={'您的宝贵意见，就是我们进步的源泉'}
              />
            </List.Item>
            <InputItem
              {...getFieldProps('submitUserPhone', {
                initialValue: ''
              })}

            >
              电话(选填)
            </InputItem>
            <WhiteSpace />
            <TitleBox title="上传图片" sup="" />
            <ImagePicker
              style={{ background: '#fff', paddingBottom: '10px' }}
              files={files}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 4}
              multiple={this.state.multiple}
              accept="image/*"
            />
            <WingBlank>
              <Button type="primary" onClick={this.onSubmit.bind(this)}>提交</Button>
            </WingBlank>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(({ loading, opinion, app }) => ({
  loading,
  opinion,
  app
}))(createForm()(Opinion));
