<template>
    <div id="profil">
        <Avatar :color="color" page="profil"/>
        <div id="slider-menu">
            <div class="slider informations" @click="openInfo = true">
                <!-- TEST -->
                boubou
                <!-- TEST -->
            </div>
            <div class="slider lists" @click="openList = true">
                <!-- TEST -->
                bebeow
                <!-- TEST -->
            </div>
            <div class="slider success" @click="openSuccess = true">
                <!-- TEST -->
                bibou
                <!-- TEST -->
            </div>
            <div class="slider conversations"  @click="openConv = true">
                <!-- TEST -->
                babou
                <!-- TEST -->
            </div>
        </div>
        <div id="menu-informations" :class="openInfo ? 'active' : 'inactive-left'">
            <button class="close" @click="openInfo = false">X</button>
            <div v-if="!updateProfil" class="info">
                <div class="name">{{ user.firstname }} {{ user.name }}</div>
                <div v-if="user.pseudo" class="pseudo"> aka {{ user.pseudo }}</div>
                <div class="classic">{{ user.email }}</div>
                <div v-if="user.age" class="classic">{{ user.age }} years old</div>
                <div v-if="user.profil" :class="user.profil">{{ user.profil }}</div>
                <div v-else class="no-profil">No Profil</div>
                <div class="classic">{{ user.city }}</div>
                <ul v-if="user.level">
                    <li><span>level {{ user.level }}</span></li>
                </ul>
                <ul v-else>
                    <li><span>Start your adventure to level up !</span></li>
                </ul>
                <div class="buttons">
                    <button class="login-button" type="submit" @click="updateProfil = true">Modifier</button>
                    <button class="login-button" type="submit" @click="updatePwd = true">Change password</button>
                </div>
            </div>
            <div v-else class="update-profil">
                <div class="informations">{{ error.general }}</div>
                <form id="form-update" @submit.prevent="update()">
                    <Input name="Name" type="text" id="register_name" :data="user.name" :error="error.name" @check="checkName" />
                    <Input name="Firstname" type="text" id="register_firstname" :data="user.firstname" :error="error.firstname" @check="checkFirstname" />
                    <Input name="Email" type="email" id="register_email" :data="user.email" :error="error.email" @check="checkEmail" />
                    <Input name="Pseudo" type="text" id="register_pseudo" :data="user.pseudo" :error="error.pseudo" @check="checkPseudo" />
                    <Input name="Age" type="number" id="register_age" :data="user.age" :error="error.age" @check="checkAge" />
                    <Listfield title="Choose your city" :options="cities" :data="user.city" @select="checkCity"/>
                    <Multipleradio title="Choose your pronouns." :options="pronouns" :data="user.pronouns" @radio="checkPronouns" />
                    <Multipleradio title="Choose your profil." :options="profil" :data="user.profil" @radio="checkProfil" />
                    <div class="buttons">
                        <button class="login-button" type="submit">Update</button>
                        <button class="login-button" @click="updateProfil = false">Retour</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="menu-lists" :class="openList ? 'active' : 'inactive-right'">
            <button @click="openList = false">X</button>
        </div>
        <div id="menu-success" :class="openSuccess ? 'active' : 'inactive-left'">
            <button @click="openSuccess = false">X</button>
        </div>
        <div id="menu-conversations" :class="openConv ? 'active' : 'inactive-right'">
            <button @click="openConv = false">X</button>
        </div>
    </div>
</template>

<script setup>

let color = ref("#FF7A00")

// Menu's section
let openInfo = ref(false)
let openList = ref(false)
let openSuccess = ref(false)
let openConv = ref(false)

let updateProfil = ref(false)
let updatePwd = ref(false)

let cities = ref([])
const pronouns = ref(["She", "He", "They"])
const profil = ref(["Solver", "Leader", "Searcher"])

let user = ref({
    id: null,
    email: "",
    name: "",
    firstname: "",
    pseudo: "",
    age: null,
    level: null,
    grade: null,
    pronouns: "",
    profil: "",
    city: ""
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

onMounted(async () => {

    getProfil()
    // TO-DO : passer les adresses par variable et non en dur
    const { data } = await useFetch("http://127.0.0.1:8000/api/unlog/cities", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (data.value) {

        for(let i = 0; i < data.value.length; i++) {

            cities.value.push(data.value[i].name)
        }
    }
})

const token = useCookie("token")

const update = () => {

    // TEST
    console.log("update profil function")
    // TEST
}

const getProfil = async () => {

    // TO-DO : passer les adresses par variable et non en dur
    const { data } = await useFetch("http://127.0.0.1:8000/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        user.value = data.value
        user.value.city = data.value.city[0].name
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

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (data.match(validRegex)) {

        user.value.email = data
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
const checkAge = (data) => {

    if (parseInt(data)) {

        if (data > 0 && data < 150) {

            user.value.age = data
            error.value.age = ""
        } else {

            error.value.age = "Your age must be between 1 and 150 years old."
        }
    } else {

        error.value.age = "Your age must be between 1 and 150 years old."
    }
}
const checkCity = (data) => {

user.value.city = data
}
const checkPassword = (data) => {

    const validRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

    if (data.match(validRegex)) {

        user.value.password = data
        error.value.password = ""
    } else {

        error.value.password = "UPPERCASE, lowercase, digit, [#?!@$%^&*-], minimum of 8 characters"
    }
}
const checkConfPwd = (data) => {

    if (user.value.password !== data) {

        error.value.confPwd = "Your passwords don't match"
    } else {

        error.value.dataConfPwd = data
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

.inactive-left {
    transform: translate(-100vw);
}

.inactive-right {
    transform: translate(100vw);
}

.active {
    transform: translate(0vw);
}

#profil {

    width: 100%;
    @include flex();

    #slider-menu {
        width: 100%;
        position: absolute;
        height: 70vh;

        .slider {
            position: absolute;
            // TEST
            background-color: rgba($green, .5);
            // TEST
            @include flex();
            width: 50px;
            height: 50px;
            transition: 0.3s ease-in-out;

            &:hover, &:active {
                width: 75px;
            }
        }

        .informations, .success {
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }

        .lists, .conversations {
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }

        .informations {
            top: 0;
            left: 0;
        }

        .lists {
            top: 0;
            right: 0;
        }

        .success {
            bottom: 0;
            left: 0;
        }

        .conversations {
            bottom: 0;
            right: 0;
        }
    }

    #menu-informations {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 70vh;
        overflow-y: scroll;
        overflow-x: hidden;
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        .close {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
            color: $orange;
        }

        .info {
            width: 100%;
            margin-bottom: 30px;
            @include flex($direction:column);
            
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

                li {
                    --per: 50;
                    --dur: calc(calc(var(--per) / 100) * 1.5s);
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
                            #2292dd40 calc(calc(var(--per) * 1%) + 4px),
                            #1c1c1c calc(calc(var(--per) * 1%) + 4px)
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
                        width: calc(calc(var(--per) * 1%) - 2px);
                    }

                    &:hover, &:active {
                        filter: brightness(1.5);
                    }

                    &:hover span:after, &:active span:after {
                        right: calc(calc(calc(100 - var(--per)) * 1%) - 40px);
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
                            counter-reset: percent var(--per);
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

            .buttons {
                width: 100%;
                margin: 20px auto;
                @include flex($justify:space-around);
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
    }

    #menu-lists {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }

    #menu-success {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }

    #menu-conversations {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }
}
</style>