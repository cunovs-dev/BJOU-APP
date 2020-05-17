import React from 'react';
import { List } from 'antd-mobile';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const PrefixCls = 'titlebox';

function TitleBox (props) {
  return (
    <div className={styles[`${PrefixCls}-outer`]}>
      <List>
        <List.Item extra={<span onClick={props.handlerClick}>{props.sup}</span>}>
          <span className={styles[`${PrefixCls}-title`]} />
          {props.title}
        </List.Item>
      </List>
    </div>
  );
}

TitleBox.propTypes = {
  title: PropTypes.string.isRequired,
  sup: PropTypes.string.isRequired,
};

TitleBox.defaultProps = {
  title: '',
  sup: '更多>',
  handlerClick: null,
};
export default TitleBox;
