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
                    alert('Essaye encopre');
                }
                console.log(data, event);
            }
        }
    }
</script>

<style lang="scss" scoped>
    $width: 150px;
    $height: 230px;
    .box {
        display: flex;
        margin: auto;
        width: $width;
        height: $height;
        border: 2px dashed #d2d2d2;
        border-radius: 10px;
        cursor: pointer;
        transition: all .25s ease;

        &.success {
            transition: all .5s ease-in-out;
            border: 2px solid olivedrab;
        }

        &:not(.success):hover {
            transform: scale(1.1);
            border-color: #a1a1a1;
        }

        img {
            width: 100%;
            height: auto;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s, transform .25s ease-in-out;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
       transform: scale(.7);
    }
</style>