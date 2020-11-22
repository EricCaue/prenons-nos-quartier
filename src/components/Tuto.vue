<template>
  <div class="tuto-container" :class="{'hidden': !isOpen}">
    <canvas ref="tutorialCanvas" :width="windowWidth" :height="windowHeight"></canvas>
    <div class="navigation-container">
      <div ref="navigationElement" class="navigation-element">
        <div>
          <ul>
            <li v-for="step in steps"
                :key="step.id"
                :class="{'current': step.id === currentStep, 'past': pastStep.includes(step.id)}"
                @click="changeStep(step.id)"></li>
          </ul>
        </div>
        <div class="pr-tutorial-buttons">
          <button :disabled="currentStep === this.steps.length - 1"
                  @click="changeStep(currentStep + 1)">
            Suivant
          </button>
          <button @click="closeTuto">Fermer</button>
        </div>
      </div>
    </div>
    <div ref="explanationElement" data-alignment="t"
         class="pr-tutorial-explain">
      <h2 class="font-semibold uppercase mb-2">{{ title }}</h2>
      <p v-html="message"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tuto",
  components: {},
  props: {
    tutoOpen: {
      type: Boolean
    }
  },
  data() {
    return {
      isOpen: this.tutoOpen,
      steps: [
        {
          id: 0,
          text: ''
        },
        {
          id: 1,
          text: ''
        },
        {
          id: 2,
          text: ''
        },
        {
          id: 3,
          text: ''
        },
        {
          id: 4,
          text: ''
        }
      ],
      canvas: null,
      context: null,
      windowWidth: window.outerWidth,
      windowHeight: window.outerHeight,
      currentStep: 0,
      pastStep: [],
      title: '',
      message: ''
    }
  },
  created() {
    window.addEventListener("resize", this.windowResize);
  },
  mounted() {
    this.init();
    if (this.tutoOpen) {
      setTimeout(() => {
        this.placeExplanation(this.$refs.navigationElement, 't');
      }, 10)
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.windowResize);
  },
  watch: {
    tutoOpen(newVal) {
      this.isOpen = newVal;
      setTimeout(() => {
        this.placeExplanation(this.$refs.navigationElement, 't');
      }, 10)
    }
  },
  methods: {
    init() {
      this.pastStep = [];
      this.currentStep = 0;
      this.title = 'Prenons nos quartier qu\'est ce ?';
      this.message = 'Cliquez sur <b>Suivant</b> pour faire un rapide tour.';
      this.context = this.$refs.tutorialCanvas.getContext('2d');
      this.fillCanvas();
    },
    closeTuto() {
      this.isOpen = false;
      this.$emit('update:tutoOpen', this.isOpen);
      this.init();
    },
    windowResize() {
      this.windowWidth = window.outerWidth;
      this.windowHeight = window.outerHeight;
      this.changeStep(this.currentStep);
    },
    fillCanvas() {
      this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
      this.context.fillStyle = 'rgba(0,0,0,.5)';
      this.context.fillRect(0, 0, this.windowWidth, this.windowHeight);
    },
    changeStep(step) {
      this.currentStep = step;

      // Elements init
      let designsLinkContainer = document.getElementById('timeline');
      let designsLinkContainerPosition = designsLinkContainer.getBoundingClientRect();

      let deviceLinkContainer = document.getElementById('house-container');
      let deviceLinkContainerPosition = deviceLinkContainer.getBoundingClientRect();

      let orientationLinkContainer = document.getElementById('tools-container');
      let orientationLinkContainerPosition = orientationLinkContainer.getBoundingClientRect();

      let viewerContainer = document.getElementById('image-tank');
      let viewerContainerPosition = viewerContainer.getBoundingClientRect();

      let elementToPlaceExplanation = this.$refs.navigationElement;
      let align = 't';

      // Style init
      this.context.strokeStyle = 'rgb(79, 209, 197)';
      this.fillCanvas();

      switch (step) {
        case 0:
          this.title = 'Prenons nos quartier qu\'est ce ?';
          this.message = 'Cliquez sur <b>Suivant</b> pour faire un rapide tour.';
          align = 't';
          elementToPlaceExplanation = this.$refs.navigationElement;
          this.pastStep = [];
          break;
        case 1:
          this.title = 'La timeline';
          this.message = '<b>La timeline</b> est la ligne temporelle sur laquelle sont basées les différentes constructions.';
          align = 'b';
          elementToPlaceExplanation = designsLinkContainer;
          this.pastStep = [0];
          this.createHighlightedZone(designsLinkContainerPosition, designsLinkContainer);
          break;
        case 2:
          this.title = 'Les cases bâtiments';
          this.message = 'C\'est ici que vous allez devoir déposer les images de bâtiments que vous pensez correspondre à la bonne époque.';
          align = 'b';
          elementToPlaceExplanation = deviceLinkContainer;
          this.pastStep = [0, 1];
          this.createHighlightedZone(deviceLinkContainerPosition, deviceLinkContainer);
          break;
        case 3:
          this.title = 'La barre d\'outils';
          this.message = 'Ici vous trouverez le bouton pour passer en plein écran. <br />Le bouton d\'aide si vous voulez revoir ce tutoriel. <br />Les différentes images que vous allez avoir à placer en dessous de la frise.';
          align = 'r';
          elementToPlaceExplanation = orientationLinkContainer;
          this.pastStep = [0, 1, 2];
          this.createHighlightedZone(orientationLinkContainerPosition, orientationLinkContainer);
          break;
        case 4:
          this.title = 'La liste des bâtiments';
          this.message = 'C\'est ici que vous allez retrouver tous les bâtiments (maison et immeuble) à placer sur la frise. <br /> pour les placer, il vous suffit de cliquer sur l\'image et de la glisser vers l\'endroit voulu.';
          align = 'r';
          elementToPlaceExplanation = viewerContainer;
          this.pastStep = [0, 1, 2, 3];
          this.createHighlightedZone(viewerContainerPosition, viewerContainer);
          break;
      }
      setTimeout(() => {
        this.placeExplanation(elementToPlaceExplanation, align);
      }, 50)
    },
    createHighlightedZone(position, element) {
      this.context.clearRect(position.left, position.top, element.offsetWidth, element.offsetHeight);
      this.context.strokeRect(position.left, position.top, element.offsetWidth, element.offsetHeight);
    },
    placeExplanation(element, align) {
      let position = element.getBoundingClientRect();
      let x = position.left + element.offsetWidth / 2 - this.$refs.explanationElement.offsetWidth / 2;
      let y = position.top - this.$refs.explanationElement.offsetHeight - 20;

      switch (align) {
        case 't':
          this.$refs.explanationElement.dataset.alignment = align;
          break;
        case 'r':
          this.$refs.explanationElement.dataset.alignment = align;
          x = position.right + 20;
          y = position.top + element.offsetHeight / 2 - this.$refs.explanationElement.offsetHeight / 2;
          break;
        case 'b':
          this.$refs.explanationElement.dataset.alignment = align;
          y = position.bottom + 20;
          break;
        default:
          delete this.$refs.explanationElement.dataset.alignment;
          x = position.left + element.offsetWidth / 2 - this.$refs.explanationElement.offsetWidth / 2;
          y = document.body.clientHeight / 2 - this.$refs.explanationElement.offsetHeight / 2;
          break;
      }

      this.$refs.explanationElement.style.transform = "translate(" + x + "px," + y + "px)";
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/variables';

.tuto-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 1, 1);
  z-index: 50;

  &.hidden {
    display: none;
  }


  .navigation-container {
    position: fixed;
    left: 0;
    bottom: 4rem;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .navigation-element {
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      border-radius: .5rem;
      background-color: $primary;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

      div {
        &:nth-child(1) {
          display: inline-block;
          padding: .75rem;
          text-align: center;
        }

        ul {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          list-style: none;

          li {
            width: 1rem;
            height: 1rem;
            margin: 0 .5rem;
            cursor: pointer;
            border: 2px solid white;
            border-radius: 9999px;

            &.current {
              background: white;
            }

            &.past {
              background: rgba(255, 255, 255, 0.5);
            }
          }
        }
      }
    }
  }
}

.pr-tutorial-buttons {
  display: flex;
  background-color: darken($primary, 20);
  position: relative;
  padding: .75rem 1rem;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    left: 0;
    right: auto;
    top: 50%;
    bottom: auto;
    border-style: solid;
    border-width: 6px;
    border-color: transparent;
    transform: rotate(360deg);
    margin-top: -6px;
    border-right-width: 0;
    border-left-color: $primary;
  }

  button {
    border: 0;
    padding: .5rem 1rem;
    font-weight: bold;
    border-radius: .25rem;
    background-color: transparent;
    background-image: none;
    cursor: pointer;

    &:nth-child(1) {
      margin-right: .75rem;
      background-color: white;
      color: #151616;
    }

    &:nth-child(2) {
      color: white;
      border: 2px solid white;
    }
  }
}

.pr-tutorial-explain {
  position: absolute;
  left: 0;
  top: 0;
  padding: 1rem;
  border-radius: .25rem;
  background-color: white;
  max-width: 450px;
  transition: all cubic-bezier(0, 0, 0.2, 1) 200ms;
  color: #232424;
  text-align: left;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  &::before {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    border-style: solid;
    border-width: 10px;
    border-color: transparent;
    transform: rotate(360deg);
  }

  &[data-alignment="t"]::before {
    left: 50%;
    right: auto;
    top: 100%;
    bottom: auto;
    margin-left: -10px;
    border-bottom-width: 0;
    border-top-color: rgba(255, 255, 255, 0.95);
  }

  &[data-alignment="r"]::before {
    left: auto;
    right: 100%;
    top: 50%;
    bottom: auto;
    margin-top: -10px;
    border-left-width: 0;
    border-right-color: rgba(255, 255, 255, 0.95);
  }

  &[data-alignment="b"]::before {
    left: 50%;
    right: auto;
    top: auto;
    bottom: 100%;
    margin-left: -10px;
    border-top-width: 0;
    border-bottom-color: rgba(255, 255, 255, 0.95);
  }

  h2 {
    text-transform: uppercase;
    margin-bottom: .5rem;
    font-weight: 600;
  }
}
</style>