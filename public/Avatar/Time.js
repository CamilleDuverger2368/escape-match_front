import EventEmitter from "./EventEmitter"
import * as THREE from "three"

export default class Time extends EventEmitter {

    constructor() {

        super()

        // setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.clock = new THREE.Clock()

        window.requestAnimationFrame(() => {

            this.tick()
        })
    }

    tick() {

        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.clock.getElapsedTime()

        this.trigger("tick")

        window.requestAnimationFrame(() => {
            
            this.tick()
        })
    }

    resetClock() {

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.clock = new THREE.Clock()

        window.requestAnimationFrame(() => {

            this.tick()
        })
    }
}