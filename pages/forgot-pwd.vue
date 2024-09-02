<template>
    <div id="forgot-pwd">
        <section id="informations">{{ error.general }}</section>
        <form id="form" @submit.prevent="resetPwd()">
            <Input name="Email" type="email" id="forgot_password" :data="email" :error="error.email" :require="true" @check="checkEmail" />
            <div class="links">
                <nuxt-link to="/login" class="footer-link">Connexion</nuxt-link>
                <nuxt-link to="/register" class="footer-link">Inscription</nuxt-link>
            </div>
            <button type="submit">Réinitialiser</button>
        </form>
    </div>
</template>

<script setup>
import { emailChecker } from '~/public/usefull/checker'

let email = ref('')
let error = ref({
    email: '',
    general: ''
})
const runtimeConfig = useRuntimeConfig()
// Email's section
const checkEmail = async (datum) => {
    
    email.value = datum

    error.value.email = emailChecker(datum)
    if (error.value.email === '') {

        const { data } = await useFetch(runtimeConfig.public.apiBase + "unlog/email-exist/" + email.value, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (data.value) {

            if (data.value[0] !== 200) {

                error.value.general = data.value.message
                document.getElementById("informations").classList.add("error")
                document.getElementById("informations").classList.remove("success")
            } else {

                error.value.general = ""
                document.getElementById("informations").classList.remove("error")
                document.getElementById("informations").classList.remove("success")
            }
        }
    }
}

// Reset's section
const resetPwd = async () => {

    error.value.general = ""
    if (error.value.email) {

        error.value.general = "Give us a valid email please."
    } else {

        const { data } = await useFetch(runtimeConfig.public.apiBase + "unlog/reset-password/" + email.value, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })

        if (data.value[0] === 200) {

            error.value.general = data.value.message
            document.getElementById("informations").classList.add("success")
            document.getElementById("informations").classList.remove("error")
        } else {

            error.value.general = data.value.message
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

    #forgot-pwd {
        #informations {
            width: 60%;
        }

        #form {
            width: 60%;
        }
    }
}

@media screen and (min-width: 1100px) {

    #forgot-pwd {
        #informations {
            width: 35%;
        }

        #form {
            width: 35%;
        }
    }
}
</style>