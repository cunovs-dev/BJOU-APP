/**
 * @author Lowkey
 * @date 2019/04/03 15:45:07
 * @Description:
 */
import React from 'react';
import { Icon } from 'components';
import { getLocalIcon, getCommonDate } from 'utils';
import config, { userTag } from 'utils/config';
import cookie from 'utils/cookie';
import styles from './index.less';

const { userTag: { usertoken } } = config,
  // eslint-disable-next-line import/no-named-as-default-member
  { _cs, _cr, _cg } = cookie;
const userToken = () => _cg(usertoken);
const getIcon = (type) => {
  if (RegExp(/pdf/)
    .exec(type)) {
    return '/components/PDF.svg';
  } else if (RegExp(/docx/)
    .exec(type)) {
    return '/components/DOCX.svg';
  } else if (RegExp(/xlsb/)
    .exec(type)) {
    return '/components/EXCEL.svg';
  }
  return '/components/file.svg';
};

const Enclosure = (props) => {
  const introattachments = props.data,

    fileClick = (item) => {
      const { fileurl, filename } = item;
      cnDownloadAndOpen(`${fileurl}?token=${userToken()}`, filename);
    };

  return (
    <div >
      {cnIsArray(introattachments) &&
      introattachments.length > 0 &&
      introattachments.map((item, i) => {
        const { filename, timemodified } = item;
        return (
          <div key={i} className={styles.outer} onClick={fileClick.bind(null, item)} >
            <div className={styles.img} >
              <Icon type={getLocalIcon(getIcon(filename))} size="lg" color="#22609c" />
            </div >
            <div className={styles.content} >
              <div className={styles.left} >
                <span >{filename}</span >
                <span >{getCommonDate(timemodified)}</span >
              </div >
              <div className={styles.right} >
                下载
              </div >
            </div >
          </div >
        );
      })
      }
    </div >
  );
};
export default Enclosure;
