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
            <div class="slider success" @click="openSuccess = true">
                <img class="little" src="~/public/icones/cup.svg" alt="profil's success">
            </div>
            <div class="slider conversations"  @click="openConv = true">
                <img src="~/public/icones/message.svg" alt="profil's conversations">
            </div>
        </section>
        <section id="menu-informations" :class="openInfo ? 'active' : 'inactive-left'">
        </section>
        <section id="menu-lists" :class="openList ? 'active' : 'inactive-right'">
        </section>
        <section id="menu-success" :class="openSuccess ? 'active' : 'inactive-left'">
            <button @click="openSuccess = false" class="close">X</button>
            <div class="info">
                <div class="lists">
                    <button @click="achievementsToShow = 'unlocked'" :class="achievementsToShow === 'unlocked' ? 'active-list' : ''">Unlocked</button>
                    <button @click="achievementsToShow = 'locked'" :class="achievementsToShow === 'locked' ? 'active-list' : ''">Locked</button>
                    <button @click="achievementsToShow = 'objects3D'" :class="achievementsToShow === 'objects3D' ? 'active-list' : ''">Objects 3D</button>
                </div>
                <AchievementList v-if="achievementsToShow == 'unlocked'" :id="'unlocked'" :achievements="unlocked" />
                <AchievementList v-else-if="achievementsToShow == 'locked'" :id="'locked'" :achievements="locked" />
                <div v-else-if="achievementsToShow == 'objects3D'" class="objects">
                    <div class="lists">
                        <button @click="objectsToShow = 'hats'" :class="objectsToShow === 'hats' ? 'active-list' : ''">hats</button>
                        <button @click="objectsToShow = 'suits'" :class="objectsToShow === 'suits' ? 'active-list' : ''">suits</button>
                        <button @click="objectsToShow = 'goodies'" :class="objectsToShow === 'goodies' ? 'active-list' : ''">goodies</button>
                    </div>
                    <Objects3dShop v-if="objectsToShow == 'hats'" :id="'hats'" :objects="object3D" :objectsRef="hats"/>
                    <Objects3dShop v-if="objectsToShow == 'suits'" :id="'suits'" :objects="object3D" :objectsRef="suits"/>
                    <Objects3dShop v-if="objectsToShow == 'goodies'" :id="'goodies'" :objects="object3D" :objectsRef="objects"/>
                </div>
            </div>
        </section>
        <section id="menu-conversations" :class="openConv ? 'active' : 'inactive-right'">
            <button @click="openConv = false" class="close">X</button>
            <div class="info">
                <hr v-if="rooms.length > 0" />
                <div v-bind:key="conversation" v-for="conversation in rooms" class="conversation">
                    <nuxt-link :to="'/logged/conversation/' + conversation.room.id">
                        <div class="name">{{ conversation.room.name }}</div>
                        <div v-if="conversation.unread_message > 0" class="unread">{{ conversation.unread_message }} unread messages</div>
                        <div v-else class="unread">Nothing to read !</div>
                    </nuxt-link>
                    <hr />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>

onMounted(() => {

    // To-Do: Faire en sorte que tout ne soit recupere que par une seule et meme route au chargement de la page
    // getProfil()
    // getCities()
    getRooms()
    getAchievements()
})

const redirectToInformations = () => {

    openInfo.value = true
    setTimeout(() => router.push("/logged/profil/informations"), 500);
}
const redirectToSessions = () => {

    openList.value = true
    setTimeout(() => router.push("/logged/profil/sessions"), 500);
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

// Lists' section

// Achievements' section
const hats = ["test 3", "test 5"]
const suits = ["test 1", "test 6"]
const objects = ["test 12", "test 2"]
let achievementsToShow = ref("unlocked")
let objectsToShow = ref("hats")
let unlocked = ref([{
    id: null,
    conditionType: '',
    tropheeType: '',
    trophee: '',
    description: '',
    name: '',
    nextStep: '',
    scalable: false
}])
let locked = ref([{
    id: null,
    conditionType: '',
    tropheeType: '',
    trophee: '',
    description: '',
    name: '',
    nextStep: '',
    scalable: false
}])
let object3D = ref([])
const getAchievements = async () => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "achievements", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        unlocked.value = data.value.unlocked
        locked.value = data.value.locked
        object3D.value = data.value.object3D
    }
}

// Conversations' section
let rooms = ref([{
    room: {
        id: null, 
        name: ''
    },
    unread: null
}])
const getRooms = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/unread", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        rooms.value = data.value
    }
}
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

.close {
    position: fixed;
    top: 2vh;
    right: 3vw;
    font-weight: 900;
    color: $orange;
}

.buttons {
    width: 100%;
    margin: 20px auto;
    @include flex($justify:space-around);

    button {
        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:0);
    }
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
        overflow-y: scroll;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;

        .info {
            width: 100%;
            margin-bottom: 30px;
            margin-top: 60px;
            @include flex($direction:column);

            .lists {
                width: 100%;
                @include flex($justify:space-around);

                .active-list {
                    box-shadow: 0 0 0 $orange;
                    background-color: rgba($orange, .7);
                    color: $black;
                }
            }
        }
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

        .info {
            width: 100%;
            margin-bottom: 30px;
            margin-top: 60px;
            @include flex($direction:column);

            .lists {
                width: 90%;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-row-gap: 10px;
                grid-column-gap: 10px;

                .active-list {
                    box-shadow: 0 0 0 $orange;
                    background-color: rgba($orange, .7);
                    color: $black;
                }
            }

            .objects {

                width: 90%;
                margin: 15px auto;
                @include flex($direction:column);
            }

            button {
                
                @include button($paddingY:10px, $paddingX:20px);
            }
        }
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

        .info {
            width: 100%;
            margin-bottom: 30px;
            margin-top: 60px;
            @include flex($direction:column);

            .conversation {
                width: 100%;
                min-height: 25px;
                transition: color .3s ease-in-out;
                @include flex($direction:column);

                a {
                    width: 100%;
                    @include flex($justify:space-around);
                }

                &:hover, &:active {

                    color: $orange;
                    transition: color .3s ease-in-out;
                }
            }

            hr {
                width: 100%;
                color: $orange;
                font-size: 1rem;
                box-shadow: 0 0 10px $orange;
            }
        }
    }
}
</style>