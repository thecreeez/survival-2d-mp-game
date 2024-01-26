import PropRegistry from "../../registry/PropRegistry.js";
import SharedData from "../../SharedData.js";
import Particle from "../Particle.js";
import Entity from "./Entity.js";

import ParticleSpawnPacket from "../../packets/ParticleSpawnPacket.js";

class PropEntity extends Entity {
  static id = `prop_entity`;

  // Имеется своя система подгрузки текстур и не требуется использовать встроенную
  static customTextureBehavior = true;

  state = new SharedData("state", SharedData.STR_T, "default");
  prop_id = new SharedData("prop_id", SharedData.STR_T, "default");

  constructor({ position = [0,0], worldId = "core:spawn", propId = "lamp", state = "default" } = {}) {
    super({ position, worldId })

    let propCandidate = PropRegistry.getById(this.getPackId(), propId);

    if (!propCandidate) {
      console.error(`Prop is not finded.`)
      return;
    }

    let stateValue = propCandidate.states[state];

    if (!stateValue) {
      console.error(`Prop state [${stateName}] is not exist`)
      return;
    }

    this.state.setValue(state);
    this.prop_id.setValue(propId);
  }

  getPropId() {
    return this.prop_id.getValue();
  }

  getState() {
    return this.state.getValue();
  }

  getPropData() {
    return PropRegistry.getById(this.getPackId(), this.getPropId());
  }

  getTags() {
    let propData = PropRegistry.getById(this.getPackId(), this.getPropId());

    if (propData.states[this.getState()].tags) {
      return propData.states[this.getState()].tags;
    }

    if (propData.tags) {
      return propData.tags;
    }

    return this.tags;
  }

  handleDamage(entity, damage) {
    let propData = this.getPropData();

    if (propData.onDamage) {
      let moves = propData.onDamage.split("/");
      
      moves.forEach((arg) => {
        let args = arg.split(":");

        switch (args[0]) {
          case "state": this.state.setValue(args[1]); return;
          case "spawn_particle": {
            let server = this.getWorld().application.context;

            let particle = this.getWorld().spawnParticle(new Particle({
              pack: args[1],
              particleType: args[2],
              position: this.getPosition(),
              worldId: this.getWorld().getId()
            }))
            ParticleSpawnPacket.serverSend(server, server.getPlayersConnections(), { particle })
            return;
          }
          case "death": this.getWorld().application.removeEntity(this.getUuid()); return;
        }
      })

      return true;
    }

    return false;
  }
}

export default PropEntity;