import React from "react"
import "./Board.scss"
import { Modal, HelpDrawer } from "../index"
import WebSocketInstance from "../../services/WebSocket"
import generateRandomID from "../../utils/randomIDGenerator"
import config from "../../config/index"
import AppBar from "@material-ui/core/AppBar"
import Fab from "@material-ui/core/Fab"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTimesCircle,
  faCircle,
  faQuestionCircle
} from "@fortawesome/free-regular-svg-icons"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameID: this.props.gameID,
      playerID: null,
      playerName: this.props.playerName,
      myTurn: false,
      gameReady: false,
      winner: 0,
      dimX: config.BOARD_X_DIMENSION,
      dimY: config.BOARD_Y_DIMENSION,
      board: [[]],
      error: false,
      errorModal: {
        title: "Something wrong just happened",
        text: "Try to create a new game"
      },
      secondPlayerModal: {
        title: "Waiting for a second player",
        text: "Share the following code with your friend and play"
      },
      endMatchModal: {
        titleForWinner: "Congratulations, you are the winner",
        titleForLoser: "Sorry, you lose this match",
        titleForDraw: "Sorry, you lose this match",
        text: "Want play again?"
      },
      helpDrawer: false
    }
    this.connectToWebSocket(this.props.gameID, this.props.playerName)
  }

  componentDidMount() {
    this.initBoard()
  }

  initBoard = () => {
    const boardMatrix = Array(this.state.dimY)
      .fill(0)
      .map(() => Array(this.state.dimX).fill(0))
    this.setState({ board: boardMatrix })
  }

  resetBoard = () => {
    this.setState({ gameID: null })
    this.setState({ playerID: null })
    this.setState({ playerName: null })
    this.setState({ myTurn: false })
    this.setState({ winner: 0 })
    this.initBoard()
  }

  connectToWebSocket = (gameID, playerName) => {
    WebSocketInstance.connect(gameID)
    WebSocketInstance.waitForSocketConnection(() => {
      WebSocketInstance.joinGame(playerName)
      WebSocketInstance.addCallbacks(
        this.newPlayer.bind(this),
        this.newMovement.bind(this),
        this.startGame.bind(this),
        this.showError.bind(this)
      )
    })
  }

  tryAgain = () => {
    const newGameID = generateRandomID()
    this.resetBoard()
    this.setState({ gameID: newGameID })
    WebSocketInstance.terminateConnection()
    WebSocketInstance.connect(newGameID)
    WebSocketInstance.waitForSocketConnection(() => {
      WebSocketInstance.joinGame(this.state.playerName)
    })
  }

  leaveGame = () => {
    this.resetBoard()
    WebSocketInstance.terminateConnection()
    this.props.onLeaveGame()
  }

  actionMove = (x, y) => {
    if (this.validateMovement(x, y)) {
      WebSocketInstance.sendMovement(this.formatMovement(x, y))
    }
  }

  newPlayer = playerID => {
    if (!this.state.playerID) {
      this.setState({ playerID: playerID })
    }
  }

  newMovement = movement => {
    let newBoard = this.state.board
    newBoard[movement.y][movement.x] = movement.player_id
    this.setState({ myTurn: this.state.playerID === movement.next_turn })
    this.setState({ board: newBoard })
    this.setState({ winner: movement.winner })
  }

  startGame = turnNumber => {
    this.setState({ gameReady: true })
    this.setState({ myTurn: this.state.playerID === turnNumber })
  }

  showError = () => {
    this.setState({ error: true })
  }

  formatMovement = (x, y) => {
    let side = ""
    const xf = this.state.dimX - 1
    const board = this.state.board
    if (x === 0 || (x < xf && board[y][x + 1] === 0)) {
      side = "L"
    } else if (x === xf || (x > 0 && board[y][x - 1] === 0)) {
      side = "R"
    }
    return {
      player_id: this.state.playerID,
      row: y,
      side: side
    }
  }

  validateMovement = (x, y) => {
    let validMove = false
    if (!this.state.myTurn) {
      return validMove
    }
    const xf = this.state.dimX - 1
    const yf = this.state.dimY - 1
    const board = this.state.board
    if (x >= 0 && x <= xf && y >= 0 && y <= yf) {
      if (board[y][x] === 0) {
        if (
          x === 0 ||
          x === xf ||
          ((x > 0 && board[y][x - 1] !== 0) ||
            (x < xf && board[y][x + 1] !== 0))
        ) {
          validMove = true
        }
      }
    }
    return validMove
  }

  getButtonColor = (x, y) => {
    const playerMark = this.state.board[y][x]
    let color = "default"
    if (playerMark === 1) {
      color = "primary"
    } else if (playerMark === 2) {
      color = "secondary"
    }
    return color
  }

  getPlayerMark = playerID => {
    let icon = faQuestionCircle
    if (playerID === 1) {
      icon = faCircle
    } else if (playerID === 2) {
      icon = faTimesCircle
    }
    return icon
  }

  closeHelpDrawer = () => {
    this.setState({ helpDrawer: false })
  }

  openHelpDrawer = () => {
    this.setState({ helpDrawer: true })
  }

  getEndModalTitle = () => {
    let title = this.state.endMatchModal.titleForLoser
    if (this.state.winner === this.state.playerID) {
      title = this.state.endMatchModal.titleForWinner
    } else if (this.state.winner === 100) {
      title = this.state.endMatchModal.titleForDraw
    }
    return title
  }

  render() {
    return (
      <div className="board">
        <HelpDrawer
          open={this.state.helpDrawer}
          onClose={this.closeHelpDrawer}
        ></HelpDrawer>
        <div className="container">
          <Modal
            title={this.state.secondPlayerModal.title}
            text={this.state.secondPlayerModal.text}
            label={this.state.gameID}
            allowCancel={false}
            allowAccept={false}
            show={!this.state.gameReady}
          ></Modal>
          <Modal
            title={this.state.errorModal.title}
            text={this.state.errorModal.text}
            allowCancel={false}
            allowAccept={false}
            show={this.state.error}
          ></Modal>
          <Modal
            title={this.getEndModalTitle()}
            text={this.state.endMatchModal.text}
            allowCancel={false}
            callback={this.tryAgain}
            show={this.state.winner !== 0}
          ></Modal>
          <table className="board-table">
            <tbody>
              {this.state.board.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <th key={j}>
                      <Fab
                        className="board-button"
                        color={this.getButtonColor(j, i)}
                        disabled={!this.validateMovement(j, i) && cell === 0}
                        onClick={() => {
                          this.actionMove(j, i)
                        }}
                      >
                        {cell !== 0 && (
                          <FontAwesomeIcon
                            className="button-icon"
                            icon={this.getPlayerMark(cell)}
                          />
                        )}
                      </Fab>
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {this.state.gameID && (
          <AppBar className="bottom-app-bar" position="absolute">
            <div className="content">
              <h3 className="h3-l">
                ({this.state.playerID}) {this.state.playerName}
              </h3>
              <h3 className="h3-r">{this.state.gameID}</h3>
            </div>
          </AppBar>
        )}
        <Fab
          className="help-button"
          color="default"
          onClick={() => {
            this.openHelpDrawer()
          }}
        >
          <FontAwesomeIcon className="button-icon" icon={faQuestionCircle} />
        </Fab>
        <Fab
          className="leave-button"
          color="default"
          onClick={() => {
            this.leaveGame()
          }}
        >
          <FontAwesomeIcon className="button-icon" icon={faSignOutAlt} />
        </Fab>
      </div>
    )
  }
}
