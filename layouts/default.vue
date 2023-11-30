<template>
    <div id="layout">
        <Header />
        <div class="contain-body">
            <slot />
        </div>
        <Footer />
    </div>
</template>

<style lang="scss" scoped>
.contain-body {
    min-height: 75vh;
    width: 100%;
}
</style>