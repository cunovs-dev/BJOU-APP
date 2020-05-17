import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const PrefixCls = 'discussionarea';

function DiscussionArea (props) {
  return (
    <div className={styles[`${PrefixCls}-outer`]}>
      {props.title}
    </div>
  );
}

DiscussionArea.propTypes = {
  title: PropTypes.string.isRequired,
};

DiscussionArea.defaultProps = {
  title: '',

};
export default DiscussionArea;
