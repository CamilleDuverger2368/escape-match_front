<template>
    <div id="forgot-pwd">
        <div id="informations">{{ error }}</div>
        <form id="form" @submit.prevent="resetPwd()">
            <Input name="Email" type="email" id="forgot_password" :data="email" :error="errorEmail" @check="checkEmail" />
            <div class="links">
                <nuxt-link to="/login" class="footer-link">Connexion</nuxt-link>
                <nuxt-link to="/register" class="footer-link">Inscription</nuxt-link>
            </div>
            <button class="login-button" type="submit">Réinitialiser mon mot de passe</button>
        </form>
    </div>
</template>

<script setup>

let email = ref('')

// Email's section
let errorEmail = ref('')
const checkEmail = async (datum) => {

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (datum.match(validRegex)) {

        email.value = datum
        errorEmail.value = ""
        // TO-DO : passer les adresses par variable et non en dur
        const { data } = await useFetch('http://127.0.0.1:8000/api/unlog/email-exist/' + email.value, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (data.value) {

            if (data.value[0] !== 200) {

                error.value = data.value.message
                document.getElementById("informations").classList.add("error")
                document.getElementById("informations").classList.remove("success")
            } else {

                error.value = ""
                document.getElementById("informations").classList.remove("error")
                document.getElementById("informations").classList.remove("success")
            }
        }
    } else {

        errorEmail.value = "Give us a valid email please."
    }
}

// Reset's section
let error = ref('')
const resetPwd = async () => {

    error.value = ""
    if (errorEmail.value) {

        error.value = "Give us a valid email please."
    } else {

        // TO-DO : passer les adresses par variable et non en dur
        const { data } = await useFetch('http://127.0.0.1:8000/api/unlog/reset-password/' + email.value, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })

        if (data.value[0] === 200) {

            error.value = data.value.message
            document.getElementById("informations").classList.add("success")
            document.getElementById("informations").classList.remove("error")
        } else {

            error.value = data.value.message
            document.getElementById("informations").classList.add("error")
            document.getElementById("informations").classList.remove("success")
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#forgot-pwd {

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

        &.success {
            
            color: $green;
        }

        &.error:not(:empty) {

            box-shadow: 0 0 5px $red;
            background-color: $black;
            padding: 0 15px;
            border-radius: 5px;
            opacity: 1;
        }

        &.success:not(:empty) {

            box-shadow: 0 0 5px $green;
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