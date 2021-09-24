<template>
    <div ref="dropdownElement" class="dropdown" :style="cssVariables" ww-responsive="dropdown" @click.stop>
        <div
            v-show="!isMenuDisplayed"
            class="dropdown-default"
            @click="handleMouseClick"
            @mouseenter="showDropdown"
            @mouseleave="hideDropdown"
        >
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
    data() {
        return {
            dropdown: null,
            isVisible: false,
            isMobileVisible: false,
            isContentEdit: false,
            topPosition: 0,
            states: [],
            isMouseIn: false,
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

                if (this.content.appearAnimation === 'rotate') {
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
                '--slideOrigin': this.content.slideOrigin,
                '--rotationAngle': this.content.rotationAngle,
            };
        },
    },
    watch: {
        content() {
            this.updatePosition();
        },
        'content.trigger'() {
            if (this.content.trigger === 'click') {
                wwLib.getFrontDocument().addEventListener('click', this.clickListener);
            } else {
                wwLib.getFrontDocument().removeEventListener('click', this.clickListener);
            }
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

        if (this.content.trigger === 'click') {
            wwLib.getFrontDocument().addEventListener('click', this.clickListener);
        }
    },
    created() {
        wwLib.$on('ww-hover-dropdown:opened', () => {
            this.isVisible = false;
            this.states = [];
        });
    },
    beforeUnmount() {
        wwLib.$off('ww-hover-dropdown:opened');
        if (this.content.trigger === 'click') {
            wwLib.getFrontDocument().removeEventListener('click', this.clickListener);
        }
    },
    methods: {
        showDropdown(event) {
            this.isMouseIn = true;

            if (this.isEditing && !this.isContentEdit) return;
            if (this.content.trigger !== event.type) return;

            this.updatePosition();
            this.isVisible = true;
        },
        hideDropdown() {
            this.isMouseIn = false;
            if (this.content.trigger === 'click') return;

            this.isVisible = false;
        },
        handleMouseClick() {
            if (this.isVisible) {
                this.isVisible = false;
                return;
            }

            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('ww-hover-dropdown:opened');
            this.isVisible = true;
            this.updatePosition();
        },
        clickListener() {
            if (this.isMouseIn) return;
            else this.isVisible = false;
        },
        toggleView() {
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
    --slideOrigin: -20px;
    --rotationAngle: -35deg;
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
    transition: all var(--animation-duration) var(--animationTimingFunction);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* SLIDE Y */
.slideY-enter-active,
.slideY-leave-active {
    transition: all var(--animation-duration) var(--animationTimingFunction);
}

.slideY-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(var(--slideOrigin));
}
.slideY-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(var(--slideOrigin));
}

/* SLIDE X */
.slideX-enter-active,
.slideX-leave-active {
    transition: all var(--animation-duration) var(--animationTimingFunction);
}

.slideX-enter-from {
    opacity: 0;
    transform: translateX(calc(-50% + var(--slideOrigin)));
}
.slideX-leave-to {
    opacity: 0;
    transform: translateX(calc(-50% + var(--slideOrigin)));
}

//  SCALE DOWN
.scale-enter-active,
.scale-leave-active {
    transition: all var(--animation-duration) var(--animationTimingFunction);
    animation-fill-mode: forwards;
    transform-origin: top center;
}

.scale-enter-from {
    opacity: 0;
    transform: translateX(-50%) scale(0);
}
.scale-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(0);
}

//  ROTATE X
.rotate-enter-active,
.rotate-leave-active {
    transition: all var(--animation-duration) var(--animationTimingFunction);
    transform-origin: center -20px;
}

.rotate-enter-from {
    opacity: 0;
    transform: translateX(-50%) rotateX(var(--rotationAngle));
}
.rotate-leave-to {
    opacity: 0;
    transform: translateX(-50%) rotateX(var(--rotationAngle));
}
</style>
