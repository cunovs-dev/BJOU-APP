/**
 * @author Lowkey
 * @date 2019/02/26 11:00:46
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import Tag from 'components/tag';
import styles from './index.less';

const PrefixCls = 'photobox';

const PhotoBox = (props) => (
  <div>
    <div className={styles[`${PrefixCls}-outer`]} style={{ backgroundImage: `url(${props.bg})` }}>
      <div className={styles[`${PrefixCls}-teacher`]}>
        {props.tutor.length > 0 ?
          props.tutor.slice(0, 2)
            .map(item => (
              <span
                key={item.id}
                className={styles[`${PrefixCls}-tutorteacher`]}
                onClick={props.handlerChartClick.bind(null, 'conversation', {
                  fromuserid: item.id,
                  name: item.userData ? item.userData.fullname : ''
                }, props.dispatch)}
              >
                {item.roleData ? item.roleData.roleName : ''}：{item.userData ? item.userData.fullname : ''}
              </span>
            )) : null}
        {props.master.length > 0 ?
          <span
            key={props.master[0].id}
            className={styles[`${PrefixCls}-masterteacher`]}
            onClick={props.handlerChartClick.bind(null, 'conversation', {
              fromuserid: props.master[0].id,
              name: props.master[0].fullname
            }, props.dispatch)}
          >
      责任教师：{props.master[0].fullname || ''}
          </span> :
          null}
      </div>
    </div>
    {props.hasAttendance && props.daypass !== '0' && !props.isTeacher ?
      <div className={styles[`${PrefixCls}-attendance-outer`]}>
        <div className={styles[`${PrefixCls}-attendance`]} onClick={props.attendanceClick}>
          <div className={styles[`${PrefixCls}-attendance-info`]}>
            <Icon type={getLocalIcon('/components/attendance.svg')} size="xs" color="#22609c" />
            <span>{props.openState === '1' ? '考勤' : '本周考勤'}</span>
          </div>
          {
            props.openState === '1' ?
              <Tag
                text={props.stat ? '达标' : '未达标'}
                color={props.stat ? '#1eb259' : '#f34e14'}
              />
              :
              <Tag
                text={props.weekStat ? '达标' : '未达标'}
                color={props.weekStat ? '#1eb259' : '#f34e14'}
              />
          }
        </div>
      </div>
      :
      null
    }
  </div>
);
PhotoBox.PropTypes = {
  bg: PropTypes.string.isRequired,
  tutor: PropTypes.string.isRequired,
  master: PropTypes.string.isRequired
};

PhotoBox.defaultProps = {
  tutor: [],
  master: [],
  hasAttendance: false,
  attendanceClick: null,
  handlerChartClick: null,
  weekStat: 0,
  stat: 0,
  isTeacher: false,
  daypass: '0',
  openState: '0'
};
export default PhotoBox;
