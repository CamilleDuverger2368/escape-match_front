<template>
    <div id="room">
        <div class="slider" @click="openInformations = true">
            <img src="~/public/icones/list.svg" alt="room's informations">
        </div>
        <section id="informations" :class="openInformations ? 'active' : 'inactive'">
            <button @click="openInformations = false" class="close">X</button>
            <div class="info">
                <div v-if="changeName === false" class="name">{{ roomName }}</div>
                <form v-else id="form-update-room-name" @submit.prevent="updateRoomName()">
                    <Input name="Room's new name" type="text" id="room_name" :data="roomName" :error="error.roomName" :require="true" @check="checkName" />
                    <button type="submit" class="submit">Update</button>
                </form>
                <button v-if="changeName === false" @click="changeName = true" class="change">Change Room's name</button>
                <button v-else @click="changeName = false" class="change">Retour</button>
                <div class="date">Created at {{ formatDate(room.createdAt) }}</div>
                <div class="title">Admin(s)</div>
                <div class="line" v-bind:key="admin" v-for="admin in room.admins">
                    <div v-if="admin.pseudo">{{ admin.pseudo }}</div>
                    <div v-else>{{ admin.firstname + ' ' + admin.name }}</div>
                </div>
                <div class="title">Members</div>
                <div v-if="addingMember === false && isAdmin === true" class="change" @click="addingMember = true">add member</div>
                <form v-else-if="addingMember === true && isAdmin === true" id="form-add-member" @submit.prevent="addMember()">
                    <ListfieldUsers title="Choose member to add" :options="people" :data="newMember" @select="checkMember"/>
                    <button type="submit" class="submit">Add</button>
                </form>
                <div class="line" v-bind:key="member" v-for="member in room.members">
                    <div v-if="member.pseudo">{{ member.pseudo }}</div>
                    <div v-else>{{ member.firstname + ' ' + member.name }}</div>
                    <div v-if="isAdmin" class="actions">
                            <div class="granted" @click="grantedAdmin(member.id)">Granted to Admin</div>
                            <div class="kick-off" @click="kickOff(member.id)">Kick-off this room</div>
                    </div>
                </div>
                <div class="quit" @click="quitRoom()">Quit room</div>
            </div>
        </section>
        <section id="current">
            <div id="messages">
                <div v-bind:key="message" v-for="message in room.messages" :class="message.sender.email !== current ? 'message other' : 'message current'">
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
    </div>
</template>

<script setup>
import dayjs from "dayjs"

const token = useCookie("token")
const current = useCookie("email")
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

let openInformations = ref(false)
let changeName = ref(false)
let addingMember = ref(false)

onMounted(() => {

    getRoom()
    getPeople()
    readMessages()
})
onBeforeUnmount(() => {
    
    clearTimeout()
})
const currentUser = useCookie("email")
let isAdmin = ref(false)
let room = ref({
    id: null,
    name: '',
    createdAt: '',
    members: [],
    messages: [],
    admins: []
})
let message = ref('')
let roomName = ref('')
let people = ref([])
let newMember = ref(0)
let error = ref({
    message: '',
    roomName: ''
})
const getRoom = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        room.value = data.value
        if (roomName.value === '') {
            roomName.value = data.value.name
        }
        for(let i = 0; i < room.value.admins.length; i++) {

            if (room.value.admins[0].email === currentUser.value) {

                isAdmin.value = true
            }
        }
        setTimeout(getRoom, 200)
    }
}
const updateRoomName = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/update/name/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            name: roomName.value
        }
    })

    if (data.value) {

        changeName.value = false
    }
}
const checkName = (data) => {

    roomName.value = data
}
const sendMessage = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/send/" + route.params.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            message: message.value,
        }
    })

    if (data.value) {

        getRoom()
        message.value = ''
        readMessages()
    }
}
const fillUpMessage = (data) => {

    message.value = data
}
const readMessages = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "messages/read/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
}
const quitRoom = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/quit/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        router.push("/logged/profil")
    }
}
const formatDate = (dateString) => {
  
  const date = dayjs(dateString);
  return date.format("DD-MM-YYYY");
}

// Admin's section
const grantedAdmin = async (userId) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/granted/admin/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            member: userId
        }
    })
}
const kickOff = async (userId) => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/kick-off/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            member: userId
        }
    })
}
const getPeople = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/list", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        people.value = data.value
    }
}
const addMember = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/add/member/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            member: newMember.value
        }
    })

    if (data.value) {

        addingMember.value = false
    }
}
const checkMember = async (data) => {

    newMember.value = data
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#room {

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

    #informations {
        width: 100vw;
        position: fixed;
        background-color: $black;
        z-index: 26;
        height: 75vh;
        overflow-y: scroll;
        overflow-x: hidden;
        @include flex($direction:column, $justify:flex-start);
        transition: transform 0.5s ease-in-out;

        .close {
            position: fixed;
            top: 2vh;
            right: 4vw;
            font-weight: 900;
            color: $orange;
        }

        .info {
            width: 100%;
            margin-bottom: 30px;
            @include flex($direction:column);

            .name {
                width: 90%;
                margin: 20px auto 10px auto;
                @include flex();
                font-size: 1.5rem;
                font-weight: bold;
                color: $orange;
            }

            form {
                width: 70%;
                @include flex($direction:column);

                .submit {
                    width: 50%;
                    margin: 20px auto;
                    @include button($color:$orange);
                    @include flex();
                }
            }

            .change {
                color: $orange;
                @include link($color:$orange);
            }

            .date {
                width: 90%;
                margin: 20px auto 10px auto;
                @include flex();
                font-style: italic;
            }

            .title {
                width: 90%;
                margin: 15px auto 10px auto;
                @include flex();
                font-size: 1.25rem;
                font-weight: bold;
                color: $green;
            }

            .line {
                width: 90%;
                margin: 5px auto;
                @include flex();

                .actions {
                    width: 60%;
                    margin: 15px 0;
                    @include flex($direction:column);

                    .granted {
                        color: $green;
                        @include link($color:$green);
                    }

                    .kick-off {
                        color: $red;
                        @include link($color:$red);
                    }
                }
            }

            .quit {
                width: 50%;
                margin: 20px auto;
                @include button($color:$red);
                @include flex();
            }
        }
    }

    .slider {
        position: absolute;
        @include flex();
        width: 40px;
        height: 40px;
        box-shadow: 0 0 10px $orange;
        transition: 0.3s ease-in-out;
        top: 11%;
        right: 0;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
        background-color: $black;

        &:hover, &:active {
            width: 75px;

            img {
                width: 30px;
            }
        }

        img {
            width: 25px;
            transition: 0.3s ease-in-out;
        }
    }

    .active {
        transform: translate(0vw);
    }

    .inactive {
        transform: translate(100vw);
    }
}

@media screen and (min-width: 450px) {
    #room {
        #current {
            width: 70%;
        }

        #informations {
            #info {
                width: 70%;
            }
        }
    }
}

@media screen and (min-width: 1100px) {
    #room {
        #current {
            width: 50%;

            #message {

                -ms-overflow-style: none;
                scrollbar-width: none;
                &::-webkit-scrollbar {
                    display: none;
                }
            }
        }

        #informations {

            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
            #info {
                width: 50%;
            }
        }
    }
}
</style>