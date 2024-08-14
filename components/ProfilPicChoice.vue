<template>
    <label>Choose your Profil Picture</label>
    <div id="choose-profil-pic">
        <div v-bind:key="image" v-for="image in images" :class="image === model ? 'image selected' : 'image'" @click="model = image">
            <img :src="'/profil-pictures/' + image + '.webp'" :alt="image + '\'s picture'">
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    data: {
        type: [String],
        require: false
    },
    images: {
        type: Array,
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

label {
    width: 100%;
    color: $orange;
    font-size: .8rem;
    padding: 4px 12px;
}

.selected {
    background-color: rgba($orange, 0.4);
}

#choose-profil-pic {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;

    .image {
        padding: 10px 15px;
        border-radius: 5px;
        @include flex();
        border: solid 1px rgba($orange, 0.4);

        &:hover, &:active {
            background-color: rgba($orange, 0.4);
        }

        img {
            width: 100px;
            height: 100px;
        }
    }
}
</style>