import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { WhiteSpace, List, Icon, ActivityIndicator, InputItem, Toast, Modal } from 'components';
import Nav from 'components/nav';
import FileUpload from 'react-fileupload';
import { routerRedux } from 'dva/router';
import { getErrorImg, getImages, getLocalIcon, config, cookie } from 'utils';
import doUserAvatarUpload from 'utils/formsubmit';
import './index.less';
import styles from '../opinion/index.less';

const PrefixCls = 'oldSetup',
  prompt = Modal.prompt,
  { api: { UploadFiles }, userTag } = config,
  { _cg } = cookie;


class OdSetup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      canEdit: false
    };
  }

  onEditClick = () => {
    this.setState({
      canEdit: true
    });
  };

  onSubmit = () => {
    this.props.form.validateFields({
      force: true,
    }, (error) => {
      if (!error) {
        const data = {
          ...this.props.form.getFieldsValue(),
        };
        this.props.dispatch({
          type: 'oldSetup/updateInfo',
          payload: {
            ...data
          },
        });
      }
    });
  };

  render () {
    const { name = '' } = this.props.location.query,
      { getFieldProps, } = this.props.form,
      { data: { email = '', phone = '' } } = this.props.oldHomePage,
      uploadSuccess = (res) => {
        const { itemid, userid } = res[0];
        this.props.dispatch({
          type: 'oldSetup/setAvatar',
          payload: {
            draftitemid: itemid,
            userid
          }
        });
      },
      options = {
        baseUrl: `${UploadFiles()}`,
        uploadSuccess: uploadSuccess.bind(this),
        accept: 'image/*',
        dataType: 'json',
        fileFieldName: 'photo',
        chooseFile (files) {
          doUserAvatarUpload(`${UploadFiles()}`, { token: _cg(userTag.usertoken) }, {
            file: files[0],
          }, {}, true)
            .then((res) => {
              if (res.length > 0) {
                this.uploadSuccess(res);
              } else {
                Toast.fail('上传失败，请稍后再试', 2);
              }
            });
        },
      };

    const { users: { useravatar } } = this.props.app;
    const { canEdit } = this.state;
    return (
      <div >
        <Nav
          title={name}
          dispatch={this.props.dispatch}
          hasShadow
          renderNavRight={
            canEdit ?
              <span style={{ color: '#fff' }} onClick={this.onSubmit} >
              保存
              </span >
              :
              <span style={{ color: '#fff' }} onClick={this.onEditClick} >
              编辑
              </span >
          }
        />
        <WhiteSpace size="xs" />
        <div >
          <List className={`${PrefixCls}-list`} >
            <List.Item >
              <div className={`${PrefixCls}-user-icon-upload`} >
                <FileUpload options={options} >
                  <p className={'icon-title-avatar'} ref="chooseBtn" >
                    <span >更换头像</span >
                  </p >
                  <div className={'icon-img-box'} >
                    <img src={getImages(useravatar, 'user')} alt="icon" onError={(el => getErrorImg(el, 'user'))} />
                  </div >
                </FileUpload >
              </div >
            </List.Item >
            <form >
              <InputItem
                {...getFieldProps('email', {
                  initialValue: email,
                })}
                disabled={!canEdit}
                clear
              >
                邮箱
              </InputItem >
              <InputItem
                {...getFieldProps('phone', {
                  initialValue: phone,
                })}
                disabled={!canEdit}
                clear
              >
                手机号
              </InputItem >
            </form >
          </List >
          <ActivityIndicator animating={this.props.loading} toast text="上传中..." />
        </div >
      </div >
    );
  }
}

export default connect(({ loading, oldSetup, app, oldHomePage }) => ({
  loading: loading.global,
  oldSetup,
  app,
  oldHomePage
}))(createForm()(OdSetup));
