<template>
    <form class="rating">
        <input type="radio" name="rating" value="5" v-model="model" :id="'r1-' + id">
        <img :for="'r1-' + id"/>

        <input type="radio" name="rating" value="4" v-model="model" :id="'r2-' + id">
        <img :for="'r2-' + id"/>

        <input type="radio" name="rating" value="3" v-model="model" :id="'r3-' + id">
        <img :for="'r3-' + id"/>

        <input type="radio" name="rating" value="2" v-model="model" :id="'r4-' + id">
        <img :for="'r4-' + id"/>

        <input type="radio" name="rating" value="1" v-model="model" :id="'r5-' + id">
        <img :for="'r5-' + id"/>
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

const emit = defineEmits(["grade"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {

        emit("grade", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

@mixin star-rating( $filled-color: $orange, $empty-color: #444, $size: 60px) {
    
    $lock--close: url("~/public/icones/lock-close.svg");
    $lock--open: url("~/public/icones/lock-open.svg");

    img {
        height: 40px;
        width: 20%;
        display: block;
        position: relative;
        cursor: pointer;
        @for $i from 5 through 1 {
            &:nth-of-type(#{$i}):after {
                $animation-delay: $i * .05s;
                animation-delay: $animation-delay;
            }
        }

        &:after {
            transition: all 0.4s ease-out;
            -webkit-font-smoothing: antialiased;
            position: absolute;
            content: '#{$lock--open}';
            color: $empty-color;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            font-size: $size;
            animation: 1s pulse ease;
        }

        &:hover:after {
            color: lighten($empty-color, 10%);
            text-shadow: 0 0 15px lighten($empty-color, 10%);
        }
    }

    input {
    
        display: none;

        &:checked {
            + img:after,
            ~ img:after {
                content: '#{$lock--close}';
                color: $filled-color;
                text-shadow: 0 0 20px $filled-color;
            }
        }
    }
}

.rating {

    width: 100%;
    @include flex($direction:row-reverse, $justify:space-around);
    margin: 0 auto 50px auto;
    @include star-rating();
}
</style>