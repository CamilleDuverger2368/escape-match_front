<template>
    <div id="success" :class="load ? 'active' : 'inactive-left'">
        <button @click="redirectToProfil" class="close">X</button>
        <div class="info">
            <div class="lists">
                <button @click="achievementsToShow = 'unlocked'" :class="achievementsToShow === 'unlocked' ? 'active-list' : ''">Unlocked</button>
                <button @click="achievementsToShow = 'locked'" :class="achievementsToShow === 'locked' ? 'active-list' : ''">Locked</button>
                <button @click="achievementsToShow = 'objects3D'" :class="achievementsToShow === 'objects3D' ? 'active-list' : ''">Objects 3D</button>
                <button @click="achievementsToShow = 'titles'" :class="achievementsToShow === 'titles' ? 'active-list' : ''">Titles</button>
            </div>
            <AchievementList v-if="achievementsToShow == 'unlocked'" :id="'unlocked'" :achievements="unlocked" />
            <AchievementList v-else-if="achievementsToShow == 'locked'" :id="'locked'" :achievements="locked" />
            <div v-else-if="achievementsToShow == 'objects3D'" class="objects">
                <div class="lists">
                    <button @click="objectsToShow = 'hats'" :class="objectsToShow === 'hats' ? 'active-list' : ''">hats</button>
                    <button @click="objectsToShow = 'suits'" :class="objectsToShow === 'suits' ? 'active-list' : ''">suits</button>
                    <button @click="objectsToShow = 'goodies'" :class="objectsToShow === 'goodies' ? 'active-list' : ''">goodies</button>
                </div>
                <Objects3dShop v-if="objectsToShow == 'hats'" id="hats" :data="avatar.hat" :objects="object3D" :objectsRef="hats" @choose="chooseHat" />
                <Objects3dShop v-if="objectsToShow == 'suits'" id="suits" :data="avatar.suit" :objects="object3D" :objectsRef="suits" @choose="chooseSuit" />
                <Objects3dShop v-if="objectsToShow == 'goodies'" id="goodies" :data="avatar.goodie" :objects="object3D" :objectsRef="objects" @choose="chooseObject" />
            </div>
            <div v-else-if="achievementsToShow == 'titles'" class="objects">
                <Objects3dShop id="titles" :data="avatar.title" :objects="titles" :objectsRef="titlesRef" @choose="chooseTitle" />
            </div>
        </div>
    </div>
</template>

<script setup>

let load = ref(false)
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const router = useRouter();

onMounted(async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/achievements", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        load.value = true
        unlocked.value = data.value.unlocked
        locked.value = data.value.locked
        object3D.value = data.value.object3D
        titles.value = data.value.titles
        avatar.value = data.value.avatar
    }
})
const redirectToProfil = () => {

    load.value = false
    setTimeout(() => router.push("/logged/profil"), 500)
}

// Menu's section
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

// Avatar's section
let object3D = ref([])
let titles = ref([])
let avatar = ref({
    id: '',
    hat: '',
    suit: '',
    goodie: '',
    title: ''
})

const hats = ["BowlerHat", "SherlockHat", "Cap", "TopHat"]
const suits = ["Smoking", "Sweat", "Tshirt", "Jogging", "Skirt", "SuitPants"]
const objects = ["Glass", "Torchman", "Weapon"]
const titlesRef = ["Maitre du Donjon", "Le newbie !", "Super Copaing"]

const getAvatar = async () => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/find", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        avatar.value = data.value
    }
}
const chooseHat = async (element) => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/dress/" + avatar.value.id + "/hat/" + element, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getAvatar()
    }
}
const chooseSuit = async (element) => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/dress/" + avatar.value.id + "/suit/" + element, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getAvatar()
    }
}
const chooseObject = async (element) => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/dress/" + avatar.value.id + "/goodie/" + element, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getAvatar()
    }
}
const chooseTitle = async (element) => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "avatar/title/" + avatar.value.id + '/' + element, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getAvatar()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.inactive-left {
    transform: translate(-100vw);
}

.active {
    transform: translate(0vw);
}

#success {
    width: 100%;
    overflow-x: hidden;
    @include flex($direction:column);
    transition: transform 0.5s ease-in-out;

    .close {
        width: 100%;
        color: $orange;
        margin-right: 30px;
        @include flex($justify:flex-end);
    }

    .info {
        width: 100%;
        margin-bottom: 30px;
        margin-top: 60px;
        @include flex($direction:column);

        .lists {
            width: 90%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
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
            
            .active {
                background-color: rgba($orange, 0.7);
                color: $black !important;
                transition: 0.3s ease-in-out;
            }

            .icone {

                padding: 10px 15px;
                border-radius: 5px;
                border: solid 1px rgba($orange, 0.7);
                @include flex($direction:column, $justify:flex-start);
                transition: 0.3s ease-in-out;
                color: $orange;
                font-style: italic;
                text-align: center;

                &:hover {
                    background-color: rgba($orange, 0.7);
                    color: $black;
                    transition: 0.3s ease-in-out;
                }
            }
        }

        button {
            
            @include button($paddingY:10px, $paddingX:20px);
        }
    }
}
</style>