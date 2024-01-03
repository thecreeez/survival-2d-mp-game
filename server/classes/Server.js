import Application from "../../core/Application.js";
import PacketRegistry from "../../core/PacketRegistry.js";

import sockjs from "sockjs";
import http from 'http';
import fs from 'fs';
import EntityRemovePacket from "../../core/packets/EntityRemovePacket.js";
import EntityUpdatePacket from "../../core/packets/EntityUpdatePacket.js";

class Server {
  static type = "server"
  static _TPS = 60;

  static socket = sockjs.createServer({ prefix: "/socket", disable_cors: true})
  static http = http.createServer();
  static application = new Application(this);

  static players = [];

  static start() {
    this._initSocketEvents();
    this._initClientFiles();
    this.http.listen(3000);

    setInterval(() => {
      Application.instance.updateTick();
      
      let updatedEntities = Application.instance.getEntities().filter(entity => entity.needToUpdate());

      updatedEntities.forEach((entity) => {
        EntityUpdatePacket.serverSend(this.getPlayersConnections(), { data: entity.serializeLazy() })
      })
    }, 1000 / this._TPS);
  }

  static _initClientFiles() {
    this.http.addListener('request', (request, response) => {
      const filePath = request.url.substring(1);

      let formedPath = "../" + filePath;
      fs.access(formedPath, fs.constants.R_OK, (error) => {
        if (error) {
          response.statusCode = 404;
          response.end(`ERROR: File is not exist.`);
          return;
        }

        if (formedPath.endsWith(".js"))
          response.setHeader("Content-Type", "application/javascript; charset=utf-8")
        
        fs.createReadStream(formedPath).pipe(response);
      })
    })
  }

  static _initSocketEvents() {
    Server.socket.on("connection", (conn) => {
      conn.on('data', (data) => {
        Server.handleMessage(conn, data);
      })

      conn.on('close', () => {
        Server.handleDisconnect(conn);
      })
    })

    Server.socket.installHandlers(Server.http);
  }

  static handleMessage(conn, data) {
    let args = data.split("/");

    if (!PacketRegistry[args[0]]) {
      return console.log(`packet is not exist: `+data);
    }

    if (!PacketRegistry[args[0]].serverHandle) {
      return console.log(`server cant handle this packet: ` + data);
    }

    PacketRegistry[args[0]].serverHandle(this, conn, data)
  }

  static handleDisconnect(conn) {
    let player = this.getPlayerByConnection(conn);

    if (!player) {
      return;
    }

    this.players = this.players.filter(playerCandidate => playerCandidate != player);
    Application.instance.removeEntity(player.entity.getUuid());
    EntityRemovePacket.serverSend(this.getPlayersConnections(), player.entity);
  }

  static getPlayerByConnection(conn) {
    let candidates = this.players.filter(playerCandidate => playerCandidate.connection == conn);

    if (candidates.length > 0) {
      return candidates[0];
    }

    return false;
  }

  static getPlayerByName(name) {
    let candidates = this.players.filter(playerCandidate => playerCandidate.name == name);

    if (candidates.length > 0) {
      return candidates[0];
    }
    
    return false;
  }

  static getPlayersConnections() {
    return this.players.map(playerData => playerData.connection);
  }

  static addPlayerConnection(connection, playerName, entity) {
    this.players.push({
      connection,
      name: playerName,
      entity
    });
  }
}

export default Server;