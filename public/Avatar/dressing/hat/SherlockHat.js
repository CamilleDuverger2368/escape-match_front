import Experience from "../../Experience"
import * as THREE from "three"

export default class SherlockHat {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.setInstance()
    }

    setInstance() {

        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: "#6E8B3D" })
        // this.mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(this.mesh)

        this.hat = this.resources.items.hat.scene
        this.hat.position.set(0, 0, -2)
        this.scene.add(this.hat)
    }
}