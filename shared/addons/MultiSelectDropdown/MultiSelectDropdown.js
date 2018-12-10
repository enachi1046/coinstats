import React, { Component } from 'react';
import { isClient } from '../../utils/env/index';

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justOpnened: false,
      showMenu: false,
      selected: props.defaultSelected || [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleValue = this.toggleValue.bind(this);
  }

  closeSourceFilter(event) {
    const placeHolder = document.getElementsByClassName('multi-select-dropdown-items-show')[0];
    if (!!placeHolder && !this.state.justOpnened
      && !event.target.classList.contains('multi-select-dropdown-items')
      && !event.target.classList.contains('multi-select-dropdown-item')
      && placeHolder.classList.contains('multi-select-dropdown-items-show')) {
      this.setState({ showMenu: false });
    } else {
      this.setState({ justOpnened: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.showMenu && this.state.showMenu) {
      this.setState({ justOpnened: true });
    }
  }

  componentDidMount() {
    if (isClient) {
      document.addEventListener('click', this.closeSourceFilter.bind(this));
    }
  }

  componentWillUnmount() {
    if (isClient) {
      document.removeEventListener('click', this.closeSourceFilter.bind(this));
    }
  }

  toggle() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  toggleValue(v) {
    const selected = this.state.selected;
    const index = selected.indexOf(v);
    if (index === -1) {
      selected.push(v);
    } else {
      selected.splice(index, 1);
    }
    this.setState({ selected }, () => {
      this.props.onSelect(selected);
    });
  }

  render() {
    const { style = {}, options, placeholder = `Filtered (${this.state.selected.length})`, ...props } = this.props;

    const itemsClassNames = ['multi-select-dropdown-items'];
    if (this.state.showMenu) {
      itemsClassNames.push('multi-select-dropdown-items-show');
    }

    return (
      <div className="multi-select-dropdown-container" style={{ ...style }}>
        <button className="multi-select-dropdown-placeholder" type="button" onClick={() => this.toggle()}>
          {placeholder}
        </button>
        <div className={itemsClassNames.join(' ')}>
          {options.map(({ label, value }) => {
            const checked = this.state.selected.indexOf(value) !== -1;
            const itemClassNames = ['multi-select-dropdown-item'];
            if (checked) {
              itemClassNames.push('multi-select-dropdown-item-selected');
            }
            return (
              <div className={itemClassNames.join(' ')} key={value} onClick={() => this.toggleValue(value)}>
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MultiSelectDropdown;
