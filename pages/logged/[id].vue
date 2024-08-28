<template>
    <div id="escape">
        <section id="title">
            <div class="composition">
                <img v-if="image" alt="escape" :src="image" />
                <img v-else alt="escape" src="/escapes/no-image-found.webp" />
                <h1 class="name">{{ escape.name }}</h1>
                <h2 v-if="!escape.actual">NO LONGER EXISTS</h2>
            </div>
        </section>
        <section id="description">
            {{ description.description }}
        </section>
        <hr/>
        <section id="informations">
            <div class="info">
                <img src="~/public/icones/group-team.svg" alt="players">
                <div>{{ escape.minPlayer }} to {{ escape.maxPlayer }}</div>
            </div>
            <div class="info">
                <img :src="'/icones/age-' + escape.age + '.svg'" alt="age">
            </div>
            <div class="info">
                <img src="~/public/icones/hourglass.svg" alt="time">
                <div>{{ escape.time }} min</div>
            </div>
            <div v-if="escape.level == 5" class="info">
                <img v-bind:key="n" v-for="n in escape.level" src="~/public/icones/lock-close.svg" alt="level">
            </div>
            <div v-else class="info">
                <img v-bind:key="n" v-for="n in escape.level" src="~/public/icones/lock-close.svg" alt="level">
                <img v-bind:key="nb" v-for="nb in (5 - escape.level)" class="open" src="~/public/icones/lock-open.svg" alt="level">
            </div>
            <div class="info">
                <div>~ {{ escape.price }}</div>
                <img src="~/public/icones/euro.svg" alt="price">
            </div>
            <a :href="link.link" class="footer-link" target="_blanck">The escape here !</a>
        </section>
        <hr/>
        <section id="tags">
            <div v-bind:key="tag" v-for="tag in escape.tags">{{ tag.name }}</div>
        </section>
        <hr/>
        <section id="grades">
            <div class="general">
                <h3>Escape's average</h3>
                <div v-if="votes > 0">There is {{ votes }} vote(s)</div>
                <div v-else>There is no vote yet</div>
                <Stars v-if="votes != 0" id="average" :data="average" />
            </div>
            <div class="user">
                <div v-if="userGrade.grade === 0 && changeGrade === false" class="old-grade">
                    <h3>You didn't grade this escape yet !</h3>
                    <button @click="changeGrade = true">Grade this escape</button>
                </div>
                <div v-else-if="userGrade.grade !== 0 && changeGrade === false" class="old-grade">
                    <h3>Your grade for this escape</h3>
                    <Stars id="old-grade-user" :data="userGrade.grade" />
                    <div class="buttons">
                        <button @click="changeGrade = true">Change my grade</button>
                        <button @click="deleteGrade">Remove my grade</button>
                    </div>
                </div>
                <div v-else-if="changeGrade === true" class="old-grade">
                    <h3 v-if="userGrade.grade !== 0">Your new grade for this escape</h3>
                    <h3 v-else>Grade for this escape</h3>
                    <Ratingstars id="grade-escape" :data="grade" @grade="gradeEscape" />
                    <button v-if="userGrade.grade === 0" @click="gradeEscapeGame">Grade</button>
                    <button v-else @click="updateGrade">Update my grade</button>
                </div>
            </div>
        </section>
        <hr v-if="escape.actual"/>
        <section v-if="escape.actual" id="list-to-do">
            <button v-if="!isToDo" @click="addToToDoList" class=" top">Add to my to-do list</button>
            <div v-else class="actions top">
                <button @click="removeFromToDoList">Remove from my to-do list</button>
                <button @click="updateToDoList">Update my willing</button>
            </div>
            <Tablelist :headers="['User\'s profil', 'Since', 'Contact']" :list="escape.listToDos" id="list-to-do-escape" page="escape"/>
        </section>
        <hr />
        <section id="done">
            <button @click="markAsDone = true" class=" top">Add a new session</button>
            <form v-if="markAsDone" id="add-session" @submit.prevent="addNewSession()">
                <Datepicker id="session-date" :data="newSession.date" name="Session's date" @check="checkSessionDate" />
                <div class="members">
                    <div class="title">Members</div>
                    <div class="member">{{ findUserNameByIdOrEmail("email", currentEmail) }}</div>
                    <div :key="member" v-for="member in newSession.members" class="member">{{ findUserNameByIdOrEmail("id", member) }}</div>
                </div>
                <ListfieldUsers title="Choose session's member to add" :options="users" :data="newSession.members" @select="checkSessionMember"/>
                <button type="submit">Save</button>
            </form>
            <div v-if="sessions.length > 0" class="sessions">
                <div :key="session" v-for="session in sessions" class="session">
                    <div class="time">
                        <img src="~/public/icones/hourglass.svg" alt="time">
                        {{ formatDate(session.playedAt) }}
                    </div>
                    <div class="members">
                        <div class="title">Members</div>
                        <nuxt-link :key="member" v-for="member in session.members" :to="member.email === currentEmail ? '/logged/profil' : '/logged/profil/' + member.id" class="member">
                            {{ member.firstname + ' ' + member.name }}
                            <span v-if="member.pseudo"> aka {{ member.pseudo }}</span>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </section>
        <!--<hr/>
        <section id="list-favori">
            <button v-if="!isFavorite" @click="addToFavoriList" class=" top">Add to my favori</button>
            <button v-else @click="removeFromFavoriList" class=" top">Remove from my favori</button>
            <Tablelist :headers="['User\'s profil', 'Since', 'Contact']" :list="escape.listFavoris" id="list-favori-escape" page="escape"/>
        </section>-->
    </div>
</template>

<script setup>
import { formatDate } from "~/public/usefull/usefull"

// Escape's section
let escape = ref({
    id: 0,
    name: '',
    actual: true,
    time: 0,
    minPlayer: 0,
    maxPlayer: 0,
    age: 0,
    level: 0,
    price: 0,
    entreprises: [{
        name: ''
    }],
    tags: [],
    listToDos: [],
    listFavoris: []
})
let description = ref({
    description: ''
})
let link = ref({
    link: ''
})
const route = useRoute()
const token = useCookie("token")
const currentEmail = useCookie("email")
const runtimeConfig = useRuntimeConfig()
let image = ref(false)

onMounted(() => {

    if (route.query.entreprise) {

        getEscapeWithEntreprise()
    } else {

        getEscape()
    }
})

const getImage = (name, entreprise) => {

    const img = new Image()
    img.src = "/escapes/" + name  + '-' + entreprise + ".webp"

    if (img.complete) {

        image.value = img.src
    } else {

        img.onload = () => {

            image.value = img.src
        }

        img.onerror = () => {

            img.src = "/escapes/" + name + ".webp"
            if (img.complete) {

                image.value = img.src
            } else {

                img.onload = () => {

                    image.value = img.src
                }

                img.onerror = () => {

                    image.value = false
                }
            }
        }
    }
}
const fillUpInformations = (data) => {
    escape.value = data.escape
    description.value = data.description
    link.value = data.link
    average.value = data.average
    votes.value = data.votes
    if (data.userGrade === null) {

        userGrade.value.grade = 0
    } else {

        userGrade.value.grade = data.userGrade
    }
    isToDo.value = data.isToDo
    isFavorite.value = data.isFavorite
    
    // Check if escape's image exist
    getImage(
        escape.value.name.toLowerCase().replaceAll(' ', '-'),
        escape.value.entreprises[0].name.toLowerCase().replaceAll(' ', '-')
    )

    users.value = data.usersList
    sessions.value = data.sessions
}
const getEscapeWithEntreprise = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/escape/" + route.params.id + "/entreprise/" + route.query.entreprise, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        fillUpInformations(data.value)
    }
}
const getEscape = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "website/routes/escape/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        fillUpInformations(data.value)
    }
}

// Grade section
let changeGrade = ref(false)
let average = ref(0.0)
let votes = ref(0)
let grade = ref(0)
let userGrade = ref({
    grade: 0
})

// Get grade graduating
const getAverage = async () => {
    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/average/" + escape.value.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        average.value = data.average
        votes.value = data.votes
        if (data.userGrade === null) {

            userGrade.value.grade = 0
        } else {

            userGrade.value.grade = data.userGrade
        }
    }
}
const gradeEscape = (data) => {

    grade.value = data
}
const deleteGrade = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/delete/" + escape.value.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        getAverage()
    }
}
const gradeEscapeGame = async () => {

    userGrade.value.grade = grade.value

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/" + escape.value.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            grade: Number(userGrade.value.grade)
        }
    })

    if (data.value) {

        changeGrade.value = false
        getAverage()
    }
}
const updateGrade = async () => {

    userGrade.value.grade = grade.value
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/update/" + escape.value.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: {
            grade: Number(userGrade.value.grade)
        }
    })

    if (data.value) {

        changeGrade.value = false
        getAverage()
    }
}

// List section
let isToDo = ref(false)
let isFavorite = ref(false)
let markAsDone = ref(false)
let sessions = ref({})
let users = ref({})
let newSession = ref({
    date: '',
    escape: route.params.id,
    members: []
})

const checkSessionDate = (data) => {

    newSession.value.date = data
}
const checkSessionMember = (data) => {
    
    if (!newSession.value.members.includes(data)) {

        newSession.value.members.push(data)
    }
}
const findUserNameByIdOrEmail = (key, value) => {
    
    let max = users.value.length
    for (let i = 0; i < max; i++) {
        if (users.value[i][key] === value) {

            let name = users.value[i].firstname + ' ' + users.value[i].name
            if (users.value[i].pseudo) {
                name += " aka " + users.value[i].pseudo
            }
            return name
        }
    }
}
const getSessions = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/session/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        sessions.value = data.value
        markAsDone.value = false
    }
}
const getToDos = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        escape.value.listToDos = data.value.toDoList
        isToDo.value = data.value.isToDo
    }
}
const addNewSession = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/session/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        body: newSession.value
    })

    if (data.value) {

        getSessions()
    }
}
const addToToDoList = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/add/" + escape.value.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        getToDos()
    }
}
const addToFavoriList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris/add/" + escape.value.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        // To-Do : changer de methode pour ne recuperer que les listes d un escape et ne pas recharger TOUTES les infos
        getEscape()
    }
}
const removeFromToDoList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/remove/" + isToDo.value.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        getToDos()
    }
}
const removeFromFavoriList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris/remove/" + isFavorite.value.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        // To-Do : changer de methode pour ne recuperer que les listes d un escape et ne pas recharger TOUTES les infos
        getEscape()
    }
}
const updateToDoList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/update/" + isToDo.value.id, {
        method: "PUT",
                headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })
    
    if (data.value) {

        getToDos()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#escape {
    
    width: 100%;
    @include flex($direction:column);

    hr {

        width: 75%;
        color: $orange;
        font-size: 1rem;
        box-shadow: 0 0 10px $orange;
        transition: all 0.3s ease-in-out;

        &:hover, &:active {

            width: 85%;
        }
    }

    .top {

        margin-top: 20px;
    }

    #title {
        width: 100%;

        .composition {
            width: 100%;
            height: 50vh;
            @include flex();

            img {
                width: 100%;
                height: 50vh;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
            }

            .name {
                position: absolute;
                text-transform: capitalize;
            }

            h2 {
                margin-top: 20%;
                position: absolute;
                background-color: $red;
            }
        }
    }

    #description {
        
        width: 90%;
        margin: 20px auto;
        padding: 0 10px;
        text-align: justify;
        @include flex();
    }

    #informations {

        width: 100%;
        margin: 20px auto;
        padding: 0 10px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-row-gap: 5px;

        .info {

            @include flex();

            img {

                width: 25%;
                margin: auto 3px;
            }
        }
    }

    #tags {

        width: 90%;
        margin: 20px auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 20px;
        grid-column-gap: 20px;

        div {

            border-radius: 5px;
            padding: 10px;
            text-align: center;
            color: $orange;
            background-color: rgba($orange, .3);
        }
    }

    #grades {

        width: 100%;
        @include flex($direction:column);

        .general {
            
            width: 100%;
            @include flex($direction:column);
        }

        .user {

            width: 100%;
            margin: 10px auto;
            @include flex($direction:column);

            .old-grade {
                
                width: 100%;
                @include flex($direction:column);

                .buttons {

                    width: 100%;
                    margin: 15px auto;
                    @include flex($justify:space-around);

                    button {
            
                        @include button($paddingY:10px, $paddingX:20px, $size:1rem);
                    }
                }

                button {
                    
                    @include button($paddingY:10px, $paddingX:25px, $size:1rem, $marge:15px auto);
                }
            }
        }
    }

    #list-to-do {

        width: 100%;
        margin: 20px auto;
        @include flex($direction:column);

        button {

            @include button($paddingX:10px, $paddingY:10px, $size:1rem);
        }

        .actions {

            width: 100%;
            @include flex($justify:space-around);
        }
    }

    #done {
        
        width: 100%;
        margin: 20px auto;
        @include flex($direction:column);

        button {

            @include button($paddingX:10px, $paddingY:10px, $size:1rem);
        }

        form {
            width: 70%;
            margin: 10px auto;
            @include flex($direction:column);

            .title {
                color: $orange;
                font-size: 1.25rem;
                font-weight: 400;
            }

            .members {
                width: 100%;
                margin: 10px auto;
                @include flex($direction:column);
            }
        }

        .sessions {
            width: 70%;
            margin: 20px auto;
            @include flex($direction:column);

            .session {
                width: 100%;
                margin: 20px auto;
                padding: 15px;
                @include flex($direction:column);
                border: solid 1px rgba($orange, 0.7);
                border-radius: 5px;

                .time {
                    width: 100%;
                    @include flex();

                    img {
                        width: 40px;
                        margin: auto 3px;
                    }
                }
                
                .title {
                    color: $orange;
                    font-size: 1.25rem;
                    font-weight: 400;
                }

                .members {
                    width: 100%;
                    margin: 10px auto;
                    @include flex($direction:column);

                    .member {
                        @include link();
                    }
                }
            }
        }
    }

    #list-favori {

        width: 100%;
        margin: 20px auto;
        @include flex($direction:column);

        button {

            @include button($paddingX:10px, $paddingY:10px, $size:1rem);
        }
    }
}

@media screen and (min-width: 450px) {

    #escape {

        #title {
            .composition {

                h2 {

                    margin-top: 8%;
                }
            }
        }

        #description {

            margin: 40px auto;
        }

        #informations {

            margin: 40px auto;
            grid-row-gap: 30px;
            .info {

                img {

                    width: 40px;
                }
            }
        }

        #tags {

            margin: 40px auto;
            grid-template-columns: repeat(3, 1fr);
        }

        #grades {

            margin: 40px auto;

            .user {
                .old-grade {
                    .buttons {

                        width: 50%;
                        margin: 20px auto;
                    }
                }
            }
        }

        #list-to-do {

            margin: 40px auto;

            .actions {

                width: 50%;
            }
        }
        
        #list-favori {

            margin: 40px auto;
        }
    }
}

@media screen and (min-width: 1100px) {

    #escape {

        #title {
            .composition {

                h2 {

                    margin-top: 5%;
                }
            }
        }

        #grades {

            .user {
                .old-grade {
                    .buttons {

                        width: 40%;
                    }
                }
            }
        }

        #list-to-do {
            .actions {

                width: 40%;
            }
        }
    }
}
</style>