import Sizes from "./Sizes"
import Time from "./Time"
import * as THREE from "three"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World"
import Resources from "./Resources"
import sources from "./sources"

// Singleton = on garde la premiere instanciation de la class en quesiton quand elle est appelee ailleurs (pour faire comme une variable globale)
let instance = null

export default class Experience {

    constructor(canvas, color, page) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access = y acceder depuis la console
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.sizes = new Sizes(page)
        this.time = new Time()
        this.scene = new THREE.Scene()
        // this.mouse = new THREE.Vector2()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World(color)

        // Listening events
        this.sizes.on("resize", () => {

            this.resize()
        })

        this.time.on("tick", () => {

            this.update()
        })

        // window.addEventListener("mousemove", (event) => {

        //     this.mouse.x = event.clientX / this.sizes.width * 2 - 1
        //     this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
        // })
    }

    resize() {

        this.camera.resize()
        this.renderer.resize()
    }

    update() {

        this.world.update()
        this.renderer.update()
    }

    changeColor(color) {

        this.scene.remove(this.mesh)
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: color })
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)

        this.renderer.update()
    }
}