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
            const { data, pending }: any = await useFetch(runtimeConfig.public.apiBase + "unlog/login", {
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
                const email = useCookie("email")
                email.value = username
                this.authenticated = true
            } else {

                this.authenticated = false
            }
        },

        async logUserOut() {

            const token = useCookie("token")
            const runtimeConfig = useRuntimeConfig()
            const { data, pending }: any = await useFetch(runtimeConfig.public.apiBase + "user/logout", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token.value
                }
            })
            this.loading = pending

            if (data) {
                this.authenticated = false
                token.value = null
            }
        },
    },
});