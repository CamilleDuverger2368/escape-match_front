<template>
    <div id="alter-profil" :class="load ? 'visible' : 'invisible'">
        <div v-if="isBlocked" class="blocked-title">BLOCKED</div>
        <div class="name">{{ user.firstname }} {{ user.name }}</div>
        <div v-if="user.pseudo" class="pseudo"> aka {{ user.pseudo }}</div>
        <img v-if="user.profilPic" class="profil-pic" alt="profil-picture" :src="'/profil-pictures/' + user.profilPic + '.webp'" />
        <img v-else class="profil-pic" alt="profil-picture" src="/profil-pictures/neutral.webp" />
        <div v-if="avatar.title" class="title">{{ avatar.title }}</div>
        <Avatar v-if="avatar.id !== ''"
                :color="color"
                page="profil"
                :hat="avatar.hat"
                :suit="avatar.suit"
                :goodie="avatar.goodie"/>
        <div v-if="user.birthday" class="classic"><span>Birthday :</span> {{ formatDate(user.birthday) }}</div>
        <div class="classic"><span>Member since :</span> {{ formatDate(user.createdAt) }}</div>
        <div v-if="user.profil" :class="user.profil">{{ user.profil }}</div>
        <div v-else class="no-profil">No Profil</div>
        <div class="city"><img src="~/public/icones/house.svg" alt="profil's city"><div class="classic">{{ user.city }}</div></div>
        <div v-if="!isBlocked" class="contact" @click="getRoom()">Start a talk !</div>
        <button v-if="friendship === null" @click="sendFriendRequest" class="button">Send friend request !</button>
        <button v-else-if="friendship.friend === false && friendship.sender.email === currentEmail" class="request-sent">Request sent</button>
        <div v-else-if="friendship.friend === false && friendship.receiver.email === currentEmail" class="decision">
            <div class="title">Answer request</div>
            <div class="choice">
                <button class="request-sent" @click="acceptFriendship">&#10003;</button>
                <button class="reject-request" @click="declineFriendship">X</button>
            </div>
        </div>
        <div v-else-if="friendship.friend === true && removeFriendship === false" class="request-sent" @click="removeFriendship = true">Friends since {{ formatDate(friendship.since) }}</div>
        <div v-else-if="friendship.friend === true && removeFriendship === true" class="decision">
            <div class="title">Remove friendship ?</div>
            <div class="choice">
                <button class="request-sent" @click="declineFriendship">&#10003;</button>
                <button class="reject-request" @click="removeFriendship = false">X</button>
            </div>
        </div>

        <button v-if="!isBlocked" @click="blockUser" class="block">Block {{ user.firstname }} ?</button>
        <button v-else @click="unblockUser" class="unblock">Unblock {{ user.firstname }} ?</button>

        <ul v-if="user.level">
            <li :class="'percent--' + levelDecimal"><span>level {{ level }}</span></li>
        </ul>
        <ul v-else>
            <li class="percent--1"><span>level 0</span></li>
        </ul>
        <div class="classic">To-Do List</div>
        <Tablelist :headers="['Escape', 'Since', 'Actions']" :list="user.listToDos" id="list-to-do-user-alter" page="alter" />
        <div class="classic">Favori List</div>
        <Tablelist :headers="['Escape', 'Since', 'Actions']" :list="user.listFavoris" id="list-favori-user-alter" page="alter" />
    </div>
</template>

<script setup>
import { formatDate } from "~/public/usefull/usefull"
import { profilChecker } from "~/public/usefull/checker"

const route = useRoute()
const router = useRouter()
const token = useCookie("token")
const currentEmail = useCookie("email")
const runtimeConfig = useRuntimeConfig()
let load = ref(false)

let color = ref("#FF7A00")
let user = ref({
    id: null,
    name: '',
    firstname: '',
    pseudo: '',
    profilPic: '',
    birthday: '',
    createdAt: '',
    level: null,
    pronouns: null,
    profil: null,
    city: '',
    listFavoris: [],
    listToDos: []
})
let levelDecimal = ref(1)
let level = ref(0)
let avatar = ref({
    id: '',
    hat: '',
    suit: '',
    goodie: '',
    title: ''
})

onMounted( async () => {
    
    const { data, status } = await useFetch(runtimeConfig.public.apiBase + "website/routes/user/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        if (status.value !== "success") {

            router.push("/logged/profil")
        }

        load.value = true
        friendship.value = data.value.friendship
        user.value = data.value.user
        user.value.city = data.value.user.city.name
        color.value = profilChecker(user.value.profil)
        if (user.value.level) {

            levelDecimal.value = user.value.level.toString().substring(user.value.level.toString().indexOf('.') + 1)
            if (levelDecimal.value.length == 1) {

                levelDecimal.value += '0'
            } else if (levelDecimal.value[0] == '0') {

                levelDecimal.value = levelDecimal.value.substring(1)
            }
            level.value = Math.trunc(user.value.level)
        } else {
            level.value = 0
            levelDecimal.value = 0
        }
        avatar.value = data.value.avatar
        isBlocked.value = data.value.isBlocked
    }
})

// Conversation's section
const getRoom = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            members: [route.params.id]
        }
    })

    if (data.value) {
        
        router.push("/logged/conversation/" + data.value.id)
    }
}

// Friendship's section
let friendship = ref(null)
let removeFriendship = ref(false)

const sendFriendRequest = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/asking/" + route.params.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        friendship.value = data.value
    }
}
const acceptFriendship = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/accept/" + friendship.value.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        friendship.value.friend = true
        friendship.value.since = Date.now()
    } 
}
const declineFriendship = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/decline/" + friendship.value.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        friendship.value = null
    }
}

// Block's session
let isBlocked = ref(false)

const isUserBlocked = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/is/blocked/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        isBlocked.value = data.value
    }
}
const blockUser = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/block/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        isUserBlocked()
    }
}
const unblockUser = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/unblock/" + route.params.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        isUserBlocked()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.visible {
    opacity: 100%;
    transition: 0.3s ease-in-out;
}

.invisible {
    opacity: 0%;
    transition: 0.3s ease-in-out;
}

#alter-profil {

    width: 100%;
    margin-bottom: 30px;
    overflow-x: hidden;
    @include flex($direction:column);

    .button {
        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px);
    }

    .request-sent {
        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$green);
    }

    .reject-request {
        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$red);
    }

    .decision {
        width: 100%;
        @include flex($direction:column);

        .title {
            width: 100%;
            font-size: large;
            margin: 10px auto;
            text-align: center;
            color: $orange;
        }

        .choice {
            @include flex();
        }
    }

    .profil-pic {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }

    .name {
        font-size: 3rem;
        margin: 10px auto 0 auto;
    }

    .pseudo {
        font-size: 1rem;
        font-style: italic;
        margin: 0 auto 10px auto;
    }

    .blocked-title {
        font-size: 3rem;
        margin: 10px auto 0 auto;
        color: $red;
        text-align: center;
    }

    .block {

        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$red);
    }

    .unblock {

        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$green);
    }

    .title {
        margin-top: 20px;
        font-style: italic;
        font-size: 1.2rem;
        color: $orange;
        text-align: center;
    }

    .classic {
        font-size: 1.5rem;
        margin: 10px auto;
        
        span {
            color: $orange;
        }
    }

    .city {
        @include flex();

        img {
            width: 25px;
            margin-right: 15px;
        }
    }

    .contact {

        color: $orange;
        @include link($color:$orange);
    }

    .Solver {
        border-radius: 50px;
        box-shadow: 0 0 10px $green;
        background-color: rgba($green, .7);
        padding: 15px 35px;
        color: $black;
        font-size: 1.25rem ;
        margin: 10px auto;
    }

    .Leader {
        border-radius: 50px;
        box-shadow: 0 0 10px $red;
        background-color: rgba($red, .7);
        padding: 15px 35px;
        color: $black;
        font-size: 1.25rem ;
        margin: 10px auto;
    }

    .Searcher {
        border-radius: 50px;
        box-shadow: 0 0 10px $orange;
        background-color: rgba($orange, .7);
        padding: 15px 35px;
        color: $black;
        font-size: 1.25rem ;
        margin: 10px auto;
    }

    .no-profil {
        border-radius: 50px;
        box-shadow: 0 0 10px $white;
        background-color: rgba($white, .7);
        padding: 15px 35px;
        color: $black;
        font-size: 1.25rem ;
        margin: 10px auto;
    }

    ul {
        width: 100%;
        position: relative;
        padding: 0 35px;

        .percent {

            @for $i from 1 through 100 {
                
                @include percent(#{$i})
            }
        }
    }
}
</style>