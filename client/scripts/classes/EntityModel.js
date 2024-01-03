import * as THREE from 'three';

class EntityModel {
  constructor(entity) {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);

    if (entity.getType() == "player_entity") {
      this.material = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
    } else {
      this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.entity = entity;
  }

  getMesh() {
    return this.mesh;
  }
}

export default EntityModel;