<template>
    <div class="dropdown" ref="dropdownElement" :style="cssVariables" @click.stop>
        <div class="dropdown-default" @mouseenter="showDropdown" @mouseleave="hideDropdown" v-if="!isMenuDisplayed">
            <wwLayout class="dropdown__layout" path="dropdown"></wwLayout>

            <div class="dropdown__content">
                <transition name="fade" mode="out-in">
                    <wwLayout
                        class="layout"
                        ref="dropdownContent"
                        path="dropdownContent"
                        v-show="isVisible || isContentEdit"
                    >
                        <template v-slot="{ item }">
                            <wwLayoutItem>
                                <wwObject v-bind="item" :states="states"></wwObject>
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </transition>
            </div>
        </div>
        <div class="dropdown-mobile" @click="toggleView" v-if="isMenuDisplayed">
            <wwLayout class="dropdown__layout--mobile" path="dropdown"></wwLayout>

            <div class="dropdown__content--mobile">
                <wwExpandTransition>
                    <wwLayout
                        class="layout"
                        ref="dropdownContent"
                        path="dropdownContent"
                        v-show="isMobileVisible || isContentEdit"
                    >
                        <template v-slot="{ item }">
                            <wwLayoutItem>
                                <wwObject v-bind="item"></wwObject>
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </wwExpandTransition>
            </div>
        </div>
    </div>
</template>

<script>
import wwExpandTransition from './wwExpandTransition.vue';

export default {
    components: { wwExpandTransition },
    props: {
        content: Object,
        wwFrontState: Object,
        /* wwEditor:start */
        wwEditorState: Object,
        /* wwEditor:end */
    },
    wwDefaultContent: {
        dropdown: [],
        dropdownContent: [],
        menuBreakpoint: 'mobile',
    },
    data() {
        return {
            isVisible: false,
            isMobileVisible: false,
            isContentEdit: false,
            topPosition: 0,
            // states: [],
        };
    },
    watch: {
        isEditing() {
            if (!this.isEditing) this.isContentEdit = false;
            this.topPosition = this.dropdown.getBoundingClientRect().top + this.dropdown.offsetHeight;
        },
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isMenuDisplayed() {
            if (this.content.menuBreakpoint === 'laptop') return true;
            if (this.content.menuBreakpoint === 'tablet')
                return this.wwFrontState.screenSize === 'mobile' || this.wwFrontState.screenSize === 'tablet';
            return this.wwFrontState.screenSize === 'mobile';
        },
        cssVariables() {
            return {
                '--content-width': this.isEditing ? `${79}vw` : `${80}vw`,
                '--top-position': this.topPosition + 'px',
            };
        },
    },
    methods: {
        showDropdown() {
            this.updatePosition();
            this.isVisible = true;
            // this.startAnim();
        },
        hideDropdown() {
            this.isVisible = false;
            // this.removeAnim();
        },
        toggleView() {
            this.isMobileVisible = !this.isMobileVisible;
        },
        toggleEdit() {
            this.isContentEdit = !this.isContentEdit;
            // if (this.isContentEdit) this.startAnim();
            // else this.removeAnim();
        },
        // startAnim() {
        //     this.$nextTick(() => {
        //         this.states = ['anim'];
        //     });
        // },
        // removeAnim() {
        //     this.states = [];
        // },
        updatePosition() {
            this.topPosition = this.dropdown.getBoundingClientRect().top + this.dropdown.offsetHeight;
        },
    },
    mounted() {
        this.dropdown = this.$refs.dropdownElement;
        this.updatePosition();
    },
};
</script>

<style lang="scss" scoped>
.dropdown {
    --content-width: 80vw;

    &__layout {
        display: flex;
        flex-direction: column;
        min-height: 20px;
        min-width: 100px;
    }

    &__content {
        z-index: 9;
        position: fixed;
        top: var(--top-position);
        left: 0;
        width: var(--content-width);
        margin-left: 10vw;
        margin-top: -1px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;

        .layout {
            display: flex;
            flex-direction: column;
            min-height: 20px;
            min-width: 100px;
        }
    }

    .dropdown-mobile {
        width: 100%;

        &__content {
            z-index: 9;
            position: fixed;
            top: var(--top-position);
            left: 0;
            width: var(--content-width);
            margin-left: 10vw;
            margin-top: -1px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;

            .layout {
                display: flex;
                flex-direction: column;
                min-height: 20px;
                min-width: 100px;
            }
        }
    }
}

// FADE
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
