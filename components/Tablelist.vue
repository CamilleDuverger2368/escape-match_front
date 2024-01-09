<template>
  <div class="table-list" :id="id">
    <hr />
    <div class="header">
      <div class="title">{{ headers[0] }}</div>
      <div class="title center">{{ headers[1] }}</div>
      <div class="title">{{ headers[2] }}</div>
    </div>
    <div v-if="list.length > 0"  :class="page == 'escape' ? 'table-body big' : 'table-body'">
      <div v-bind:key="element" v-for="element in list" class="block">
        <hr />
        <div class="line">
          <div v-if="page == 'escape'" class="info">
            <nuxt-link v-if="element.user.pseudo" :to="'/logged/profil' + element.user.id" class="footer-link">{{ element.user.pseudo }}</nuxt-link>
            <nuxt-link v-else :to="'/logged/profil' + element.user.id" class="footer-link">{{ element.user.firstname + ' ' + element.user.name }}</nuxt-link>
          </div>
          <div v-else class="info">
            <nuxt-link :to="'/logged/' + element.escape.id" class="footer-link">{{ element.escape.name }}</nuxt-link>
          </div>
          <div class="info center">{{ formatDate(element.since) }}</div>
          <div v-if="page == 'escape'" class="info">
            <!--TO-DO : remplacer par les bonnes actions -->
            <nuxt-link to="/logged/profil">Contacter</nuxt-link>
          </div>
          <div v-else-if="page == 'current'" class="info">
            <button @click="emit('delete', element.id)">Supprimer</button>
            <button v-if="toDo" @click="emit('update', element.id)">Actualiser</button>
          </div>
          <div v-else class="info">
            <!--TO-DO : remplacer par les bonnes actions -->
            <nuxt-link to="/logged/profil">Contacter</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="table-body empty">This list is empty !</div>
  </div>
</template>
  
<script setup>
import dayjs from "dayjs"

const props = defineProps({
    headers: {
        type: Array,
        require: true
    },
    list: {
        type: Array,
        require: true
    },
    id: {
        type: String,
        require: true
    },
    page: {
        type: String,
        require: true
    },
    toDo: {
        type:Boolean,
        require: false,
        default: false
    }
})

const formatDate = (dateString) => {
  
  const date = dayjs(dateString);
  return date.format("DD-MM-YYYY");
}

const emit = defineEmits(["delete", "udpate"])
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.table-list {

  width: 100%;
  margin: 30px auto;
  @include flex($direction:column, $justify:flex-start);

  hr {

    width: 90%;
    color: $orange;
    font-size: 1rem;
  }

  .center {

    border-left: solid 1px $orange;
    border-right: solid 1px $orange;
  }
  .header {

    width: 100%;
    @include flex($justify:space-around);

    .title {

      width: 33%;
      font-weight: bolder;
      font-style: italic;
      @include flex();
    }
  }

  .table-body {

    width: 100%;
    height: 25vh;
    overflow-y: scroll;
    @include flex($direction:column, $justify:flex-start);

    .block {

      width: 100%;
      @include flex($direction:column);

      .line {

        width: 100%;
        @include flex($justify:space-around);

        .info {

          width: 33%;
          @include flex($direction:column);

          button {

            @include button($paddingY:5px, $paddingX:10px, $marge:10px auto);
          }
        }
      }
    }
  }

  .big {

    height: 45vh;
  }

  .empty {

    @include flex();
  }
}
</style>