<template>
    <div id="login">
        <form id="form" @submit.prevent="login()">
            <Input name="Email" type="email" id="connexion_email" :error="errorEmail" @check="checkEmail" />
            <Input name="Password" type="password" id="connexion_password" :error="errorPwd" @check="checkPwd" />
            <div class="links">
                <a class="footer-link">Mot de passe oublié ?</a>
                <a class="footer-link">Inscription</a>
            </div>
            <button class="login-button" type="submit">Connexion</button>
        </form>
    </div>
</template>

<script setup>

const router = useRouter()

// Email's section
let email = ref('')
let errorEmail = ref('')
const checkEmail = (data) => {

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (data.match(validRegex)) {

        email.value = data
        errorEmail.value = ""
    } else {

        errorEmail.value = "Give us a valid email please."
    }
}

// Password's section
let password = ref('')
let errorPwd = ref('')
const checkPwd = (data) => {

if (data.length > 1) {

    errorPwd.value = ""
} else {

    password.value = data
    errorPwd.value = "Give us a password please."
}
}

// login's section
let error = ref('')
async function login() {

    if (errorPwd.value || errorEmail.value) {

        error.value = "Give us a valid email and a password please."
    } else {

        error.value =""
        // TEST
        // console.log("COUCOU")
        // TEST
    }
}
</script>

<style lang="scss">
@import "~/assets/variables";

#login {

    width: 100%;
    @include flex();

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