<template>
    <div class="input">      
        <div class="error">{{ error }}</div>
        <input v-if="require" v-model="model" :id="'input_' + id" class="require" :type="type" required>
        <input v-else v-model="model" :id="'input_' + id" :type="type">
        <label>{{ name }}</label>
    </div>
</template>

<script setup>

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
    },
    data: {
        type: [String, Number],
        require: true
    },
    require: {
        type: Boolean,
        require: true
    }
})

const emit = defineEmits(["check"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {

        emit("check", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.input {
    width: 100%;
    position: relative;
    z-index: 0;
    margin: 20px auto;

    .error {
        color: $red;
        position: absolute;
        width: 100%;
        pointer-events: none;
        // right: 10px;
        top: 45px;
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

        &:focus ~ label, &:valid.require ~ label, &:not([value=""]):not(.require) ~ label {
            top: -20px;
            font-size: .8rem;
            color: $orange;
        }

        &[type=number] {
            appearance: textfield;

            &::-webkit-inner-spin-button {
                opacity: 1;
                background: $orange;
            }
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