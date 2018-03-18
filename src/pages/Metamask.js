import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import Account from '../components/Account';
import Card from '../components/Card';
import {
  accountUpdateMetamaskAccount,
  accountConnectMetamask,
  accountClearIntervals,
  accountChangeNativeCurrency,
  accountCheckNetworkIsConnected
} from '../reducers/_account';
import { modalOpen } from '../reducers/_modal';
import { fonts, colors } from '../styles';

const StyledWrapper = styled.div`
  width: 100%;
`;

const StyledMessage = styled.div`
  height: 177px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(${colors.grey});
  font-weight: ${fonts.weight.medium};
`;

class Metamask extends Component {
  componentDidMount() {
    this.props.accountConnectMetamask();
    window.onoffline = () => this.props.accountCheckNetworkIsConnected(false);
    window.ononline = () => this.props.accountCheckNetworkIsConnected(true);
  }
  renderMessage() {
    if (!this.props.web3Available) return `Please install Metamask chrome extension`;
    if (!this.props.metamaskAccount) return `Please unlock your Metamask`;
    if (!this.props.web3Network) return `Unknown network, please switch to another one`;
  }
  componentWillUnmount() {
    this.props.accountClearIntervals();
  }
  render = () => (
    <BaseLayout>
      <StyledWrapper>
        {this.props.fetching ||
        (this.props.web3Network && this.props.metamaskAccount && this.props.web3Available) ? (
          <Account
            account={this.props.account}
            fetching={this.props.fetching}
            prices={this.props.prices}
            nativeCurrency={this.props.nativeCurrency}
            modalOpen={this.props.modalOpen}
          />
        ) : (
          <Card fetching={this.props.fetching}>
            <StyledMessage>{this.renderMessage()}</StyledMessage>
          </Card>
        )}
      </StyledWrapper>
    </BaseLayout>
  );
}

Metamask.propTypes = {
  accountUpdateMetamaskAccount: PropTypes.func.isRequired,
  accountConnectMetamask: PropTypes.func.isRequired,
  accountClearIntervals: PropTypes.func.isRequired,
  accountChangeNativeCurrency: PropTypes.func.isRequired,
  accountCheckNetworkIsConnected: PropTypes.func.isRequired,
  modalOpen: PropTypes.func.isRequired,
  prices: PropTypes.object.isRequired,
  nativeCurrency: PropTypes.string.isRequired,
  web3Available: PropTypes.bool.isRequired,
  web3Network: PropTypes.string.isRequired,
  metamaskAccount: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired
};

const reduxProps = ({ account }) => ({
  prices: account.prices,
  nativeCurrency: account.nativeCurrency,
  web3Available: account.web3Available,
  web3Network: account.web3Network,
  metamaskAccount: account.metamaskAccount,
  account: account.account,
  fetching: account.fetching,
  error: account.error
});

export default connect(reduxProps, {
  accountUpdateMetamaskAccount,
  accountCheckNetworkIsConnected,
  accountConnectMetamask,
  accountClearIntervals,
  accountChangeNativeCurrency,
  modalOpen
})(Metamask);
