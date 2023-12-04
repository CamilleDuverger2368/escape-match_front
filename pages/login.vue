<template>
    <div id="login">
        <div id="error">{{ error }}</div>
        <form id="form" @submit.prevent="login()">
            <Input name="Email" type="email" id="connexion_email" :data="user.username" :error="errorEmail" @check="checkEmail" />
            <Input name="Password" type="password" id="connexion_password" :data="user.password" :error="errorPwd" @check="checkPwd" />
            <div class="links">
                <a class="footer-link">Mot de passe oublié ?</a>
                <a class="footer-link">Inscription</a>
            </div>
            <button class="login-button" type="submit">Connexion</button>
        </form>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

const { authenticateUser } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore());
const router = useRouter()

let user = ref({
    username: '',
    password: '',
})

// Email's section
let errorEmail = ref('')
const checkEmail = (data) => {

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (data.match(validRegex)) {

        user.value.username = data
        errorEmail.value = ""
    } else {

        errorEmail.value = "Give us a valid email please."
    }
}

// Password's section
let errorPwd = ref('')
const checkPwd = (data) => {

    if (data.length > 1) {

        user.value.password = data
        errorPwd.value = ""
    } else {

        errorPwd.value = "Give us a password please."
    }
}

// login's section
let error = ref('')
const login = async () => {

    error.value = ""
    if (errorPwd.value || errorEmail.value) {

        error.value = "Give us a valid email and a password please."
    } else {

        await authenticateUser(user.value)
        error.value =""
        if (authenticated.value) {

            router.push('/')
        } else {

            error.value = "Give us a valid email and a password please."
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/variables";

#login {

    width: 100%;
    @include flex($direction:column);

    #error {
        
        width: 80%;
        min-height: 40px;
        margin-bottom: 20px;
        color: $red;
        opacity: 0;
        @include flex();
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;

        &:not(:empty) {

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
            margin-top: 15px;
        }
    }
}
</style>