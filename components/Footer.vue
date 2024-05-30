<template>
    <footer>
        <div class="links">
            <div class="informations">
                <!-- TO-DO : Remplacer par le systeme de navigation de nuxt -->
                <a class="footer-link">CGU</a>
            </div>
            <div class="usefull">
                <nuxt-link to="/login" class="footer-link">Connexion</nuxt-link>
                <nuxt-link to="/register" class="footer-link">Inscription</nuxt-link>
            </div>
        </div>
        <div class="creator">Made with love by Grandma</div>
    </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import "~/assets/variables";

footer {
    width: 100vw;
    box-shadow: 0 -5px 5px $orange;
    @include flex($direction:column, $justify:space-around);

    .links {
        width: 100%;
        margin: 10px auto;
        @include flex($justify:flex-start, $align:flex-start);

        .informations {
            width: 50%;
            @include flex($direction:column, $justify:flex-start);
        }

        .usefull {
            width: 50%;
            @include flex($direction:column, $justify:flex-start);
        }
    }

    .creator {
        width: 100%;
        font-style: italic;
        opacity: .5;
        margin: 10px auto;
        @include flex();
    }
}
</style>