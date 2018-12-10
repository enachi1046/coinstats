import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import Switch from 'addons/Switch';

class Manual extends Component {
  onPasteClick(field) {
    navigator.clipboard.readText().then((clipText) => {
      if (field.split('_')[0] === 'exchange') {
        this.props.exchangeChange('', field.split('_')[1], clipText);
      } else {
        this.props.addressChange({}, clipText);
      }
    });
  }

  _exchangeChange(key, event) {
    this.props.exchangeChange(event.target.value, key);
  }

  get content() {
    if (this.props.isExchange) {
      return (
        <div style={{ display: 'grid' }}>
          {this.props.exchangeAdditionalFields.map(field => (
            <div className="input-row">
              <div>
                <div
                  className={`label-exchange-api ${this.props.finalPageSuccess === false
                    || (this.props.emptyField
                      && this.props.emptyField === field.key) ?
                    'red' : ''}`
                  }
                >
                  <span>{field.name}</span>
                </div>
                <div><Input value={this.props.newExchangeAdditionalFields[field.key]} className="input-exchange-api" onChange={this._exchangeChange.bind(this, field.key)} /></div>
              </div>
              <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                <Button onClick={this.onPasteClick.bind(this, 'exchange_apiKey')} className="paste-btn">Paste</Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        <div style={{ display: 'inline-flex' }}>
          <div>
            <div
              className={`label-exchange-api ${this.props.finalPageSuccess === false
                || (this.props.emptyField
                  && this.props.emptyField.split(' ')[1] === 'Key') ?
                'red' : ''}`
              }
            >
              Address
            </div>
            <div><Input value={this.props.walletAddress} className="input-exchange-api" onChange={this.props.addressChange.bind(this)} /></div>
          </div>
          <div style={{ marginLeft: '15px', marginTop: '15px' }}>
            <Button onClick={this.onPasteClick.bind(this, 'adress')} className="paste-btn">Paste</Button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="first-exchange">
        {this.props.header}
        <div style={this.props.finalPageSuccess === false ? { marginTop: '50px', display: 'inline-grid' } : { marginTop: '70px', display: 'inline-grid' }}>
          {!this.props.emptyField && this.props.finalPageSuccess === false ? (
            <div>
              <div className="red" style={{ marginBottom: '25px' }}>
                Your API Key and API Secret are invalid.
              </div>
            </div>
          ) : ''}
          {this.props.emptyField ? (
            <div>
              <div className="red" style={{ marginBottom: '25px' }}>
                Please enter {this.props.emptyField}
              </div>
            </div>
          ) : ''}
          {this.content}
          <div style={{ marginTop: '50px' }}>
            <Button className="submit-exchange-btn" onClick={this.props.submit.bind(this)}>Submit</Button>
          </div>
        </div>
        <div className="exchange-manual-footer">
          <div>It will only sync your balances. Ability to sync your</div>
          <div>transactions/trades is coming soon.</div>
        </div>
      </div>
    );
  }
}

export default Manual;
