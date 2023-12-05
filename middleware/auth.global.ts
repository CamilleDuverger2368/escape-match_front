import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to) => {
    
    const { authenticated } = storeToRefs(useAuthStore())
    const token = useCookie("token")

    if (token.value) {

        authenticated.value = true
    }

    if (token.value && to.name === "login") {

        // TO-DO : faire naviguer vers le profil de l'utilisateur courant
        return navigateTo('/')
    }

    if (!token.value && to.name !== "login" && to.name !== "/" && to.name !== "forgot-pwd") {

        abortNavigation()
        return navigateTo("/login")
    }
})