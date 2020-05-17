import React from 'react';
import { List, Checkbox } from 'components';
import styles from './index.less';

const CheckboxItem = Checkbox.CheckboxItem;

class FormCheckBox extends React.Component {
  constructor (props) {
    super(props);
    const { items = [], value = {} } = props;
    this.CheckboxItems = items.map((option) => {
      const { value: itemValue, label, id, checked = false } = option;
      return { value: itemValue, label, id, checked };
    });
    this.state = {
      value: Object.keys(value).length === 0 ? this.initValue() : value
    };
  }

  initValue = () => {
    const value = {};
    this.CheckboxItems.map(item => {
      value[item.id] = (item.checked === true);
    });
    return value;
  };

  onChange = (item) => {
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
    return (
      <div id={this.props.keys || ''} className={styles.checkbox} >
        {this.CheckboxItems.map(item =>
          <CheckboxItem key={item.id} checked={this.state.value[item.id] === true} wrap
                        onClick={() => setTimeout(this.onChange.bind(null, item), 1)} >
            {item.label}
          </CheckboxItem >)}
      </div >
    );
  }
}

export default FormCheckBox;
