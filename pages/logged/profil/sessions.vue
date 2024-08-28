<template>
    <div id="lists-sessions" :class="load ? 'active' : 'inactive-right'">
        <button @click="redirectToProfil" class="close">X</button>
        <div class="info">
            <div class="lists">
                <button @click="listToShow = 'To-Do'" :class="listToShow === 'To-Do' ? 'active-list' : ''">To-Do</button>
                <button @click="listToShow = 'Favori'" :class="listToShow === 'Favori' ? 'active-list' : ''">Favori</button>
                <button @click="listToShow = 'Done'" :class="listToShow === 'Done' ? 'active-list' : ''">Done</button>
            </div>
            <Tablelist v-if="listToShow == 'To-Do'" :headers="['Escape', 'Since', 'Actions']" :list="toDo" id="list-to-do-user" :toDo="true" @delete="deleteFromToDo" @actualise="updateToDo" page="current" />
            <Tablelist v-else-if="listToShow == 'Favori'" :headers="['Escape', 'Since', 'Actions']" :list="favoris" id="list-favori-user" @delete="deleteFromFavoris" page="current" />
            <div v-else-if="listToShow == 'Done'" class="sessions">
                <div v-if="sessions.length > 0" :key="session" v-for="session in sessions" class="session">
                    <div class="time">
                        <img src="~/public/icones/hourglass.svg" alt="time">
                        {{ formatDate(session.playedAt) }}
                        <span>Escape : </span><nuxt-link :to="'/logged/' + session.escape.id">{{ session.escape.name }}</nuxt-link>
                    </div>
                    <div class="members">
                        <div class="title">Members</div>
                        <nuxt-link :key="member" v-for="member in session.members" :to="member.email === currentEmail ? '/logged/profil' : '/logged/profil/' + member.id" class="member">
                            {{ member.firstname + ' ' + member.name }}
                            <span v-if="member.pseudo"> aka {{ member.pseudo }}</span>
                        </nuxt-link>
                    </div>
                    <button @click="deleteSession(session.id)" class="delete">Delete</button>
                </div>
                <div v-else>There is no done session</div>
            </div>
            <!--<Tablelist v-else-if="listToShow == 'Done'" :headers="['Escape', 'Since', 'Actions']" :list="done" id="list-done-user" @delete="deleteFromDone" page="current" />-->
        </div>
    </div>
</template>

<script setup>
import { formatDate } from "~/public/usefull/usefull"

let load = ref(false)
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const router = useRouter();

onMounted(async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/lists", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        load.value = true
        sessions.value = data.value.sessions
        favoris.value = data.value.favoris
        toDo.value = data.value.toDo
    }
})

// Menu's section
let listToShow = ref("To-Do")

const redirectToProfil = () => {

    load.value = false
    setTimeout(() => router.push("/logged/profil"), 500)
}

// Lists' section
let favoris = ref([])
let toDo = ref([])
let sessions = ref([])

// Get
const getSessions = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/session", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        sessions.value = data.value
    }
}
const getFavoris = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        favoris.value = data.value
    }
}
const getToDo = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        toDo.value = data.value
    }
}
// Delete
const deleteFromFavoris = async (value) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris/remove/" + value, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getFavoris()
    }
}
const deleteFromToDo = async (value) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/remove/" + value, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getToDo()
    }
}
const deleteSession = async (value) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/session/remove/" + value, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getSessions()
    }
}
// Update
const updateToDo = async (value) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/update/" + value, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    
    if (data.value) {

        getToDo()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.inactive-right {
    transform: translate(100vw);
}

.active {
    transform: translate(0vw);
}

#lists-sessions {
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
            width: 100%;
            @include flex($justify:space-around);

            .active-list {
                box-shadow: 0 0 0 $orange;
                background-color: rgba($orange, .7);
                color: $black;
            }
        }

        button {
            
            @include button($paddingY:10px, $paddingX:20px);
        }
    }

    .sessions {
        width: 100%;
        height: 45vh;
        overflow-y: scroll;
        margin: 53px auto;
        padding: 15px;
        @include flex($direction:column);

        .session {
            width: 70%;
            border: solid 1px rgba($orange, 0.7);
            border-radius: 5px;
            @include flex($direction:column);

            .time {
                width: 100%;
                @include flex();

                img {
                    width: 40px;
                    margin: auto 3px;
                }

                span {
                    color: $orange;
                    margin: auto 15px;
                }

                a {
                    @include link();
                }
            }
            
            .title {
                color: $orange;
                font-size: 1.25rem;
                font-weight: 400;
            }

            .members {
                width: 100%;
                margin: 10px auto;
                @include flex($direction:column);

                .member {
                    @include link();
                }
            }

            .delete {
                @include button($paddingY: 10px, $paddingX: 20px, $size: 1rem, $marge:10px, $color:$red);
            }
        }
    }
}
</style>