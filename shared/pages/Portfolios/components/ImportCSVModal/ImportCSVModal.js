import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Col, Row, Modal, ModalBody, ModalFooter, Form, FormGroup, Input, Button,
} from 'reactstrap';

import {
  ui as uiActions,
  coins as coinsActions,
  portfolios as portfolioActions,
} from 'store/actions';
import config from 'config';
import VirtualizedSelect from 'react-virtualized-select';


class ImportCSVModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      selectedExchange: null,
      selectedPortfolio: null,
      file: null,
    };
  }

  _onSelectPortfolio(v) {
    this.setState({
      selectedPortfolio: v.value,
    });
  }

  _onSelectExchange(v) {
    this.setState({
      selectedExchange: v.value,
    });
  }

  _onFileChange(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  _onSubmit(e) {
    e.preventDefault();
    this.props.importCSV({
      portfolioId: this.state.selectedPortfolio,
      exchange: this.state.selectedExchange,
      file: this.state.file,
    });
  }

  componentWillMount() {
    this.props.fetchSupportedExchanges();
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className={`${this.props.className} modal-custom`}
      >
        <div className="modal-header border0 pb-0">
          <h2 className="float-left">Import CSV</h2>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => this.props.toggleSubscriptionModal(false)}
          >
            <span aria-hidden="true">
              {' '}
              <img src="/img/close.png" alt="" />{' '}
            </span>
          </button>
        </div>
        <ModalBody className="subscribe-modal-body">
          <Form onSubmit={this._onSubmit.bind(this)}>
            <FormGroup>
              <label htmlFor="">Select Exchange</label>
              <VirtualizedSelect
                id="exchangeType"
                value={this.state.selectedExchange}
                options={this.props.exchanges.map((e) => {
                  return {
                    label: e.exchange,
                    value: e.exchange,
                  };
                })}
                onChange={this._onSelectExchange.bind(this)}
                required
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="">Select Portfolio</label>
              <VirtualizedSelect
                type="select"
                options={this.props.portfolios.map((portfolio) => {
                  return {
                    label: portfolio.name,
                    value: portfolio.identifier,
                  };
                })}
                value={this.state.selectedPortfolio}
                onChange={this._onSelectPortfolio.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="">Select File</label>
              <Input type="file" onChange={this._onFileChange.bind(this)} />
            </FormGroup>
            <Button color="primary" className="float-right">Import</Button>
          </Form>
        </ModalBody>
        <ModalFooter className="subscribe-modal-footer">
          <div />
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    isOpen: state.ui.isImportCSVModalOpen,
    token: state.auth.token,
    portfolios: state.coins.portfolios.filter((p) => {
      return p.altfolioType === 0 && p.identifier !== 'totalPortfolio';
    }),
    exchanges: state.coins.supportedExchanges || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle() {
      return dispatch(uiActions.toggleImportCSVModal());
    },
    fetchSupportedExchanges() {
      return dispatch(coinsActions.fetchSupportedExchanges());
    },
    importCSV(data) {
      return dispatch(portfolioActions.importCSV(data));
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportCSVModal);
