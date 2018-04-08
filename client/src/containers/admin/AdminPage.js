import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Button = styled.button`
  background: white;
  color: #006e96;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid #006e96;
  border-radius: 3px;
  margin-top: 1em;
`;

const PResult = styled.p`
  font-size: 0.7em;
`;

const ColSection = styled.div`

`;
const RowSection = styled.div`
  display:'flex';
  flex-direction: row,
  align-items: center
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: #006e96;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

class AdminPage extends Component {

  state = {
    channel: 'mychannel',
    chaincodeVersion: 0,
    chaincodeName: 'salmons_cc',
    chaincodePath: 'github.com/salmons_cc/go',
    chaincodeType: 'golang'
  }

  constructor(props) {
    super(props)
  }

  onLoginClick() {
    this.props.login();
  }

  onCreateChannelClick() {
    this.props.createChanel(this.state.channel);
  }

  onJoinChannelClick() {
    this.props.joinChannel(this.state.channel);
  }

  onInstallCCClick() {
    this.props.instalCC(this.state);
  }

  onInstantiatedCCClick() {
    this.props.instantiatedCC(this.state);
    this.setState({
      chaincodeVersion: Number(this.state.chaincodeVersion) + 1
    })
  }

  onGoToFisherPage() {
    this.props.history.push("/fisher");
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <RowSection>
          <span style={{ color: 'red'}}>ADMIN PAGE</span>
          <Button style={{ color: 'red', marginLeft: 100 }} onClick={() => this.onGoToFisherPage()}>Go to Fisher Page</Button>
        </RowSection>
        <ColSection>
          <Button onClick={() => this.onLoginClick()}>Login</Button>
          <PResult>
            {
              JSON.stringify(this.props.data.user ? this.props.data.user : this.props.data.userError)
            }
          </PResult>
        </ColSection>
        <ColSection>
          <RowSection>
            <Button onClick={() => this.onCreateChannelClick()}>Create Channel</Button>
            <Input value={this.state.channel} onChange={(evt) => { this.setState({ channel: evt.target.value }) }} type="text" />
          </RowSection>
          <PResult>
            {
              JSON.stringify(this.props.data.channel ? this.props.data.channel : this.props.data.channelError)
            }
          </PResult>
        </ColSection>
        <ColSection>
          <Button onClick={() => this.onJoinChannelClick()}>Join Channel</Button>
          <PResult>
            {
              JSON.stringify(this.props.data.channelJoin ? this.props.data.channelJoin : this.props.data.channelJoinError)
            }
          </PResult>
        </ColSection>
        <ColSection>

          <RowSection>
            <Button onClick={() => this.onInstallCCClick()}>Install ChainCode</Button>
            <Input value={this.state.chaincodeVersion} onChange={(evt) => { this.setState({ chaincodeVersion: Number(evt.target.value) }) }} type="text" />
          </RowSection>
          <PResult>
            {
              JSON.stringify(this.props.data.installCCSuccess ? this.props.data.installCCSuccess : this.props.data.installCCError)
            }
          </PResult>
        </ColSection>

        <ColSection>
          <Button onClick={() => this.onInstantiatedCCClick()}>Instantiated Chaincode</Button>
          <PResult>
            {
              JSON.stringify(this.props.data.instantiatedCCSuccess ? this.props.data.instantiatedCCSuccess : this.props.data.instantiatedCCError)
            }
          </PResult>
        </ColSection>
       
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.AdminReducer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: () => {
      dispatch({ type: "LOGIN_REQUEST" })
    },
    createChanel: (c) => {
      dispatch({ type: "CREATE_CHANNEL", payload: c })
    },
    instalCC: (data) => {
      dispatch({ type: "INSTALL_CHAINCODE", payload: data })
    },
    instantiatedCC: (data) => {
      dispatch({ type: "INSTANTIATED_CHAINCODE", payload: data })
    },
    joinChannel: (c) => {
      dispatch({ type: "JOIN_CHANNEL", payload: c })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPage)