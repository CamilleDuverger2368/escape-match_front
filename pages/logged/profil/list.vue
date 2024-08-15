<template>
    <div id="friends-list">
        <section id="toggle">
            <button @click="switcher = 'friends'" :class="switcher == 'friends' ? 'switch left selected' : 'switch left'">friends</button>
            <button @click="switcher = 'asking'" :class="switcher == 'asking' ? 'switch right selected' : 'switch right'">asking</button>
        </section>
        <section id="friends"></section>
        <section id="asking"></section>
    </div>
</template>

<script setup>

const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()

let switcher = ref("friends")

</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#friends-list {
    width: 100%;
    @include flex($direction:column);

    #toggle {
        width: 50%;
        @include flex();

        .switch {

            width: 50%;
            height: 40px;
            color: $orange;
            @include flex();
            border-right: 1px solid rgba($orange, .7);
            transition: all 0.5s;

            &:hover, &:active {

                background-color: rgba($orange, .7);
                color: $white;
                box-shadow: 0px 0px 0px $orange;
            }
        }

        .left {

            box-shadow: -2px 0px 10px $orange;
            border-radius: 50px 0 0 50px;
        }

        .right {

            border-radius: 0 50px 50px 0;
            box-shadow: 2px 0px 10px $orange;
        }

        .selected {

            background-color: rgba($orange, .7);
            color: $white;
            box-shadow: 0px 0px 0px $orange;
        }
    }

    #friends {
        width: 100%;
        @include flex();
    }

    #asking {
        width: 100%;
        @include flex();
    }
}
</style>