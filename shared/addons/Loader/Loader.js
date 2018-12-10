import React, { Component } from 'react';

class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text = 'Loading...' } = this.props;
    return (
      <span>
        <div className="loader" style={{ ...this.props.style }}>
          <div className="d-block">
            <svg className="circular" viewBox="25 25 50 50">
              <circle
                className="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeDasharray="200, 200"
                strokeDashoffset="0"
              />
            </svg>
            <div className="loader-text">{text}</div>
          </div>
        </div>
      </span>
    );
  }
}

export default Loader;
