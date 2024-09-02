import Experience from "../../Experience"
import * as THREE from "three"

export default class Skirt {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.setInstance()
    }

    setInstance() {

        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: "#FF4500" })
        // this.mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(this.mesh)
        
        this.suit = this.resources.items.suit.scene
        this.suit.position.set(0, 0, -2)
        this.scene.add(this.suit)
    }
}