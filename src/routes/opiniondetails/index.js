import React from 'react';
import Nav from 'components/nav';
import { List, WhiteSpace } from 'components';
import { commentsRow } from 'components/row';
import { connect } from 'dva';
import Tag from 'components/tag';
import { getCommonDate } from 'utils';
import { handlerChangeRouteClick } from 'utils/commonevents';
import WxImageViewer from 'react-wx-images-viewer';
import TitleBox from 'components/titlecontainer';
import styles from './index.less';

const PrefixCls = 'opiniondetails';
const OpinionDetails = ({ location, dispatch, opiniondetails, }) => {
  const { name = '我的反馈' } = location.query;
  const { detail, isOpen, viewImageIndex } = opiniondetails;
  const { submitContent = '', submitDate = '', submitType = '', submitAnnex = '', baseHost = '', replyContent = '', courseName = '', resourcesName = '' } = detail;
  const getUrls = (str) => {
    if (!str) {
      return [];
    }
    const arr = [];
    str.split(',')
      .map(item => arr.push(baseHost + item));
    return arr;
  };
  const getImages = () => {
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
                data-src={`${baseHost}${src}`}
                className="imgbox"
                style={{ backgroundImage: `url(${baseHost}${src})` }}
              />
            ))}
          </div >
        );
      }
    },
    handleDivClick = (e) => {
      if (e.target.className === 'imgbox') {
        let src = e.target.dataset.src,
          curImageIndex = getUrls(submitAnnex)
            .indexOf(src);
        if (src) {
          dispatch({
            type: `${PrefixCls}/updateState`,
            payload: {
              isOpen: true,
              viewImageIndex: curImageIndex < 0 ? 0 : curImageIndex,
            },
          });
        }
      }
    },
    onViemImageClose = () => {
      dispatch({
        type: `${PrefixCls}/updateState`,
        payload: {
          isOpen: false,
        },
      });
    };
  return (
    <div className={styles.whiteBox} >
      <Nav title={name} dispatch={dispatch} />
      <div className={styles.outer} >
        <div className={styles.info} >
          <div className={styles.type} >
            <div >反馈类型</div >
            <Tag
              text={submitType}
              color={'cyan'}
              size="xs"
            />
          </div >
          <div >
            {
              courseName !== '' ?
                <div className={styles.course} >
                  {`课程名称：${courseName}`}
                </div >
                :
                null
            }
            {
              resourcesName !== '' ?
                <div className={styles.resource} >
                  {`资源名称：${resourcesName}`}
                </div >
                :
                null
            }
          </div >
          <div className={styles.date} >{getCommonDate(submitDate / 1000)}</div >
        </div >
        <div className={styles.content} onClick={handleDivClick} >
          <div >
            {submitContent}
          </div >
          {getImages()}
        </div >
      </div >
      {
        replyContent && replyContent !== ''
          ?
          <div className={styles.reply} >
            <TitleBox title="回复" sup="" />
            <p >{replyContent}</p >
          </div >
          :
          null
      }
      {
        isOpen && viewImageIndex !== -1 ?
          <WxImageViewer onClose={onViemImageClose} urls={getUrls(submitAnnex)} index={viewImageIndex} /> : null
      }
    </div >
  );
};

OpinionDetails.propTypes = {};
OpinionDetails.defaultProps = {};
export default connect(({ loading, opiniondetails, }) => ({ loading, opiniondetails, }))(OpinionDetails);
