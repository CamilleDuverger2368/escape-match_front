<template>
    <div class="datepicker">
        <label>{{ name }}</label>
        <input :id="id" v-model="model" type="date" />
    </div>
</template>

<script setup>

const props = defineProps({
    id: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    data: {
        type: [Date],
        require: false
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

.datepicker {
    width: 100%;
    @include flex($direction:column);

    label {
        width: 100%;
        font-size: .8rem;
        padding: 4px 12px;
        color: $orange;
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
    }
}

</style>