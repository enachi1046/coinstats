import React, { Component } from 'react';

import './assets/style.scss';

class Switch extends Component {
  constructor(props) {
    super(props);
  }

  _onChange(e) {
    this.props.onChange(e.target.checked);
  }

  render() {
    const { on: checked, style, className = '', width = 60, ...props } = this.props;

    return (
      <label className={`switch ${className}`}>
        <input type="checkbox" onChange={this._onChange.bind(this)} checked={checked} />
        <span className="switch-slider" />
      </label>
    );
  }
}

export default Switch;
