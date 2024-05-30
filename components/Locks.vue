<template>
    <form class="rating">
        <input type="radio" name="rating" value="5" v-model="model" :id="'r1-' + id">
        <label :for="'r1-' + id"><img  alt="level"></label>

        <input type="radio" name="rating" value="4" v-model="model" :id="'r2-' + id">
        <label :for="'r2-' + id"><img  alt="level"></label>

        <input type="radio" name="rating" value="3" v-model="model" :id="'r3-' + id">
        <label :for="'r3-' + id"><img  alt="level"></label>

        <input type="radio" name="rating" value="2" v-model="model" :id="'r4-' + id">
        <label :for="'r4-' + id"><img  alt="level"></label>

        <input type="radio" name="rating" value="1" v-model="model" :id="'r5-' + id">
        <label :for="'r5-' + id"><img  alt="level"></label>
    </form>
</template>

<script setup>

const props = defineProps({
    id: {
        type: String,
        require: true
    },
    data: {
        type: Number,
        require: true
    }
})


const emit = defineEmits(["level"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {

        emit("level", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

@mixin star-rating() {
    
    label {
        height: 40px;
        width: 20%;
        display: block;
        position: relative;

        &:hover, &:active {
            
            img {
    
                content: url("~/public/icones/lock-close.svg");
            }
        }
        img {

            width: 100%;
            content: url("~/public/icones/lock-open.svg");

            &:hover, &:active {

                content: url("~/public/icones/lock-close.svg");
            }
        }
    }

    input {
    
        display: none;

        &:checked {
            + label,
            ~ label {
                img {

                    content: url("~/public/icones/lock-close.svg");
                }
            }
        }
    }
}

.rating {

    width: 100%;
    @include flex($direction:row-reverse, $justify:space-around);
    margin: 0px auto 30px auto;
    @include star-rating();
}
</style>