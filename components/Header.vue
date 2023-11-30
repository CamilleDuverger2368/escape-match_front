<template>
    <div id="header">
        <nav class="container">
            <img alt="logo" class="image" src="/favicon.ico" />
            <div class="links" @click="openNav()">
                <span class="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span> 
            </div>
        </nav>
        <div id="menu-items" class="inactive">
            <button @click="closeNav()">X</button>
            <!-- TO-DO : Ajouter une condition qui checke si l'utilisateur est logged ou non pour les differents liens -->
            <LinkMenu link="test" name="S'inscrire"/>
            <LinkMenu link="test" name="Se Connecter"/>
        </div>
    </div>
</template>

<script setup>

function openNav() {
    document.getElementById("menu-items").classList.remove("inactive");
    document.getElementById("menu-items").classList.add("active");
}

function closeNav() {
    document.getElementById("menu-items").classList.remove("active");
    document.getElementById("menu-items").classList.add("inactive");
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.inactive {
    transform: translate(-100vw);
}

.active {
    transform: translate(0vw);
}

#header {
    position: sticky;
    top: 0;
    width: 100%;
    // TO-DO : Retirer le test
    box-shadow: 0 5px 5px $orange;
    @include flex($direction:column);

    nav {
        width: 100%;
        padding: 2vh 5vw;
        @include flex($justify: space-between);

        .links {
            border-radius: 50%;
            box-shadow: 0 0 10px $orange;
            padding: 7px 5px;
            transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;

            .burger-icon {

                span {
                    display: block;
                    width: 20px;
                    height: 1px;
                    background-color: $orange;
                    margin: 5px;
                    transition: background-color 0.3s ease-in-out;
                }

                &:hover, &:active {

                    span {
                        background-color: $black;
                    }
                }
            }

            &:hover, &:active {
                box-shadow: 0 0 0 $orange;
                background-color: $orange;
            }
        }
    }

    #menu-items {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        z-index: 42;
        @include flex($direction:column);
        // background-color: rgba($color: #000000, $alpha: 0.5);
        background-color: $black;
        transition: transform 0.5s ease-in-out;

        button {
            position: fixed;
            top: 3vh;
            right: 6vw;
            font-weight: 900;
            color: $orange;
        }
    }
}
</style>