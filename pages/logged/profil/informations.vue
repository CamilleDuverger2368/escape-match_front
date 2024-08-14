<!-- WIP !!!!!!!!!!!!!!! -->
<template>
    <div id="informations-profil" :class="load ? 'active' : 'inactive-left'">
        <button class="close" @click="redirectToProfil">X</button>
        <section v-if="!updateProfil && !updatePwd" class="info">
            <div class="name">{{ user.firstname }} {{ user.name }}</div>
            <div v-if="user.pseudo" class="pseudo"> aka {{ user.pseudo }}</div>
            <img v-if="user.profilPic" class="profil-pic" alt="profil-picture" :src="'/profil-pictures/' + user.profilPic + '.webp'" />
            <img v-else class="profil-pic" alt="profil-picture" src="/profil-pictures/neutral.webp" />
            <div class="classic">{{ user.email }}</div>
            <div v-if="user.birthday" class="classic"><span>Birthday :</span> {{ formatDate(user.birthday) }}</div>
            <div v-if="user.birthday" class="classic"><span>Member since :</span> {{ formatDate(user.createdAt) }}</div>
            <div v-if="user.profil" :class="user.profil">{{ user.profil }}</div>
            <div v-else class="no-profil">No Profil</div>
            <div class="city"><img src="~/public/icones/house.svg" alt="profil's city"><div class="classic">{{ user.city }}</div></div>
            <ul v-if="user.level">
                <li :class="'percent--' + levelDecimal"><span>level {{ level }}</span></li>
            </ul>
            <ul v-else>
                <li class="percent--1"><span>Start your adventure to level up !</span></li>
            </ul>
            <div class="buttons">
                <button type="submit" @click="updateProfil = true">Modifier</button>
                <button type="submit" @click="updatePwd = true">Change password</button>
            </div>
        </section>
        <section v-else-if="updateProfil" class="update-profil">
            <div class="informations">{{ error.general }}</div>
            <form id="form-update" @submit.prevent="update()">
                <Input name="Name" type="text" id="register_name" :data="user.name" :error="error.name" :require="true" @check="checkName" />
                <Input name="Firstname" type="text" id="register_firstname" :data="user.firstname" :error="error.firstname" :require="true" @check="checkFirstname" />
                <Input name="Email" type="email" id="register_email" :data="user.email" :error="error.email" :require="true" @check="checkEmail" />
                <Input name="Pseudo" type="text" id="register_pseudo" :data="user.pseudo" :error="error.pseudo" :require="false" @check="checkPseudo" />
                <ProfilPicChoice :images="pictures" :data="user.profilPic" @check="checkProfilPic"/>
                <Datepicker id="birthday" :data="user.birthday" name="Birthday" @check="checkBirthday" />
                <ListfieldCities :data="user.city" @select="checkCity"/>
                <Multipleradio title="Choose your pronouns." :options="pronouns" :data="user.pronouns" @radio="checkPronouns" />
                <Multipleradio title="Choose your profil." :options="profil" :data="user.profil" @radio="checkProfil" />
                <div class="buttons">
                    <button type="submit">Update</button>
                    <button @click="updateProfil = false">Retour</button>
                </div>
            </form>
        </section>
        <section v-else-if="updatePwd" class="update-password">
            <div class="informations">{{ error.general }}</div>
            <form id="form-update-password" @submit.prevent="updatePassword()">
                <Input name="New password" type="password" id="register_pwd" :data="password.password" :error="error.password" :require="true" @check="checkPassword" />
                <Input name="Confirm your password" type="password" id="register_pwd_conf" :data="error.dataConfPwd" :error="error.confPwd" :require="true" @check="checkConfPwd" />
                <div class="buttons">
                    <button type="submit">Update</button>
                    <button @click="updatePwd = false">Retour</button>
                </div>
            </form>
        </section>
    </div>
</template>

<script setup>
// WIP !!!!!!!!!!!!!!!
import dayjs from "dayjs"

onMounted(() => {

    getProfil()
    getCities()
    getPicturesAchievements()
})

let color = ref("#FF7A00")
let load = ref(false)
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const router = useRouter();

const formatDate = (dateString) => {
  
  const date = dayjs(dateString);
  return date.format("DD-MM-YYYY");
}

const redirectToProfil = () => {

    load.value = false
    setTimeout(() => router.push("/logged/profil"), 500)
}

// Profil's section
let user = ref({
    id: null,
    email: "",
    name: "",
    firstname: "",
    pseudo: "",
    birthday: '',
    createdAt: '',
    profilPic: "",
    level: null,
    pronouns: "",
    profil: "",
    city: ""
})
let levelDecimal = ref(1)
let level = ref(0)
let password = ref({
    password:''
})
let error = ref({
    general: '',
    name: '',
    firstname: '',
    email: '',
    pseudo: '',
    age: '',
    password: '',
    confPwd: '',
    dataConfPwd: ''
})
let updateProfil = ref(false)
let updatePwd = ref(false)
let cities = ref([])
let pictures = ref(["droopy", "totoro", "fou-a-pieds-bleus", "neutral"])
const pronouns = ref(["She", "He", "They"])
const profil = ref(["Solver", "Leader", "Searcher"])
const update = async () => {

    if (error.value.email || error.value.firstname || error.value.name || error.value.pseudo || error.value.age) {

        error.value.general = "Check your errors please."
    } else {

        const { data } = await useFetch(runtimeConfig.public.apiBase + "user/" + user.value.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token.value
            },
            body: user.value
        })

        if (data.value) {

            getProfil()
            updateProfil.value = false
        }
    }
}
const updatePassword = async () => {

    if (error.value.password || error.value.confPwd) {

        error.value.general = "Check your errors please."
    } else {

        const { data } = await useFetch(runtimeConfig.public.apiBase + "user/password/" + user.value.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token.value
            },
            body: password.value
        })

        if (data.value) {

            getProfil()
            updatePwd.value = false
        }
    }
}
const getProfil = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user", {
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
        load.value = true
    }
}
const getCities = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "unlog/cities", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (data.value) {

        for(let i = 0; i < data.value.length; i++) {

            cities.value.push(data.value[i].name)
        }
    }
}
const getPicturesAchievements = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "achievements/pictures", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        for(let i = 0; i < data.value.length; i++) {
            
            pictures.value.push(data.value[i].trophee)
        }
    }
}

// Check's section
const checkName = (data) => {

    const validRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u

    if (data.match(validRegex)) {

        user.value.name = data
        error.value.name = ""
    } else {

        error.value.name = "Give us a valid name please."
    }
}
const checkFirstname = (data) => {

    const validRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u

    if (data.match(validRegex)) {

        user.value.firstname = data
        error.value.firstname = ""
    } else {

        error.value.firstname = "Give us a valid firstname please."
    }
}
const checkEmail = (data) => {

    user.value.email = data

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (data.match(validRegex)) {

        error.value.email = ""
    } else {

        error.value.email = "Give us a valid email please."
    }
}
const checkPseudo = (data) => {

    const validRegex = /^([A-Za-z0-9\-\_]+)$/

    if (data.match(validRegex)) {

        user.value.pseudo = data
        error.value.pseudo = ""
    } else {

        error.value.pseudo = "Your pseudo can only have letters, numbers or '-' '_'."
    }
}
const checkProfilPic = (data) => {

    user.value.profilPic = data
}
const checkBirthday = (data) => {

    user.value.birthday = data
}
const checkCity = (data) => {

    user.value.city = data
}
const checkPassword = (data) => {

    password.value.password = data

    const validRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

    if (data.match(validRegex)) {

        error.value.password = ""
    } else {

        error.value.password = "UPPERCASE, lowercase, digit, [#?!@$%^&*-], minimum of 8 characters"
    }
}
const checkConfPwd = (data) => {

    error.value.dataConfPwd = data

    if (password.value.password !== data) {

        error.value.confPwd = "Your passwords don't match"
    } else {

        error.value.confPwd = ''
    }
}
const checkPronouns = (data) => {

    user.value.pronouns = data
}
const checkProfil = (data) => {

    user.value.profil = data
    if (data === "Solver") {

        color.value = "#45C4A2"
    } else if (data === "Leader") {

        color.value = "#E03616"
    } else {
        
        color.value = "#FF7A00"
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

.inactive-left {
    transform: translate(-100vw);
}

.active {
    transform: translate(0vw);
}

.buttons {
    width: 100%;
    margin: 20px auto;
    @include flex($justify:space-around);

    button {
        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:0);
    }
}

#informations-profil {
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
        @include flex($direction:column);
        
        .profil-pic {
            width: 100px;
            height: 100px;
            object-fit: cover;
        }

        .name {
            font-size: 2.75rem;
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

    .update-profil {
        width: 100%;
        position: inherit;
        top: 4vh;
        left: 0;
        padding: 50px 0;
        @include flex($direction:column);

        #informations {
            width: 80%;
            min-height: 40px;
            margin-bottom: 20px;
            color: $red;
            opacity: 0;
            @include flex();
            transition: 0.2s ease all;
            -moz-transition: 0.2s ease all;
            -webkit-transition: 0.2s ease all;

            &.error:not(:empty) {
                box-shadow: 0 0 5px $red;
                background-color: $black;
                padding: 0 15px;
                border-radius: 5px;
                opacity: 1;
            }
        }

        form {
            width: 80%;
            @include flex($direction:column);

            .buttons {
                width: 100%;
                @include flex($justify:space-around);
            }
        }
    }

    .update-password {
        width: 100%;
        padding: 50px 0;
        @include flex($direction:column, $justify:center);

        .informations {
            width: 80%;
            min-height: 40px;
            margin-bottom: 20px;
            color: $red;
            opacity: 0;
            @include flex();
            transition: 0.2s ease all;
            -moz-transition: 0.2s ease all;
            -webkit-transition: 0.2s ease all;

            &.error:not(:empty) {
                box-shadow: 0 0 5px $red;
                background-color: $black;
                padding: 0 15px;
                border-radius: 5px;
                opacity: 1;
            }
        }

        form {
            width: 80%;
            @include flex($direction:column);

            .buttons {
                width: 100%;
                @include flex($justify:space-around);
            }
        }
    }
}
</style>