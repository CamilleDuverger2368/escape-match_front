<template>
    <div class="achievement-list" :id="id">
        <div v-bind:key="element" v-for="element in achievements" class="icone">
            <div class="title">{{ element.name }}</div>
            <div class="description">{{ element.description }}</div>
            <div class="gain">{{ element.tropheeType }} : {{ element.trophee }}</div>
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
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;

    .icone {

        padding: 10px 15px;
        border-radius: 5px;
        border: solid 1px rgba($orange, 0.7);
        @include flex($direction:column, $justify:flex-start);

        .title {

            font-weight: 600;
            text-align: center;
            font-size: 1.25rem;
            color: $orange;
        }

        .description {

            font-style: italic;
            text-align: center;
            margin: 10px auto;
        }

        .gain {

            color: $orange;
            font-style: italic;
            text-align: center;
        }
    }
}
</style>