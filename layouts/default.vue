<template>
    <div id="layout">
        <Header @open="openNav()" />
        <div class="contain-body">
            <slot />
        </div>
        <Footer />
        <Menu :open="menu" :logged="authenticated" @close="closeNav()"/>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { useAuthStore } from "~/store/auth"

const { authenticated } = storeToRefs(useAuthStore())

// Open Close menu
let menu = ref(false)
const openNav = () => {
    menu.value = true
}
const closeNav = () => {
    menu.value = false
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.contain-body {
    min-height: 77vh;
    width: 100%;
    @include flex($direction:column);
}
</style>