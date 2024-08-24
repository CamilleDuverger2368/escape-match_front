<template>
    <div id="register">
        <section id="informations">{{ error.general }}</section>
        <form id="form" @submit.prevent="register()">
            <Input name="Name (Mandatory)" type="text" id="register_name" :data="user.name" :error="error.name" :require="true" @check="checkName" />
            <Input name="Firstname (Mandatory)" type="text" id="register_firstname" :data="user.firstname" :error="error.firstname" :require="true" @check="checkFirstname" />
            <Input name="Email (Mandatory)" type="email" id="register_email" :data="user.email" :error="error.email" :require="true" @check="checkEmail" />
            <Input name="Pseudo" type="text" id="register_pseudo" :data="user.pseudo" :error="error.pseudo" :require="false" @check="checkPseudo" />
            <ProfilPicChoice :images="['droopy', 'totoro', 'fou-a-pieds-bleus', 'neutral']" :data="user.profilPic" @check="checkProfilPic"/>
            <Datepicker id="birthday" :data="user.birthday" name="Birthday" @check="checkBirthday" />
            <ListfieldCities :data="user.city" @select="checkCity"/>
            <Input name="Password (Mandatory)" type="password" id="register_pwd" :data="user.password" :error="error.password" :require="true" @check="checkPassword" />
            <Input name="Confirm your password" type="password" id="register_pwd_conf" :data="error.dataConfPwd" :error="error.confPwd" :require="true" @check="checkConfPwd" />
            <Multipleradio title="Choose your pronouns" :options="pronouns" :data="user.pronouns" @radio="checkPronouns" />
            <Multipleradio title="Choose your profil" :options="profil" :data="user.profil" @radio="checkProfil" />
            <Avatar :color="color" page="register"/>
            <button type="submit">Inscription</button>
        </form>
    </div>
</template>

<script setup>

let user = ref({
    name: '',
    firstname: '',
    email: '',
    pseudo: '',
    profilPic: '',
    birthday: '',
    city: '',
    password: '',
    pronouns: '',
    profil: ''
})

let color = ref("#FF7A00")

const pronouns = ref(["She", "He", "They"])
const profil = ref(["Solver", "Leader", "Searcher"])
const runtimeConfig = useRuntimeConfig()
let error = ref({
    general: '',
    name: '',
    firstname: '',
    email: '',
    pseudo: '',
    password: '',
    confPwd: '',
    dataConfPwd: ''
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
    
    user.value.password = data

    const validRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

    if (data.match(validRegex)) {

        error.value.password = ""
    } else {

        error.value.password = "UPPERCASE, lowercase, digit, [#?!@$%^&*-], minimum of 8 characters"
    }
}
const checkConfPwd = (data) => {

    error.value.dataConfPwd = data
    
    if (user.value.password !== data) {

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

// Register's section
const router = useRouter()
const register = async () => {

    if (error.value.email || error.value.firstname || error.value.name || error.value.pseudo || error.value.password || error.value.confPwd) {

        error.value.general = "Check your errors please."
    } else {

        document.documentElement.scrollTop = 0
        const data = await useFetch(runtimeConfig.public.apiBase + "unlog/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: user.value
        })

        if (data) {

            if (data.status.value === "success") {

                error.value.general = "Account created !"
                document.getElementById("informations").classList.add("success")
                document.getElementById("informations").classList.remove("error")
                setTimeout(() => {

                    router.push("/login")
                }, 3000)
            } else {

                error.value.general = data.error.value
                document.getElementById("informations").classList.add("error")
                document.getElementById("informations").classList.remove("success")
            }
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
        @include panel-error-success();
    }

    form {

        width: 80%;
        margin-bottom: 30px;
        @include flex($direction:column);

        button {

            @include button();
        }
    }
}

@media screen and (min-width: 450px) {

    #register {
        #informations {
            width: 60%;
        }

        form {
            width: 60%;
        }
    }
}

@media screen and (min-width: 1100px) {

    #register {
        #informations {
            width: 35%;
        }

        form {
            width: 35%;
        }
    }
}
</style>