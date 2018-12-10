import React, { Component } from 'react';
import { Button } from 'reactstrap';
import LoginWithCoinbase from 'shared/components/LoginWithCoinbase';
import Loader from 'addons/Loader';

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coinbaseData: {},
    };
  }
  get content() {
    const rows = [];
    this.props.texts.map((row) => {
      const text = [];
      const highlightedWords = [];
      row.highlights.map((highlight) => {
        highlightedWords.push(row.text.substring(highlight.loc, highlight.loc + highlight.len));
      });
      highlightedWords.map((word, ind) => {
        if (ind > 0) {
          text.push(row.text.split(highlightedWords[ind - 1])[1].split(word)[0]);
        } else {
          text.push(row.text.split(word)[0]);
        }
        if (!highlightedWords[ind + 1]) {
          text.push(row.text.split(` ${word}`)[1]);
        }
      });
      rows.push((
        <div className="follow-step">
          {text.map((t, ind) => {
            return (
              <span>
                <span>{` ${t}`}</span>
                <span className="orange">{` ${highlightedWords[ind] ? highlightedWords[ind] : ''} `}</span>
              </span>
            );
          })}
        </div>
      ));
    });
    return rows.map((row) => {
      return row;
    });
  }

  _coinBaseOAuth({ data }) {
    this.setState({
      coinbaseData: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        requestDate: new Date(),
      },
    });
  }

  get button() {
    if (Object.keys(this.props.clickedExchange)[0] === 'Coinbase') {
      if (!this.state.coinbaseData.access_token) {
        return <LoginWithCoinbase class="add-first-btn" onAuth={this._coinBaseOAuth.bind(this)} text="connect with Coinbase" />;
      } else {
        return (
          <div>
            <div className="mt-3 text-center text-success">Successfully connected!</div>
            <div style={{ marginTop: '20px' }}>
              <Button className="mb-3 add-first-btn" onClick={() => this.props.submitCoinbase(this.state.coinbaseData)}> Submit Coinbase </Button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div style={{ marginTop: '20px' }}>
          <Button className="mb-3 add-first-btn" onClick={this.props.setManual.bind(this)}> Enter Manualy </Button>
        </div>
      );
    }
  }

  render() {
    if (this.props.exchangesLoading || this.props.walletsLoading) {
      return <Loader />;
    }
    return (
      <div className="first-exchange" style={{ display: 'grid' }}>
        {this.props.header}
        <div style={{ marginTop: '14px' }} className="exchange-header">Follow this steps:</div>
        <div
          style={
            {
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              maxWidth: '425px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }
          }
        >
          {this.props.texts ? this.content : ''}
        </div>
        {this.button}
      </div>
    );
  }
}

export default Tutorial;
