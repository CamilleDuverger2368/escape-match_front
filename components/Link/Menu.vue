<template>
    <nuxt-link :to="link">
        <div class="Title">
            <h3>{{ name }}
                <div class="Title__highlight"></div>
            </h3>
            <div class="Title__underline"></div>
            <div aria-hidden class="Title__filled">{{ name }}</div>
        </div>
    </nuxt-link>
</template>

<script setup>

const props = defineProps({
    link: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";
@import url("https://fonts.googleapis.com/css?family=Catamaran:900&display=swap");

a {
    margin: 15px 0;
    .Title {
        color: $orange;
        position: relative;
        font-family: "Catamaran", sans-serif;
        cursor: pointer;

        h3 {
            position: relative;
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-size: 3em;
            -webkit-text-stroke: 1px $orange;
            -webkit-text-fill-color: $black;
        }

        &__underline {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0.3em;
            height: 3px;
            background-color: $orange;
            z-index: 5;
            transition: transform 580ms cubic-bezier(0.2, 0.1, 0.15, 1.32);
        }

        &__highlight {
            position: absolute;
            width: 100%;
            bottom: -50;
            left: 0;
            height: 35px;
            background-color: $orange;
            z-index: -1;
            transition: transform 400ms ease;
        }

        &__filled {
            position: absolute;
            margin: 0;
            padding: 0;
            font-size: 3em;
            top: 0;
            clip-path: polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%);
            transition: clip-path 600ms cubic-bezier(0.2, 0.1, 0.15, 1.32);
        }

        &:hover {

            .Title__filled {
                clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%);
            }

            .Title__underline {
                transform: translateY(-3.7em);
            }

            .Title__highlight {
                transform: translateY(-2.1em);
            }
        }
    }
}
</style>