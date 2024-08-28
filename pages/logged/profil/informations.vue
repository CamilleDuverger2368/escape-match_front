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
            <div class="classic"><span>Member since :</span> {{ formatDate(user.createdAt) }}</div>
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
import { formatDate } from "~/public/usefull/usefull"
import { emailChecker,
         nameChecker,
         pseudoChecker,
         passwordChecker,
         passwordConfChecker,
         profilChecker } from "~/public/usefull/checker"

onMounted(async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/informations/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        fillUpProfil(data.value.user)

        for(let i = 0; i < data.value.cities.length; i++) {

            cities.value.push(data.value.cities[i].name)
        }
        
        for(let i = 0; i < data.value.pictures.length; i++) {
            
            pictures.value.push(data.value.pictures[i].trophee)
        }
        
        load.value = true
    }
})

let color = ref("#FF7A00")
let cities = ref([])
let pictures = ref(["droopy", "totoro", "fou-a-pieds-bleus", "neutral"])
const pronouns = ref(["She", "He", "They"])
const profil = ref(["Solver", "Leader", "Searcher"])

let load = ref(false)
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const router = useRouter();

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

        fillUpProfil(data.value)
    }
}
const fillUpProfil = (data) => {
    user.value = data
    user.value.city = data.city.name
    levelDecimal.value = user.value.level.toString().substring(user.value.level.toString().indexOf('.') + 1)
    if (levelDecimal.value.length == 1) {

        levelDecimal.value += '0'
    } else if (levelDecimal.value[0] == '0') {

        levelDecimal.value = levelDecimal.value.substring(1)
    }
    level.value = Math.trunc(user.value.level)
}

// Check's section
const checkName = (data) => {

    error.value.name = nameChecker(data)
    if (error.value.name === "") {

        user.value.name = data
    }
}
const checkFirstname = (data) => {

    error.value.firstname = nameChecker(data)
    if (error.value.firstname === "") {

        user.value.firstname = data
    }
}
const checkEmail = (data) => {

    user.value.email = data
    
    error.value.email = emailChecker(data)
}
const checkPseudo = (data) => {

    error.value.pseudo = pseudoChecker(data)
    if (error.value.pseudo === "") {

        user.value.pseudo = data
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

    error.value.password = passwordChecker(data)
}
const checkConfPwd = (data) => {

    error.value.dataConfPwd = data
    
    error.value.confPwd = passwordConfChecker(data, password.value.password)
}
const checkPronouns = (data) => {

    user.value.pronouns = data
}
const checkProfil = (data) => {

    user.value.profil = data
    
    color.value = profilChecker(data)
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
        padding: 50px 0;
        @include flex($direction:column);

        #informations {
            width: 80%;
            @include panel-error-success();
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
            @include panel-error-success();
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