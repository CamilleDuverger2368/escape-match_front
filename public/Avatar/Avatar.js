import Experience from "./Experience"

export default class Avatar {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.setInstance()
    }

    setInstance() {

        this.avatar = this.resources.items.avatar.scene
        this.avatar.position.set(0, 0, -2)
        this.scene.add(this.avatar)
    }
}