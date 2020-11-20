/**
 * @author Lowkey
 * @date 2020/03/19 14:36:59
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import InnerHtml from 'components/innerhtml';
import { List, WhiteSpace, Icon } from 'components';
import TitleBox from 'components/titlecontainer';
import { getCommonDate, bkIdentity, getLocalIcon } from 'utils';
import { connect } from 'dva';
import FileBox from './components/FilesBox';
import styles from './index.less';


const SchoolCalendar = ({ location, dispatch, schoolCalendar }) => {
  const { data = {} } = schoolCalendar;
  const { title = '', createDate = new Date(), informationSource = '', informationDetail = '', browserNum = 0, isCollection = false, informationId, fileList = [], informationType } = data,
    handlerCollectionClick = (id) => {
      const { queryType } = location.query;
      dispatch({
        type: 'schoolCalendar/collection',
        payload: {
          informationId: id,
          cateGoryId: queryType
        }
      });
    };
  const { name } = location.query;
  return (
    <div className={styles.outer}>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>
          <span>{`来源：${informationSource}`}</span>
          <span>{`发布时间：${getCommonDate(createDate / 1000, false)}`}</span>
          {/*{*/}
            {/*bkIdentity()*/}
            {/*?*/}
            {/*<span>{`点击数：${browserNum}`}</span>*/}
            {/*:*/}
            {/*null*/}
          {/*}*/}
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

export default connect(({ loading, schoolCalendar }) => ({
  loading,
  schoolCalendar
}))(SchoolCalendar);
