// usually taken from the things collection : https://www.thiings.co/things

export enum IllustrationSizes {
    SMALL = 24,
    MEDIUM = 36,
    BIG = 48,
    GIANT = 64,
}
export default function Illustration({name, size=IllustrationSizes.MEDIUM}: {name: string, size?: IllustrationSizes}) {
    return <img src={`/illustrations/${name}.png`} className={`w-${size} object-contain`}/>
}