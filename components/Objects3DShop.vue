<!-- WIP -->
<template>
    <div class="objects3D-list" :id="id">
        <div class="icone">
            <div class="gain">Nothing</div>
        </div>
        <div v-bind:key="element" v-for="element in obj" class="icone">
            <div class="gain">{{ element.trophee }}</div>
        </div>
</div>
</template>

<script setup>
const props = defineProps({
    objects: {
        type: Array,
        require: true
    },
    objectsRef: {
        type: Array,
        require: true
    },
    id: {
        type: String,
        require: true
    }
})

let obj = computed({

    get() {
        let obj = []
        props.objectsRef.forEach((curr) => {
            
            let element = props.objects.find((el) => el.trophee === curr)
            if (undefined !== element) {
                obj.push(element)
            }
        })
        return obj
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.objects3D-list {

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

        .gain {

            color: $orange;
            font-style: italic;
            text-align: center;
        }
    }
}
</style>