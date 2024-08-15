<template>
    <div id="find-friends">
        <section id="search">
            <Input name="Search friend by name, firstname or pseudo" type="text" id="find_friend" :data="search.info" :error="search.error" :require="true" @check="searchFriends" />
        </section>
        <section id="result">
            <hr v-if="result.length > 0"/>
            <nuxt-link class="line" :key="user" v-for="user in result" :to="'/logged/profil/' + user.id" :id="'user-' + user.id">
                <div class="title">
                    <img v-if="user.profilPic" :alt="user.firstname + ' profil picture'" class="image" :src="'/profil-pictures/' + user.profilPic + '.webp'" />
                    <img v-else alt="neutral profil picture" class="image" src="/profil-pictures/neutral.webp" />
                    <div class="name">
                        {{ user.firstname + ' ' + user.name }}
                        <span v-if="user.pseudo"> aka {{ user.pseudo }}</span>
                    </div>
                </div>
                <hr/>
            </nuxt-link>
        </section>
    </div>
</template>

<script setup>

const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()

let search = ref({
    info: '',
    error: ''
})
let result = ref({})

const searchFriends = async (data) => {

    search.value.info = data
    if (search.value.info != '') {
        const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/finder", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token.value
            },
            params: {
                search: search.value.info
            }
        })

        if (data.value) {

            result.value = data.value
        }
    } else {
        result.value = {}
    }
}

</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#find-friends {
    width: 100%;
    @include flex($direction:column, $justify:flex-start);

    #search {
        width: 90%;
        @include flex();
    }

    #result {
        width: 100%;
        @include flex($direction:column);

        hr {
            width: 100%;
            color: $orange;
            font-size: 1rem;
            margin: 0;
            box-shadow: 0 0 10px $orange;
        }

        .line {
                width: 100%;
                @include flex($direction:column);

                .title {
                    width: 100%;
                    @include flex($justify:space-around, $align:center);

                    .image {
                        width: 20%;
                    }

                    .name {
                        width: 60%;
                        font-size: 1.5rem;
                        text-align: center;
                    }
                }

                &:hover, &:active {
                    background-color: rgba($white, 0.5);
                }
            }
    }
}
</style>