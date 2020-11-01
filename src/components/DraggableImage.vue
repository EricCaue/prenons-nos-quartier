<template>
    <drag class="image"
          effect-allowed="move"
          drop-effect="move"
          :transfer-data="{ id: id, dragTo: dragTo, imageName: name }">
        <img :src="publicPath + 'images/' + name" alt="">
    </drag>
</template>

<script>
    export default {
        name: "DraggableImage",
        props: ['id', 'dragTo', 'name'],
        data() {
            return {
                publicPath: process.env.BASE_URL
            }
        },
    }
</script>

<style lang="scss" scoped>
    $width: 150px;
    $height: 230px;
    .image {
        overflow: hidden;
        display: flex;
        margin: auto;
        justify-content: center;
        align-items: center;
        width: $width * .5;
        height: $height * .5;
        cursor: grabbing;
        transition: all .25s ease;

        img {
            height: 100%;
            width: auto;
        }

        &:hover {
            transform: scale(1.1);
            border-color: #a1a1a1;
        }
    }
</style>