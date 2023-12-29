<template>
    <div id="finder">
        <section id="search">
            <div id="switcher">
                <button @click="switcher = 'entreprise'" :class="switcher == 'entreprise' ? 'switch left selected' : 'switch left'">entreprise</button>
                <button @click="switcher = 'tag'" :class="switcher == 'tag' ? 'switch right selected' : 'switch right'">tag</button>
            </div>
            <div class="variables">

            </div>
        </section>
        <section id="result">

        </section>
    </div>
</template>

<script setup>

const token = useCookie("token")
onMounted(() => {

})
let switcher = ref("entreprise")
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#finder {

    width: 100%;
    @include flex($direction:column);

    #search {

        width: 100%;
        @include flex($direction:column);

        #switcher {

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
    }
}
</style>