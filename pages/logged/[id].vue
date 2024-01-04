<template>
    <div id="escape">
        <section id="title">
            <div class="composition">
                <!--<img v-if="image" alt="escape" :src="'/escapes/' + escape.name.toLowerCase().replaceAll(' ', '-') + '-' + escape.entreprises[0].name.toLowerCase().replaceAll(' ', '-') + '.webp'" />-->
                <img v-if="image" alt="escape" :src="image" />
                <img v-else alt="escape" src="/escapes/no-image-found.webp" />
                <h1 class="name">{{ escape.name }}</h1>
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
            <a :href="link.link" class="footer-link">The escape is here !</a>
        </section>
        <hr/>
        <section id="tags">
            <button v-bind:key="tag" v-for="tag in escape.tags" class="login-button">{{ tag.name }}</button>
        </section>
        <hr/>
        <section id="grades">
            <div class="general">
                <h3>Escape's average</h3>
                <Stars id="average" :data="average" />
            </div>
            <div class="user">
                <div v-if="userGrade.grade === 0 && changeGrade === false">
                    <h3>You didn't grade this escape yet !</h3>
                    <button @click="changeGrade = true" class="login-button">Grade this escape</button>
                </div>
                <div v-else-if="userGrade.grade !== 0 && changeGrade === false" class="old-grade">
                    <h3>Your grade for this escape</h3>
                    <Stars id="old-grade-user" :data="userGrade.grade" />
                    <div class="buttons">
                        <button @click="changeGrade = true" class="login-button">Change my grade</button>
                        <button @click="deleteGrade" class="login-button">Remove my grade</button>
                    </div>
                </div>
                <div v-else-if="changeGrade === true" class="old-grade">
                    <h3 v-if="userGrade.grade !== 0">Your new grade for this escape</h3>
                    <h3 v-else>Grade for this escape</h3>
                    <Ratingstars id="grade-escape" :data="grade" @grade="gradeEscape" />
                    <button v-if="userGrade.grade === 0" @click="gradeEscapeGame" class="login-button">Grade</button>
                    <button v-else @click="updateGrade" class="login-button">Update my grade</button>
                </div>
            </div>
        </section>
        <hr/>
        <section id="list-to-do">
            <button v-if="!isToDo" @click="addToToDoList" class="login-button top">Add to my to-do list</button>
            <div v-else class="actions top">
                <button @click="removeFromToDoList" class="login-button">Remove from my to-do list</button>
                <button @click="updateToDoList" class="login-button">Update my willing</button>
            </div>
            <Tablelist :headers="['User\'s profil', 'Since', 'Contact']" :list="escape.listToDos" id="list-to-do-escape" :fromEscapePage="true"/>
        </section>
        <hr/>
        <section id="list-favori">
            <button v-if="!isFavorite" @click="addToFavoriList" class="login-button top">Add to my favori</button>
            <button v-else @click="removeFromFavoriList" class="login-button top">Remove from my favori</button>
            <Tablelist :headers="['User\'s profil', 'Since', 'Contact']" :list="escape.listFavoris" id="list-favori-escape" :fromEscapePage="true"/>
        </section>
        <hr/>
        <section id="list-done">
            <button v-if="!isDone" @click="addToDoneList" class="login-button top">Add to my done list</button>
            <button v-else @click="removeFromDoneList" class="login-button top">Remove from my done list</button>
            <Tablelist :headers="['User\'s profil', 'Since', 'Contact']" :list="escape.listDones" id="list-done-escape" :fromEscapePage="true"/>
        </section>
    </div>
</template>

<script setup>

let escape = ref({
    id: 0,
    name: '',
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
    listFavoris: [],
    listDones: []
})
let description = ref({
    description: ''
})
let link = ref({
    link: ''
})
const route = useRoute()
const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
let image = ref(false)

onMounted(() => {

    // Get Escape's informations
    getEscape()
})
const getEscape = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/" + route.params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        }
    })

    if (data.value) {

        escape.value = data.value.escape
        description.value = data.value.description
        link.value = data.value.link
        average.value = data.value.average
        if (data.value.userGrade === null) {

            userGrade.value.grade = 0
        } else {

            userGrade.value.grade = data.value.userGrade
        }
        isToDo.value = data.value.isToDo
        isFavorite.value = data.value.isFavorite
        isDone.value = data.value.isDone
        
        // Check if escape's image exist
        const img = new Image()
        img.src = "/escapes/" + escape.value.name.toLowerCase().replaceAll(' ', '-')  + '-' + escape.value.entreprises[0].name.toLowerCase().replaceAll(' ', '-') + ".webp"

        if (img.complete) {

            image.value = img.src
        } else {

            img.onload = () => {

                image.value = img.src
            }

            img.onerror = () => {

                img.src = "/escapes/" + escape.value.name.toLowerCase().replaceAll(' ', '-') + ".webp"
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
}

// Grade section
let changeGrade = ref(false)
let average = ref(0.0)
let grade = ref(0)
let userGrade = ref({
    grade: 0
})
const gradeEscape = (data) => {

    grade.value = data
}
const deleteGrade = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/delete/" + escape.value.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })

    if (data.value) {

        getEscape()
    }
}
const gradeEscapeGame = async () => {

    userGrade.value.grade = grade.value

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/" + escape.value.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userGrade.value
    })

    if (data.value) {

        changeGrade.value = false
        getEscape()
    }
}
const updateGrade = async () => {

    userGrade.value.grade = grade.value
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/grade/update/" + escape.value.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: userGrade.value
    })

    if (data.value) {

        changeGrade.value = false
        getEscape()
    }
}

// List section
let isToDo = ref(false)
let isDone = ref(false)
let isFavorite = ref(false)
const addToToDoList = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/add/" + escape.value.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const addToFavoriList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris/add/" + escape.value.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const addToDoneList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/done/add/" + escape.value.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const removeFromToDoList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/remove/" + isToDo.value.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const removeFromFavoriList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/favoris/remove/" + isFavorite.value.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const removeFromDoneList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/done/remove/" + isDone.value.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
const updateToDoList = async () => {
    
    const { data } = await useFetch(runtimeConfig.public.apiBase + "lists/to-do/update/" + isToDo.value.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    
    if (data.value) {

        getEscape()
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#escape {
    
    width: 100%;
    @include flex($direction:column);

    .login-button {

        padding: 10px;
        font-size: 1rem;
    }

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
        }
    }

    #description {
        
        width: 100%;
        margin: 20px auto;
        padding: 0 10px;
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
    }

    #grades {

        width: 100%;
        @include flex($direction:column);

        .general {
            
            width: 100%;
            margin: 10px auto;
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

                    .login-button {
                        padding: 10px 25px;
                        font-size: 1rem;
                    }
                }

                .login-button {
                    margin: 15px auto;
                    padding: 10px 25px;
                    font-size: 1rem;
                }
            }
        }
    }

    #list-to-do {

        width: 100%;
        @include flex($direction:column);

        .actions {

            width: 100%;
            @include flex($justify:space-around);
        }
    }

    #list-favori {

        width: 100%;
        @include flex($direction:column);
    }

    #list-done {

        width: 100%;
        @include flex($direction:column);
    }
}
</style>