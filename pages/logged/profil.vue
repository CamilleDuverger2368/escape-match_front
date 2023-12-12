<template>
    <div id="profil">
        <Avatar :color="color" page="profil"/>
        <div id="slider-menu">
            <div class="slider informations" @click="openInfo = true">
                <!-- TEST -->
                boubou
                <!-- TEST -->
            </div>
            <div class="slider lists" @click="openList = true">
                <!-- TEST -->
                bebeow
                <!-- TEST -->
            </div>
            <div class="slider success" @click="openSuccess = true">
                <!-- TEST -->
                bibou
                <!-- TEST -->
            </div>
            <div class="slider conversations"  @click="openConv = true">
                <!-- TEST -->
                babou
                <!-- TEST -->
            </div>
        </div>
        <div id="menu-informations" :class="openInfo ? 'active' : 'inactive-left'">
            <button class="close" @click="openInfo = false">X</button>
            <div class="info">
                <div class="name">{{ user.firstname }} {{ user.name }}</div>
                <div v-if="user.pseudo" class="pseudo"> aka {{ user.pseudo }}</div>
                <div class="classic">{{ user.email }}</div>
                <div v-if="user.age" class="classic">{{ user.age }} years old</div>
                <div v-if="user.profil" :class="user.profil">{{ user.profil }}</div>
                <div v-else class="no-profil">No Profil</div>
                <div class="classic">{{ user.city }}</div>
                <!-- TEST -->
                <ul v-if="user.level">
                    <li class="sk-cms"><span>level {{ user.level }}</span></li>
                </ul>
                <ul v-else>
                    <li class="sk-cms"><span>Start your adventure to level up !</span></li>
                </ul>
                <!-- TEST -->
            </div>
            <button class="login-button" type="submit">Modifier</button>
        </div>
        <div id="menu-lists" :class="openList ? 'active' : 'inactive-right'">
            <button @click="openList = false">X</button>
        </div>
        <div id="menu-success" :class="openSuccess ? 'active' : 'inactive-left'">
            <button @click="openSuccess = false">X</button>
        </div>
        <div id="menu-conversations" :class="openConv ? 'active' : 'inactive-right'">
            <button @click="openConv = false">X</button>
        </div>
    </div>
</template>

<script setup>

let color = ref("#FF7A00")

// Menu's section
let openInfo = ref(false)
let openList = ref(false)
let openSuccess = ref(false)
let openConv = ref(false)

let cities = ref([])

// TEST
let user = ref({
    id: 1,
    email: "test@mail.com",
    name: "Testouille",
    firstname: "Test",
    pseudo: "Boubou",
    age: 25,
    level: 1,
    grade: 5,
    pronouns: "They",
    profil: "",
    city: "Paris"
})
// TEST

onMounted(async () => {

    // TO-DO : passer les adresses par variable et non en dur
    const { data } = await useFetch('http://127.0.0.1:8000/api/unlog/cities', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (data.value) {

        for(let i = 0; i < data.value.length; i++) {

            cities.value.push(data.value[i].name)
        }
    }
})

</script>

<style lang="scss" scoped>
@import "~/assets/variables";

// TEST

@keyframes start {
	100% {
		width: calc(calc(var(--per) * 1%) - 2px);
	}
}
// TEST

.inactive-left {
    transform: translate(-100vw);
}

.inactive-right {
    transform: translate(100vw);
}

.active {
    transform: translate(0vw);
}

#profil {

    width: 100%;
    @include flex();

    #slider-menu {
        width: 100%;
        position: absolute;
        height: 70vh;

        .slider {
            position: absolute;
            // TEST
            background-color: rgba($green, .5);
            // TEST
            width: 50px;
            height: 50px;
            transition: 0.3s ease-in-out;

            &:hover, &:active {
                width: 75px;
            }
        }

        .informations, .success {
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }

        .lists, .conversations {
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }

        .informations {
            top: 0;
            left: 0;
        }

        .lists {
            top: 0;
            right: 0;
        }

        .success {
            bottom: 0;
            left: 0;
        }

        .conversations {
            bottom: 0;
            right: 0;
        }
    }

    #menu-informations {
        width: 100vw;
        position: fixed;
        background-color: $black;
        height: 70vh;
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        .close {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
            color: $orange;
        }

        .info {
            width: 100%;
            margin-bottom: 30px;
            @include flex($direction:column);
            
            .name {
                font-size: 3rem;
                margin: 10px auto 0 auto;
            }

            .pseudo {
                font-size: 1rem;
                font-style: italic;
                margin: 0 auto 10px auto;
            }

            .classic {
                font-size: 1.5rem;
                margin: 10px auto;
            }

            .Solver {
                border-radius: 50px;
                box-shadow: 0 0 10px $green;
                background-color: rgba($green, .7);
                padding: 15px 35px;
                color: $black;
                font-size: 1.25rem ;
                margin: 10px auto;
            }

            .Leader {
                border-radius: 50px;
                box-shadow: 0 0 10px $red;
                background-color: rgba($red, .7);
                padding: 15px 35px;
                color: $black;
                font-size: 1.25rem ;
                margin: 10px auto;
            }

            .Searcher {
                border-radius: 50px;
                box-shadow: 0 0 10px $orange;
                background-color: rgba($orange, .7);
                padding: 15px 35px;
                color: $black;
                font-size: 1.25rem ;
                margin: 10px auto;
            }

            .no-profil {
                border-radius: 50px;
                box-shadow: 0 0 10px $white;
                background-color: rgba($white, .7);
                padding: 15px 35px;
                color: $black;
                font-size: 1.25rem ;
                margin: 10px auto;
            }

            ul {
                width: 100%;
                position: relative;
                padding: 25px 35px;

                li {
                    --per: 50;
                    --dur: calc(calc(var(--per) / 100) * 1.5s);
                    list-style: none;
                    padding: 20px 0;
                    position: relative;
                    font-size: 1.5rem;
                    color: $white;
                    width: 100%;

                    &:before {
                        content: "";
                        position: absolute;
                        background: $black;
                        height: 1rem;
                        width: 100%;
                        left: 0;
                        bottom: 0;
                        border-radius: 5px;
                        border: 1px solid #111;
                        border-color: #111 #323232 #323232 #111;
                        --track: #2292dd40;
                        background: linear-gradient(
                            90deg,
                            var(--track) calc(calc(var(--per) * 1%) + 4px),
                            #1c1c1c calc(calc(var(--per) * 1%) + 4px)
                        );
                    }

                    &:after {
                        content: "";
                        height: 11px;
                        margin: 0 0 2px 0;
                        background: $green;
                        position: absolute;
                        box-shadow: 0px 0px 10px 1px #00c6ff66;
                        left: 3px;
                        width: 0%;
                        bottom: 0;
                        transition: all var(--dur) ease 0s;
                        animation: start 1s ease 0s 2 alternate;
                    }

                    // Analyse en est la
                    &:hover, &:active {
                        filter: brightness(1.5);
	                    transition: all 0.5s ease 0s;
                    }

                    &:hover span:before,
                    ul li span:before {
                        transition: all 0.5s ease 0s;
                        right: calc(calc(calc(100 - var(--per)) * 1%) - 12px);
                        opacity: 1;
                        border-right-color: #2187e7;
                    }

                    span {
                        font-weight: 500;

                        &:before {
                            position: absolute;
                            right: -25px;
                            top: 43px;
                            transition: all 0.5s ease 0s;
                            content: "";
                            opacity: 1;
                            border: 7px solid #fff0;
                        }

                        &:after {
                            position: absolute;
                            right: -40px;
                            top: 38px;
                            transition: all 0.5s ease 0s;
                            counter-reset: percent var(--per);
                            /*content: counter(percent) "%";*/
                            content: counter(percent);
                            color: #222;
                            opacity: 1 !important;
                            padding: 4px 6px;
                            border-radius: 1px;
                            font-weight: bold;
                            pointer-events: none;
                        }
                    }
                }

                &:hover li:after,
                label:hover + ul li:after,
                input:checked + label + ul li:after {
                    width: calc(calc(var(--per) * 1%) - 2px);
                }

                &:hover span:after,
                .profile-skills input:checked + label + ul li span:after {
                    transition: all 0.5s ease 0s;
                    right: calc(calc(85 - var(--per)) * 1%);
                    right: calc(calc(calc(100 - var(--per)) * 1%) - 40px);
                    opacity: 1;
                    background: #2187e7;
                }
            }
        }
    }

    #menu-lists {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }

    #menu-success {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }

    #menu-conversations {
        width: 100vw;
        position: fixed;
        // TEST
        background-color: rgba($orange, .5);
        height: 70vh;
        // TEST
        @include flex($direction:column);
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
        }
    }
}
</style>