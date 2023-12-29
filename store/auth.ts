import { defineStore } from "pinia"

interface UserPayloadInterface {
    username: string,
    password: string
}

export const useAuthStore = defineStore("auth", {

    state: () => ({
        authenticated: false,
        loading: false
    }),

    actions: {

        async authenticateUser({ username, password }: UserPayloadInterface) {

            const runtimeConfig = useRuntimeConfig()
            const { data, pending }: any = await useFetch(runtimeConfig.public.apiBase + "login_check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: {
                    username,
                    password
                }
            })
            this.loading = pending

            if (data.value) {

                const token = useCookie("token")
                token.value = data.value.token
                this.authenticated = true
            } else {

                this.authenticated = false
            }
        },

        logUserOut() {

            const token = useCookie("token")
            this.authenticated = false
            token.value = null
        },
    },
});