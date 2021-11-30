<template>
  <div id="app" :class="{'tuto-open': tutoOpen, 'is-moving': isMoving}">
    <Tuto :tuto-open.sync="tutoOpen" :help-list="helpList" @update:tutoOpen="onCloseTuto"></Tuto>
    <div class="content-container" :style="cssVars">
      <timeline @click:indice="onClickIndice" />
      <div class="house-container" id="house-container">
        <h2>Habitat individuel</h2>
        <div class="box-tank" id="house-box">
          <Box v-for="house in houseList" :key="house.id" :id="house.id"/>
        </div>
      </div>
      <div class="building-container" id="building-container">
        <h2>Habitat collectif</h2>
        <div class="box-tank" id="building-box">
          <Box v-for="building in buildingList" :key="building.id" :id="building.id"/>
        </div>
      </div>
      <div class="presentation-container">
        <h1>Le jeu du temps</h1>
        <div class="logo-container"></div>
      </div>
    </div>
    <div id="tools-container" class="tools-container">
      <h3>Barre d'outils</h3>
      <div class="buttons-container">
        <button @click="toggleFullScreen" class="btn btn-inverse btn-fullscreen"
                v-tooltip.right="fullscreenHelp">
          <svg v-if="!isFullscreen" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 448 512" width="20">
            <path fill="currentColor"
                  d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path>
          </svg>
          <svg v-if="isFullscreen" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 352 512">
            <path fill="currentColor"
                  d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
          </svg>
        </button>
        <button @click="openGlobalHelp" class="btn btn-inverse" v-tooltip.right="'Besoin d\'aide pour jouer ?'">
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
               width="20">
            <path fill="currentColor"
                  d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path>
          </svg>
        </button>
      </div>
      <image-tank
          id="image-tank"
          :img-list="imgList"/>
    </div>
    <modal v-if="showModal"
           :state="modalState"
           @close="showModal = false">
      <template v-slot:body>
        <h3 v-if="modalContent">{{ modalContent }}</h3>
        <p v-if="!modalHtml">
          <svg v-if="modalState === 'success'" aria-hidden="true" focusable="false" role="img"
               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor"
                  d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
          </svg>
          <svg v-else aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512 512">
            <path fill="currentColor"
                  d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path>
          </svg>
        </p>
        <div class="modal-content" v-if="modalHtml" v-html="modalHtml"></div>
      </template>
    </modal>
  </div>
</template>

<script>
import Box from "@/components/Box";
import ImageTank from "@/components/ImageTank";
import Modal from "@/components/Modal";
import Tuto from "@/components/Tuto";
import Timeline from "./components/Timeline";

// let edgeSize = 200;
// let timer = null;

export default {
  name: 'App',
  components: {
    Timeline,
    Box,
    ImageTank,
    Modal,
    Tuto
  },
  data() {
    return {
      pos: {
        top: 0,
        left: 0,
        x: 0,
        y: 0
      },
      houseList: [],
      buildingList: [],
      imgList: [],
      helpList: [],
      showModal: false,
      modalHtml: null,
      modalContent: null,
      modalState: 'success',
      isFullscreen: false,
      fullscreenHelp: 'Afficher en plein écran',
      publicPath: process.env.BASE_URL,
      tutoOpen: false,
      isMoving: false,
      houseH2Position: 0,
      buildingH2Position: 0,
      friseHelp: []
    }
  },
  created() {
    window.addEventListener("resize", this.windowsResize);
  },
  mounted() {
    const baseUrl = process.env.BASE_URL;

    fetch(`${baseUrl}data/data.json`, {mode: 'cors'})
        .then(resp => resp.json())
        .then((data) => {
          this.imgList = this.shuffle(data.imgList);
          this.houseList = data.cards.houseList;
          this.buildingList = data.cards.buildingList;
          this.helpList = data.globalHelp;
          this.friseHelp = data.friseHelp;
        });

    // Handle the mouseevent to scroll the window when grab
    this.enableScroll();

    // Handle the image add ok event
    this.$on('image:added', (id) => {
      this.imgList.splice(this.imgList.findIndex(img => img.id === id), 1);
      this.showModal = true;
      this.modalHtml = null;
      this.modalContent = 'Bravo !';
      this.modalState = 'success';
    });

    // Handle the image add not ok event
    this.$on('image:error', () => {
      this.showModal = true;
      this.modalHtml = null;
      this.modalContent = 'Désolé ce n\'est pas la bonne image !';
      this.modalState = 'error';
    });

    this.$on('open:modal', (id) => {
      const building = this.imgList.find((img) => img.id === id);
      const help = building.help ?? 'Aide sur la maison';
      const name = building.name;
      this.showModal = true;
      this.modalContent = null;
      this.modalHtml = `<img src="${this.publicPath}images/${name}" alt="" /><div>${help}</div>`;
      this.modalState = 'info';
    });

    this.$on('image-drag:start', this.disableScroll);
    this.$on('image-drag:stop', this.enableScroll);

    this.tutoOpen = true;

    this.placeLists();
  },
  destroyed() {
    window.removeEventListener("resize", this.windowsResize);
  },
  computed: {
    cssVars() {
      return {
        '--h2-house-position': this.houseH2Position + 'px',
        '--h2-building-position': this.buildingH2Position + 'px'
      }
    }
  },
  methods: {
    disableScroll() {
      window.removeEventListener("mousedown", this.handleMouseDown, false);
    },
    enableScroll() {
      window.addEventListener("mousedown", this.handleMouseDown, false);
    },
    openGlobalHelp() {
      window.scrollTo(0, 0);
      this.tutoOpen = !this.tutoOpen;
    },
    // Used to toggle window on/off fullscreen
    toggleFullScreen() {
      let elem = document.documentElement;
      if (!this.isFullscreen) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
        this.fullscreenHelp = 'Arrêter le plein écran';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
      }

      this.isFullscreen = !this.isFullscreen;
    },
    // Used to handle window move with mouse move.
    handleMousemove(event) {
      // How far the mouse has been moved
      const dx = event.clientX - this.pos.x;

      // Scroll the element
      document.documentElement.scrollLeft = this.pos.left - dx;
    },
    handleMouseDown(event) {
      this.pos = {
        // The current scroll
        left: document.documentElement.scrollLeft,
        // Get the current mouse position
        x: event.clientX,
      };

      this.isMoving = true;

      window.addEventListener('mousemove', this.handleMousemove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp() {
      this.isMoving = false;
      window.removeEventListener('mousemove', this.handleMousemove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    },
    shuffle(array) {
      let currentIndex = array.length, randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    },
    onCloseTuto() {
      this.placeLists();
    },
    placeLists() {
      const h2House = this.$el.querySelector('#house-container h2');
      const houseIndice = this.$el.querySelector('#indice001').getBoundingClientRect().left;
      // const buildingIndice = this.$el.querySelector('#indice007').getBoundingClientRect().left;
      const toolsContainerWidth = 180;
      const gridGap = 12.8;
      let houseContainerWidth = 0;
      if(this.$el.querySelector('.box')) {
        houseContainerWidth = this.$el.querySelector('.box').clientWidth;
      }

      this.houseH2Position = houseIndice - (toolsContainerWidth + h2House.clientWidth + houseContainerWidth + gridGap / 2);
      this.buildingH2Position = this.houseH2Position  + h2House.clientWidth + houseContainerWidth * 3 + gridGap;
    },
    windowsResize() {
      this.placeLists();
    },
    onClickIndice(indiceId) {
      const friseHelp = this.friseHelp.find((help) => help.id === indiceId);
      if(!friseHelp) return;
      const help = friseHelp.content ?? 'Aucune aide disponible pour le moment';
      const date = friseHelp.date ?? '';
      this.showModal = true;
      this.modalContent = date;
      this.modalHtml = help;
      this.modalState = 'info';
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/variables';

$friseHeight: 27.4vh;
$caseHeight: 23vh;
$caseWidth: $caseHeight * .7;
#app {
  cursor: grab;
  padding-left: 180px;

  &.is-moving {
    cursor: grabbing;
    user-select: none;
  }

  &.tuto-open {
    overflow: hidden;
    max-width: calc(100% - 180px);

    & .timeline,
    & .house-container,
    & .building-container {
      overflow: hidden;
      width: 100%;
    }
  }
}

.content-container {
  display: grid;
  grid-template-rows: $friseHeight repeat(2, $caseHeight);
  grid-template-columns: 1fr;
  grid-gap: 2vh;
}

.tools-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  left: 0;
  height: 100%;
  width: 150px;
  padding: .6em;
  background-color: $primary;
  z-index: 20;

  h3 {
    color: #ffffff;
    text-align: center;
    font-size: 16px;
    margin-left: 0;
  }

  .buttons-container {
    .btn {
      margin: 1em 0;
      width: 3.3em;
      height: 3.3em;
      display: flex;
      justify-content: center;
      align-items: center;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.timeline {
  margin-bottom: 2rem;
  img {
    height: 23.82vh;
    width: auto;
    float: left;
  }
  svg {
    height: 23.82vh;
    width: auto;
    float: left;
  }
}

.house-container,
.building-container {
  display: flex;
  align-items: flex-end;

  h2 {
    display: flex;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    align-self: center;
    margin: 0;
  }

  .box-tank {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(40, $caseWidth);
    grid-column-gap: .8rem;
  }
}

.house-container {
  h2 {
    margin-left: var(--h2-house-position);
  }
}

.building-container {
  h2 {
    margin-left: var(--h2-building-position);
  }
}

.presentation-container {
  position: fixed;
  bottom: 0;
  left: 200px;
  padding: 1rem 0;
}
</style>
