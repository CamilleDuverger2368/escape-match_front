<template>
    <div class="table-list" :id="id">
      <hr />
      <div class="header">
        <div class="title">{{ headers[0] }}</div>
        <div class="title center">{{ headers[1] }}</div>
        <div class="title">{{ headers[2] }}</div>
      </div>
      <div v-if="list.length > 0"  class="table-body">
        <div v-bind:key="element" v-for="element in list" class="block">
          <hr />
          <div class="line">
            <div v-if="fromEscapePage" class="info">
              <!--TO-DO : remplacer par les bons liens -->
              <nuxt-link v-if="element.user.pseudo" to="/logged/profil" class="footer-link">{{ element.user.pseudo }}</nuxt-link>
              <nuxt-link v-else to="/logged/profil" class="footer-link">{{ element.user.firstname + ' ' + element.user.name }}</nuxt-link>
            </div>
            <div v-else class="info">
              <!--TO-DO : remplacer par les bons liens -->
              <nuxt-link to="/logged/23" class="footer-link">{{ element.escape.name }}</nuxt-link>
            </div>
            <div class="info center">{{ formatDate(element.since) }}</div>
            <div v-if="fromEscapePage" class="info">
              <!--TO-DO : remplacer par les bonnes actions -->
              <nuxt-link to="/logged/profil">Contacter</nuxt-link>
            </div>
            <div v-else class="info">
              <!--TO-DO : remplacer par les bonnes actions -->
              <nuxt-link to="/logged/23">Supprimer</nuxt-link>
              <nuxt-link v-if="toDo" to="/logged/23">Actualiser</nuxt-link>
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
      fromEscapePage: {
          type: Boolean,
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
  </script>
  
  <style lang="scss" scoped>
  @import "~/assets/variables";
  
  .table-list {
  
    width: 100%;
    margin: 30px auto;
    @include flex($direction:column);
  
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
            @include flex();
          }
        }
      }
    }

    .empty {

      @include flex();
    }
  }
  </style>