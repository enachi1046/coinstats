import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Reactions from './Reactions';
import Source from './Source';
import NewsSearch from './NewsSearch';

class Header extends Component {
  render() {
    const defaultSelected = this.props.sources
      .filter(s => s.isSelected)
      .map(s => s.id);
    return (
      <ul className="news-control-header">
        <li>
          <div className="news-filter-holder">
            <Reactions
              reactions={this.props.reactions}
              _onReactionClick={this.props._onReactionClick}
            />
            <Source
              defaultSelected={defaultSelected}
              sources={this.props.sources}
              onSourceSelect={this.props.onSourceSelect}
            />
          </div>
        </li>
        <li>
          <NewsSearch
            coins={this.props.coins}
            onSearch={this.props.onSearch}
            _onResetSearch={this.props._onResetSearch}
          />
        </li>
      </ul>
    );
  }
}

export default Header;
