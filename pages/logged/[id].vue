<template>
    <div id="escape">
        <section id="title">
            <div class="composition">
                <img v-if="image" alt="escape" :src="'/escapes/' + escape.name.toLowerCase().replaceAll(' ', '-') + '.webp'" />
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
                <img v-if="escape.age == 16" src="~/public/icones/age-16.svg" alt="age">
                <img v-else src="~/public/icones/age-18.svg" alt="age">
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
            <Tablelist :headers="['User\'s profil', 'since', 'Contact']" :list="escape.listToDo" id="list-to-do-escape" :fromEscapePage="true"/>
        </section>
        <hr/>
        <section id="list-favori">
            <Tablelist :headers="['User\'s profil', 'since', 'Contact']" :list="escape.listFavori" id="list-favori-escape" :fromEscapePage="true"/>
        </section>
        <hr/>
        <section id="list-done">
            <Tablelist :headers="['User\'s profil', 'since', 'Contact']" :list="escape.listDone" id="list-done-escape" :fromEscapePage="true"/>
        </section>
    </div>
</template>

<script setup>

// TEST
let escape = ref({
    id: 42,
    name: "L'Elixir",
    time: 90,
    minPlayer: 2,
    maxPlayer: 6,
    age: 16,
    level: 3,
    price: 28,
    entreprise: [
        {
            name: "Prizoners"
        }
    ],
    tags: [
        {
            name: "horror"
        },
        {
            name: "potache"
        },
        {
            name: "fantastique"
        },
        {
            name: "historique"
        },
        {
            name: "licence"
        }
    ],
    listToDo: [
        {
            user: {
                    id: 7,
                    name: "test",
                    firstname: "testouille",
                    pseudo: ""
                },
                since: "2023-12-21T00:00:00+00:00"
            },
            {
                user: {
                    id: 8,
                    name: "user",
                    firstname: "user",
                    pseudo: ""
                },
                since: "2023-12-21T00:00:00+00:00"
            },
            {
                user: {
                    id: 9,
                    name: "Duverger",
                    firstname: "Camille",
                    pseudo: "Grandma"
                },
                since: "2023-12-21T00:00:00+00:00"
            }
    ],
    listFavori: [],
    listDone: []
})
let description = ref({
    description: "1789, glorieuse mais sanglante année pour la France. Notre agence vous envoie en pleine révolution française, les révolutionnaires sont aux portes du monastère de la grande de Chartreuse afin de piller ces lieux. Dans l?urgence les moines sont partis se réfugier. Profitez de cette occasion pour vous infiltrer dans le monastère afin de retrouver la recette de l?Elixir de Chartreuse, la reproduire et la livrer à l?agence."
})
let link = ref({
    link: "https://www.prizoners.com/agence/grenoble/jeux/elixir"
})
// TEST
let image = ref(false)

onMounted(() => {

    // Check if escape's image exist
    const img = new Image()
    img.src = "/escapes/" + escape.value.name.toLowerCase().replaceAll(' ', '-') + ".webp"

    if (img.complete) {

        image.value = true
    } else {

        img.onload = () => {

            image.value = true
        }

        img.onerror = () => {

            image.value = false
        }
    }
})

// Grade section
let changeGrade = ref(false)
let average = ref(3.0)
let grade = ref(0)
let userGrade = ref({
    grade: 2.0
})
const gradeEscape = (data) => {

    grade.value = data
}
const deleteGrade = async () => {

    const { data } = await useFetch("http://127.0.0.1:8000/api/escape/grade/delete/" + escape.value.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
}
const gradeEscapeGame = async () => {

    userGrade.value.grade = grade.value

    const { data } = await useFetch("http://127.0.0.1:8000/api/escape/grade/" + escape.value.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userGrade.value
    })
    if (data.value) {

        changeGrade.value = false
    }
}
const updateGrade = async () => {

    userGrade.value.grade = grade.value
    
    const { data } = await useFetch("http://127.0.0.1:8000/api/escape/grade/update/" + escape.value.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: userGrade.value
    })
    if (data.value) {

        changeGrade.value = false
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

        .login-button {
            padding: 10px;
            font-size: 1rem;
        }
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
        @include flex();
    }

    #list-favori {

        width: 100%;
        @include flex();
    }

    #list-done {

        width: 100%;
        @include flex();
    }
}
</style>