import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { isClient } from 'utils/env/index';
import { childOf } from 'utils/dom';
import Dropdown from 'react-dropdown';

const PAGE_SIZE_OPTIONS = [
  {
    value: 20,
    label: '20',
  },
  {
    value: 100,
    label: '100',
  },
  {
    value: 300,
    label: '300',
  },
  {
    value: 'show-all',
    label: 'Show All',
  },
];

class Filters extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  _onDocumentClick(event) {
    if (!childOf(event.target, this.drop)) {
      this.setState({
        active: false,
      });
    }
  }

  componentDidMount() {
    if (isClient) {
      document.addEventListener('click', this._onDocumentClick.bind(this));
    }
  }

  componentWillUnmount() {
    if (isClient) {
      document.removeEventListener('click', this._onDocumentClick.bind(this));
    }
  }

  get hasPrev() {
    return this.props.currPage > 1;
  }

  get hasNext() {
    return this.props.currPage < this.props.totalPages;
  }

  get prevLink() {
    if (this.hasPrev) {
      return `?pagesize=${this.props.pageSize}&page=${this.props.currPage - 1}${
        this.props.orderkey ? `&orderkey=${this.props.orderkey}` : ''
      }${this.props.orderdir ? `&orderdir=${this.props.orderdir}` : ''}`;
    }
    return null;
  }

  get nextLink() {
    if (this.hasNext) {
      return `?pagesize=${this.props.pageSize}&page=${this.props.currPage + 1}${
        this.props.orderkey ? `&orderkey=${this.props.orderkey}` : ''
      }${this.props.orderdir ? `&orderdir=${this.props.orderdir}` : ''}`;
    }
    return null;
  }

  _onPaginationPrevClick(e) {
    e.preventDefault();
    if (this.hasPrev) {
      this.props.onPrev();
    }
  }

  _onPaginationNextClick(e) {
    e.preventDefault();
    if (this.hasNext) {
      this.props.onNext();
    }
  }

  _toggle() {
    this.setState({
      active: !this.state.active,
    });
  }

  _onPageSizeChange(value) {
    this.setState(
      {
        active: false,
      },
      () => this.props.onPageSizeChange(value),
    );
  }

  get perPageDropdown() {
    return (
      <div
        className={`drop ${this.state.active ? 'active' : ''}`}
        ref={(c) => {
          this.drop = c;
        }}
      >
        <div className="drop-head" onClick={this._toggle.bind(this)}>
          <span>Rows per page:</span>
          <select
            value={this.props.pageSize}
            onChange={e => this._onPageSizeChange(e.target.value)}
          >
            {PAGE_SIZE_OPTIONS.map((option) => {
              return (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <p>
            {Number(this.props.pageSize) <= 300
              ? this.props.pageSize
              : 'Show All'}
          </p>
        </div>
        {this.state.active && (
          <div className="drop-body">
            <ul>
              {PAGE_SIZE_OPTIONS.map((option) => {
                return (
                  <li
                    className={
                      this.props.pageSize === option.value ? 'active' : ''
                    }
                    onClick={() => this._onPageSizeChange(option.value)}
                    key={option.value}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

  get pageSwitcher() {
    return (
      <div className="pagination-buttons">
        <a
          href={this.prevLink}
          className="icon-arrow-left pagination-prev"
          onClick={this._onPaginationPrevClick.bind(this)}
        />
        <a
          href={this.nextLink}
          className="icon-arrow-right pagination-next"
          onClick={this._onPaginationNextClick.bind(this)}
        />
      </div>
    );
  }

  render() {
    return [this.perPageDropdown, this.pageSwitcher];
  }
}

export default Filters;
