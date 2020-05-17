/**
 * @author Lowkey
 * @date 2020/02/28 10:28:41
 * @Description:
 */
import React from 'react';
import { List, Popover } from 'antd-mobile';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const PrefixCls = 'selectBox';

class SelectBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      choice: props.defaultChoice,
      visible: false
    };
  }

  onSelect = (opt) => {
    this.setState({
      choice: opt.props.children,
      visible: false
    });
  };

  render () {
    const { overlay } = this.props,
      renderOverlay = () => {
        const arr = [];
        overlay.map(item => (
          arr.push(
            (<Popover.Item disabled	={this.state.choice === item.label} key={item.key} value={item.value}>{item.label}</Popover.Item>)
          )
        ));
        return arr;
      };
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <List>
          <List.Item extra={
            <Popover
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={this.state.visible}
              overlay={renderOverlay()}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [10, 10]
              }}
              onSelect={this.onSelect}
            >
              <span
                className={styles.choice}
                onClick={this.props.handlerClick}
              >
                {this.state.choice}
              </span>
            </Popover>
          }
          >
            <span className={styles[`${PrefixCls}-title`]} />
            {this.props.title}
          </List.Item>
        </List>
      </div>
    );
  }
}

SelectBox.propTypes = {
  title: PropTypes.string.isRequired,
  defaultChoice: PropTypes.string.isRequired,
  overlay: PropTypes.array.isRequired
};

SelectBox.defaultProps = {
  title: '',
  defaultChoice: '',
  overlay: [],
  handlerClick: null
};
export default SelectBox;
