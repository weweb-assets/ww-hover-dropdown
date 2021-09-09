const options = content => {
    return {
        trigger: {
            label: {
                en: 'Show on',
                fr: 'Show on',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'mouseenter', label: { en: 'Hover', fr: 'Hover' } },
                    { value: 'click', label: { en: 'Click' } },
                ],
            },
        },
        appearAnimation: {
            label: {
                en: 'Appear animation',
                fr: "Animation d'apparition",
            },
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
        },
        slideOrigin:
            content.appearAnimation === 'slideX' || content.appearAnimation === 'slideY'
                ? {
                      type: 'Length',
                      label: {
                          en: 'Slide origin',
                          fr: 'Slide origin',
                      },
                      options: {
                          unitChoices: [{ value: 'px', label: 'px', min: -300, max: 300 }],
                      },
                  }
                : {},
        rotationAngle:
            content.appearAnimation === 'rotate'
                ? {
                      type: 'Length',
                      label: {
                          en: 'Rotation angle',
                          fr: 'Rotation angle',
                      },
                      options: {
                          unitChoices: [{ value: 'deg', label: 'deg', min: -180, max: 180 }],
                      },
                  }
                : {},
        animationDuration: {
            type: 'Length',
            label: {
                en: 'Animation duration',
                fr: "Durée de l'animation",
            },
            options: {
                unitChoices: [{ value: 'ms', label: 'ms', min: 1, max: 5000 }],
            },
        },
        animationTimingFunction: {
            label: {
                en: 'Animation timing function',
                fr: 'Animation timing function',
            },
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
        },
        menuBreakpoint: {
            label: { en: 'Mobile view starting at' },
            type: 'TextRadioGroup',
            options: {
                choices: [
                    { value: 'laptop', title: { en: 'Laptop' }, icon: 'laptop' },
                    { value: 'tablet', title: { en: 'Tablet' }, icon: 'tablet' },
                    { value: 'mobile', title: { en: 'Mobile' }, icon: 'mobile' },
                ],
            },
        },
        toggleEdit: {
            type: 'Button',
            options: {
                text: { en: 'Toggle edition', fr: 'Toggle edition' },
                color: 'blue',
                action: 'toggleEdit',
            },
        },
    };
};

export const getSettingsConfigurations = content => {
    return { settingsOptions: { ...options(content) } };
};
