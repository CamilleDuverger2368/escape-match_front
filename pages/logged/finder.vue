<template>
    <div id="finder">
        <section id="search">
            <div id="switcher">
                <button @click="switcher = 'entreprise'" :class="switcher == 'entreprise' ? 'switch left selected' : 'switch left'">entreprise</button>
                <button @click="switcher = 'tag'" :class="switcher == 'tag' ? 'switch right selected' : 'switch right'">tag</button>
            </div>
            <div class="parameters" @click="toggleParameters = !toggleParameters">Parameters</div>
            <div v-show="toggleParameters" class="variables">
                <div class="reset" @click="resetParamters()">Reset Parameters</div>
                <div v-if="parameters.actual === 1" @click="getActualOrNot(0)" class="playable">Playable Actually</div>
                <div v-else @click="getActualOrNot(1)" class="unplayable">Unplayable Actually</div>
                <Input name="Minimum de joueureuses" type="number" id="minimum_player" :data="parameters.nbPlayer" :error="error.nbPlayer" :require="false" @check="checkNbPlayer" />
                <Input name="Prix maximum" type="number" id="maximu_price" :data="parameters.price" :error="error.price" :require="false" @check="checkPrice" />
                <Locks id="level-select" :data="parameters.level" @level="checkLevel" />
                <Input name="Age minimum" type="number" id="minimum_age" :data="parameters.age" :error="error.age" :require="false" @check="checkAge" />
                <Input name="Temps (en min) minimum" type="number" id="minimum_time" :data="parameters.time" :error="error.time" :require="false" @check="checkTime" />
            </div>
        </section>
        <section id="result">
            <div v-if="switcher == 'entreprise' && entreprises != []" id="entreprises">
                <hr/>
                <div class="line" :key="entreprise" v-for="entreprise in entreprises" :id="'item-' + entreprise['entreprise'].id" @click="toggleEscapes(entreprise['entreprise'].id)">
                    <div class="title">
                        <img :alt="'logo ' + entreprise['entreprise'].name" class="image" :src="'/logo/logo-' + entreprise['entreprise'].name.toLowerCase().replaceAll(' ', '-') + '.webp'" />
                        <div class="name">
                            {{ entreprise["entreprise"].name }}
                        </div>
                    </div>
                    <ul :id="'ul-' + entreprise['entreprise'].id">
                        <li v-for="escape in entreprise['escapes']" :key="escape">
                            <nuxt-link :to="'/logged/' + escape.id + '?entreprise=' + entreprise['entreprise'].id" class="escape">
                                <div class="title">{{ escape.name }}</div>
                                <div class="informations">
                                    <div class="info">
                                        <img src="~/public/icones/hourglass.svg" alt="time">
                                        <div>{{ escape.time }} min</div>
                                    </div>
                                    <div class="info">
                                        <img src="~/public/icones/group-team.svg" alt="players">
                                        <div>{{ escape.minPlayer }} to {{ escape.maxPlayer }}</div>
                                    </div>
                                </div>
                            </nuxt-link>
                        </li>
                    </ul>
                    <hr/>
                </div>
            </div>
            <div v-else-if="switcher == 'tag' && tags != []" id="tags">
                <hr/>
                <div class="line" :key="tag" v-for="tag in tags" :id="'item-' + tag['tag'].id" @click="toggleEscapes(tag['tag'].id)">
                    <div class="title">
                        <div class="name">
                            {{ tag["tag"].name }}
                        </div>
                    </div>
                    <ul :id="'ul-' + tag['tag'].id">
                        <li v-for="escape in tag['escapes']" :key="escape">
                            <nuxt-link :to="'/logged/' + escape.id" class="escape">
                                <div class="title">{{ escape.name }}</div>
                                <div class="informations">
                                    <div class="info">
                                        <img src="~/public/icones/hourglass.svg" alt="time">
                                        <div>{{ escape.time }} min</div>
                                    </div>
                                    <div class="info">
                                        <img src="~/public/icones/group-team.svg" alt="players">
                                        <div>{{ escape.minPlayer }} to {{ escape.maxPlayer }}</div>
                                    </div>
                                </div>
                            </nuxt-link>
                        </li>
                    </ul>
                    <hr/>
                </div>
            </div>
            <div v-else class="empty">There is no escape for this search, sorry !</div>
        </section>
    </div>
</template>

<script setup>

const token = useCookie("token")
const runtimeConfig = useRuntimeConfig()
onMounted(() => {

    getEscapes()
})

// Search section
let switcher = ref("entreprise")
let toggleParameters = ref(false)
let parameters = ref({
    nbPlayer: 0,
    price: 0,
    age: 0,
    time: 0,
    level: 0,
    actual: 1
})
let error = ref({
    nbPlayer: '',
    price: '',
    age: '',
    time: ''
})
let tags = ref([])
let entreprises = ref([])
const getEscapes = async () => {

    const { data } = await useFetch(runtimeConfig.public.apiBase + "escape/finder", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.value
        },
        params: {
            nbPlayer: parameters.value.nbPlayer,
            price: parameters.value.price,
            level: parameters.value.level,
            age: parameters.value.age,
            time: parameters.value.time,
            level: parameters.value.level,
            actual: parameters.value.actual
        }
    })

    if (data.value) {

        tags.value = data.value.tags
        entreprises.value = data.value.entreprises
    }
}

// Show section
const toggleEscapes = (id) => {

    let allLi = document.querySelector("#ul-" + id).children
    for (let i = 0; i < allLi.length; i++) {
        
        allLi[i].classList.toggle("appear-li")
    }
}

// Checks section
const checkNbPlayer = (data) => {

    if (parseInt(data)) {

        if (data > 0 && data <= 50) {

            parameters.value.nbPlayer = data
            error.value.nbPlayer = ""
            getEscapes()
        } else {

            error.value.nbPlayer = "You must have between 1 and 50 players."
        }
    } else {

        error.value.nbPlayer = "You must have between 1 and 50 players."
    }
}
const checkPrice = (data) => {

    if (parseInt(data)) {

        if (data > 0 && data < 100) {

            parameters.value.price = data
            error.value.price = ""
            getEscapes()
        } else {

            error.value.price = "You must have a price between 1 and 100 per player."
        }
    } else {

        error.value.price = "You must have a price between 1 and 100 per player."
    }
}
const checkAge = (data) => {

    if (parseInt(data)) {

        if (data > 0 && data < 150) {

            parameters.value.age = data
            error.value.age = ""
            getEscapes()
        } else {

            error.value.age = "Your age must be between 1 and 150 years old."
        }
    } else {

        error.value.age = "Your age must be between 1 and 150 years old."
    }
}
const checkTime = (data) => {

    if (parseInt(data)) {

        if (data > 0 && data < 180) {

            parameters.value.time = data
            error.value.time = ""
            getEscapes()
        } else {

            error.value.time = "Your time must be between 1 and 180 mintues."
        }
    } else {

        error.value.time = "Your time must be between 1 and 180 mintues."
    }
}
const checkLevel = (data) => {

    parameters.value.level = Number(data)
    getEscapes()
}
const getActualOrNot = (data) => {

    parameters.value.actual = data
    getEscapes()
}
const resetParamters = () => {

    parameters.value.nbPlayer = 0
    parameters.value.price = 0
    parameters.value.age = 0
    parameters.value.time = 0
    parameters.value.level = 0
    parameters.value.actual = 1
    getEscapes()
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#finder {

    width: 100%;
    @include flex($direction:column);

    #search {

        width: 100%;
        @include flex($direction:column);

        #switcher {

            width: 50%;
            @include flex();

            .switch {

                width: 50%;
                height: 40px;
                color: $orange;
                @include flex();
                border-right: 1px solid rgba($orange, .7);
                transition: all 0.5s;

                &:hover, &:active {

                    background-color: rgba($orange, .7);
                    color: $white;
                    box-shadow: 0px 0px 0px $orange;
                }
            }

            .left {

                box-shadow: -2px 0px 10px $orange;
                border-radius: 50px 0 0 50px;
            }

            .right {

                border-radius: 0 50px 50px 0;
                box-shadow: 2px 0px 10px $orange;
            }

            .selected {

                background-color: rgba($orange, .7);
                color: $white;
                box-shadow: 0px 0px 0px $orange;
            }

        }

        .parameters {

            margin: 30px auto 0 auto;
            transition: all 0.5s;

            &:hover, &:active {

                color: $orange;
                transition: all 0.5s;
            }
        }

        .variables {

            width: 80%;
            margin: 20px auto;
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-row-gap: 5px;

            .reset {

                margin: 10px auto;
                color: rgba($orange, .7);
                transition: all 0.5s;
                @include flex();

                &:hover, &:active {

                    color: $orange;
                    transition: all 0.5s;
                }
            }

            .playable {

                width: 100%;
                margin-bottom: 20px;
                color: rgba($green, .7);
                transition: all 0.5s;
                @include flex();

                &:hover, &:active {

                    cursor: pointer;
                    color: $green;
                    transition: all 0.5s;
                }
            }

            .unplayable {

                width: 100%;
                margin-bottom: 20px;
                color: rgba($red, .7);
                transition: all 0.5s;
                @include flex();

                &:hover {

                    cursor: pointer;
                    color: $red;
                    transition: all 0.5s;
                }
            }
        }
    }

    #result {

        width: 100%;
        margin: 20px auto;
        @include flex($direction:column);

        #tags, #entreprises, .emtpy {

            width: 100%;
            @include flex($direction:column);

            hr {

                width: 100%;
                color: $orange;
                font-size: 1rem;
                box-shadow: 0 0 10px $orange;
            }

            .line {
                width: 100%;
                @include flex($direction:column);

                .title {
                    width: 100%;
                    margin-top: 25px;
                    @include flex($justify:space-around, $align:center);

                    .image {
                        width: 20%;
                    }

                    .name {
                        width: 60%;
                        z-index: 40;
                        font-size: 1.5rem;
                        text-align: center;
                    }
                }
                
                ul {
                    width: 100%;
                    margin: 15px auto 10px auto;
                    padding: 0;
                    @include flex($direction: column);

                    li {
                        max-height: 0;
                        width: 100%;
                        opacity: 0;
                        list-style: none;
                        border-top: 1px solid $orange;
                        background-color: $black;
                        transition: max-height 0.5s ease-out, opacity 0.4s ease-out 0.1s;
                        color: $white;
                        &:last-child {
                            border-bottom: 1px solid $orange;
                        }

                        &:hover, &:active {
                            background-color: rgba($white, 0.5);
                        }

                        &.appear-li {
                            max-height: 100px;
                            opacity: 1;

                            transition: max-height 0.5s ease-in, opacity 0.4s ease-in 0.1s;
                        }

                        a {
                            width: 100%;
                            margin: 10px auto;
                            @include flex($justify: space-around);

                            .title {
                                width: 50%;
                                margin: unset;
                            }

                            .informations {
                                width: 45%;
                                @include flex($justify: space-around);

                                .info {

                                    width: 50%;
                                    @include flex();

                                    img {

                                        width: 30%;
                                        margin: auto 3px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 450px) {

    #finder {
        #search {
            #switcher {
                width: 40%;
            }

            .variables {
                margin: 10px auto;
                grid-template-columns: repeat(2, 1fr);
                grid-column-gap: 30px;
                grid-row-gap: 20px;

                .playable {
                    margin: 10px auto;
                }
            }
        }

        #result {
            #tags, #entreprises, .emtpy {
                .line {
                    .title {
                        .image {
                            width: 10%;
                        }

                        .name {
                            width: 40%;
                            text-align: start;
                        }
                    }

                    ul {
                        li {
                            a {
                                margin: 20px auto;
                                
                                .title {
                                    width: 60%;
                                }
                            
                                .informations {
                                    width: 40%;

                                    .info {
                                        img {
                                            width: 20%;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 1100px) {

    #finder {
        #search {
            #switcher {
                width: 30%;
            }

            .variables {
                width: 40%;
            }
        }

        #result {
            #tags, #entreprises, .emtpy {
                .line {
                    .title {
                        .image {
                            width: 5%;
                        }
                    }

                    ul {
                        li {
                            a {
                                margin: 20px auto;
                                
                                .title {
                                    width: 70%;
                                }
                            
                                .informations {
                                    width: 20%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>