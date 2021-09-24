export default {
    options: {
        autoByContent: true,
    },
    editor: {
        label: {
            en: 'Hover dropdown',
        },
    },
    properties: {
        trigger: {
            label: {
                en: 'Show on',
                fr: 'Show on',
            },
            section: 'settings',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'mouseenter', label: { en: 'Hover', fr: 'Hover' } },
                    { value: 'click', label: { en: 'Click' } },
                ],
            },
            defaultValue: 'click',
        },
        appearAnimation: {
            label: {
                en: 'Appear animation',
                fr: "Animation d'apparition",
            },
            section: 'settings',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'fade', label: { en: 'Fade', fr: 'Fade' } },
                    { value: 'slideY', label: { en: 'Slide Y', fr: 'Slide Y' } },
                    { value: 'slideX', label: { en: 'Slide X', fr: 'Slide X' } },
                    { value: 'scale', label: { en: 'Scale', fr: 'Scale' } },
                    { value: 'rotate', label: { en: 'Rotate', fr: 'Rotate' } },
                ],
            },
            defaultValue: 'fade',
        },
        slideOrigin: {
            type: 'Length',
            label: {
                en: 'Slide origin',
                fr: 'Slide origin',
            },
            section: 'settings',
            hidden: content => {
                return content.appearAnimation === 'slideX' || content.appearAnimation === 'slideY';
            },
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: -300, max: 300 }],
            },
            defaultValue: '20px',
        },
        rotationAngle: {
            type: 'Length',
            label: {
                en: 'Rotation angle',
                fr: 'Rotation angle',
            },
            section: 'settings',
            hidden: content => {
                return content.appearAnimation === 'rotate';
            },
            options: {
                unitChoices: [{ value: 'deg', label: 'deg', min: -180, max: 180 }],
            },
            defaultValue: '-35deg',
        },
        animationDuration: {
            type: 'Length',
            label: {
                en: 'Animation duration',
                fr: "Durée de l'animation",
            },
            section: 'settings',
            options: {
                unitChoices: [{ value: 'ms', label: 'ms', min: 1, max: 5000 }],
            },
            defaultValue: '300ms',
        },
        animationTimingFunction: {
            label: {
                en: 'Animation timing function',
                fr: 'Animation timing function',
            },
            section: 'settings',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'ease', label: { en: 'ease', fr: 'ease' } },
                    { value: 'ease-in', label: { en: 'ease-in', fr: 'ease-in' } },
                    { value: 'ease-out', label: { en: 'ease-out', fr: 'ease-out' } },
                    { value: 'ease-in-out', label: { en: 'ease-in-out', fr: 'ease-in-out' } },
                    { value: 'linear', label: { en: 'linear', fr: 'linear' } },
                ],
            },
            defaultValue: 'ease',
        },
        menuBreakpoint: {
            label: { en: 'Mobile view starting at' },
            type: 'TextRadioGroup',
            section: 'settings',
            options: {
                choices: [
                    { value: 'laptop', title: { en: 'Laptop' }, icon: 'laptop' },
                    { value: 'tablet', title: { en: 'Tablet' }, icon: 'tablet' },
                    { value: 'mobile', title: { en: 'Mobile' }, icon: 'mobile' },
                ],
            },
            defaultValue: 'mobile',
        },
        toggleEdit: {
            type: 'Button',
            section: 'settings',
            options: {
                text: { en: 'Toggle edition', fr: 'Toggle edition' },
                color: 'blue',
                action: 'toggleEdit',
            },
            editorOnly: true,
        },
        dropdown: {
            hidden: true,
            defaultValue: [],
        },
        dropdownContent: {
            hidden: true,
            defaultValue: [],
        },
    },
};
