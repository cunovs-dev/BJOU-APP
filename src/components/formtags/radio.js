import React from 'react';
import { Radio } from 'components';
import styles from './index.less'

const RadioItem = Radio.RadioItem;

class FormRadio extends React.Component {
  constructor (props) {
    super(props);
    const { value = '' } = props;
    this.state = {
      value
    };
  }

  onChange = (value) => {
    this.setState({ value }, () => {
      this.props.onChange(this.state.value);
    });
  };

  render () {
    let radioItems = this.props.items.map((option) => {
      const { value, label, id } = option;
      return { value, label, id };
    });
    return (
      <div id={this.props.keys || ''} className={styles.radio}>
        {radioItems.map(item =>
          (<RadioItem
            key={`f_radio_${item.id}`}
            checked={this.state.value == item.value}
            wrap
            onClick={() => setTimeout(this.onChange.bind(null, item.value), 1)}
          >
            <div className={styles.htmlBox} dangerouslySetInnerHTML={{ __html: item.label }}/>
          </RadioItem >))}
      </div >
    );
  }
}

export default FormRadio;
