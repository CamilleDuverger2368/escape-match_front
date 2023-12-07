<template>
    <div id="avatar-three">
        <canvas class="webgl"></canvas>
    </div>
</template>

<script setup>
import Avatar from "~/public/avatar.js"

const props = defineProps({
    color: {
        type: String,
        require: true
    }
})

onMounted(() => {
    
    let avatar = new Avatar(document.querySelector("canvas.webgl"))
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#avatar-three {
    width: 100%;
}
</style>