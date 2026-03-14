export enum IllustrationSizes {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    BIG = 'BIG',
    GIANT = 'GIANT',
}

const sizeClasses: Record<IllustrationSizes, string> = {
    [IllustrationSizes.SMALL]: 'w-24 h-24',    // 24px
    [IllustrationSizes.MEDIUM]: 'w-32 h-32',   // 36px (proche de 40px/w-10)
    [IllustrationSizes.BIG]: 'w-40 h-40',    // 48px
    [IllustrationSizes.GIANT]: 'w-48 h-48',  // 64px
};

export default function Illustration({ name, size = IllustrationSizes.MEDIUM }: { name: string, size?: IllustrationSizes }) {
    return (
        <img
            src={`/illustrations/${name}.png`}
            className={`${sizeClasses[size]} object-contain w-4`}
            alt={name}
        />
    );
}