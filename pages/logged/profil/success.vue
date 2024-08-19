<template>
    <div id="success" :class="load ? 'active' : 'inactive-left'">
        <button @click="redirectToProfil" class="close">X</button>
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
    </div>
</template>

<script setup>

let load = ref(false)
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const router = useRouter();

onMounted(() => {

    getAchievements()
})
const redirectToProfil = () => {

    load.value = false
    setTimeout(() => router.push("/logged/profil"), 500)
}

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

        load.value = true
        unlocked.value = data.value.unlocked
        locked.value = data.value.locked
        object3D.value = data.value.object3D
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
    position: fixed;
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
</style>