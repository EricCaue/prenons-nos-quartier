<template>
  <div class="timeline" id="timeline">
    <frise ref="frise"/>
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
  created() {
    window.addEventListener("resize", this.windowsResize);
  },
  mounted() {
    console.log(this.$refs.frise.$el.clientHeight, this.$el);
  },
  destroyed() {
    window.removeEventListener("resize", this.windowsResize);
  },
  methods: {
    windowsResize() {
      console.log(this.$refs.frise.$el.clientHeight, this.$el);
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline {
  position: relative;

  &::after {
    position: absolute;
    content: "";
    height: 5px;
    width: 100%;
    background: #151616;
    bottom: 0;
    left: 0;
  }

  .arrow {
    color: #151616;
    position: fixed;
    top: calc(38px + 27.4vh);
    right: 5px;
    width: 40px;
    height: 40px;
    transform: rotateZ(45deg);
  }
}
</style>