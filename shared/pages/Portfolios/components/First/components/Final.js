import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Final extends Component {
  componentDidMount() {
    if (!this.props.showButtons) {
      setTimeout(this.props.openPortfoliosPage, 1500);
    }
  }
  render() {
    return (
      <div className="first-exchange">
        {this.props.header}
        <div>
          <div style={{ marginTop: '55px' }}>
            <img src="/images/tutorialSuccess.svg" height="30px" width="30px" />
          </div>
          <div className="orange" style={{ marginTop: '15px' }}>
            Success!
          </div>
          {this.props.showButtons ? (
            <div>
              <div style={{ marginTop: '50px' }}>
                Do you want to sync another portfolio?
              </div>
              <div style={{ marginTop: '65px' }}>
                <div>
                  <Button
                    className="submit-exchange-btn"
                    onClick={this.props.openPortfoliosPage.bind(this)}
                  >
                    No, show me synced
                  </Button>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <Button
                    className="submit-exchange-btn"
                    onClick={this.props.syncAnother.bind(this)}
                  >
                    Yes!
                  </Button>
                </div>
              </div>
            </div>
          ) : ''}
        </div>
      </div>
    );
  }
}

export default Final;
