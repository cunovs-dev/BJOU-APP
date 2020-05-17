/**
 * @author Lowkey
 * @date 2019/02/26 11:00:34
 * @Description:
 */
import React from 'react';
import { Icon } from 'components';
import InnerHtml from 'components/innerhtml';
import { handlerChangeRouteClick } from 'utils/commonevents';
import styles from './index.less';

const PrefixCls = 'breviary';

const Breviary = (props) => {
  return (
    <div
      className={styles[`${PrefixCls}-outer`]}
      onClick={(e) => handlerChangeRouteClick('details', {
        name: '在线文本',
        type: 'onlineText',
      }, props.dispatch, e)}
    >
      <div className={styles[`${PrefixCls}-outer-content`]} >
        <div ><InnerHtml data={props.data} /></div >
      </div >
      <div className={styles[`${PrefixCls}-mask`]} >
        查看详情...
      </div >
    </div >
  );
};

Breviary.defaultProps = {
  data: '',
};
Breviary.propTypes = {};

export default Breviary;
