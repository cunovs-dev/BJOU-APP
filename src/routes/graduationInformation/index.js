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
import MobileTable from 'components/MobileTable';
import styles from './index.less';

const GraduationInformation = ({ dispatch, location, graduationInformation }) => {
  const { list } = graduationInformation;
  const { name = '毕业信息' } = location.query;
  return (
    <div>
      <Nav title={name} dispatch={dispatch} />
      <WhiteSpace />
      <MobileTable data={list} thead={['项目', '审批条件', '我的条件', '状态']} type="graduation" />
      <WhiteSpace size="lg" />
      <div className={styles.notice}>
        <Icon type={getLocalIcon('/components/loadingfail.svg')} size="lg" style={{ marginRight: '10px' }} />
        各项考核条件需要达到我的条件≥审批条件，才可满足毕业要求
      </div>
    </div>
  );
};
export default connect(({ loading, graduationInformation }) => ({
  loading,
  graduationInformation
}))(GraduationInformation);
