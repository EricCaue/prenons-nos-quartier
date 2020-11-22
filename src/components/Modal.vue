<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" :class="state">
                    <div class="modal-header">
                        <slot name="header">
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <h3 v-if="content">{{content}}</h3>
                            <svg v-if="!html" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                            </svg>
                            <div v-html="html"></div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button" @click="$emit('close')">
                                Continuer
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Modal",
        props: ['content', 'html', 'state']
    }
</script>

<style lang="scss">
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: table;
        transition: opacity 0.3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        overflow: hidden;
        width: 30vw;
        margin: 0 auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;

        .modal-default-button {
          background-color: #3b92ad;
          margin: 0 .5rem;

          &:hover,
          &:focus {
            background-color: darken(#3b92ad, 15%);
          }
        }

        &.success {
            color: #3b92ad;
            h3 {
                color: #3b92ad;
            }

            .modal-default-button {
                background-color: #3b92ad;

                &:hover,
                &:focus {
                    background-color: darken(#3b92ad, 15%);
                }
            }
        }

        &.error {
            color: #ad833b;
            h3 {
                color: #ad833b;
            }

            .modal-default-button {
                background-color: #ad833b;

                &:hover,
                &:focus {
                    background-color: darken(#ad833b, 15%);
                }
            }
        }

        &.info {
            color: #3b4aad;
            .modal-default-button {
                background-color: #3b4aad;

                &:hover,
                &:focus {
                    background-color: darken(#3b4aad, 15%);
                }
            }
        }
    }

    .modal-body {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            margin-left: 1em;
            width: 3em;
        }
    }

    .modal-footer {
        display: flex;
        justify-content: center;
    }
    .modal-default-button {
        cursor: pointer;
        color: #FFF;
        border: 0;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        border-radius: .25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>