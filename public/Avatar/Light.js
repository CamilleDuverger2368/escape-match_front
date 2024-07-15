import Experience from "./Experience"
import * as THREE from "three"

export default class Light {

    constructor(color) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.color = color

        this.setAmbientLight()
        this.setDirectionalLight()

        // Debug
        if (this.experience.debug.active) {

            this.debugFolder = this.experience.debug.ui.addFolder("lights")
            this.debugFolder.add(this.directional.position, 'y').min(0).max(10).step(0.01).name("elevation")
            this.debugFolder.add(this.directional.position, 'x').min(0).max(10).step(0.01).name("x")
            this.debugFolder.add(this.directional.position, 'z').min(0).max(10).step(0.01).name("z")
        }
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

    changeColor(color) {

        this.directional.color.set(color)
    }
}