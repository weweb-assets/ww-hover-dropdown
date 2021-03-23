<template>
    <div class="dropdown" ref="dropdownElement" :style="cssVariables" ww-responsive="dropdown" @click.stop>
        <div class="dropdown-default" v-show="!isMenuDisplayed">
            <div class="dropdown-hover-trigger" @click="showDropdown" @mouseenter="showDropdown">
                <wwLayout class="dropdown__layout" path="dropdown">
                    <template v-slot="{ item }">
                        <wwLayoutItem>
                            <wwObject v-bind="item" :states="states"></wwObject>
                        </wwLayoutItem>
                    </template>
                </wwLayout>
            </div>

            <div class="dropdown__content" :class="{ under: content.position === 'under' }" @mouseleave="hideDropdown">
                <transition name="fade" mode="out-in">
                    <wwLayout
                        class="layout"
                        ref="dropdownContent"
                        path="dropdownContent"
                        v-show="isVisible || isContentEdit"
                        @mouseleave.native="hideDropdown"
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
        <div class="dropdown-mobile" @click="toggleView" v-show="isMenuDisplayed">
            <wwLayout class="dropdown__layout--mobile" path="dropdown">
                <template v-slot="{ item }">
                    <wwLayoutItem>
                        <wwObject v-bind="item" :states="states"></wwObject>
                    </wwLayoutItem>
                </template>
            </wwLayout>

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
                                <wwObject v-bind="item" :states="states"></wwObject>
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
        contentWidth: '80vw',
        position: 'under',
        trigger: 'mouseenter',
    },
    data() {
        return {
            dropdown: null,
            isVisible: false,
            isMobileVisible: false,
            isContentEdit: false,
            topPosition: 0,
            states: [],
        };
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
                '--top-position': this.topPosition + 'px',
                '--display': this.isVisible || this.isContentEdit ? 'flex' : 'none',
                '--content-dimension': this.isVisible ? '300px' : '0px',
            };
        },
    },
    methods: {
        showDropdown(event) {
            if (this.isEditing && !this.isContentEdit) return;
            if (this.content.trigger !== event.type) return;

            wwLib.$emit('ww-hover-dropdown:opened');
            this.updatePosition();
            this.isVisible = true;
            this.states = ['active'];
        },
        hideDropdown() {
            this.isVisible = false;
            this.states = [];
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
    mounted() {
        this.dropdown = this.$refs.dropdownElement;
        this.updatePosition();
    },
    created() {
        wwLib.$on('ww-hover-dropdown:opened', () => {
            this.isVisible = false;
        });
    },
    beforeDestroy() {
        wwLib.$off('ww-hover-dropdown:opened');
    },
};
</script>

<style lang="scss" scoped>
.dropdown {
    --content-width: 80vw;
    --top-position: 0px;
    position: relative;

    &__layout {
        display: flex;
        flex-direction: column;
        min-height: 20px;
        min-width: 100px;
    }

    &__content {
        z-index: 9999;
        height: var(--content-dimension);
        position: fixed;
        top: var(--top-position);
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        margin-top: -1px;
        display: var(--display);
        flex-direction: row;
        justify-content: center;
        align-content: center;

        .layout {
            min-height: 20px;
            min-width: 100px;
        }
    }

    &__content.under {
        z-index: 9999;
        height: var(--content-dimension);
        position: absolute;
        top: 100%;
        display: var(--display);

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
