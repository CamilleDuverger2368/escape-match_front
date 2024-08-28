<template>
    <div id="conversations" :class="load ? 'active' : 'inactive-right'">
        <button @click="redirectToProfil" class="close">X</button>
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
    </div>
</template>

<script setup>

const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
let load = ref(false)
const router = useRouter();

onMounted(async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/unread", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        rooms.value = data.value
        load.value = true
    }
})

let rooms = ref([{
    room: {
        id: null, 
        name: ''
    },
    unread: null
}])

const redirectToProfil = () => {

    load.value = false
    setTimeout(() => router.push("/logged/profil"), 500)
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

#conversations {
    width: 100vw;
    position: fixed;
    background-color: $black;
    height: 73vh;
    overflow-y: scroll;
    overflow-x: hidden;
    @include flex($direction:column, $justify:flex-start);
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
</style>