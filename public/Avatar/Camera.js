import Experience from "./Experience"
import * as THREE from "three"

export default class Camera {
    
    constructor() {

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
    }

    setInstance() {

        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
        this.instance.position.z = 3
        this.scene.add(this.instance)
    }

    resize() {

        this.instance.aspect = this.sizes.width / this.sizes.height
    }
}