import React, { Component } from 'react';

class MultiSelectSearchDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      searchString: '',
    };
    this.toggle = this.toggle.bind(this);
    this.addValue = this.addValue.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInput) {
        this.setState({ showMenu: false });
      }
    });
  }

  toggle(show) {
    this.setState({
      showMenu: show,
    });
  }

  addValue(v) {
    const arrSearchString = this.state.searchString
      .split(',')
      .map((str) => {
        return str.trim();
      })
      .filter((str) => {
        return str.length;
      });
    const lastValue = arrSearchString.pop();
    arrSearchString.push(v);
    const searchString = `${arrSearchString.join(', ')}, `;
    this.setState({ searchString, show: false }, () => {
      this.props.onChange(arrSearchString.join(', '));
    });
  }

  _onInputChange(e) {
    this.setState({
      searchString: e.target.value,
    });
  }

  get lastSearchString() {
    return this.state.searchString
      .split(', ')
      .slice(-1)[0]
      .toLowerCase()
      .trim();
  }

  get filteredItems() {
    const searchString = this.lastSearchString;
    if (!searchString.length) {
      return [];
    }
    return this.props.items.filter((item) => {
      return item.search.filter((str) => {
        return str.toLowerCase().trim().indexOf(searchString) === 0;
      }).length;
    });
  }

  get showMenu() {
    if (!this.state.showMenu) {
      return false;
    }
    return !!this.lastSearchString.length;
  }

  _onClearClick() {
    this.setState({ searchString: '' });
    this.props._onResetSearch();
  }

  get icon() {
    if (this.state.searchString.length > 0 && this.props.showX) {
      return (
        <i
          className="fa fa-times fa-2x multi-select-search-dropdown-placeholder-img cursor-pointer"
          onClick={this._onClearClick.bind(this)}
        />
      );
    } else {
      return <i className="fas fa-search multi-select-search-dropdown-placeholder-img" />;
    }
  }

  render() {
    const { style = {}, options, placeholder = 'Search', ...props } = this.props;

    return (
      <div className="multi-select-search-dropdown-container" style={{ ...style }}>
        <div className="multi-select-search-dropdown-placeholder-base-div">
          <input
            ref={(c) => {
              this.searchInput = c;
            }}
            className="multi-select-search-dropdown-placeholder"
            placeholder={placeholder}
            onFocus={() => this.toggle(true)}
            onChange={this._onInputChange}
            value={this.state.searchString}
          />
        </div>
        <div className="search-results" style={{ display: this.showMenu ? 'block' : 'none' }}>
          <div className="search-r-inner">
            {this.filteredItems.map(({ label, value, search }, ind) => {
              return (
                <a href="#" key={ind} onClick={() => this.addValue(value)}>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default MultiSelectSearchDropdown;
