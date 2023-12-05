<template>
    <div id="register">
        <div id="informations">{{ error }}</div>
        <form id="form" @submit.prevent="register()">
            <Input name="Name (Mandatory)" type="text" id="register_name" :data="user.name" :error="errorName" @check="checkName" />
            <Input name="Firstname (Mandatory)" type="text" id="register_firstname" :data="user.firstname" :error="errorFirstname" @check="checkFirstname" />
        </form>
    </div>
</template>

<script setup>

let user = ref({
    name: '',
    firstname: ''
})

// Name's section
let errorName = ref('')
const checkName = (data) => {

    const validRegex = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/;

    if (data.match(validRegex)) {

        user.value.name = data
        errorName.value = ""
    } else {

        errorName.value = "Give us a valid name please."
    }
}

// Firstname's section
let errorFirstname = ref('')
const checkFirstname = (data) => {

    const validRegex = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/;

    if (data.match(validRegex)) {

        user.value.name = data
        errorFirstname.value = ""
    } else {

        errorFirstname.value = "Give us a valid firstname please."
    }
}

// Register's section
let error = ref('')
const register = async () => {
    // TEST
    console.log("register's page")
    // TEST
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