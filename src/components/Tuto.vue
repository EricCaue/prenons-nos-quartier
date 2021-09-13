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
    },
    helpList: {
      type: Array
    }
  },
  data() {
    return {
      isOpen: this.tutoOpen,
      canvas: null,
      context: null,
      windowWidth: window.outerWidth,
      windowHeight: window.outerHeight,
      currentStep: 0,
      pastStep: [],
      steps: [],
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
      }, 200)
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.windowResize);
  },
  watch: {
    helpList(helpList) {
      this.title = helpList[0].titre;
      this.message = helpList[0].text;

      this.steps = helpList.filter(id => id !== 0);
    },
    tutoOpen(newVal) {
      this.isOpen = newVal;
      setTimeout(() => {
        this.placeExplanation(this.$refs.navigationElement, 't');
      }, 200);
    }
  },
  methods: {
    init() {
      this.pastStep = [];
      this.currentStep = 0;
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
      this.context.strokeStyle = 'rgb(59, 146, 173)';
      this.fillCanvas();
      this.title = this.steps[step].titre;
      this.message = this.steps[step].text;

      switch (step) {
        case 0:
          align = 't';
          elementToPlaceExplanation = this.$refs.navigationElement;
          this.pastStep = [];
          break;
        case 1:
          align = 'b';
          elementToPlaceExplanation = designsLinkContainer;
          this.pastStep = [0];
          this.createHighlightedZone(designsLinkContainerPosition, designsLinkContainer);
          break;
        case 2:
          align = 'b';
          elementToPlaceExplanation = deviceLinkContainer;
          this.pastStep = [0, 1];
          this.createHighlightedZone(deviceLinkContainerPosition, deviceLinkContainer);
          break;
        case 3:
          align = 'r';
          elementToPlaceExplanation = orientationLinkContainer;
          this.pastStep = [0, 1, 2];
          this.createHighlightedZone(orientationLinkContainerPosition, orientationLinkContainer);
          break;
        case 4:
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
@import "../assets/style/tuto";
</style>