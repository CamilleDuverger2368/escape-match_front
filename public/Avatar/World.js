import Experience from "./Experience"
import * as THREE from "three"
import Light from "./Light"
import Avatar from "./Avatar"

let once = 0

export default class World {

    constructor(color) {
 
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.mouse = this.experience.mouse
        this.camera = this.experience.camera
        this.light = new Light(color)

        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: color })
        // this.mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(this.mesh)

        this.resources.on("ready", () => {

            this.avatar = new Avatar()
        })
    }

    update() {

        // this.mesh.rotation.y += 0.01
        if (this.avatar) {

            this.avatar.avatar.rotation.y += 0.01
        }
    }
}