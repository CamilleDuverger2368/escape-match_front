<template>
    <div id="header">
        <nav class="container">
            <img alt="logo" class="image" src="/favicon.ico" />
            <div class="links" @click="openMenu()">
                <span class="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span> 
            </div>
        </nav>
    </div>
</template>

<script setup>

const emit = defineEmits(["open"])

const openMenu = () => {

    emit('open')
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#header {
    position: sticky;
    top: 0;
    width: 100%;
    @include flex($direction:column);

    nav {
        width: 100%;
        padding: 2vh 5vw;
        @include flex($justify: space-between);

        .links {
            border-radius: 50%;
            box-shadow: 0 0 10px $orange;
            padding: 7px 5px;
            transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;

            .burger-icon {

                span {
                    display: block;
                    width: 20px;
                    height: 1px;
                    background-color: $orange;
                    margin: 5px;
                    transition: background-color 0.3s ease-in-out;
                }

                &:hover, &:active {

                    span {
                        background-color: $black;
                    }
                }
            }

            &:hover, &:active {
                box-shadow: 0 0 0 $orange;
                background-color: $orange;
            }
        }
    }
}
</style>