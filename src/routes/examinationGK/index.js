/**
 * @author Lowkey
 * @date 2020/03/19 15:06:24
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import { Radio } from 'antd';
import { connect } from 'dva';
import { WhiteSpace, Button, Icon, Popover } from 'components';
import { getLocalIcon } from 'utils';
import MobileTable from 'components/MobileTable';
import CunovsTab from 'components/Tabs';
import NoContent from 'components/nocontent';
import styles from './index.less';

const ExaminationGK = ({ dispatch, location, examinationGK, loading }) => {
  const { list, allList, selectIndex = 0, isShow = false } = examinationGK;
  const { name = '考试成绩' } = location.query;
  const onChange = select => {
    dispatch({
      type: 'examinationGK/updateState',
      payload: {
        selectIndex: select
      }
    });
    if (select === 1) {
      dispatch({
        type: 'examinationGK/queryList'
      });
    }
  };

  const onSelect = (opt) => {
    if (selectIndex === 1) {
      dispatch({
        type: 'examinationGK/queryList',
        payload: {
          [opt.props.value]: opt.props.value === 'stateSortValue' ? 'asc' : 'desc'
        }
      });
    } else {
      dispatch({
        type: 'examinationGK/queryList',
        payload: {
          [opt.props.value]: opt.props.value === 'stateSortValue' ? 'asc' : 'desc',
          examYear: new Date().getFullYear()
        }
      });
    }
    dispatch({
      type: 'examinationGK/updateState',
      payload: {
        isShow: false
      }
    });
  };

  const renderRight = () => (
    <Popover mask
             visible={isShow}
             overlay={[
               (<Popover.Item key="4" value="cNameSortValue" data-seed="logId">按课程名称排序</Popover.Item>),
               (<Popover.Item key="5" value="eDateSortValue" style={{ whiteSpace: 'nowrap' }}>按最新课程排序</Popover.Item>),
               (<Popover.Item key="6" value="stateSortValue">
                 <span style={{ marginRight: 5 }}>按状态排序</span>
               </Popover.Item>)
             ]}
             align={{
               overflow: { adjustY: 0, adjustX: 0 },
               offset: [-10, 0]
             }}
             onSelect={onSelect}
    >
      <div style={{
        height: '100%',
        padding: '0 15px',
        marginRight: '-15px',
        display: 'flex',
        alignItems: 'center'
      }}
      >
        <Icon type="ellipsis" color="#fff" />
      </div>
    </Popover>

  );
  return (
    <div className={styles.outer}>
      <Nav title={name} dispatch={dispatch} renderNavRight={renderRight()} />
      <WhiteSpace />
      <CunovsTab defaultIndex={0} onTabClick={onChange}>
        <CunovsTab.TabItem label="本年度成绩" tabIndex={0}>
          {
            cnIsArray(list) && list.length > 0 ?
            <MobileTable data={list} />
                                               :
            <NoContent isLoading={loading} />
          }
        </CunovsTab.TabItem>
        <CunovsTab.TabItem label="往年成绩" tabIndex={1}>
          {
            cnIsArray(allList) && allList.length > 0 ?
            <MobileTable data={allList} />
                                                     :
            <NoContent isLoading={loading} />
          }
        </CunovsTab.TabItem>
      </CunovsTab>
      <WhiteSpace />
    </div>
  );
};
export default connect(({ loading, examinationGK }) => ({
  loading: loading.effects['examinationGK/queryList'],
  examinationGK
}))(ExaminationGK);
