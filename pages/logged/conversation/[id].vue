<template>
    <div id="conversation">
        <section id="current">
            <div id="messages">
                <div v-bind:key="message" v-for="message in conversation.messages" :class="message.sender.email !== current ? 'message other' : 'message current'">
                    <div class="informations">
                        <div class="meta">
                            <div class="name" v-if="message.sender.pseudo">{{ message.sender.pseudo }}</div>
                            <div class="name" v-else>{{ message.sender.firstname + ' ' + message.sender.name }}</div>
                            <div class="time">{{ formatDate(message.createdAt) }}</div>
                        </div>
                        <div class="text">{{ message.message }}</div>
                    </div>
                </div>
            </div>
            <div id="send">
                <form id="form" @submit.prevent="sendMessage()">
                    <div class="contain"><Input name="" type="text" id="message" :data="message" :error="error.message" :require="true" @check="fillUpMessage" /></div>
                    <button type="submit">Send</button>
                </form>
            </div>
        </section>
        <!--WIP-->
        <div class="slider lists" @click="openList = true">
            <img src="~/public/icones/list.svg" alt="profil's lists">
        </div>
        <section id="informations"></section>
        <!--WIP-->
    </div>
</template>

<script setup>
import dayjs from "dayjs"

const token = useCookie("token")
const current = useCookie("email")
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

onMounted(() => {

    getConversation()
    readMessages()
})

let conversation = ref({
    id: null,
    name: '',
    createdAt: '',
    members: [],
    messages: [],
    administrator: {}
})
let message = ref('')
let error = ref({
    message: ''
})
const getConversation = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        conversation.value = data.value

        setTimeout(getConversation, 5000)
    }
}
const sendMessage = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            message: message.value,
            room: route.params.id
        }
    })

    if (data.value) {

        getConversation()
        message.value = ''
        readMessages()
    }
}
const readMessages = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/read", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            room: route.params.id
        }
    })
}
const formatDate = (dateString) => {
  
  const date = dayjs(dateString);
  return date.format("DD-MM-YYYY");
}
const fillUpMessage = (data) => {

    message.value = data
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#conversation {

    width: 100%;
    @include flex();

    #current {
        
        width: 100%;
        height: 77vh;
        @include flex($direction:column);

        #messages {

            width: 100%;
            height: 70vh;
            overflow-y: scroll;
            @include flex($direction:column, $justify:flex-end);

            .message {

                width: 95%;
                margin: 10px auto;
                
                .informations {

                    max-width: 55%;
                    min-width: 25%;
                    @include flex($direction:column);

                    .meta {
                        
                        width: 100%;
                        @include flex($justify:space-between);

                        .name, .time {
                            font-size: .8rem;
                            margin-bottom: 2px;
                        }
                    }

                    .text {

                        width: 100%;
                        border-radius: 5px;
                        padding: 3px;
                        box-shadow: 0 0 5px $orange;
                    }
                }
            }

            .other {

                @include flex($justify: flex-start);

                & > .informations > .text {

                    box-shadow: 0 0 5px $green;
                }
            }

            .current {

                @include flex($justify: flex-end);
            }
        }

        #send {

            width: 100%;
            height: 7vh;
            @include flex();

            form {
                width: 95%;
                margin: 20px auto 30px auto;
                @include flex($justify:space-between);

                .contain {

                    width: 75%;
                }

                button {

                    @include button($paddingY:12px, $paddingX:20px, $size:1rem);
                }
            }
        }
    }
}
</style>