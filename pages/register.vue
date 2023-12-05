<template>
    <div id="register">
        <div id="informations">{{ error.general }}</div>
        <form id="form" @submit.prevent="register()">
            <Input name="Name (Mandatory)" type="text" id="register_name" :data="user.name" :error="error.name" @check="checkName" />
            <Input name="Firstname (Mandatory)" type="text" id="register_firstname" :data="user.firstname" :error="error.firstname" @check="checkFirstname" />
            <Input name="Email (Mandatory)" type="email" id="register_email" :data="user.email" :error="error.email" @check="checkEmail" />
            <Input name="Pseudo" type="text" id="register_pseudo" :data="user.pseudo" :error="error.pseudo" @check="checkPseudo" />
            <Input name="Age" type="number" id="register_age" :data="user.age" :error="error.age" @check="checkAge" />
            <!-- TEST -->
            <Input name="Test" type="radio" id="test" :data="user.test" :error="error.test" @check="test" />
            <!-- TEST -->
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
    // TEST
    test: '',
    // TEST
})

let error = ref({
    general: '',
    name: '',
    firstname: '',
    email: '',
    pseudo: '',
    age: '',
    // TEST
    test: '',
    // TEST
})

// Check's section
const checkName = (data) => {

    const validRegex = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/

    if (data.match(validRegex)) {

        user.value.name = data
        error.value.name = ""
    } else {

        error.value.name = "Give us a valid name please."
    }
}
const checkFirstname = (data) => {

    const validRegex = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/

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

    const validRegex = /^\d+$/

    if (data.match(validRegex)) {

        if (data > 0 && data < 150) {

            user.value.age = data
            error.value.age = ""
        } else {

            error.value.age = "Your age must be between 1 and 150 years old."
        }
    } else {

        error.value.age = "Your age must be a number."
    }
}
// TEST
const test = (data) => {
    console.log("data")
    console.log(data)
}
// TEST

// Register's section
const register = async () => {

    if (error.value.email || error.value.firstname || error.value.name || error.value.pseudo) {

        error.value.general = "Check your errors please."
    } else {

        // TEST
        console.log("register's page")
        // TEST
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
    }
}
</style>