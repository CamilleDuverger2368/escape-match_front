<template>
    <div id="conversation">
        <section id="current"></section>
        <section id="informations current"></section>
    </div>
</template>

<script setup>

const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

onMounted(() => {

})

let conversation = ref({
    id: null,
    name: '',
    createdAt: '',
    members: [],
    messages: [],
    administrator: {}
})
const getConversation = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "rooms/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        conversation.value = data.value
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#conversation {

    width: 100%;
    @include flex();
}
</style>