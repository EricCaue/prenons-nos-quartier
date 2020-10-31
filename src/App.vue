<template>
  <div id="app">
    <div class="timeline">
      <img src="@/assets/frise.png" alt="frise temporelle">
    </div>
    <div class="box-container">
      <Box v-for="house in houseList" :key="house.id" :id="house.id" />
    </div>
    <div class="image-container">
      <draggable-image v-for="img in imgList" :key="img.id" :id="img.id" :drag-to="img.dragTo" :name="img.name" />
    </div>
  </div>
</template>

<script>
  import Box from "@/components/Box";
  import DraggableImage from "@/components/DraggableImage";

export default {
  name: 'App',
  components: {
    DraggableImage,
    Box
  },
  mounted() {
    this.$on('image:added', (id) => {
      this.imgList.splice(this.imgList.findIndex(img => img.id === id), 1);
    });
  },
  data() {
    return {
      houseList: [
        { id: 'house-0' },
        { id: 'house-1' },
        { id: 'house-2' },
        { id: 'house-3' },
        { id: 'house-4' },
        { id: 'house-5' },
        { id: 'house-6' },
        { id: 'house-7' },
        { id: 'house-8' },
        { id: 'house-9' },
      ],
      buildingList: [
        { id: 'building-0' },
        { id: 'building-1' },
        { id: 'building-2' },
        { id: 'building-3' },
        { id: 'building-4' },
        { id: 'building-5' },
      ],
      imgList: [
        {
          id: 'img-0',
          dragTo: 'house-0',
          name: '001.png'
        },
        {
          id: 'img-1',
          dragTo: 'house-3',
          name: '001.png'
        },
        {
          id: 'img-2',
          dragTo: 'house-4',
          name: '001.png'
        },
        {
          id: 'img-4',
          dragTo: 'house-2',
          name: '001.png'
        },
        {
          id: 'img-5',
          dragTo: 'house-5',
          name: '001.png'
        }
      ]
    }
  },
  method: {
    handleImageAdd(id) {
      console.log(id);

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.box-container {
  display: grid;
  grid-auto-flow:column;
  grid-column-gap: .8rem;
}

  .image-container {
    position: fixed;
    width: 100%;
    bottom: 10px;
    left: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 75px);
    grid-column-gap: .8rem;
    grid-template-rows: 1fr;
  }
</style>
