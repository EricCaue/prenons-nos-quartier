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
    </div>
</template>

<script>
    import Box from "@/components/Box";
    import ImageTank from "@/components/ImageTank";

    export default {
        name: 'App',
        components: {
            Box,
            ImageTank
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
            });
        },
        data() {
            return {
                houseList: [],
                buildingList: [],
                imgList: []
            }
        },
        method: {
            handleImageAdd(id) {
                console.log(id);

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
