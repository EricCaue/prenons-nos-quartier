<template>
    <div id="app">
        <button @click="openFullScreen" class="btn btn-fullscreen">Plein écran</button>
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
        <image-tank :img-list="imgList"/>
        <modal v-if="showModal"
               :state="modalState"
               @close="showModal = false">
            <template v-slot:body>
                <h3>{{modalContent}}</h3>
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
        mounted() {
            const baseUrl = process.env.BASE_URL;
            fetch(`${baseUrl}data/data.json`, {mode: 'cors'})
                    .then(resp => resp.json())
                    .then((data) => {
                        this.imgList = data.imgList;
                        this.houseList = data.cards.houseList;
                        this.buildingList = data.cards.buildingList;
                    });

            window.addEventListener( "mousemove", this.handleMousemove, false );

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
        },
        methods: {
            openFullScreen() {
                let elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            },
            closeFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            },
            handleMousemove(event) {
                // Get the viewport-relative coordinates of the mousemove event.
                let viewportX = event.clientX;
                let viewportY = event.clientY;

                // Get the viewport dimensions.
                let viewportWidth = document.documentElement.clientWidth;
                let viewportHeight = document.documentElement.clientHeight;

                // Next, we need to determine if the mouse is within the "edge" of the
                // viewport, which may require scrolling the window. To do this, we need to
                // calculate the boundaries of the edge in the viewport (these coordinates
                // are relative to the viewport grid system).
                let edgeTop = edgeSize;
                let edgeLeft = edgeSize;
                let edgeBottom = (viewportHeight - edgeSize);
                let edgeRight = (viewportWidth - edgeSize);

                let isInLeftEdge = (viewportX < edgeLeft);
                let isInRightEdge = (viewportX > edgeRight);
                let isInTopEdge = (viewportY < edgeTop);
                let isInBottomEdge = (viewportY > edgeBottom);

                // If the mouse is not in the viewport edge, there's no need to calculate
                // anything else.
                if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
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
                let documentHeight = Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.body.clientHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight,
                        document.documentElement.clientHeight
                );

                // Calculate the maximum scroll offset in each direction. Since you can only
                // scroll the overflow portion of the document, the maximum represents the
                // length of the document that is NOT in the viewport.
                let maxScrollX = (documentWidth - viewportWidth);
                let maxScrollY = (documentHeight - viewportHeight);

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
                    let currentScrollY = window.pageYOffset;

                    // Determine if the window can be scrolled in any particular direction.
                    let canScrollUp = ( currentScrollY > 0 );
                    let canScrollDown = ( currentScrollY < maxScrollY );
                    let canScrollLeft = ( currentScrollX > 0 );
                    let canScrollRight = ( currentScrollX < maxScrollX );

                    // Since we can potentially scroll in two directions at the same time,
                    // let's keep track of the next scroll, starting with the current scroll.
                    // Each of these values can then be adjusted independently in the logic
                    // below.
                    let nextScrollX = currentScrollX;
                    let nextScrollY = currentScrollY;

                    // As we examine the mouse position within the edge, we want to make the
                    // incremental scroll changes more "intense" the closer that the user
                    // gets the viewport edge. As such, we'll calculate the percentage that
                    // the user has made it "through the edge" when calculating the delta.
                    // Then, that use that percentage to back-off from the "max" step value.
                    let maxStep = 50;

                    // Should we scroll left?
                    if (isInLeftEdge && canScrollLeft) {
                        let intensity = ((edgeLeft - viewportX) / edgeSize);

                        nextScrollX = (nextScrollX - (maxStep * intensity));

                        // Should we scroll right?
                    } else if (isInRightEdge && canScrollRight) {
                        let intensity = ((viewportX - edgeRight) / edgeSize);

                        nextScrollX = (nextScrollX + (maxStep * intensity));
                    }

                    // Should we scroll up?
                    if (isInTopEdge && canScrollUp) {
                        let intensity = ((edgeTop - viewportY) / edgeSize);

                        nextScrollY = (nextScrollY - (maxStep * intensity));

                        // Should we scroll down?
                    } else if (isInBottomEdge && canScrollDown) {
                        let intensity = ((viewportY - edgeBottom) / edgeSize);

                        nextScrollY = (nextScrollY + (maxStep * intensity ));
                    }

                    // Sanitize invalid maximums. An invalid scroll offset won't break the
                    // subsequent .scrollTo() call; however, it will make it harder to
                    // determine if the .scrollTo() method should have been called in the
                    // first place.
                    nextScrollX = Math.max(0, Math.min( maxScrollX, nextScrollX));
                    nextScrollY = Math.max(0, Math.min( maxScrollY, nextScrollY));

                    if (
                            (nextScrollX !== currentScrollX) ||
                            (nextScrollY !== currentScrollY)
                    ) {
                        window.scrollTo(nextScrollX, nextScrollY);
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
    $caseHeight: 23vh;
    $caseWidth: $caseHeight * .7;
    #app {
        display: grid;
        grid-template-rows: repeat(4, $caseHeight);
        grid-template-columns: 1fr;
        grid-gap: 15px;
    }

    .btn-fullscreen {
        position: fixed;
        top: 15px;
        left: 15px;
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
