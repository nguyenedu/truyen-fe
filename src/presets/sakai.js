import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const Sakai = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{sky.600}',
                    inverseColor: '#ffffff',
                    hoverColor: '{sky.700}',
                    activeColor: '{sky.800}'
                },
                highlight: {
                    background: '{sky.50}',
                    focusBackground: '{sky.100}',
                    color: '{sky.700}',
                    focusColor: '{sky.800}'
                },
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            },
            dark: {
                primary: {
                    color: '{sky.400}',
                    inverseColor: '{sky.950}',
                    hoverColor: '{sky.300}',
                    activeColor: '{sky.200}'
                },
                highlight: {
                    background: 'rgba(125, 211, 252, 0.16)',
                    focusBackground: 'rgba(125, 211, 252, 0.24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

export default Sakai;
