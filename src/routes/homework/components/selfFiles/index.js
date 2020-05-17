/**
 * @author Lowkey
 * @date 2019/04/03 15:45:07
 * @Description:
 */
import React from 'react';
import { Icon } from 'components';
import { getLocalIcon, getCommonDate } from 'utils';
import Breviary from 'components/breviary';
import Enclosure from 'components/enclosure';
import styles from './index.less';


const SelfFiles = (props) => {
  const { data, fileIdPrefix } = props;
  const Result = data && data.filter(item => item.type !== 'comments');
  return (
    <div className={styles.outer} >
      {Result && Result.map((item, i) => {
        return (
          item.type === 'onlinetext' ?
            <div
              className={styles.text}
              key={i}
            >
              <h3 >{item.name}</h3 >
              <Breviary data={item.editorfields[0].text} dispatch={props.dispatch} />
            </div >
            : item.files && item.files.length > 0 ?
              <div className={styles.file} key={i} >
                <h3 >{item.name}</h3 >
                <Enclosure data={item.files} fileIdPrefix={fileIdPrefix} />
              </div >
              :
              ''
        );
      })}
    </div >
  );
};
export default SelfFiles;
