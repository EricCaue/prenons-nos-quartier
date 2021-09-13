<template>
  <div class="timeline" id="timeline" :style="cssVars">
    <frise ref="frise" class="frise"/>
    <svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor"
            d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
    </svg>
  </div>
</template>

<script>
import Frise from "./Frise";
export default {
  name: "Timeline",
  components: {
    Frise
  },
  data() {
    return {
      timelineHeight: 0,
      arrowPosition: 0
    }
  },
  computed: {
    cssVars() {
      return {
        '--timeline-position': this.timelineHeight + 'px',
        '--arrow-position': this.arrowPosition + 'px'
      }
    }
  },
  created() {
    window.addEventListener("resize", this.windowsResize);
  },
  mounted() {
    this.getPositions();
  },
  destroyed() {
    window.removeEventListener("resize", this.windowsResize);
  },
  methods: {
    getPositions() {
      this.timelinePositionWindow = this.$refs.frise.$el.querySelector('#line').getBoundingClientRect().top;
      this.timelineHeight = this.timelinePositionWindow - this.$refs.frise.$el.getBoundingClientRect().top - 4;
      this.arrowPosition = this.timelinePositionWindow - this.$el.querySelector('.arrow').clientHeight / 2;
    },
    windowsResize() {
      this.getPositions();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/style/timeline";
</style>