import React, { Component } from 'react';
import MultiSelectDropdown from 'addons/MultiSelectDropdown';

class Source extends Component {
  constructor(props) {
    super(props);
  }

  get options() {
    return this.props.sources.map((s) => {
      return {
        label: s.name,
        value: s.id,
      };
    });
  }

  render() {
    return (
      <MultiSelectDropdown
        options={this.options}
        defaultSelected={this.props.defaultSelected}
        onSelect={this.props.onSourceSelect}
      />
    );
  }
}

export default Source;
