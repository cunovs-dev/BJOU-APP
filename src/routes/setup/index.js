import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { WhiteSpace, List, Icon, ActivityIndicator, Toast } from 'components';
import Nav from 'components/nav';
import FileUpload from 'react-fileupload';
import { routerRedux } from 'dva/router';
import { getErrorImg, getPortalAvatar, getLocalIcon, config, cookie, bkIdentity } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import doUserAvatarUpload from 'utils/formsubmit';
import styles from './index.less';

const PrefixCls = 'setup',
  { api: { PortalFileUpload, EnclosureDownload }, userTag } = config,
  { _cg, _cs } = cookie;


class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isUploading: false
    };
  }

  onSubmit = () => {
    this.props.form.validateFields({
      force: true
    }, (error) => {
      if (!error) {
        const data = {
          ...this.props.form.getFieldsValue()
        };
        this.props.dispatch({
          type: 'setup/updateInfo',
          payload: {
            ...data
          }
        });
      }
    });
  };

  render () {
    const { name = '编辑个人信息' } = this.props.location.query,
      uploadSuccess = (res) => {
        const { data: { fileId } } = res;
        _cs(bkIdentity() ? 'portalHeadImg' : 'portalHeadImgGK', fileId);
        this.props.dispatch({
          type: 'setup/setPortalAvatar',
          payload: {
            imgId: fileId
          }
        });
      },
      updateStatus = (status) => {
        this.setState({
          isUploading: status
        });
      },
      options = {
        baseUrl: PortalFileUpload,
        uploadSuccess: uploadSuccess.bind(this),
        accept: 'image/*',
        dataType: 'json',
        fileFieldName: 'photo',
        chooseFile (files) {
          updateStatus(true);
          doUserAvatarUpload(PortalFileUpload, {}, {
            multipartFiles: files[0]
          }, {}, true)
            .then((res) => {
              if (res.code === 0) {
                updateStatus(false);
                this.uploadSuccess(res);
              } else {
                updateStatus(false);
                Toast.fail('上传失败，请稍后再试', 2);
              }
            });
        }
      };
    return (
      <div>
        <Nav
          title={name}
          dispatch={this.props.dispatch}
        />
        <WhiteSpace size="xs" />
        <div className={styles.content}>
          <List className={styles.list}>
            <List.Item arrow="horizontal" thumb={<Icon type={getLocalIcon('/set/avatar.svg')} />}>
              <div className={`${PrefixCls}-user-icon-upload`}>
                <FileUpload options={options}>
                  <p className={styles.avatar} ref="chooseBtn">
                    <span>修改头像</span>
                  </p>
                  <div className={styles['icon-img-box']}>
                    <img
                      src={getPortalAvatar(EnclosureDownload, _cg(bkIdentity() ? 'portalHeadImg' : 'portalHeadImgGK'))}
                      alt="icon"
                      onError={(el => getErrorImg(el, 'user'))}
                    />
                  </div>
                </FileUpload>
              </div>
            </List.Item>
            <List.Item
              thumb={<Icon type={getLocalIcon('/set/phonenumber.svg')} />}
              arrow="horizontal"
              onClick={() => handlerChangeRouteClick('verification', {
                type: 'phone',
                name: '修改手机号'
              }, this.props.dispatch)}
            >
              <span className={styles.text}>修改手机号</span>
            </List.Item>
            <List.Item
              thumb={<Icon type={getLocalIcon('/set/mailnumber.svg')} />}
              arrow="horizontal"
              onClick={() => handlerChangeRouteClick('verification', {
                type: 'mail',
                name: '修改邮箱'
              }, this.props.dispatch)}
            >
              <span className={styles.text}> 修改邮箱</span>
            </List.Item>
            <List.Item
              thumb={<Icon type={getLocalIcon('/set/password.svg')} />}
              arrow="horizontal"
              onClick={() => handlerChangeRouteClick('setPassword', {
                name: '修改密码'
              }, this.props.dispatch)}
            >
              <span className={styles.text}> 修改密码</span>
            </List.Item>
            {/*<List.Item*/}
            {/*  thumb={<Icon type={getLocalIcon('/set/wechat.svg')} />}*/}
            {/*  arrow="horizontal"*/}
            {/*  onClick={() => {*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <span className={styles.text}> 绑定微信/解绑微信</span>*/}
            {/*</List.Item>*/}
          </List>
          <ActivityIndicator animating={this.state.isUploading} toast text="上传中..." />
        </div>
      </div>
    );
  }
}

export default connect(({ loading, setup, app, homepage }) => ({
  loading,
  setup,
  app,
  homepage
}))(createForm()(Setup));
