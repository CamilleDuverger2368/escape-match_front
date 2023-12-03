<template>
    <div id="menu-items" :class="open ? 'active' : 'inactive'">
        <button @click="closeMenu()">X</button>
        <!-- TO-DO : Ajouter une condition qui checke si l'utilisateur est logged ou non pour les differents liens -->
        <LinkMenu link="test" name="S'inscrire"/>
        <LinkMenu link="test" name="Se Connecter"/>
    </div>
</template>

<script setup>

const props = defineProps({
    open: {
        type: Boolean,
        require: true
    }
})
const emit = defineEmits(["close"])

const closeMenu = () => {

    emit('close')
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.inactive {
    transform: translate(-100vw);
}

.active {
    transform: translate(0vw);
}

#menu-items {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 42;
    @include flex($direction:column);
    // background-color: rgba($color: #000000, $alpha: 0.5);
    background-color: $black;
    transition: transform 0.5s ease-in-out;

    button {
        position: fixed;
        top: 3vh;
        right: 6vw;
        font-weight: 900;
        color: $orange;
    }
}
</style>