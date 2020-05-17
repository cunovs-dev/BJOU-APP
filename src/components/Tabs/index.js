/**
 * @author Lowkey
 * @date 2020/03/26 14:57:44
 * @Description: 为了一个样式自己写一个Tabs组件。。。
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getOffsetTopByBody } from 'utils';
import classnames from 'classnames';
import styles from './index.less';

function TabItem (props) {
  return <div {...props} />;
}

class CunovsTab extends React.Component {

  static TabItem = TabItem;

  constructor (props) {
    super(props);
    this.state = {
      initIndex: props.defaultIndex
    };
  }

  componentDidMount () {

  }

  changeTab = newIndex => {
    if (typeof this.props.onTabClick === 'function') this.props.onTabClick(newIndex);
    this.setState({
      initIndex: newIndex
    });
  };

  render () {
    const items = this.props.children.filter(item => item.type.name === TabItem.name);
    const { initIndex } = this.state;
    return (
      <div className={styles.wrapper}>
        <div className={styles.tabmenu}>
          {items.map(({ props: { tabIndex, label } }) => (
            <div
              className={styles['tab-item']}
              onClick={() => this.changeTab(tabIndex)}
              key={tabIndex}
            >
              <span className={
                classnames(
                  styles.inner,
                  {
                    [styles.active]: initIndex === tabIndex
                  }
                )
              }
              >
                <span className={styles.dot} />
              </span>
              {label}
            </div>
          ))}
        </div>
        <div>
          {items.map(({ props }) => (
            <div
              {...props}
              className={styles['tab-view_item']}
              key={props.tabIndex}
              style={{ display: initIndex === props.tabIndex ? 'block' : 'none' }}
            />
          ))}
        </div>
      </div>
    );
  }
}


CunovsTab.defaultProps = {
  children: [],
  defaultIndex: 0,
  label: ''
};
CunovsTab.propTypes = {};
export default CunovsTab;
