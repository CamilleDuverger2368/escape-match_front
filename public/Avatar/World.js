import Experience from "./Experience"
import * as THREE from "three"
import Light from "./Light"
import Avatar from "./Avatar"
import BowlerHat from "./dressing/hat/BowlerHat"
import SherlockHat from "./dressing/hat/SherlockHat"
import Cap from "./dressing/hat/Cap"
import TopHat from "./dressing/hat/TopHat"
import Glass from "./dressing/hand/Glass"
import Torchman from "./dressing/hand/Torchman"
import Weapon from "./dressing/hand/Weapon"
import Jogging from "./dressing/suit/Jogging"
import Skirt from "./dressing/suit/Skirt"
import Smoking from "./dressing/suit/Smoking"
import SuitPants from "./dressing/suit/SuitPants"
import Sweat from "./dressing/suit/Sweat"
import Tshirt from "./dressing/suit/Tshirt"

let once = 0

export default class World {

    constructor(color,
                hat,
                suit,
                goodie
    ) {
 
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
            switch(hat) {
                case "BowlerHat":
                    this.hat = new BowlerHat()
                case "Cap":
                    this.hat = new Cap()
                case "SherlockHat":
                    this.hat = new SherlockHat()
                case "TopHat":
                    this.hat = new TopHat()
                default :
                    this.hat = null
            }
            switch(suit) {
                case "Jogging":
                    this.suit = new Jogging()
                case "Skirt":
                    this.suit = new Skirt()
                case "SuitPants":
                    this.suit = new SuitPants()
                case "Smoking":
                    this.suit = new Smoking()
                case "Sweat":
                    this.suit = new Sweat()
                case "Tshirt":
                    this.suit = new Tshirt()
                default :
                    this.suit = null
            }
            switch(goodie) {
                case "Glass":
                    this.goodie = new Glass()
                case "Torchman":
                    this.goodie = new Torchman()
                case "Weapon":
                    this.goodie = new Weapon()
                default :
                    this.suit = null
            }
        })
    }

    update() {

        // this.mesh.rotation.y += 0.01
        if (this.avatar) {

            this.avatar.avatar.rotation.y += 0.01
        }
        if (this.hat) {

            this.hat.hat.rotation.y += 0.01
        }
        if (this.suit) {

            this.suit.suit.rotation.y += 0.01
        }
        if (this.goodie) {

            this.goodie.goodie.rotation.y += 0.01
        }
    }

    changeColor(color) {

        this.light.changeColor(color)
    }
    
    changeDressing(hat, suit, goodie) {
        
        switch(hat) {
            case "BowlerHat":
                this.hat = new BowlerHat()
            case "Cap":
                this.hat = new Cap()
            case "SherlockHat":
                this.hat = new SherlockHat()
            case "TopHat":
                this.hat = new TopHat()
            default :
                this.hat = null
        }
        switch(suit) {
            case "Jogging":
                this.suit = new Jogging()
            case "Skirt":
                this.suit = new Skirt()
            case "SuitPants":
                this.suit = new SuitPants()
            case "Smoking":
                this.suit = new Smoking()
            case "Sweat":
                this.suit = new Sweat()
            case "Tshirt":
                this.suit = new Tshirt()
            default :
                this.suit = null
        }
        switch(goodie) {
            case "Glass":
                this.goodie = new Glass()
            case "Torchman":
                this.goodie = new Torchman()
            case "Weapon":
                this.goodie = new Weapon()
            default :
                this.suit = null
        }
    }
}