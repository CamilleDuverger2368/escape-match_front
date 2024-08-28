<template>
    <div id="login">
        <section id="informations">{{ error.general }}</section>
        <form id="form" @submit.prevent="login()">
            <Input name="Email" type="email" id="connexion_email" :data="user.username" :error="error.email" :require="true" @check="checkEmail" />
            <Input name="Password" type="password" id="connexion_password" :data="user.password" :error="error.password" :require="true" @check="checkPwd" />
            <div class="links">
                <nuxt-link to="/forgot-pwd" class="footer-link">Mot de passe oublié ?</nuxt-link>
                <nuxt-link to="/register" class="footer-link">Inscription</nuxt-link>
            </div>
            <button type="submit">Connexion</button>
        </form>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { useAuthStore } from "~/store/auth"
import { emailChecker, passwordLoginChecker } from "~/public/usefull/checker"

const { authenticateUser } = useAuthStore()
const { authenticated } = storeToRefs(useAuthStore())
const router = useRouter()

let user = ref({
    username: '',
    password: ''
})

let error = ref({
    email: '',
    password: '',
    general: ''
})

// Check's section
const checkEmail = (data) => {

    user.value.username = data

    error.value.email = emailChecker(data)
}
const checkPwd = (data) => {
    
    user.value.password = data

    error.value.password = passwordLoginChecker(data)
}

// login's section
const login = async () => {

    error.value.general = ""
    if (error.value.password || error.value.email) {

        error.value.general = "Give us a valid email and a password please."
    } else {

        await authenticateUser(user.value)
        error.value.general =""
        if (authenticated.value) {

            document.getElementById("informations").classList.remove("error")
            router.push("/logged/profil")
        } else {

            error.value.general = "Give us a valid email and a password please OR validate your email."
            document.getElementById("informations").classList.add("error")
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/variables";

#login {

    width: 100%;
    @include flex($direction:column);

    #informations {
        
        width: 80%;
        @include panel-error-success();
    }

    form {

        width: 80%;
        @include flex($direction:column);

        .links {

            width: 100%;
            margin: 10px auto;
            @include flex($justify:space-around);

            a {
                color: $orange;
                font-style: italic;
                font-weight: bold;
            }
        }

        button {

            @include button($marge:15px auto auto auto);
        }
    }
}

@media screen and (min-width: 450px) {

    #login {
        #informations {
            width: 60%;
        }

        #form {
            width: 60%;
        }
    }
}

@media screen and (min-width: 1100px) {

    #login {
        #informations {
            width: 35%;
        }

        #form {
            width: 35%;
        }
    }
}
</style>