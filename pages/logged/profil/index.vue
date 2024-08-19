<template>
    <div id="profil">
        <Avatar :color="color" page="profil"/>
        <!--WIP TEST DE TITRE-->
        <section id="title">Nouvel arrivant !</section>
        <section id="slider-menu">
            <div class="slider informations" @click="redirectToInformations">
                <img src="~/public/icones/user.svg" alt="profil's informations">
            </div>
            <div class="slider lists" @click="redirectToSessions">
                <img src="~/public/icones/list.svg" alt="profil's lists">
            </div>
            <div class="slider success" @click="redirectToSuccess">
                <img class="little" src="~/public/icones/cup.svg" alt="profil's success">
            </div>
            <div class="slider conversations" @click="redirectToMessages">
                <img src="~/public/icones/message.svg" alt="profil's conversations">
            </div>
        </section>
        <section id="menu-informations" :class="openInfo ? 'active' : 'inactive-left'">
        </section>
        <section id="menu-lists" :class="openList ? 'active' : 'inactive-right'">
        </section>
        <section id="menu-success" :class="openSuccess ? 'active' : 'inactive-left'">
        </section>
        <section id="menu-conversations" :class="openConv ? 'active' : 'inactive-right'">
        </section>
    </div>
</template>

<script setup>

onMounted(() => {
})

const redirectToInformations = () => {

    openInfo.value = true
    setTimeout(() => router.push("/logged/profil/informations"), 500);
}
const redirectToSessions = () => {

    openList.value = true
    setTimeout(() => router.push("/logged/profil/sessions"), 500);
}
const redirectToMessages = () => {

    openConv.value = true
    setTimeout(() => router.push("/logged/profil/messages"), 500);
}
const redirectToSuccess = () => {

    openSuccess.value = true
    setTimeout(() => router.push("/logged/profil/success"), 500);
}

const router = useRouter()
let color = ref("#FF7A00")
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()

// Menu's section
let openInfo = ref(false)
let openList = ref(false)
let openSuccess = ref(false)
let openConv = ref(false)

</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.inactive-left {
    transform: translate(-100vw);
}

.inactive-right {
    transform: translate(100vw);
}

.active {
    transform: translate(0vw);
}

#profil {

    width: 100%;
    @include flex();

    #title {
        width: 100%;
        position: absolute;
        height: 65vh;
        color: $orange;
        text-align: center;
    }

    #slider-menu {
        width: 100%;
        position: absolute;
        height: 70vh;

        .slider {
            position: absolute;
            @include flex();
            width: 50px;
            height: 50px;
            box-shadow: 0 0 10px $orange;
            transition: 0.3s ease-in-out;

            &:hover, &:active {
                width: 75px;
            }

            img {
                width: 65%;

                &.little {
                    width: 50%;
                }
            }
        }

        .informations {
            top: 0;
            left: 0;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }

        .lists {
            top: 0;
            right: 0;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }

        .success {
            bottom: 0;
            left: 0;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }

        .conversations {
            bottom: 0;
            right: 0;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }
    }

    #menu-informations {
        width: 100vw;
        position: fixed;
        background-color: $black;
        // DEBUG !!!
        // background-color: $red;
        // DEBUG !!!
        height: 73vh;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;
    }

    #menu-lists {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 73vh;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;
    }

    #menu-success {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 73vh;
        overflow-y: scroll;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;

    }

    #menu-conversations {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 73vh;
        overflow-y: scroll;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;
    }
}
</style>