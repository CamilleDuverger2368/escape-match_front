<template>
    <div id="layout">
        <Header @open="openNav()" />
        <div class="contain-body">
            <slot />
        </div>
        <Footer />
        <Menu :open="menu" @close="closeNav()"/>
    </div>
</template>

<script setup>

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