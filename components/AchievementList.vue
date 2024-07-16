<template>
    <div class="achievement-list" :id="id">
        <div v-bind:key="element" v-for="element in achievements" class="icone">
            <div>{{ element.name }}</div>
            <div>{{ element.description }}</div>
            <div>{{ element.tropheeType }} : {{ element.trophee }}</div>
        </div>
</div>
</template>

<script setup>
const props = defineProps({
    achievements: {
        type: Array,
        require: true
    },
    id: {
        type: String,
        require: true
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.achievement-list {

    width: 90%;
    margin: 30px auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;

    .icone {

        // width: 80px;
        border-radius: 5px;
        border: solid 1px rgba($orange, 0.7);
        @include flex($direction:column, $justify:flex-start);
    }
}
</style>