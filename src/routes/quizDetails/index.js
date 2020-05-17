/**
 * @author Lowkey
 * @date 2019/02/28 11:58:51
 * @Description:
 */
import React from 'react';
import Nav from 'components/nav';
import classNames from 'classnames';
import { connect } from 'dva';
import { Icon, List, Button, NoticeBar, WingBlank, WhiteSpace, Drawer, Toast } from 'components';
import { getImages, getErrorImg, getLocalIcon } from 'utils';
import Nocontent from 'components/nocontent';
import Examination from './components/examination';
import styles from './index.less';


const PrefixCls = 'quizDetails';


@connect(({ quizDetails, loading }) => ({ // babel装饰器语法糖
  quizDetails,
  loading,
  loadingFirst: loading.effects[`${PrefixCls}/queryExamination`],
  loadingQuiz: loading.effects[`${PrefixCls}/queryLastTimeExamination`],
}))
class QuizDetails extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    };
  }


  componentDidMount () {
    document.scrollTop = 0;

  }

  onOpenChange = () => {
    if (!this.state.open) {
      const { dispatch, quizDetails: { attemptid = '' } } = this.props;
      dispatch({
        type: 'quizDetails/querySummary',
        payload: {
          attemptid
        }
      });
    }
    this.setState({ open: !this.state.open });
  };

  hanlerSubmit = (data, type = 'progress') => {
    const { attemptid = '', } = this.props.quizDetails;
    const { name, quizid = '' } = this.props.location.query;
    this.props.dispatch({
      type: 'quizDetails/sendQuiz',
      payload: {
        data,
        attemptid,
        timeup: type === 'auto' ? 1 : 0,
        finishattempt: type === 'auto' ? 1 : 0,
        type,
        name,
        quizid
      }
    });
  };

  sidebar = (navigator) => {
    const { quizDetails: { page = '', navmethod = '' } } = this.props;
    return (
      <List className={styles.list} >
        {navigator.map((item, index) => {
          return (<List.Item
            key={item.slot}
            extra={item.status}
            arrow={navmethod === 'sequential' ? '' : 'horizontal'}
            onClick={navmethod !== 'sequential' ? () => this.child.navigatorClick(item.page) : this.warningClick}
          >
            <span
              style={{ paddingLeft: '10px' }}
              className={classNames({ [styles.active]: item.page == page })}
            >
              {item.type !== 'description' ? `题目${item.number}` : '信息'}
            </span >
          </List.Item >);
        })}
        <List.Item
          arrow="horizontal"
          onClick={() => this.child.onSubmit('finish')}
        >
          结束答题
        </List.Item >
      </List >
    );
  };

  onRef = (ref) => {
    this.child = ref;
  };

  warningClick = () => {
    Toast.fail('只能按顺序答题');
  };

  render () {
    const { name, quizid = '', timelimit = 0 } = this.props.location.query,
      { navigator, navmethod = '', } = this.props.quizDetails,
      { loadingQuiz, loadingFirst } = this.props;
    const props = {
      quizid,
      navmethod,
      timelimit
    };
    return (
      <div className={styles[`${PrefixCls}-outer`]} >
        <Nav
          title={name}
          dispatch={this.props.dispatch}
          renderNavRight={
            <Icon
              type={getLocalIcon('/components/navigation.svg')}
              color="#fff"
              onClick={this.onOpenChange}
            />
          }
          isAlert
        />
        <Drawer
          className={styles[`${PrefixCls}-my-drawer`]}
          style={{ minHeight: document.documentElement.clientHeight - 45 }}
          sidebar={this.sidebar(navigator)}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
          position="right"
        >
          {loadingQuiz || loadingFirst ? <Nocontent isLoading={loadingQuiz || loadingFirst} /> :
            <div className={styles[`${PrefixCls}-outer-container`]} >
              <Examination onRef={this.onRef} {...props} hanlerSubmit={this.hanlerSubmit} />
            </div >}
        </Drawer >
      </div >
    );
  }
}


export default QuizDetails;
