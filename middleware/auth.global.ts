import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to) => {
    
    const { authenticated } = storeToRefs(useAuthStore())
    const token = useCookie("token")
    // for messages' request

    if (token.value) {

        authenticated.value = true
    }

    if (token.value && to.name === "login") {

        return navigateTo("/logged/profil")
    }

    if (!token.value && to.name !== "login" && to.name !== "/" && to.name !== "forgot-pwd" && to.name !== "register") {

        abortNavigation()
        return navigateTo("/login")
    }
})