import React, { Component } from 'react';
import MultiSelectSearchDropdown from 'addons/MultiSelectSearchDropdown';

class NewsSearch extends Component {
  constructor(props) {
    super(props);
  }

  get items() {
    return this.props.coins.map((coin) => {
      return {
        label: (
          <React.Fragment>
            <img src={coin.iconUrl} alt="" />
            <p>
              {coin.name} ({coin.symbol})
            </p>
          </React.Fragment>
        ),
        search: [coin.name, coin.symbol],
        value: `${coin.name} ${coin.symbol}`,
      };
    });
  }

  render() {
    return (
      <div className="search-div">
        <MultiSelectSearchDropdown
          items={this.items}
          onChange={this.props.onSearch}
          _onResetSearch={this.props._onResetSearch}
          showX
        />
      </div>
    );
  }
}

export default NewsSearch;
