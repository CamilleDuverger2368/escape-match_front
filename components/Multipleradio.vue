<template>
    <div class="radio-buttons">
        <div class="title">{{ title }}</div>
        <div class="buttons">
            <div class="button" :key="option" v-for="option in options" :value="option">
                <input type="radio" name="checkbox" class="check" :id="'radio_' + option" :value="option" v-model="model"/>
                <label :for="'radio_' + option">
                    <div class="container">
                        <div class="cRadioBtn">
                        <div class="overlay"></div>
                        <div class="drops xsDrop"></div>
                        <div class="drops mdDrop"></div>
                        <div class="drops lgDrop"></div>
                        </div>
                    </div>
                    <h2>{{ option }}</h2>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        require: true
    },
    options: {
        type: Array,
        require: true
    },
    data: {
        type: String,
        require: true
    }
})

const emit = defineEmits(["radio"])
let model = computed({
    
    get() {

        return props.data
    },

    set(value) {

        emit("radio", value)
    }
})
</script>

<style lang="scss" scoped>
@import "~/assets/variables";

.radio-buttons {
    width: 100%;
    margin: 15px auto;
    @include flex($direction:column);

    .title {
        width: 100%;
        @include flex();
        font-size: x-large;
        font-weight: bolder;
    }

    .buttons {
        width: 100%;
        @include flex();
    }
}

input[type="radio"] {
    display: none;
}

label {
    display: flex;
    margin: auto 10px;
    gap: 5px;
    align-items: center;
}

.container {
    width: 20px;
    aspect-ratio : 1;
    overflow : hidden;
    border-radius : 50%;
}

.cRadioBtn {
    @include flex();
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: $black;
    position: relative;
    border: solid 5px rgba($orange, 0.7);
    box-sizing: border-box;
    transition: all 0.1s ease-in;
    cursor: pointer;

    &:hover {
        border: solid 8px rgba($orange, 0.7);
    }
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: $black;
}

.check:checked + label > .container > .cRadioBtn > .overlay {
  background: $black;
  animation: shrink 0.3s ease-in-out forwards;
}

.check:checked + label > .container  > .cRadioBtn {
  background: rgba($orange, 0.7);
  border-color: rgba($orange, 0.7);
}

.drops {
  position: absolute;
  background: $black;
  top: -100%;
  left: 50%;
  transform: translate(-50%);
  border-radius: 50%;
  aspect-ratio: 1;
}

.lgDrop {
  width: 50%;
}

.xsDrop {
  width: 20%;
}

.mdDrop {
  width: 30%;
}

.check:checked + label > .container  > .cRadioBtn > .lgDrop {
  animation: drop 0.5s ease-in-out forwards;
}

.check:checked + label > .container  > .cRadioBtn > .mdDrop {
  animation: drop 0.8s ease-in forwards;
}

.check:checked + label > .container  > .cRadioBtn > .xsDrop {
  animation: drop 0.9s linear forwards;
}

@keyframes drop {
  0% {
    top: -100%;
  }
  50% {
    top: -100%;
  }
  75% {
    top: 10%;
  }
  100% {
    top: 25%;
  }
}

@keyframes shrink {
  0% {
    width: 100%;
  }
  100% {
    width: 0px;
  }
}
</style>