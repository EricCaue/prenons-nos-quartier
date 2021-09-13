<template>
    <div @mouseover="methodOver"
         @mouseleave="methodLeave"
         class="image-tank">
        <h3>Mes bâtiments</h3>
        <div class="image-container">
            <draggable-image v-for="img in imgList"
                             :key="img.id"
                             :id="img.id"
                             :drag-to="img.dragTo"
                             :name="img.name"
                             :help="img.help"
            />
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
    @import "../assets/style/imagetank";
</style>