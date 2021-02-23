<script>
/** Functional component to animate height for vertical opening transition */
export default {
    name: 'wwExpandTransition',
    functional: true,
    render(createElement, context) {
        const data = {
            props: {
                name: 'expand',
            },
            // With this synthax, we are not able to pass any listeners to the transition
            // If needed later, add call to context.listeners.XXX in the differents listeners below
            on: {
                beforeEnter(element) {
                    element.style.overflowY = 'hidden';
                },
                enter(element) {
                    const { width } = window.getComputedStyle(element);
                    const inlineWidth = element.style.width;
                    element.style.width = width;
                    element.style.position = 'absolute';
                    element.style.visibility = 'hidden';
                    element.style.height = 'auto';

                    const { height } = window.getComputedStyle(element);
                    element.style.width = inlineWidth;
                    element.style.position = '';
                    element.style.visibility = '';
                    element.style.height = context.props.minHeight || 0;

                    // Force repaint
                    window.getComputedStyle(element).height;

                    setTimeout(() => {
                        element.style.height = height;
                    });
                },
                afterEnter(element) {
                    element.style.height = 'auto';
                    element.style.overflowY = 'unset';
                },
                leave(element) {
                    const { height } = window.getComputedStyle(element);
                    element.style.height = height;
                    element.style.overflowY = 'hidden';
                    // Force repaint
                    window.getComputedStyle(element).height;
                    setTimeout(() => {
                        element.style.height = context.props.minHeight || 0;
                    });
                },
            },
        };

        return createElement('transition', data, context.children);
    },
};
</script>

<style lang="scss">
.expand-enter-active,
.expand-leave-active {
    will-change: height;
    transition: height 0.15s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}
</style>
