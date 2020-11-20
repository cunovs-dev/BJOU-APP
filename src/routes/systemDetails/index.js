import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import InnerHtml from 'components/innerhtml';
import TitleBox from 'components/titlecontainer';
import { List, WhiteSpace, Icon } from 'components';
import { getCommonDate, getLocalIcon, bkIdentity } from 'utils';
import FileBox from './components/FilesBox';
import styles from './index.less';


const SystemDetails = ({ location, dispatch, systemDetails }) => {
  const { categoryName = '' } = location.query,
    { data } = systemDetails;

  const { title = '', createDate = new Date(), informationSource = '', informationDetail = '', browserNum = 0, fileList = [], informationType, isCollection, informationId } = data,
    handlerCollectionClick = (id) => {
      dispatch({
        type: 'systemDetails/collection',
        payload: {
          informationId: id
        }
      });
    };
  return (
    <div className={styles.outer}>
      <Nav title={categoryName} dispatch={dispatch} />
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>
          <span>{`来源：${informationSource}`}</span>
          <span>{`发布时间：${getCommonDate(createDate / 1000, false)}`}</span>
          {/* { */}
          {/* bkIdentity() */}
          {/* ? */}
          {/* <span>{`点击数：${browserNum}`}</span> */}
          {/* : */}
          {/* null */}
          {/* } */}
          {
            bkIdentity()
              ?
                <Icon
                onClick={() => handlerCollectionClick(informationId)}
                type={getLocalIcon(`/sprite/${isCollection ? 'collection' : 'notCollection'}.svg`)}
                size="xs"
              />
              :
              null
          }
        </div>
      </div>
      <div className={styles.contaniner}>
        <InnerHtml data={informationDetail} />
        {
          cnIsArray(fileList) && fileList.length > 0
            ?
              <div>
              <WhiteSpace />
              <TitleBox title="附件" sup="" />
              <FileBox data={fileList} informationType={informationType} />
            </div>
            :
            null
        }
      </div>
    </div>
  );
};

export default connect(({ loading, systemDetails }) => ({
  loading,
  systemDetails
}))(SystemDetails);
