import React, { Component } from 'react';
import { connect } from 'dva';
import Nav from 'components/nav';
import Introduction from 'components/introduction';
import NoContent from 'components/nocontent';
import {
  Button,
  WhiteSpace,
  WingBlank,
  Checkbox,
  Card,
  Modal
} from 'components';
import { routerRedux } from 'dva/router';
import { getLocalIcon, getCommonDate } from 'utils';
import { Chart, Axis, Geom, Coord, Global, Tooltip } from 'bizgoblin';
import StatusBox from 'components/statusBox';
import TitleBox from 'components/titlecontainer';
import styles from './index.less';

const alert = Modal.alert;
const PrefixCls = 'choice',
  CheckboxItem = Checkbox.CheckboxItem;


const defs = [{
  dataKey: 'text',
  tickCount: 5,
}];

const formatLabel = (text, index, total) => {
  const textCfg = {};
  if (index === 0) {
    textCfg.textAlign = 'left';
  } else if (index === total - 1) {
    textCfg.textAlign = 'right';
  }
  return textCfg;
};

const label = {
  textStyle: {
    fill: '#000', // 文本的颜色
    fontSize: '18px', // 文本大小
  }
};

const getData = (data, key) => {
  const res = [];
  data.length > 0 && data.map(items => {
    if (items.text) {
      res.push({
        text: items.text,
        [key]: parseInt(items.numberofuser),
        numberofuser: parseInt(items.numberofuser)
      });
    }
  }
  );
  return res;
};

class Choice extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
  }

  onSubmit = () => {
    const { values } = this.props.choice;
    const { voteId = '', } = this.props.location.query;
    this.props.dispatch({
      type: 'choice/sendChoice',
      payload: {
        choiceid: values.join(','),
        voteId
      }
    });
  };

  onBackSubmit = () => {
    this.props.dispatch({
      type: 'app/updateBackModal',
      payload: {
        showBackModal: false
      }
    });
    this.props.dispatch(routerRedux.goBack());
  };

  showModal = () => {
    alert('提交', '确定要保存吗???', [
      { text: '取消', onPress: () => console.log('ok') },
      {
        text: '保存',
        onPress: () => {
          this.onSubmit();
        }
      },
    ]);
  };

  showBackMoadl = () => {
    alert('返回？', '返回后不保存当前内容！', [
      {
        text: '取消',
        onPress: () => this.props.dispatch({
          type: 'app/updateBackModal',
          payload: {
            showBackModal: false
          }
        })
      },
      { text: '确定', onPress: () => this.onBackSubmit() },
    ]);
  };

  handleOnChange = (value) => {
    this.setState({
      isChecked: true
    });
    const { values = [], data: { allowmultiple = false } } = this.props.choice;
    if (allowmultiple) {
      let currentValue = values;
      if (currentValue.includes(value)) {
        currentValue.remove(value);
      } else {
        currentValue.push(value);
      }
      this.props.dispatch({
        type: 'choice/updateState',
        payload: {
          values: currentValue,
        },
      });
    } else {
      this.props.dispatch({
        type: 'choice/updateState',
        payload: {
          values: [value],
        },
      });
    }
  };

  isChoiced = () => {
    const { data: { chooseData = [] } } = this.props.choice;
    return chooseData.find(item => item.checked === true);
  };

  layoutInputItem = (list) => {
    const { values } = this.props.choice;
    return (
      list.map(item => {
        const { text = '', id = '', checked } = item;
        return text && id ?
          <CheckboxItem
            key={id}
            wrap
            checked={values && values.includes(id) || checked}
            onClick={this.isChoiced() ? null : this.handleOnChange.bind(null, id)}
          > {text}
          </CheckboxItem > : '';
      })
    );
  };

  renderChart = () => {
    const { data = {}, } = this.props.choice,
      { chooseResult, axisDataKey = '数量', showresults, expiredMsg } = data;
    if (showresults === 0) {
      return <NoContent context="结果不公开" />;
    }
    if (showresults === 1 && !this.isChoiced()) {
      return <NoContent context="结果现在不能查看" />;
    }
    if (showresults === 2 && !expiredMsg) {
      return <NoContent context="结果现在不能查看" />;
    }
    return (
      <div className={styles.chart} >
        <Chart data={getData(chooseResult, axisDataKey)} defs={defs} pixelRatio={window.devicePixelRatio * 2} >
          <Axis dataKey="text" label={label} grid={null} />
          <Axis dataKey="numberofuser" label={formatLabel} line={null} grid={Global._defaultAxis.grid} />
          <Tooltip />
          <Coord transposed />
          <Geom geom="interval" position={`text*${axisDataKey}`} />
        </Chart >
      </div >
    );
  };

  render () {
    const { name = '', courseid = '', } = this.props.location.query,
      { data = {}, values = {} } = this.props.choice,
      { chooseData = [], chooseResult, intro = '', timeclose = 0, axisDataKey = '数量', notStartedMsg, expiredMsg, showresults } = data,
      { loadingQuestions = false, loadingSend = false } = this.props;
    const { showBackModal = false } = this.props.app;
    // anonymous变为了字符"1"
    return (
      <div >
        <Nav
          title={name}
          dispatch={this.props.dispatch}
          isAlert={!this.isChoiced() && this.state.isChecked}
        />
        <WhiteSpace />
        {
          intro !== '' ?
            <div className={styles.describe} >
              <Introduction data={intro} courseid={courseid} dispatch={this.props.dispatch} />
            </div >
            : ''
        }
        <WhiteSpace />
        {
          notStartedMsg || expiredMsg ?
            <StatusBox status={'unuseful'} content={notStartedMsg || expiredMsg} color="#d24747" />
            :
            loadingQuestions ?
              <NoContent isLoading={this.props.loadingQuestions} />
              :
              <WingBlank size="xs" >
                <WhiteSpace size="lg" />
                <Card className={styles.card} >
                  <Card.Body >
                    {this.layoutInputItem(chooseData)}
                  </Card.Body >
                </Card >
                <WhiteSpace size="lg" />
                {
                  !this.isChoiced() ?
                    <Button
                      loading={loadingSend}
                      type="primary"
                      disabled={values.length === 0}
                      onClick={this.showModal}
                    >保存我的选择
                    </Button >
                    :
                    null
                }
              </WingBlank >
        }
        <WhiteSpace size="lg" />
        <TitleBox title="回复" sup="" />
        {
          cnIsArray(chooseResult) && this.renderChart()
        }
        {showBackModal && this.showBackMoadl()}
      </div >
    );
  }
}

export default connect(({ loading, choice, app }) => ({
  loadingQuestions: loading.effects[`${PrefixCls}/querys`],
  loadingSend: loading.effects[`${PrefixCls}/sendChoice`],
  choice,
  app
}))(Choice);
