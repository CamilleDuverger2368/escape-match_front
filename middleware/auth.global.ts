import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to) => {
    
    const { authenticated } = storeToRefs(useAuthStore())
    const token = useCookie("token")

    if (token.value) {

        authenticated.value = true
    }

    // if (token.value && to.name === "login") {

    //     // TO-DO : faire naviguer vers le profil de l'utilisateur courant
    //     return navigateTo('/logged/profil')
    // }

    // if (!token.value && to.name !== "login" && to.name !== "/" && to.name !== "forgot-pwd" && to.name !== "register") {

    //     abortNavigation()
    //     return navigateTo("/login")
    // }
})