<template>
    <div class="objects3D-list" :id="id">
        <div :class="data === '' || !data ? 'icone active' : 'icone'" @click="model = 'Nothing'">
            <div>Nothing</div>
        </div>
        <div v-bind:key="element" v-for="element in obj" @click="model = element.trophee" :class="data === element.trophee ? 'icone active' : 'icone'">
            <div>{{ element.trophee }}</div>
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
    },
    data: {
        type: String,
        require: false
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

const emit = defineEmits(["choose"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {
        
        emit("choose", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.active {
    background-color: rgba($orange, 0.7);
    color: $black !important;
    transition: 0.3s ease-in-out;
}

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
        transition: 0.3s ease-in-out;
        color: $orange;
        font-style: italic;
        text-align: center;

        &:hover {
            background-color: rgba($orange, 0.7);
            color: $black;
            transition: 0.3s ease-in-out;
        }
    }
}
</style>