<template>
    <div id="friends-list">
        <section id="toggle">
            <button @click="switcher = 'friends'" :class="switcher === 'friends' ? 'active-list' : 'list'">friends</button>
            <button @click="switcher = 'asking'" :class="switcher === 'asking' ? 'active-list' : 'list'">asking</button>
            <button @click="switcher = 'blocked'" :class="switcher === 'blocked' ? 'active-list' : 'list'">blocked</button>
        </section>
        <section v-if="switcher === 'friends'" id="friends">
            <hr />
            <div v-if="friends.length > 0" class="content">
                <nuxt-link class="line" :key="friend" v-for="friend in friends" :to="currentEmail === friend.friend.sender.email ? '/logged/profil/' + friend.friend.receiver.id : '/logged/profil/' + friend.friend.sender.id" :id="'friendship-' + friend.friend.id">
                    <div class="title">
                        <img v-if="currentEmail === friend.friend.sender.email ? friend.friend.receiver.profilPic : friend.friend.sender.profilPic" alt="profil picture" class="image" :src="currentEmail === friend.friend.sender.email ? '/profil-pictures/' + friend.friend.receiver.profilPic + '.webp' : '/profil-pictures/' + friend.friend.sender.profilPic + '.webp'" />
                        <img v-else alt="neutral profil picture" class="image" src="/profil-pictures/neutral.webp" />
                        <div class="text">
                            <div class="name">
                                {{ currentEmail === friend.friend.sender.email ? friend.friend.receiver.firstname + ' ' + friend.friend.receiver.name :  friend.friend.sender.firstname + ' ' + friend.friend.sender.name }}
                                <span v-if="currentEmail === friend.friend.sender.email ? friend.friend.receiver.pseudo : friend.friend.sender.pseudo"> aka {{ currentEmail === friend.friend.sender.email ? friend.friend.receiver.pseudo : friend.friend.sender.pseudo }}</span>
                            </div>
                            <div class="sessions">{{ friend.sessions }} session(s) done together</div>
                        </div>
                    </div>
                    <hr/>
                </nuxt-link>
            </div>
            <div v-else class="empty">You have no friend yet</div>
        </section>
        <section v-else-if="switcher === 'asking'" id="asking">
            <hr />
            <div v-if="askings.length > 0" class="content">
                <div class="line" :key="request" v-for="request in askings" :id="'request-' + request.id">
                    <div class="title">
                        <div class="name">
                            {{ currentEmail === request.sender.email ? request.receiver.firstname + ' ' + request.receiver.name :  request.sender.firstname + ' ' + request.sender.name }}
                            <span v-if="currentEmail === request.sender.email ? request.receiver.pseudo : request.sender.pseudo"> aka {{ currentEmail === request.sender.email ? request.receiver.pseudo : request.sender.pseudo }}</span>
                        </div>
                        <div v-if="currentEmail === request.receiver.email" class="choice">
                            <button class="accept-request" @click="acceptFriendship(request.id)">&#10003;</button>
                            <button class="reject-request" @click="declineFriendship(request.id)">X</button>
                        </div>
                        <div v-else class="accept-request">
                            Request sent !
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
            <div v-else class="empty">There is no pending request</div>
        </section>
        <section v-else-if="switcher === 'blocked'" id="blocked">
            <hr />
            <div v-if="blocked.length > 0" class="content">
                <div class="line" :key="user" v-for="user in blocked" :id="'blocked-' + user.id">
                    <div class="title">
                        <div class="name">
                            {{ user.firstname + ' ' + user.name }}
                            <span v-if="user.pseudo"> aka {{ user.pseudo }}</span>
                        </div>
                        <div @click="unblockUser(user.id)" class="accept-request">
                            Unblock {{ user.firstname }} ?
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
            <div v-else class="empty">There is no blocked user by you.</div>
        </section>
    </div>
</template>

<script setup>

const token = useCookie("token")
const currentEmail = useCookie("email")
const runtimeConfig = useRuntimeConfig()

onMounted(async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/friendships", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        askings.value = data.value.askings
        friends.value = data.value.friendships
        blocked.value = data.value.blocked
    }
})

let switcher = ref("friends")

// Friends' section
let askings = ref({})
let friends = ref({})

const getFriends = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/list", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        askings.value = data.value.askings
        friends.value = data.value.friendships
    }
}
const acceptFriendship = async (id) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/accept/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        getFriends()
    } 
}
const declineFriendship = async (id) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "friend/decline/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        getFriends()
    } 
}

// Blocked's section
let blocked = ref({})

const getBlockedUsers = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/blocked", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        blocked.value = data.value
    }
}
const unblockUser = async (element) => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "user/unblock/" + element, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {
        
        getBlockedUsers()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#friends-list {
    width: 100%;
    @include flex($direction:column);
    
    hr {
        width: 100%;
        color: $orange;
        font-size: 1rem;
        margin: 0;
        box-shadow: 0 0 10px $orange;
    }

    .empty {
        width: 100%;
        margin-top: 30px;
        text-align: center;
        @include flex();
    }

    .content {
        width: 100%;
    }

    #toggle {
        
        width: 90%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-row-gap: 10px;
        grid-column-gap: 10px;

        .active-list {
            box-shadow: 0 0 0 $orange;
            background-color: rgba($orange, .7);
            color: $black;
            @include button($paddingY:10px, $paddingX:20px);
        }

        .list {
            box-shadow: 1px 1px 1px $orange;
            @include button($paddingY:10px, $paddingX:20px);
        }
    }

    #friends {
        width: 100%;
        margin-top: 30px;
        @include flex($direction:column);
        
        .line {
            width: 100%;
            @include flex($direction:column);

            .title {
                width: 100%;
                @include flex($justify:space-around, $align:center);

                .image {
                    width: 100px;
                }

                .text {
                    width: 60%;
                    @include flex($direction:column);

                    .name {
                        width: 100%;
                        font-size: 1.5rem;
                        text-align: center;
                    }

                    .sessions {
                        color: $orange;
                        margin: 5px auto;
                        font-size: .8rem;
                    }
                }
            }

            &:hover, &:active {
                background-color: rgba($white, 0.5);
            }
        }
    }

    #asking, #blocked {
        width: 100%;
        margin-top: 30px;
        @include flex($direction:column);
        
        .line {
            width: 100%;
            @include flex($direction:column);

            .title {
                width: 100%;
                @include flex($justify:space-around, $align:center);

                .name {
                    width: 60%;
                    font-size: 1.5rem;
                    text-align: center;
                }
                
                .accept-request {
                    @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$green);
                }

                .choice {
                    width: 40%;
                    @include flex();

                    .reject-request {
                        @include button($paddingY:10px, $paddingX: 15px, $size: 1rem, $marge:10px, $color:$red);
                    }
                }
            }

            &:hover, &:active {
                background-color: rgba($white, 0.5);
            }
        }
    }
}
</style>