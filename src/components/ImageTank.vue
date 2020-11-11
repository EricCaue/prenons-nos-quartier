<template>
    <div @mouseover="methodOver"
         @mouseleave="methodLeave"
         class="image-tank"
         :class="{'closed': isClosed}">
        <h3>Mes bâtiments</h3>
        <div class="image-container">
            <draggable-image v-for="img in imgList" :key="img.id" :id="img.id" :drag-to="img.dragTo" :name="img.name" />
        </div>
        <a class="btn-toggle" @click="isClosed = !isClosed">
            <svg aria-hidden="true" focusable="false" class="svg-inline--fa fa-chevron-right fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
            </svg>
        </a>
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
        position: fixed;
        bottom: 10px;
        left: 10px;
        display: flex;
        align-items: flex-end;
        width: 100%;
        height: 130px;
        max-width: calc(100vw - 60px);
        padding: .6em;
        border-radius: .8em;
        background-color: $secondary;
        transition: max-width .3s ease;
        overflow: hidden;

        h3 {
            color: #ffffff;
            display: flex;
            font-size: 16px;
            writing-mode: vertical-lr;
            transform: rotate(180deg);
            margin-left: 0;
        }

        .image-container {
            overflow: auto;
            max-height: 115px;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, 75px);
            grid-column-gap: .8rem;
            grid-template-rows: 1fr;
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

        &.closed {
            max-width: 130px;

            .image-container { overflow: hidden; }

            .btn-toggle {
                svg {
                    transform: rotate(0deg);
                }
            }
        }
    }
</style>