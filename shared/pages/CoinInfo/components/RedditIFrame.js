import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { isServer } from 'utils/env';

class RedditIFrame extends Component {
  addTarget() {
    const iframe = document.getElementById('redditFrame');
    const iframeDocElem = iframe.contentDocument.getElementsByTagName('a');
    [].forEach.call(iframeDocElem, elem => elem.setAttribute('target', '_blank'));
  }

  componentDidMount() {
    this.addTarget();
    setTimeout(() => {
      this.addTarget();
    }, 1000);
  }

  render() {
    return (
      <iframe
        id="redditFrame"
        style={{ height: '700px', width: '100%' }}
        src={`/reddit?url=${this.props.url}`}
        frameBorder="0"
        marginWidth="0"
        marginHeight="0"
        title="reddit"
      />
    );
  }
}

export default RedditIFrame;
