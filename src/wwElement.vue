<template>
    <div ref="dropdownElement" class="dropdown" :style="cssVariables" ww-responsive="dropdown" @click.stop>
        <div v-show="!isMenuDisplayed" class="dropdown-default">
            <div
                class="dropdown-hover-trigger"
                @click="showDropdown"
                @mouseenter="showDropdown"
                @mouseleave="hideDropdown"
            >
                <wwLayout class="dropdown__layout" path="dropdown">
                    <template #default="{ item }">
                        <wwLayoutItem>
                            <wwElement v-bind="item" :states="states"></wwElement>
                        </wwLayoutItem>
                    </template>
                </wwLayout>
            </div>
            <div
                v-if="isVisible || isContentEdit"
                class="dropdown__content"
                :class="{ under: content.position === 'under' }"
                @mouseenter="showDropdown"
                @mouseleave="hideDropdown"
            >
                <transition name="fade" mode="out-in">
                    <wwLayout ref="dropdownContent" class="layout" path="dropdownContent">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="states"></wwElement>
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </transition>
            </div>
        </div>
        <div v-show="isMenuDisplayed" class="dropdown-mobile" @click="toggleView">
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
        position: fixed;
        top: var(--top-position);
        left: 50%;
        transform: translateX(-50%);
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
