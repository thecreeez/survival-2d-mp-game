import Application from "../../core/Application.js";
import PacketRegistry from "../../core/registry/PacketRegistry.js";

import EntityRemovePacket from "../../core/packets/EntityRemovePacket.js";
import EntityUpdatePacket from "../../core/packets/EntityUpdatePacket.js";

import sockjs from "sockjs";
import http from 'http';
import fs from 'fs';
import Logger from "../../core/utils/Logger.js";

class Server {
  static type = "server"
  static _TPS = 25;

  static _currentTPS = 0;
  static _tpsC = 0;

  static serverProfiler = {
    profiles: {},
    start(name) {
      this.profiles[name] = Date.now();
    },
    end(name) {
      this.profiles[name] = Date.now() - this.profiles[name];
    },
    log() {
      console.log(`===== Start =====`)
      for (let name in this.profiles) {
        console.log(`${name}: ${this.profiles[name]}`);
      }
      console.log(`=====  End  =====`)
    },
    set(field, value) {
      this.profiles[field] = value;
    }
  }

  static Logger = new Logger("Server");

  static socket = sockjs.createServer({ prefix: "/socket", disable_cors: true})
  static http = http.createServer();
  static application = new Application(this);

  static welcomeMessage = `Welcome to the game, {player} (Version {version})`;
  static bLoaded = false;

  static packs = {};
  static players = [];

  static async start() {
    this._initSocketEvents();
    this._initClientFiles();
    this.http.listen(3000);

    Server.bLoaded = true;

    setInterval(() => {
      if (this.application.state === 0) {
        return;
      }

      Application.instance.updateTick();
      let updatedEntities = Application.instance.getEntities().filter(entity => entity.needToUpdate());
      this.serverProfiler.set("entities", Application.instance.getEntities().length);

      updatedEntities.forEach((entity) => {
        EntityUpdatePacket.serverSend(this.getPlayersConnections(), { data: entity.serializeLazy() })
      })
      this._tpsC++;
    }, 1000 / this._TPS);

    setInterval(() => {
      this._currentTPS = this._tpsC;
      this._tpsC = 0;

      this._updatedEntities = 0;
    }, 1000);
  }

  static async registerPacks() {
    let directories = fs.readdirSync("../packs/");

    for (let packId of directories) {
      let commonInit = await import(`../../packs/${packId}/scripts/CommonInit.js`);
      this.application.registerPack(commonInit.default)
    }

    this.application.loadPacks();
  }

  static _initClientFiles() {
    this.http.addListener('request', (request, response) => {
      const filePath = request.url.substring(1);

      switch (filePath) {
        case "getPacks": {
          let packs = fs.readdirSync("../packs/");

          response.write(JSON.stringify(packs));
          response.end();
          return
        };
      }

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
      return this.Logger.log(`Packet is not exist`, data);
    }

    if (!PacketRegistry[args[0]].serverHandle) {
      return this.Logger.log(`Server cant handle packet`, data);
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
    EntityRemovePacket.serverSend(this.getPlayersConnections(), player.entity.getUuid(), EntityRemovePacket.Contexts.playerDisconnect);
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

  static getWelcomeMessage() {
    return this.welcomeMessage;
  }
}

export default Server;