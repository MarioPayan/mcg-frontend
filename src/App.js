import React from "react"
import "./App.scss"
import { Board, Modal } from "./components/index"
import generateRandomID from "./utils/randomIDGenerator"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"

class App extends React.Component {
  state = {
    playerName: null,
    gameID: null,
    showLoginModal: true,
    showCodeModal: false
  }

  setPlayerName = playerName => {
    this.setState({ playerName: playerName })
  }

  setGameID = id => {
    this.setState({ gameID: id })
  }

  setupNewGame = () => {
    this.setState({ gameID: generateRandomID() })
  }

  closeLoginModal = () => {
    this.setState({ showLoginModal: false })
  }

  closeCodeModal = () => {
    this.setState({
      showCodeModal: !this.state.showCodeModal
    })
  }

  onLeaveGame = () => {
    this.setGameID(null)
    this.setPlayerName(null)
  }

  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <h1>Magnetic Cave Game!</h1>
        </AppBar>
        <div className="content">
          <Modal
            title="Insert your username"
            allowCancel={false}
            allowInput={true}
            inputKeyword="Username"
            onClose={this.closeLoginModal}
            callback={this.setPlayerName}
            show={this.state.showLoginModal}
          ></Modal>
          {!this.state.gameID && (
            <div>
              <img className="main-logo" alt="" src="/main_logo.png"></img>
              <div className="actions">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.setupNewGame}
                >
                  Start to play!
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.closeCodeModal}
                >
                  I have a code
                </Button>
              </div>
            </div>
          )}
          {this.state.gameID && (
            <Board
              gameID={this.state.gameID}
              playerName={this.state.playerName}
              onLeaveGame={this.onLeaveGame}
            />
          )}
          <Modal
            title="Insert your code"
            allowInput={true}
            inputKeyword="Code"
            onClose={this.closeCodeModal}
            callback={this.setGameID}
            show={this.state.showCodeModal}
          ></Modal>
        </div>
      </div>
    )
  }
}

export default App
