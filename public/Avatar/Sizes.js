import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter {
    
    constructor(page) {

        super()

        if (page === "register") {

            if (window.innerWidth > 1100) {
                this.width = window.innerWidth * 0.35
            } else if (window.innerWidth > 450 && window.innerWidth <= 1100) {
                this.width = window.innerWidth * 0.6
            } else {
                this.width = window.innerWidth * 0.8
            }
        } else {

            this.width = window.innerWidth
        }
        this.height = 400
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // listen Window resize event
        window.addEventListener("resize", () => {

            if (page === "register") {

                if (window.innerWidth > 1100) {
                    this.width = window.innerWidth * 0.35
                } else if (window.innerWidth > 450 && window.innerWidth <= 1100) {
                    this.width = window.innerWidth * 0.6
                } else {
                    this.width = window.innerWidth * 0.8
                }
            } else {
    
                this.width = window.innerWidth
            }
            this.height = 400
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger("resize")
        })
    }
}