<template>
    <select v-model="model">
        <option disabled value="">Choose your city</option>
        <option :key="city" v-for="city in cities" :value="city.name">{{ city.name }}</option>
    </select>
</template>

<script setup>

const runtimeConfig = useRuntimeConfig()
const { data: cities } = await useFetch(runtimeConfig.public.apiBase + "unlog/cities", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

const props = defineProps({
    data: {
        type: String,
        require: true
    }
})

const emit = defineEmits(["select"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {

        emit("select", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

select {
    width: 100%;
    padding: 1rem 4rem 1rem 1rem;
    margin: 15px auto;
    box-shadow: 0 0 5px $orange;
    background: url(https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg) no-repeat right 0.8em center / 1.4em,
        linear-gradient(to left, rgba($orange, 0.3) 3em, $black 3em);
    color: $white;
    border-radius: 5px;
    cursor: pointer;

    &::-ms-expand {
        display: none;
    }

    &:focus {
        outline: none;
    }

    option {
        color: $white;
        background-color: $black;
    }
}
</style>