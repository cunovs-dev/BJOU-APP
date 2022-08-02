import React from 'react';
import { Radio } from 'components';

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
      })
    ;
    return (
      <div>
        {radioItems.map(item =>
          <RadioItem
            checked={this.state.value === item.value}
            wrap
            onClick={() => setTimeout(this.onChange.bind(null, item.value), 1)}
          >
            {item.label}
          </RadioItem>)}
      </div>
    );
  }
}

export default FormRadio;
