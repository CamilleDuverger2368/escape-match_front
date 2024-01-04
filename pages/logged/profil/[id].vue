<template>
    <div id="alter-profil"></div>
</template>

<script setup>

const route = useRoute()
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()

onMounted(() => {
    
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#alter-profil {

    width: 100%;
    @include flex($direction:column);
}
</style>