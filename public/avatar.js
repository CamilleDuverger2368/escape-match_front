import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

let instance = null

export default class Avatar {

    constructor(canvas, color, page) {

        if (instance) {

            return instance
        }
        instance = this

        window.avatar = this

        // Setup canvas / size
        this.canvas = canvas
        if (page === "register") {
            this.sizes = {
                width: window.innerWidth * 0.8,
                height: 400,
                pixelRatio: Math.min(window.devicePixelRatio, 2)
            }
        } else {
            this.sizes = {
                width: window.innerWidth,
                height: 400,
                pixelRatio: Math.min(window.devicePixelRatio, 2)
            }
        }

        // Setup time
        let now = Date.now()
        this.time = {
            start: now,
            current: now,
            elapsed: 0,
            delta: 16,
            clock: new THREE.Clock()
        }

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)

        // Setup world
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
        this.camera.position.z = 3
        this.scene.add(this.camera)

        // Setup Models
        const gltfLoader = new GLTFLoader()
        gltfLoader.load(
            "../../3D/lego-human.glb",
            (gltf) =>
            {
                scene.add(gltf.scene.children[0])
            }
        )

        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: color })
        // this.mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(this.mesh)

        this.renderer.render(this.scene, this.camera)

        window.addEventListener("resize", () => {

            this.resize()
        })

        window.requestAnimationFrame(() => {

            this.tick()
        })
    }

    resize() {

        this.sizes.width = window.innerWidth * 0.8
        this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    tick() {

        // Update time
        const currentTime = Date.now()
        this.time.delta = currentTime - this.time.current
        this.time.current = currentTime
        this.time.elapsed = this.time.clock.getElapsedTime()

        // Update world
        // this.mesh.rotation.y += 0.01

        // Render
        this.renderer.render(this.scene, this.camera)

        window.requestAnimationFrame(() => {

            this.tick()
        })
    }

    changeColor(color) {

        this.scene.remove(this.mesh)
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: color })
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)

        this.renderer.render(this.scene, this.camera)
    }
}