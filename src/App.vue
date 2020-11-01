<template>
    <div id="app">
        <div class="timeline">
            <img src="@/assets/frise.png" alt="frise temporelle">
        </div>
        <div class="box-container">
            <div class="house-container">
                <h2>Maisons</h2>
                <div class="box-tank">
                    <Box v-for="house in houseList" :key="house.id" :id="house.id"/>
                </div>
            </div>
            <div class="building-container">
                <h2>Immeubles</h2>
                <div class="box-tank">
                    <Box v-for="building in buildingList" :key="building.id" :id="building.id"/>
                </div>
            </div>
        </div>
        <image-tank :img-list="imgList"/>
        <modal v-if="showModal"
               :state="modalState"
               @close="showModal = false" >
            <template v-slot:body>
                <h3>{{modalContent}}</h3>
                <svg v-if="modalState === 'success'" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                </svg>
                <svg v-else aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path>
                </svg>
            </template>
        </modal>
    </div>
</template>

<script>
    import Box from "@/components/Box";
    import ImageTank from "@/components/ImageTank";
    import Modal from "@/components/Modal";

    export default {
        name: 'App',
        components: {
            Box,
            ImageTank,
            Modal
        },
        mounted() {
            const baseUrl = process.env.BASE_URL;
            fetch(`${baseUrl}data/data.json`, {mode: 'cors'})
                    .then(resp => resp.json())
                    .then((data) => {
                        this.imgList = data.imgList;
                        this.houseList = data.cards.houseList;
                        this.buildingList = data.cards.buildingList;
                    });


            this.$on('image:added', (id) => {
                this.imgList.splice(this.imgList.findIndex(img => img.id === id), 1);
                this.showModal = true;
                this.modalContent = 'Bravo !';
                this.modalState = 'success';
            });

            this.$on('image:error', () => {
                this.showModal = true;
                this.modalContent = 'Désolé ce n\'est pas la bonne image !';
                this.modalState = 'error';
            });
        },
        data() {
            return {
                houseList: [],
                buildingList: [],
                imgList: [],
                showModal: false,
                modalContent: '',
                modalState: 'success'
            }
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0;
    }
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2, h3 {
        color: #3b92ad;
    }

    .box-container {
        .house-container,
        .building-container {
            display: flex;
            align-items: end;
            margin: 2em 0;

            h2 {
                display: flex;
                writing-mode: vertical-lr;
                transform: rotate(180deg);
            }

            .box-tank {
                display: grid;
                grid-template-columns: repeat(40, 150px);
                grid-column-gap: .8rem;
            }
        }
    }
</style>
