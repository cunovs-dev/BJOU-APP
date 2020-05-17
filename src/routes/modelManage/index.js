/**
 * @author Lowkey
 * @date 2020/03/23 17:24:36
 * @Description: 模块管理
 */
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  WhiteSpace,
  Grid,
  ActivityIndicator,
  Toast
} from 'components';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { handlerChangeRouteClick } from 'utils/commonevents';
import { allModule } from 'utils/defaults';
import { getLocalIcon } from 'utils';
// import arrayMove from 'array-move';
import Nav from 'components/nav';
import styles from './index.less';

const arrayMoveMutate = (array, from, to) => {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
};

const arrayMove = (array, from, to) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};
class ModelManage extends React.Component {
  constructor (props) {
    super(props);
    const { menus } = props.modelManage;
    this.state = {
      dragModules: menus,
      allModules: allModule || [],
      isEdit: false
    };
  }


  componentWillMount () {

  }


  componentDidMount () {
    const { modelManage } = this.props;
  }

  componentWillUnmount () {
    this.setState({});
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ dragModules }) => ({
      dragModules: arrayMove(dragModules, oldIndex, newIndex)
    }));
  };

  renderItem = (el) => {
    const { icon = '', text = '', id = '' } = el;
    return (
      <div className={styles.items} key={id}>
        <img className={styles.img} src={icon} alt="" />
        <div className={styles.text}>{text}</div>
        {
          this.state.isEdit ?
          <Icon className={styles.sup} type={getLocalIcon('/sprite/add.svg')} size="xs" />
                            :
          null
        }
      </div>
    );
  };

  edit = () => {
    const { chooseMenus } = this.props.modelManage;
    this.setState({
      isEdit: true,
      allModules: chooseMenus
    });
  };

  cancel = () => {
    const { menus } = this.props.modelManage;
    this.setState({
      dragModules: menus,
      allModules: allModule,
      isEdit: false
    });
  };

  okCallback = () => {
    this.setState({
      allModules: allModule,
      isEdit: false
    });
  };

  onOk = () => {
    if (this.state.dragModules.length === 0) {
      Toast.fail('请至少保留一个模块');
    } else {
      const arr = [];
      this.state.dragModules.map(item => {
        arr.push(item.id);
      });
      this.props.dispatch({
        type: 'modelManage/sendMenus',
        payload: {
          userConfig: arr.join(',')
        },
        callback: this.okCallback
      });
    }
  };

  gridClick = (item) => {
    const { path = '', text = '', queryType } = item;
    if (this.state.isEdit) {
      if (this.state.dragModules.length >= 7) {
        Toast.fail('最多只能选择7各模块');
      } else {
        this.setState({
          dragModules: [...this.state.dragModules, item],
          allModules: this.state.allModules.filter(ev => ev.id !== item.id)
        });
      }
    } else {
      handlerChangeRouteClick(path, {
        name: text,
        queryType
      }, this.props.dispatch);
    }
  };

  dragGridClick = (item) => {
    this.setState({
      dragModules: this.state.dragModules.filter(ev => ev.id !== item.id),
      allModules: [...this.state.allModules, item]
    });
  };

  renderRight = () => (
    this.state.isEdit ?
    <span style={{ color: '#fff' }} onClick={this.onOk}>确定</span>
                      :
    <span style={{ color: '#fff' }} onClick={this.edit}>编辑</span>

  );

  render () {
    const { sending = false } = this.props;
    const SortableItem = SortableElement(({ value }) => {
        const { icon = '', text = '' } = value;
        return (
          <div className={styles.dragItems} onClick={() => this.dragGridClick(value)}>
            <img className={styles.dragImg} src={icon} alt="" />
            <div className={styles.dragText}>{text}</div>
            {
              this.state.isEdit ?
              <Icon className={styles.sup} type={getLocalIcon('/sprite/close.svg')} size="xs" color="#ddd" />
                                :
              null
            }
          </div>
        );
      }),
      SortableGird = SortableContainer(({ items }) => {
        return (
          <div className={styles.grid}>
            <div className={styles.text}>
              你可以将常用的学习模块添加到首页，也可以按住拖动调整学习模块顺序
            </div>
            {
              items.length > 0 ?
              items.map((value, index) => (
                <SortableItem disabled={!this.state.isEdit} key={`item-${index}`} index={index} value={value} />
              ))
                               :
              <div className={styles.empty}>
                请选择您常用的模块到首页
              </div>
            }
          </div>
        );
      });
    return (
      <div className={styles.outer}>
        <Nav
          title="学习模块管理"
          dispatch={this.props.dispatch}
          renderNavRight={this.renderRight()}
          isGoBack={!this.state.isEdit}
          icon={<span style={{ color: '#fff' }} onClick={this.cancel}>取消</span>}
        />
        {
          this.state.isEdit ?
          <SortableGird pressDelay={1} axis="xy" items={this.state.dragModules} onSortEnd={this.onSortEnd} />
                            :
          null
        }
        <div className={styles.allModel}>
          <div className={styles.title}>
            全部学习模块
          </div>
          <Grid
            data={this.state.allModules}
            hasLine={this.state.isEdit}
            columnNum={4}
            renderItem={this.renderItem}
            onClick={this.gridClick}
          />
        </div>
        <ActivityIndicator animating={sending} toast text="修改中..." />
      </div>
    );
  }
}

ModelManage.defaultProps = {};
ModelManage.propTypes = {};

export default connect(({ loading, modelManage }) => ({
  modelManage,
  loading,
  sending: loading.effects['modelManage/sendMenus']
}))(ModelManage);
