import React from "react"
import "./Modal.scss"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"

export default class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: "",
      validInput: true
    }
  }

  static defaultProps = {
    title: null,
    text: null,
    label: null,
    inputKeyword: "",
    allowCancel: true,
    allowAccept: true,
    allowInput: false,
    onClose: () => {},
    callback: () => {},
    show: true
  }

  errorMessage =
    "This field can not be empty and must be just alphanumerical characters"

  updateInput = input => {
    if (input) {
      this.setState({ input: input.target.value })
    }
    this.validateInput(input.target.value)
  }

  validateInput = input => {
    if (input) {
      if (input !== "" && input.match(/^\w*$/)) {
        this.setState({ validInput: true })
      } else {
        this.setState({ validInput: false })
      }
    } else {
      this.setState({ validInput: false })
    }
  }

  onClose = () => {
    this.props.onClose()
  }

  onAccept = () => {
    this.props.callback(this.state.input)
    this.props.onClose()
  }

  onKeyPressOnInput = key => {
    if (key === "Enter" && this.state.validInput) {
      this.onAccept()
    }
  }

  onEscapeKeyDown = () => {
    if (this.props.allowCancel) {
      this.onClose()
    }
  }

  render = () => {
    return (
      <Dialog open={this.props.show} onEscapeKeyDown={this.onEscapeKeyDown}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          {this.props.text && (
            <DialogContentText>{this.props.text}</DialogContentText>
          )}
          {this.props.allowInput && (
            <FormControl error={!this.state.validInput}>
              <InputLabel>{this.props.inputKeyword}</InputLabel>
              <Input
                onKeyPress={e => {
                  this.onKeyPressOnInput(e.key)
                }}
                fullWidth={true}
                value={this.state.input}
                onChange={e => this.updateInput(e)}
              />
              {!this.state.validInput && (
                <FormHelperText>{this.errorMessage}</FormHelperText>
              )}
            </FormControl>
          )}
          {this.props.label && (
            <Paper>
              <Typography className="code-label" variant="h5" component="h3">
                {this.props.label}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          {this.props.allowCancel && (
            <Button variant="outlined" color="secondary" onClick={this.onClose}>
              Cancel
            </Button>
          )}
          {this.props.allowAccept && (
            <Button
              variant="outlined"
              color="primary"
              disabled={
                this.props.allowInput &&
                (!this.state.validInput || !this.state.input)
              }
              onClick={this.onAccept}
            >
              Accept
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )
  }
}
