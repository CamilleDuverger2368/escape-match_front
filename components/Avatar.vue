<template>
    <div id="avatar-three">
        <canvas class="webgl"></canvas>
    </div>
</template>

<script setup>
import Avatar from "~/public/Avatar/Experience.js"

const props = defineProps({
    color: {
        type: String,
        require: true
    },
    page: {
        type: String,
        require: true
    }
})

let avatar = null

onMounted(() => {
    
    avatar = new Avatar(document.querySelector("canvas.webgl"), props.color, props.page)
})

onUpdated(() => {

    avatar.changeColor(props.color)
})

onUnmounted(() => {
    avatar.unMounted()
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#avatar-three {
    width: 100%;
}
</style>