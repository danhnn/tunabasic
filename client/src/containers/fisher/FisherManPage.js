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

class FisherManPage extends Component {

  state = {

  }

  constructor(props) {
    super(props)
  }

  onInitLedgerClick() {
    this.props.initLedger();
  }

  onQueryAllTunaClick() {
    this.props.queryAllTuna();
  }

  renderTunaList() {
    if (this.props.data.allTunaSuccess) {
      const byteArray = this.props.data.allTunaSuccess
      return byteArray;
    } else {
      return this.props.data.allTunaError;
    }
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <div>FisherMan PAGE</div>
        <ColSection>
          <Button onClick={() => this.onInitLedgerClick()}>Init Ledger</Button>
          <PResult>
            {
              JSON.stringify(this.props.data.initSuccess ? this.props.data.initSuccess : this.props.data.initError)
            }
          </PResult>
        </ColSection>

        <ColSection>
          <Button onClick={() => this.onQueryAllTunaClick()}>QueryAllTuna</Button>
          <PResult>
            {
              this.renderTunaList()
            }
          </PResult>
        </ColSection>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.FisherManReducer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initLedger: () => {
      dispatch({ type: "INIT_LEDGER" })
    },
    queryAllTuna: () => {
      dispatch({ type: "QUERY_ALL_TUNA" })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FisherManPage)