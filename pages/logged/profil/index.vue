<template>
    <div id="profil">
        <Avatar :color="color"
                page="profil"
                :hat="avatar.hat"
                :suit="avatar.suit"
                :goodie="avatar.goodie"/>
        <section v-if="avatar.title" id="title">{{ avatar.title }}</section>
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
        <section :class="openInfo ? 'menu active' : 'menu inactive-left'">
        </section>
        <section :class="openList ? 'menu active' : 'menu inactive-right'">
        </section>
    </div>
</template>

<script setup>

onMounted(() => {
    getAvatar()
})

let avatar = ref({
    id: '',
    hat: '',
    suit: '',
    goodie: '',
    title: ''
})
const getAvatar = async () => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/find", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        // DEBUG !!!
        console.log("no update without console.log ?")
        // DEBUG !!!
        avatar.value = data.value
    }
}
const redirectToInformations = () => {

    openInfo.value = true
    setTimeout(() => router.push("/logged/profil/informations"), 500);
}
const redirectToSessions = () => {

    openList.value = true
    setTimeout(() => router.push("/logged/profil/sessions"), 500);
}
const redirectToMessages = () => {

    openList.value = true
    setTimeout(() => router.push("/logged/profil/messages"), 500);
}
const redirectToSuccess = () => {

    openInfo.value = true
    setTimeout(() => router.push("/logged/profil/success"), 500);
}

const router = useRouter()
let color = ref("#FF7A00")
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()

// Menu's section
let openInfo = ref(false)
let openList = ref(false)

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

    .menu {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 73vh;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;
    }
}
</style>