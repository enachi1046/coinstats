import React, { Component } from 'react';

class MiniLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, size = 20 } = this.props;
    let textBlock;
    if (text || this.props.children) {
      textBlock = <div className="loader-text">{text || this.props.children}</div>;
    }
    return (
      <div className="mini-loader" style={{ height: `${size}px`, width: `${size}px`, ...this.props.style }}>
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
        {textBlock}
      </div>
    );
  }
}

export default MiniLoader;
