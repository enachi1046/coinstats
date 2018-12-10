import React, { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = this.props.url;
    const pn = '&pn=';
    let next;
    let prev;
    if (url.includes('&pn=')) {
      const splitedURL = url.split('&');
      let page = Number(this.props.currentPage) - 1;
      const ex = splitedURL[2] ? splitedURL[2] : '';
      prev = `${splitedURL[0] + pn + page}&${ex}`;
      page = Number(this.props.currentPage) + 1;
      next = `${splitedURL[0] + pn + page}&${ex}`;
      if (this.props.currentPage <= 0) {
        prev = `${splitedURL[0] + pn}0&${ex}`;
      }
    } else if (url.includes('?')) {
      const splitedURL = url.split('?');

      let page = Number(this.props.currentPage) - 1;
      prev = `${splitedURL[0]}?${pn}${page}&${splitedURL[1]}`;
      page = Number(this.props.currentPage) + 1;
      next = `${splitedURL[0]}?${pn}${page}&${splitedURL[1]}`;
      if (this.props.currentPage <= 0) {
        prev = `${splitedURL[0]}?${pn}0&${splitedURL[1]}`;
      }
    } else {
      let page = Number(this.props.currentPage) - 1;
      prev = `${url}/?${pn}${page}`;
      page = Number(this.props.currentPage) + 1;
      next = `${url}/?${pn}${page}`;
      if (this.props.currentPage <= 0) {
        prev = `${url}/?${pn}0`;
      }
    }

    return (
      <div className="text-center">
        <a href={prev}>
          <button className="cursor_pointer btn btn-default m-left15"> Prev 20 </button>
        </a>
        <a href={next}>
          <button className="cursor_pointer btn btn-default m-left15"> Next 20 </button>
        </a>
      </div>
    );
  }
}

export default Pagination;
