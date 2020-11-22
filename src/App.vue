<template>
    <div id="app">
        <div class="timeline">
            <img src="@/assets/frise.png" alt="frise temporelle">
        </div>
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
        <div class="tools-container">
            <h3>Barre d'outils</h3>
            <div class="buttons-container">
                <button @click="toggleFullScreen" class="btn btn-inverse btn-fullscreen"
                        v-tooltip.right="fullscreenHelp">
                    <svg v-if="!isFullscreen" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512" width="20">
                        <path fill="currentColor"
                              d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path>
                    </svg>
                    <svg v-if="isFullscreen" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 352 512">
                        <path fill="currentColor"
                              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                    </svg>
                </button>
                <button @click="openGlobalHelp" class="btn btn-inverse" v-tooltip.right="'Besoin d\'aide pour jouer ?'">
                    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
                         width="20">
                        <path fill="currentColor"
                              d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path>
                    </svg>
                </button>
            </div>
            <image-tank
                    :method-over="disableScroll"
                    :method-leave="enableScroll"
                    :img-list="imgList"/>
        </div>
        <modal v-if="showModal"
               :state="modalState"
               @close="showModal = false">
            <template v-slot:body>
                <h3 v-if="modalContent">{{modalContent}}</h3>
                <p v-if="!modalHtml">
                    <svg v-if="modalState === 'success'" aria-hidden="true" focusable="false" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                    </svg>
                    <svg v-else aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path>
                    </svg>
                </p>
                <p v-if="modalHtml" v-html="modalHtml"></p>
            </template>
        </modal>
    </div>
</template>

<script>
    import Box from "@/components/Box";
    import ImageTank from "@/components/ImageTank";
    import Modal from "@/components/Modal";

    let edgeSize = 200;
    let timer = null;

    export default {
        name: 'App',
        components: {
            Box,
            ImageTank,
            Modal
        },
        data() {
            return {
                houseList: [],
                buildingList: [],
                imgList: [],
                showModal: false,
                modalHtml: null,
                modalContent: null,
                modalState: 'success',
                isFullscreen: false,
                fullscreenHelp: 'Afficher en plein écran',
                publicPath: process.env.BASE_URL
            }
        },
        mounted() {
            const baseUrl = process.env.BASE_URL;

            // we fetch datas from the json file
            fetch(`${baseUrl}data/data.json`, {mode: 'cors'})
                    .then(resp => resp.json())
                    .then((data) => {
                        this.imgList = data.imgList;
                        this.houseList = data.cards.houseList;
                        this.buildingList = data.cards.buildingList;
                    });

            // Handle the mouseevent to scroll the window when mouse approaching the edge
            this.enableScroll();

            // Handle the image add ok event
            this.$on('image:added', (id) => {
                this.imgList.splice(this.imgList.findIndex(img => img.id === id), 1);
                this.showModal = true;
                this.modalHtml = null;
                this.modalContent = 'Bravo !';
                this.modalState = 'success';
            });

            // Handle the image add not ok event
            this.$on('image:error', () => {
                this.showModal = true;
                this.modalHtml = null;
                this.modalContent = 'Désolé ce n\'est pas la bonne image !';
                this.modalState = 'error';
            });

            this.$on('open:modal', (name) => {
                this.showModal = true;
                this.modalContent = null;
                this.modalHtml = '<p><img src="' + this.publicPath + 'images/' + name + '" alt=""></p><p>Aide sur la maison</p>';
                this.modalState = 'info';
            })
        },
        methods: {
            disableScroll() {
                window.removeEventListener("mousemove", this.handleMousemove, false);
            },
            enableScroll() {
                window.addEventListener("mousemove", this.handleMousemove, false);
            },
            openGlobalHelp() {
                console.log('help opened');
            },
            // Used to toggle window on/off fullscreen
            toggleFullScreen() {
                let elem = document.documentElement;
                if (!this.isFullscreen) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                    this.fullscreenHelp = 'Arrêter le plein écran';
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }

                this.isFullscreen = !this.isFullscreen;
            },
            // Used to handle window move with mouse move.
            handleMousemove(event) {
                // Get the viewport-relative coordinates of the mousemove event.
                let viewportX = event.clientX;

                // Get the viewport dimensions.
                let viewportWidth = document.documentElement.clientWidth;

                // Next, we need to determine if the mouse is within the "edge" of the
                // viewport, which may require scrolling the window. To do this, we need to
                // calculate the boundaries of the edge in the viewport (these coordinates
                // are relative to the viewport grid system).
                let edgeLeft = edgeSize + 100;
                let edgeRight = (viewportWidth - edgeSize);

                let isInLeftEdge = (viewportX > 100 && viewportX < edgeLeft);
                let isInRightEdge = (viewportX > edgeRight);


                // If the mouse is not in the viewport edge, there's no need to calculate
                // anything else.
                if (!(isInLeftEdge || isInRightEdge)) {
                    clearTimeout(timer);
                    return;
                }


                // If we made it this far, the user's mouse is located within the edge of the
                // viewport. As such, we need to check to see if scrolling needs to be done.

                // Get the document dimensions.
                // --
                // NOTE: The various property reads here are for cross-browser compatibility
                // as outlined in the JavaScript.info site (link provided above).
                let documentWidth = Math.max(
                        document.body.scrollWidth,
                        document.body.offsetWidth,
                        document.body.clientWidth,
                        document.documentElement.scrollWidth,
                        document.documentElement.offsetWidth,
                        document.documentElement.clientWidth
                );

                // Calculate the maximum scroll offset in each direction. Since you can only
                // scroll the overflow portion of the document, the maximum represents the
                // length of the document that is NOT in the viewport.
                let maxScrollX = (documentWidth - viewportWidth);

                // As we examine the mousemove event, we want to adjust the window scroll in
                // immediate response to the event; but, we also want to continue adjusting
                // the window scroll if the user rests their mouse in the edge boundary. To
                // do this, we'll invoke the adjustment logic immediately. Then, we'll setup
                // a timer that continues to invoke the adjustment logic while the window can
                // still be scrolled in a particular direction.
                // --
                // NOTE: There are probably better ways to handle the ongoing animation
                // check. But, the point of this demo is really about the math logic, not so
                // much about the interval logic.

                (function checkForWindowScroll() {
                    clearTimeout(timer);

                    if (adjustWindowScroll()) {
                        timer = setTimeout(checkForWindowScroll, 30);
                    }
                })();

                // Adjust the window scroll based on the user's mouse position. Returns True
                // or False depending on whether or not the window scroll was changed.
                function adjustWindowScroll() {
                    // Get the current scroll position of the document.
                    let currentScrollX = window.pageXOffset;

                    // Determine if the window can be scrolled in any particular direction.
                    let canScrollLeft = (currentScrollX > 0);
                    let canScrollRight = (currentScrollX < maxScrollX);

                    // Since we can potentially scroll in two directions at the same time,
                    // let's keep track of the next scroll, starting with the current scroll.
                    // Each of these values can then be adjusted independently in the logic
                    // below.
                    let nextScrollX = currentScrollX;

                    // As we examine the mouse position within the edge, we want to make the
                    // incremental scroll changes more "intense" the closer that the user
                    // gets the viewport edge. As such, we'll calculate the percentage that
                    // the user has made it "through the edge" when calculating the delta.
                    // Then, that use that percentage to back-off from the "max" step value.
                    let maxStep = 200;

                    // Should we scroll left?
                    if (isInLeftEdge && canScrollLeft) {
                        let intensity = ((edgeLeft - viewportX) / edgeSize);

                        nextScrollX = (nextScrollX - (maxStep * intensity / 15));

                        // Should we scroll right?
                    } else if (isInRightEdge && canScrollRight) {
                        let intensity = ((viewportX - edgeRight) / edgeSize);

                        nextScrollX = (nextScrollX + (maxStep * intensity / 15));
                    }

                    // Sanitize invalid maximums. An invalid scroll offset won't break the
                    // subsequent .scrollTo() call; however, it will make it harder to
                    // determine if the .scrollTo() method should have been called in the
                    // first place.
                    nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));

                    if ((nextScrollX !== currentScrollX)) {
                        window.scrollTo(nextScrollX, 0);
                        return true;
                    } else {
                        return false;
                    }

                }
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/style/variables';

    $caseHeight: 23vh;
    $caseWidth: $caseHeight * .7;
    #app {
        padding-left: 180px;
        display: grid;
        grid-template-rows: repeat(3, $caseHeight);
        grid-template-columns: 1fr;
        grid-gap: 2vh;
    }

    .tools-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 0;
        left: 0;
        height: 100%;
        width: 150px;
        padding: .6em;
        background-color: $primary;

        h3 {
            color: #ffffff;
            text-align: center;
            font-size: 16px;
            margin-left: 0;
        }

        .buttons-container {
            .btn {
                margin: 1em 0;
                width: 3.3em;
                height: 3.3em;
                display: flex;
                justify-content: center;
                align-items: center;

                &:first-child {
                    margin-top: 0;
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .timeline {
        img {
            height: 20vh;
            width: auto;
            float: left;
        }
    }

    .house-container,
    .building-container {
        display: flex;
        align-items: flex-end;

        h2 {
            display: flex;
            writing-mode: vertical-lr;
            transform: rotate(180deg);
        }

        .box-tank {
            height: 100%;
            display: grid;
            grid-template-columns: repeat(40, $caseWidth);
            grid-column-gap: .8rem;
        }
    }
</style>
