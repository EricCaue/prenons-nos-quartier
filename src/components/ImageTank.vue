<template>
    <div @mouseover="methodOver"
         @mouseleave="methodLeave"
         class="image-tank">
        <h3>Mes bâtiments</h3>
        <div class="image-container">
            <draggable-image v-for="img in imgList" :key="img.id" :id="img.id" :drag-to="img.dragTo" :name="img.name" />
        </div>
    </div>
</template>

<script>
    import DraggableImage from "@/components/DraggableImage";
    export default {
        name: "ImageTank",
        components: {
            DraggableImage
        },
        props: ["imgList", "methodOver", "methodLeave"],
        data() {
            return {
                isClosed: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/style/variables';
    .image-tank {
        margin-top: 1em;

        .image-container {
            overflow: auto;
            height: calc(100vh - 12em);
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, 100%);
            grid-column-gap: .8rem;
            grid-template-rows: 1fr;
            justify-items: center;
        }

        .btn-toggle {
            color: #FFF;
            cursor: pointer;
            height: 100%;
            display: flex;
            align-items: center;

            svg {
                width: 20px;
                height: 20px;
                transition: transform .25s ease-in;
                transform: rotate(180deg);
            }
        }
    }
</style>