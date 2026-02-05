import localFont from 'next/font/local';

export const arrayFont = localFont({
    src: [
        { path: '../../public/fonts/Array-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/Array-Bold.woff2', weight: '700', style: 'normal' },
        { path: '../../public/fonts/Array-BoldWide.woff2', weight: '900', style: 'normal' },
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

export const exconFont = localFont({
    src: [
        { path: '../../public/fonts/Excon-Variable.woff2' },
    ],
    variable: '--font-excon',
})

export const satoshiFont = localFont({
    src: [
        { path: '../../public/fonts/Satoshi-Variable.woff2' },
    ],
    variable: '--font-satoshi',
})

export const stardomFont = localFont({
    src: [
        { path: '../../public/fonts/Stardom-Regular.woff2' },
    ],
    variable: '--font-stardom',
})