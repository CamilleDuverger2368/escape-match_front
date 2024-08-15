<template>
    <div id="alter-profil">
        <div class="name">{{ user.firstname }} {{ user.name }}</div>
        <div v-if="user.pseudo" class="pseudo"> aka {{ user.pseudo }}</div>
        <img v-if="user.profilPic" class="profil-pic" alt="profil-picture" :src="'/profil-pictures/' + user.profilPic + '.webp'" />
        <img v-else class="profil-pic" alt="profil-picture" src="/profil-pictures/neutral.webp" />
        <Avatar :color="color" page="profil"/>
        <div v-if="user.birthday" class="classic"><span>Birthday :</span> {{ formatDate(user.birthday) }}</div>
        <div class="classic"><span>Member since :</span> {{ formatDate(user.createdAt) }}</div>
        <div v-if="user.profil" :class="user.profil">{{ user.profil }}</div>
        <div v-else class="no-profil">No Profil</div>
        <div class="city"><img src="~/public/icones/house.svg" alt="profil's city"><div class="classic">{{ user.city }}</div></div>
        <div class="contact" @click="getRoom()">Start a talk !</div>
        <button @click="sendFriendRequest">Send friend request !</button>
        <ul v-if="user.level">
            <li :class="'percent--' + levelDecimal"><span>level {{ level }}</span></li>
        </ul>
        <ul v-else>
            <li class="percent--1"><span>Start your adventure to level up !</span></li>
        </ul>
        <div class="classic">To-Do List</div>
        <Tablelist :headers="['Escape', 'Since', 'Actions']" :list="user.listToDos" id="list-to-do-user-alter" page="alter" />
        <div class="classic">Favori List</div>
        <Tablelist :headers="['Escape', 'Since', 'Actions']" :list="user.listFavoris" id="list-favori-user-alter" page="alter" />
        <!--<div class="classic">Done List</div>
        <Tablelist :headers="['Escape', 'Since', 'Actions']" :list="user.listDones" id="list-done-user-alter" page="alter" />-->
    </div>
</template>

<script setup>
import dayjs from "dayjs"

const route = useRoute()
const router = useRouter()
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
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
    listToDos: [],
    listDones: []
})
let levelDecimal = ref(1)
let level = ref(0)

const formatDate = (dateString) => {
  
  const date = dayjs(dateString);
  return date.format("DD-MM-YYYY");
}

onMounted(() => {
    
    getAlterUserProfil()
})
const getAlterUserProfil = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/alter/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        user.value = data.value
        user.value.city = data.value.city.name
        levelDecimal.value = user.value.level.toString().substring(user.value.level.toString().indexOf('.') + 1)
        if (levelDecimal.value.length == 1) {

            levelDecimal.value += '0'
        } else if (levelDecimal.value[0] == '0') {

            levelDecimal.value = levelDecimal.value.substring(1)
        }
        level.value = Math.trunc(user.value.level)
    }
}
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
const sendFriendRequest = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/asking/" + route.params.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        // DEBUG !!!
        alert("COUCOU")
        // DEBUG !!!
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

@mixin percent($argument) {
    $per: unquote($argument);

    &--#{$per} {

        list-style: none;
        padding: 20px 0;
        position: relative;
        font-size: 1.5rem;
        color: $white;
        width: 100%;
        filter: brightness(1.2);
        transition: all 0.5s ease 0s;

        &:before {
            content: "";
            position: absolute;
            background: $black;
            height: 0.8rem;
            width: 100%;
            left: 0;
            bottom: 0;
            border-radius: 5px;
            border: 1px solid #111;
            border-color: #111 #323232 #323232 #111;
            background: linear-gradient(
                90deg,
                #2292dd40 calc(calc($per * 1%) + 4px),
                #1c1c1c calc(calc($per * 1%) + 4px)
            );
        }

        &:after {
            content: "";
            height: 11px;
            margin: 0 0 2px 0;
            background: $orange;
            border-radius: 5px;
            position: absolute;
            box-shadow: 0 0 5px 1px $orange;
            left: 3px;
            width: 0%;
            bottom: 0;
            width: calc(calc($per * 1%) - 2px);
        }

        &:hover, &:active {
            filter: brightness(1.5);
        }

        &:hover span:after, &:active span:after {
            right: calc(calc(calc(100 - $per) * 1%) - 40px);
            opacity: 1;
            background: $orange;
            filter: brightness(.7);
        }

        span {
            font-weight: 500;

            &:after {
                position: absolute;
                right: -40px;
                top: 40px;
                counter-reset: percent $per;
                content: counter(percent);
                color: $black;
                padding: 4px 6px;
                border-radius: 5px;
                font-weight: bold;
                pointer-events: none;
                transition: all 0.5s ease 0s;
            }
        }
    }
}

#alter-profil {

    width: 100%;
    margin-bottom: 30px;
    @include flex($direction:column);
     
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