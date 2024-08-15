<template>
    <div id="menu-items" :class="open ? 'active' : 'inactive'">
        <button @click="closeMenu()">X</button>
        <LinkMenu v-if="!logged" @click="closeMenu()" link="/" name="S'inscrire" />
        <LinkMenu v-if="!logged" @click="closeMenu()" link="/login" name="Se Connecter" />
        <LinkMenu v-if="logged" @click="closeMenu()" link="/logged/profil" name="Profil" />
        <LinkMenu v-if="logged" @click="closeMenu()" link="/logged/finder/escape" name="Finder" />
        <LinkMenu v-if="logged" @click="closeMenu()" link="/logged/finder/friends" name="Find Friends" />
        <LinkMenu v-if="logged" @click="closeMenu()" link="/logged/profil/list" name="Friends" />
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
const { authenticated } = storeToRefs(useAuthStore());
const logout = async () => {

    await logUserOut()
    if (!authenticated.value) {

        emit('close')
        router.push("/login")
    }
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