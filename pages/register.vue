<template>
    <div id="register">
        <section id="informations">{{ error.general }}</section>
        <form id="form" @submit.prevent="register()">
            <Input name="Name (Mandatory)" type="text" id="register_name" :data="user.name" :error="error.name" :require="true" @check="checkName" />
            <Input name="Firstname (Mandatory)" type="text" id="register_firstname" :data="user.firstname" :error="error.firstname" :require="true" @check="checkFirstname" />
            <Input name="Email (Mandatory)" type="email" id="register_email" :data="user.email" :error="error.email" :require="true" @check="checkEmail" />
            <Input name="Pseudo" type="text" id="register_pseudo" :data="user.pseudo" :error="error.pseudo" :require="false" @check="checkPseudo" />
            <Input name="Age" type="number" id="register_age" :data="user.age" :error="error.age" :require="false" @check="checkAge" />
            <Listfield title="Choose your city" :options="cities" :data="user.city" @select="checkCity"/>
            <Input name="Password (Mandatory)" type="password" id="register_pwd" :data="user.password" :error="error.password" :require="true" @check="checkPassword" />
            <Input name="Confirm your password" type="password" id="register_pwd_conf" :data="error.dataConfPwd" :error="error.confPwd" :require="true" @check="checkConfPwd" />
            <Multipleradio title="Choose your pronouns." :options="pronouns" :data="user.pronouns" @radio="checkPronouns" />
            <Multipleradio title="Choose your profil." :options="profil" :data="user.profil" @radio="checkProfil" />
            <Avatar :color="color" page="register"/>
            <button class="login-button" type="submit">Inscription</button>
        </form>
    </div>
</template>

<script setup>

let user = ref({
    name: '',
    firstname: '',
    email: '',
    pseudo: '',
    age: '',
    city: '',
    password: '',
    pronouns: '',
    profil: ''
})

let color = ref("#FF7A00")

let cities = ref([])

const pronouns = ref(["She", "He", "They"])
const profil = ref(["Solver", "Leader", "Searcher"])
const runtimeConfig = useRuntimeConfig()
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

    const { data } = await useFetch(runtimeConfig.public.apiBase + "unlog/cities", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (data.value) {

        for(let i = 0; i < data.value.length; i++) {

            cities.value.push(data.value[i].name)
        }
    }
})

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

// Register's section
const router = useRouter()
const register = async () => {

    if (error.value.email || error.value.firstname || error.value.name || error.value.pseudo || error.value.age || error.value.password || error.value.confPwd) {

        error.value.general = "Check your errors please."
    } else {

        const { data } = await useFetch(runtimeConfig.public.apiBase + "unlog/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: user.value
        })

        if (data.value[0] === 201) {

            error.value.general = ""
            document.getElementById("informations").classList.remove("error")
            router.push("/login")
        } else {

            error.value.general = data.value.message
            document.getElementById("informations").classList.add("error")
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#register {

    width: 100%;
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
    }
}
</style>