/**
 * @author Lowkey
 * @date 2019/04/03 15:45:07
 * @Description:
 */
import React from 'react';
import { Icon, Toast } from 'components';
import { getLocalIcon, getCommonDate, renderSize } from 'utils';
import { handlerTagAHrefParseParam } from 'utils/commonevents';
import config, { userTag } from 'utils/config';
import cookie from 'utils/cookie';
import styles from './index.less';

const { userTag: { usertoken } } = config,
  // eslint-disable-next-line import/no-named-as-default-member
  { _cg } = cookie;
const userToken = () => _cg(usertoken);
const getIcon = (type) => {
  if (RegExp(/pdf/)
    .exec(type)) {
    return '/components/PDF.svg';
  } else if (RegExp(/word/)
    .exec(type)) {
    return '/components/DOCX.svg';
  } else if (RegExp(/xlsb/)
    .exec(type)) {
    return '/components/EXCEL.svg';
  } else if (RegExp(/^(\s|\S)+(jpeg|jpg|png|JPG|PNG|)+$/)
    .exec(type)) {
    return '/components/IMAGE.svg';
  }
  return '/components/file.svg';
};

class FolderList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isDownLoad: -1,
    };
  }

  downLoaded = (i = -1) => {
    this.setState({
      isDownLoad: i
    });
  };

  fileClick = (item, i) => {
    const { fileIdPrefix = '' } = this.props;
    const { fileurl, filename, mimetype, timemodified } = item;
    handlerTagAHrefParseParam({
      fileurl,
      filename,
      mimetype,
      modname: 'resource',
      fileIdPrefix: `${fileIdPrefix}${fileIdPrefix && fileIdPrefix.indexOf(fileIdPrefix.length - 1) === '_' ? '' : '_'}`,
      callback: (loading) => this.downLoaded(loading === true ? i : -1),
    }, '', null);
  };

  render () {
    const { data } = this.props;
    const { isDownLoad } = this.state;
    return (
      <div >
        {cnIsArray(data) &&
        data.length > 0 &&
        data.map((item, i) => {
          const { filename, timemodified, filesize } = item;
          return (
            <div
              key={i}
              className={styles.outer}
              onClick={isDownLoad > -1 ? null : this.fileClick.bind(null, item, i)}
            >
              <div className={styles.img} >
                <Icon type={getLocalIcon(getIcon(filename))} size="lg" color="#22609c" />
              </div >
              <div className={styles.content} >
                <div className={styles.left} >
                  <span >{filename}</span >
                  <span >{getCommonDate(timemodified)}</span >
                </div >
                <div className={styles.right} >
                  {isDownLoad === i ? <Icon type={'loading'} size="xs" color="#22609c" /> : renderSize(filesize)}
                </div >
              </div >
            </div >
          );
        })
        }
      </div >
    );
  }
}

export default FolderList;
