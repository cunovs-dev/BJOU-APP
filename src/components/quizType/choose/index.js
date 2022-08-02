import React from 'react';
import { connect } from 'dva';
import { Radio, List, Checkbox } from 'components';
import { createForm } from 'rc-form';
import ResultIcon from '../icon';
import styles from './index.less';

const RadioItem = Radio.RadioItem,
  CheckboxItem = Checkbox.CheckboxItem;


class Choose extends React.Component {
  constructor (props) {
    const { answer } = props;
    super(props);
    this.state = {
      radioValue: answer.find(item => item.checked === true) && answer.find(item => item.checked === true).value,
      value: this.initValue()
    };
  }

  componentWillMount () {

  }

  componentWillReceiveProps () {
    const { answer } = this.props;
    this.setState({
      radioValue: this.state.radioValue,
      value: this.state.value,
    });
  }

  componentDidMount () {
    const { answer } = this.props;
    this.setState({
      radioValue: this.state.radioValue,
      value: this.state.value
    });
  }


  radioChange = (value) => {
    this.setState({ radioValue: value }, () => {
      this.props.onChange(this.state.radioValue);
    });
  };

  initValue = () => {
    const value = {};
    this.props.answer.map(item => {
      value[item.id] = (item.checked === true);
    });
    return value;
  };

  checkboxChange = (item) => {
    const { value } = this.state;
    value[item.id] = !value[item.id];
    this.setState({ value }, () => {
      let hasValue = false;
      for (let att in value) {
        hasValue = !!value[att];
        if (hasValue === true) {
          break;
        }
      }
      this.props.onChange(hasValue ? value : '');
    });
  };

  render () {
    const { answer, type = 'quiz' } = this.props;
    return (
      <List >
        {
          answer.map((item, i) => {
            if (item.type === 'radio') {
              return (
                <RadioItem
                  wrap
                  key={item.id}
                  checked={this.state.radioValue === item.value}
                  onClick={type === 'quiz' ? () => this.radioChange(item.value) : null}
                >
                  <div className={styles.answer} >
                    <div className={styles.htmlBox} dangerouslySetInnerHTML={{ __html: item.label }}/>
                    {
                      item.currect !== '' && <ResultIcon currect={item.currect} />
                    }
                  </div >
                </RadioItem >);
            }
            return (
              <CheckboxItem
                key={i}
                wrap
                checked={this.state.value[item.id] === true}
                onChange={type === 'quiz' ? () => this.checkboxChange(item) : () => (false)}
              >
                <div className={styles.answer} >
                  <div className={styles.htmlBox} dangerouslySetInnerHTML={{ __html: item.label }}/>
                  {
                    item.currect !== '' && <ResultIcon currect={item.currect} />
                  }
                </div >
              </CheckboxItem >
            );
          })
        }
      </List >
    );
  }
}

Choose.propTypes = {};
Choose.defaultProps = {
  type: 'quiz'
};

export default createForm()(Choose);
