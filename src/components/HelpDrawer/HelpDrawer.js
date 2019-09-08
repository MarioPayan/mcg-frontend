import React from "react"
import "./HelpDrawer.scss"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Drawer open={this.props.open}>
        <div className="drawer">
          <div className="content">
            <h1>Quick guide</h1>
            <p className="explanation">
              Two players see a board, which is a grid of 7 rows and 7 columns.
              They take turn adding pieces to a row, on one of the sides. The
              pieces stack on top of each other, and the game ends when there
              are no spaces left available, or when a player has four
              consecutive pieces on a diagonal, column, or row.
            </p>
            <div className="bullet">
              <img className="circle" src="/not_valid.png" alt=""></img>
              <p className="text">
                Purple positions mean that are <strong>NOT</strong> available to
                select
              </p>
            </div>
            <div className="bullet">
              <img className="circle" src="/valid.png" alt=""></img>
              <p className="text">
                Gray positions mean that are available to select
              </p>
            </div>
            <div className="bullet">
              <img className="circle" src="/player_1.png" alt=""></img>
              <p className="text">
                Positions with a symbol inside mean that were already chosen by
                a player
              </p>
            </div>
            <div className="bullet">
              <img className="circle" src="/player_2.png" alt=""></img>
              <p className="text">
                Positions with a symbol inside means that were already chosen by
                a player
              </p>
            </div>
            <Button
              className="ok-button"
              variant="outlined"
              color="primary"
              onClick={this.props.onClose}
            >
              Ok, Got it!
            </Button>
          </div>
        </div>
      </Drawer>
    )
  }
}
