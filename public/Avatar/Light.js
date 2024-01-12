import Experience from "./Experience"
import * as THREE from "three"

export default class Light {

    constructor(color) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.color = color

        this.setAmbientLight()
        this.setDirectionalLight()
    }

    setAmbientLight() {

        this.ambient = new THREE.AmbientLight("#ffffff")
        this.scene.add(this.ambient)
    }

    setDirectionalLight() {

        this.directional = new THREE.DirectionalLight(this.color)
        this.directional.position.set(0, 0, 2)
        this.directional.castShadow = true
        this.directional.shadow.mapSize.set(256, 256)
        this.directional.shadow.camera.far = 15
        this.scene.add(this.directional)
    }
}