<template>
    <div id="menu-items" :class="open ? 'active' : 'inactive'">
        <button @click="closeMenu()">X</button>
        <LinkMenu v-if="!logged" @click="closeMenu()" link="/" name="S'inscrire" />
        <LinkMenu v-if="!logged" @click="closeMenu()" link="/login" name="Se Connecter" />
        <!-- TO-DO : Ajouter les differents liens manquants -->
        <LinkMenu v-if="logged" @click="closeMenu()" link="/logged/profil" name="Profil" />
        <LinkMenu v-if="logged" @click="logout()" link="/" name="Se Déconnecter" />
    </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const props = defineProps({
    open: {
        type: Boolean,
        require: true
    },
    logged: {
        type: Boolean,
        require: true
    }
})

const emit = defineEmits(["close"])
const closeMenu = () => {

    emit('close')
}

// logout's section
const router = useRouter();
const { logUserOut } = useAuthStore();
const logout = () => {

    emit('close')
    logUserOut();
    router.push('/login');
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