import localFont from 'next/font/local';

/**
 * All font declarations, loaded from local files
 */

export const arrayFont = localFont({
    src: [
        { path: '../../public/fonts/Array-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/Array-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-array',
})

export const chillaxFont = localFont({
    src: [
        { path: '../../public/fonts/Chillax-Variable.woff2' },
    ],
    variable: '--font-chillax',
})

export const clashDisplayFont = localFont({
    src: [
        { path: '../../public/fonts/ClashDisplay-Variable.woff2' },
    ],
    variable: '--font-clashdisplay',
})

export const boskaFont = localFont({
    src: [
        { path: '../../public/fonts/Boska-Variable.woff2' },
    ],
    variable: '--font-boska',
})

export const satoshiFont = localFont({
    src: [
        { path: '../../public/fonts/Satoshi-Variable.woff2' },
    ],
    variable: '--font-satoshi',
})

export const outfitFont = localFont({
    src: [
        { path: '../../public/fonts/Outfit-Variable.woff2' },
    ],
    variable: '--font-outfit',
})