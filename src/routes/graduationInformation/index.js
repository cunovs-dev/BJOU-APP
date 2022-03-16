/**
 * @author Lowkey
 * @date 2020/03/19 15:06:24
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { WhiteSpace, Button, Icon } from 'components';
import { getLocalIcon } from 'utils';
import NoContent from 'components/nocontent';
import MobileTable from 'components/MobileTable';
import styles from './index.less';

const thead = [
  { label: '项目', width: '36%' },
  { label: '审批条件', width: '21%' },
  { label: '我的条件', width: '21%' },
  { label: '状态', width: '22%' }];

const GraduationInformation = ({ dispatch, location, loading, graduationInformation }) => {
  const { list } = graduationInformation;
  const { name = '毕业信息' } = location.query;
  return (
    <div>
      <Nav title={name} dispatch={dispatch} />
      <WhiteSpace />
      {
        cnIsArray(list) && list.length > 0
        ?
        <MobileTable data={list} thead={thead} type="graduation" />
        :
        <NoContent isLoading={loading} />
      }

      <WhiteSpace size="lg" />
      <div className={styles.notice}>
        <Icon type={getLocalIcon('/components/loadingfail.svg')} style={{ marginRight: '10px' }} />
        各项考核条件需要达到我的条件≥审批条件，才可满足毕业要求。
      </div>
    </div>
  );
};
export default connect(({ loading, graduationInformation }) => ({
  loading: loading.effects['graduationInformation/queryGraduationInfo'],
  graduationInformation
}))(GraduationInformation);
