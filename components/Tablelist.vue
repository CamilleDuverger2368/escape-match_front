<template>
    <div class="table-list" :id="id">
      <div class="header">
        <div class="title">{{ headers[0] }}</div>
        <div class="title">{{ headers[1] }}</div>
        <div class="title">{{ headers[2] }}</div>
      </div>
      <div v-bind:key="element" v-for="element in list" v-if="list !== []" class="ligne">
        <div v-if="fromEscapePage" class="info">
          <!--TO-DO : remplacer par les bons liens -->
          <nuxt-link v-if="element.user.pseudo" to="/logged/profil" class="footer-link">{{ element.user.pseudo }}</nuxt-link>
          <nuxt-link v-else to="/logged/profil" class="footer-link">{{ element.user.firstname + ' ' + element.user.name }}</nuxt-link>
        </div>
        <div v-else class="info">
          <!--TO-DO : remplacer par les bons liens -->
          <nuxt-link to="/logged/23" class="footer-link">{{ element.escape.name }}</nuxt-link>
        </div>
        <div class="info">{{ element.since }}</div>
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
      <div v-else class="ligne">This list is empty, be the first !</div>
    </div>
  </template>
  
  <script setup>
  
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
  </script>
  
  <style>
  @import "~/assets/variables";
  
  .table-list {
  
    width: 100;
    height: 25vh;
    overflow-y: scroll;
    @include flex($diretion:column);
  
    .header {
  
      width: 100%;
      @include flex();
    }
  
    .ligne {
  
      width: 100%;
      @include flex();
    }
  }
  </style>