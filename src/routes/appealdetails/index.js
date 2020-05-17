import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Nav from 'components/nav';
import {
  List,
  TextareaItem,
  Button,
  Toast,
  WhiteSpace,
  whiteSpace,
  WingBlank
} from 'components';
import { ContentSkeleton } from 'components/skeleton';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { replaceSystemEmoji, getCommonDate } from 'utils';
import UserInfo from 'components/userInfo';
import TitleBox from 'components/titlecontainer';
import WxImageViewer from 'react-wx-images-viewer';
import styles from './index.less';


const PrefixCls = 'appealdetails';

class AppealDetails extends Component {
  constructor (props) {
    super(props);
    const { currentStatus = '0' } = this.props.location.query;
    this.state = {
      edit: currentStatus === '1',
      cancel: false
    };
  }

  componentDidMount () {
    const { submitUser = '' } = this.props.location.query;
    this.props.dispatch({
      type: `${PrefixCls}/queryInfo`,
      payload: {
        userid: submitUser
      }
    });
  }

  onViemImageClose = () => {
    this.props.dispatch({
      type: `${PrefixCls}/updateState`,
      payload: {
        isOpen: false,
      },
    });
  };
  getUrls = (str) => {
    const { detail = {} } = this.props.appealdetails,
      { baseHost = '' } = detail;
    if (!str) {
      return [];
    }
    const arr = [];
    str.split(',')
      .map(item => arr.push(baseHost + item));
    return arr;
  };


  handleDivClick = (e) => {
    const { detail = {} } = this.props.appealdetails,
      { submitAnnex = '' } = detail;
    if (e.target.className === 'imgbox') {
      let src = e.target.dataset.src,
        curImageIndex = this.getUrls(submitAnnex)
          .indexOf(src);
      if (src) {
        this.props.dispatch({
          type: `${PrefixCls}/updateState`,
          payload: {
            isOpen: true,
            viewImageIndex: curImageIndex < 0 ? 0 : curImageIndex,
          },
        });
      }
    }
  };

  getImages = () => {
    const { detail = {} } = this.props.appealdetails,
      { submitAnnex, baseHost } = detail;
    if (!submitAnnex) {
      return '';
    }
    const arr = submitAnnex.split(',');
    if (cnIsArray(arr) && arr.length) {
      return (
        <div className={styles.imgbox} >
          {arr.map((src, i) => (
            <div
              key={i}
              data-src={`${baseHost + src}`}
              className="imgbox"
              style={{ backgroundImage: `url(${baseHost + src})` }}
            />
          ))}
        </div >
      );
    }
  };

  onSubmit = () => {
    const { detail = {}, opinionId } = this.props.appealdetails,
      { users: { userid } } = this.props.app,
      { submitUser = '' } = detail;
    this.props.form.validateFields({
      force: true,
    }, (error) => {
      if (!error) {
        const data = {
          ...this.props.form.getFieldsValue(),
          opinionId,
          replys: userid,
          submitUser
        };
        this.props.dispatch({
          type: `${PrefixCls}/replyAppeal`,
          payload: {
            ...this.changeValue(data)
          }
        });
      } else {
        Toast.fail('请输入回复能容');
      }
    });
  };

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
  editClick = () => {
    this.setState({
      edit: false,
      cancel: true
    });
  };

  cancelClick = () => {
    this.setState({
      edit: true,
      cancel: true
    });
  };


  render () {
    const { name = '反馈详情' } = this.props.location.query,
      { isOpen, viewImageIndex, detail = {}, opinionId, userInfo = {} } = this.props.appealdetails,
      { submitUserName = '', groupName = '', resourcesName = '', submitContent, submitDate = '', submitAnnex, submitUser = '', replyContent = '', currentStatus = '0' } = detail,
      { getFieldProps } = this.props.form;
    const { edit, cancel } = this.state;
    return (
      <div className={styles.whiteBox} >
        <Nav
          title={name}
          dispatch={this.props.dispatch}
        />
        <div className={styles[`${PrefixCls}-outer`]} >
          <UserInfo
            name={submitUserName}
            group={groupName}
            info={userInfo}
            loading={this.props.loadingInfo}
            dispatch={this.props.dispatch}
          />
          <WhiteSpace />
          {this.props.loadingDetail ?
            <ContentSkeleton />
            :
            <div >
              <div className={styles.content} onClick={this.handleDivClick} >
                {
                  resourcesName !== '' ?
                    <div >
                      {`资源名称：${resourcesName}`}
                    </div >
                    :
                    null
                }
                <div className={styles.text} >
                  {submitContent}
                </div >
                {this.getImages()}
                <p >
                  {`提交于${getCommonDate(submitDate / 1000)}`}
                </p >
              </div >
              <WhiteSpace />
              <TitleBox title="我的回复" sup="" />
              <form >
                <List.Item className={styles[`${PrefixCls}-outer-content`]} >
                  {
                    edit ?
                      <div >
                        {replyContent}
                      </div >
                      :
                      <TextareaItem
                        {...getFieldProps('replyContent', {
                          initialValue: replyContent,
                          rules: [{ required: true, message: '请输入您的意见' }],
                        })}
                        rows={4}
                        placeholder={'请在此编辑回复'}
                      />
                  }
                </List.Item >
                <WhiteSpace />
                <WingBlank >
                  {
                    edit ?
                      <Button type="primary" onClick={this.editClick.bind(this)} >修改</Button >
                      :
                      <div >
                        <Button type="primary" onClick={this.onSubmit.bind(this)} >提交</Button >
                        <WhiteSpace />
                        {
                          cancel ?
                            <Button type="warning" onClick={this.cancelClick.bind(this)} >取消</Button >
                            :
                            null
                        }
                      </div >

                  }
                </WingBlank >
              </form >
            </div >
          }
        </div >
        {
          isOpen && viewImageIndex !== -1 ?
            <WxImageViewer
              onClose={this.onViemImageClose}
              urls={this.getUrls(submitAnnex)}
              index={viewImageIndex}
            />
            :
            null
        }
      </div >
    );
  }
}

export default connect(({ loading, appealdetails, app }) => ({
  loadingInfo: loading.effects['appealdetails/queryInfo'],
  loadingDetail: loading.effects['appealdetails/queryDetails'],
  appealdetails,
  app,
}))(createForm()(AppealDetails));
