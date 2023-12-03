<template>
    <div class="input">      
        <div class="error">{{ error }}</div>
        <input :id="'input_' + id" @change="checkValue()" :type="type" required>
        <label>{{ name }}</label>
    </div>
</template>

<script setup>

const datum = ref('')

const props = defineProps({
    name: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    id: {
        type: String,
        require: true
    },
    error: {
        type: String,
        require: true
    }
})

const emit = defineEmits(["check"])

const checkValue = () => {
    datum.value = document.querySelector('#input_' + props.id).value
    emit('check', datum.value)
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.input {
    width: 100%;
    position: relative;
    z-index: 0;
    margin: 15px auto;

    .error {
        color: $red;
        position: absolute;
        pointer-events: none;
        right: 10px;
        top: -20px;
        font-size: .8rem;

        &:not(:empty) ~ label {
            top: -20px;
            font-size: .8rem;
            color: $red;
        }

        &:not(:empty) ~ input {
            box-shadow: 0 0 5px $red;
        }
    }

    input {
        width: 100%;
        min-height: 40px;
        box-shadow: 0 0 5px $orange;
        background-color: $black;
        color: $white;
        padding: 0 15px;
        border-radius: 5px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;

        &:focus ~ label, &:valid ~ label {
            top: -20px;
            font-size: .8rem;
            color: $orange;
        }
    }

    label {
        color: $white;
        position: absolute;
        pointer-events: none;
        left: 10px;
        top: 10px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }
}
</style>