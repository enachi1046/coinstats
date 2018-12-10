import React, { Component } from 'react';

class BaseLayout extends Component {
  constructor(props) {
    super(props);
  }

  get defaultClasses() {
    const classes = ['main-body'];
    if (!this.props.singleTheme) {
      classes.push(`${this.props.theme}-mode`);
    }
    return classes;
  }
}

export default BaseLayout;
