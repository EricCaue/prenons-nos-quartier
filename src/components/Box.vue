<template>
    <drop :id="id" class="box" @drop="handleDrop">
        <transition name="fade">
            <img v-if="imageName" :src="publicPath + 'images/' + imageName" />
        </transition>
    </drop>
</template>

<script>
    export default {
        name: "Box",
        props: ['id'],
        data() {
            return {
                imageName: null,
                publicPath: process.env.BASE_URL
            }
        },
        methods: {
            handleDrop(data, event) {
                if(data.dragTo === this.id) {
                    event.target.classList.add('success');
                    this.imageName = data.imageName;
                    this.$parent.$emit('image:added', data.id);
                } else {
                    this.$parent.$emit('image:error');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "../assets/style/box";
</style>