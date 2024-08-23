import Experience from "../../Experience"
import * as THREE from "three"

export default class BowlerHat {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.setInstance()
    }

    setInstance() {

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: "#00FFFF" })
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
    }
}