import { defineStore } from 'pinia'

interface UserPayloadInterface {
    username: string,
    password: string
}

export const useAuthStore = defineStore('auth', {

    state: () => ({
        authenticated: false,
        loading: false,
    }),

    actions: {

        async authenticateUser({ username, password }: UserPayloadInterface) {

            // TO-DO : passer les adresses par variable et non en dur
            const { data, pending }: any = await useFetch('http://127.0.0.1:8000/api/login_check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    username,
                    password,
                },
            })
            this.loading = pending
            console.log("authenticate 1")
            if (data.value) {

                console.log("authenticate 2")
                const token = useCookie('token')
                token.value = data.value.token
                this.authenticated = true
            } else {

                console.log("authenticate 3")
                this.authenticated = false
            }
            console.log("authenticate 4")
        },

        logUserOut() {

            const token = useCookie('token');
            this.authenticated = false;
            token.value = null;
        },
    },
});