import config from "../config"

class WebSocketService {
  static instance = null
  callbacks = {}

  static getInstance = () => {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  constructor() {
    this.socketRef = null
  }

  connect = gameID => {
    const path = config.API_URL + gameID + "/"
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      if (config.DEBUG_MODE) console.log("ws open")
    }
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data)
    }
    this.socketRef.onerror = e => {
      if (config.DEBUG_MODE) console.log(e.message)
    }
    this.socketRef.onclose = () => {
      if (config.DEBUG_MODE) console.log("WebSocket closed let's reopen")
      // this.connect(gameID)
    }
  }

  socketNewMessage = data => {
    const parsedData = JSON.parse(data)
    const command = parsedData.command
    if (Object.keys(this.callbacks).length === 0) {
      return
    }
    if (command === "new_player") {
      this.callbacks[command](parsedData.player_id)
    }
    if (command === "new_movement") {
      this.callbacks[command](parsedData.movement)
    }
    if (command === "game_ready") {
      this.callbacks[command](parsedData.turn_number)
    }
    if (command === "game_error") {
      console.log("game_error")
      this.callbacks[command]()
    }
  }

  joinGame = playerName => {
    this.sendMessage({ command: "join_game", player_name: playerName })
  }

  sendMovement = movement => {
    this.sendMessage({ command: "make_movement", movement: movement })
  }

  terminateConnection = () => {
    this.sendMessage({ command: "close_connection", code: 1 })
    this.socketRef.close()
  }

  addCallbacks = (
    newPlayerCallback,
    newMovementCallback,
    gameReadyCallback,
    gameErrorCallback
  ) => {
    this.callbacks["new_player"] = newPlayerCallback
    this.callbacks["new_movement"] = newMovementCallback
    this.callbacks["game_ready"] = gameReadyCallback
    this.callbacks["game_error"] = gameErrorCallback
  }

  sendMessage = data => {
    try {
      this.socketRef.send(JSON.stringify({ ...data }))
    } catch (err) {
      if (config.DEBUG_MODE) console.log(err.message)
    }
  }

  state = () => {
    return this.socketRef.readyState
  }

  waitForSocketConnection = callback => {
    const socket = this.socketRef
    const recursion = this.waitForSocketConnection
    setTimeout(function() {
      if (socket.readyState === 1) {
        if (config.DEBUG_MODE) console.log("Connection OK")
        if (callback != null) callback()
        return
      } else {
        if (config.DEBUG_MODE) console.log("Waiting for connection...")
        recursion(callback)
      }
    }, 250)
  }
}

const WebSocketInstance = WebSocketService.getInstance()

export default WebSocketInstance
