<template>
    <div id="escape">
        <section id="title">
            <div class="composition">
                <img :alt="'escape ' + escape.name" :src="file_exists('/public/escapes/' + escape.name.toLowerCase().replaceAll(' ', '-') + '.webp') ? '/escapes/' + escape.name.toLowerCase().replaceAll(' ', '-') + '.webp' : '/escapes/no-image-found.webp'" />
                <h1 class="name">{{ escape.name }}</h1>
            </div>
        </section>
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
            {# TO-DO : Ajouter la note moyenne de l'escape #}
            <div class="info">
                <div>~ {{ escape.price }}</div>
                <img src="~/public/icones/euro.svg" alt="price">
            </div>
            {# END TO-DO #}
            <a :href="link.link" class="footer-link">The escape is here !</a>
        </section>
    </div>    
</template>

<script setup>
import * as path from "node:path"
import * as fs from "node:fs"

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
    tags: []
})
let description = ref({
    description: "1789, glorieuse mais sanglante année pour la France. Notre agence vous envoie en pleine révolution française, les révolutionnaires sont aux portes du monastère de la grande de Chartreuse afin de piller ces lieux. Dans l?urgence les moines sont partis se réfugier. Profitez de cette occasion pour vous infiltrer dans le monastère afin de retrouver la recette de l?Elixir de Chartreuse, la reproduire et la livrer à l?agence."
})
let link = ref({
    link: "https://www.prizoners.com/agence/grenoble/jeux/elixir"
})
// TEST

// Check if escape's image exist
const file_exists = (filename) => {

    const filePath = path.join(process.cwd(), filename)
    if (fs.readFileSync(filePath)) {

        return filename
    } else {

        return null
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

#escape {
    
    width: 100%;
    @include flex($direction:column);

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
            }
        }
    }
}
</style>