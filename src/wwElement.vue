<template>
    <div ref="dropdownElement" class="dropdown" :style="cssVariables" ww-responsive="dropdown" @click.stop>
        <div
            v-show="!isMenuDisplayed"
            class="dropdown-default"
            @click="showDropdown"
            @mouseenter="showDropdown"
            @mouseleave="hideDropdown"
        >
            <div class="">Feature</div>
            <div class="dropdown-hover-trigger">
                <wwLayout class="dropdown__layout" path="dropdown">
                    <template #default="{ item }">
                        <wwLayoutItem>
                            <wwElement v-bind="item" :states="isVisible ? ['On Hover'] : []"></wwElement>
                        </wwLayoutItem>
                    </template>
                </wwLayout>
            </div>
            <transition :name="content.appearAnimation" mode="out-in">
                <div v-if="isVisible || isContentEdit" class="dropdown__content under">
                    <wwLayout ref="dropdownContent" class="layout" path="dropdownContent">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="states"></wwElement>
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </div>
            </transition>
        </div>
        <div v-if="isMenuDisplayed" class="dropdown-mobile" @click="toggleView">
            <wwLayout class="dropdown__layout--mobile" path="dropdown">
                <template #default="{ item }">
                    <wwLayoutItem>
                        <wwElement v-bind="item" :states="states"></wwElement>
                    </wwLayoutItem>
                </template>
            </wwLayout>

            <div class="dropdown__content--mobile">
                <wwExpandTransition>
                    <wwLayout
                        v-if="isMobileVisible || isContentEdit"
                        ref="dropdownContent"
                        class="layout"
                        path="dropdownContent"
                    >
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="states"></wwElement>
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
        content: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    wwDefaultContent: {
        dropdown: [],
        dropdownContent: [],
        menuBreakpoint: 'mobile',
        trigger: 'mouseenter',
        appearAnimation: 'fade',
        animationDuration: '300ms',
        animationTimingFunction: 'ease',
    },
    data() {
        return {
            dropdown: null,
            isVisible: false,
            stayvisible: false,
            isMobileVisible: false,
            isContentEdit: false,
            topPosition: 0,
            states: [],
        };
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
            const perspectiveValue = () => {
                let perspective = 'none';

                if (this.content.appearAnimation === 'rotateX') {
                    perspective = '2000px';
                }

                return perspective;
            };

            return {
                '--top-position': this.topPosition + 'px',
                '--content-dimension': this.isVisible ? '300px' : '0px',
                '--animation-duration': this.content.animationDuration,
                '--perspective': perspectiveValue(),
                '--animationTimingFunction': this.content.animationTimingFunction,
            };
        },
    },
    watch: {
        content() {
            this.updatePosition();
        },
        isEditing() {
            if (!this.isEditing) {
                this.isVisible = false;
                this.isContentEdit = false;
            }
            this.updatePosition();
        },
    },
    mounted() {
        this.dropdown = this.$refs.dropdownElement;
        this.updatePosition();
    },
    created() {
        wwLib.$on('ww-hover-dropdown:opened', () => {
            this.isVisible = false;
        });
    },
    beforeUnmount() {
        wwLib.$off('ww-hover-dropdown:opened');
    },
    methods: {
        showDropdown(event) {
            if (this.isEditing && !this.isContentEdit) return;
            if (this.content.trigger !== event.type) return;
            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('ww-hover-dropdown:opened');
            this.updatePosition();
            this.$nextTick(() => {
                this.isVisible = true;
                this.handleVisibility();
                this.states = ['active'];
            });
        },
        hideDropdown() {
            this.$nextTick(() => {
                this.isVisible = false;
                setTimeout(() => {
                    this.handleVisibility();
                }, 500);
                this.states = [];
            });
        },
        handleVisibility() {
            if (!this.isVisible) this.stayvisible = false;
            else this.stayvisible = true;
        },
        toggleView() {
            this.states = this.states[0] === 'active' ? [] : ['active'];
            this.isMobileVisible = !this.isMobileVisible;
        },
        toggleEdit() {
            this.isContentEdit = !this.isContentEdit;
        },
        updatePosition() {
            this.topPosition = this.dropdown.getBoundingClientRect().top;
        },
    },
};
</script>

<style lang="scss" scoped>
:root {
    --animation-duration: 300ms;
    --top-position: 0px;
    --perspective: 2000px;
}
.testAnim {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 200px;
    height: 200px;
    transform: translateX(-50%);
    background-color: grey;
    margin-top: 24px;
}
.dropdown {
    position: relative;
    z-index: 10000 !important;

    .dropdown-default {
        perspective: var(--perspective);
    }

    &__layout {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    &__content {
        z-index: 9999;
        position: fixed;
        top: var(--top-position);
        left: 50%;
        transform: translateX(-50%);
        margin-top: -1px;
        flex-direction: row;
        justify-content: center;
        align-content: center;

        .layout {
            display: flex;
            flex-wrap: nowrap;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-height: 20px;
            min-width: 100px;
        }
    }
    &__content.under {
        z-index: 9999;
        position: absolute;
        top: 100%;

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
            width: 80vw;
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

/* FADE */
.fade-enter-active,
.fade-leave-active {
    transition: all var(--animation-duration) ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* SLIDE DOWN */
.slideDown-enter-active,
.slideDown-leave-active {
    transition: all var(--animation-duration) ease;
}

.slideDown-enter-from {
    transform: translateX(-50%) translateY(-20px);
}
.slideDown-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}

/* SLIDE UP */
.slideUp-enter-active,
.slideUp-leave-active {
    transition: all var(--animation-duration) ease;
}

.slideUp-enter-from {
    transform: translateX(-50%) translateY(20px);
}
.slideUp-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(0px);
}

//  SCALE DOWN
.scaleDown-enter-active,
.scaleDown-leave-active {
    transition: all var(--animation-duration) ease-in-out;
    animation-fill-mode: forwards;
    transform-origin: top center;
}

.scaleDown-enter-from {
    transform: translateX(-50%) scale(0);
}
.scaleDown-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(0);
}

//  ROTATE X
.rotateX-enter-active,
.rotateX-leave-active {
    transition: all var(--animation-duration) ease-in-out;
    transform-origin: center -20px;
}

.rotateX-enter-from {
    transform: translateX(-50%) rotateX(-35deg);
}
.rotateX-leave-to {
    opacity: 0;
    transform: translateX(-50%) rotateX(-35deg);
}
</style>
