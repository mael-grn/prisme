import ICON from "../../../../public/ico/loader.json";
import {Player} from "@lordicon/react";
import {useEffect, useRef} from "react";

/**
 * Loader (icone de chargement) utilisant une animation de Lordicon.
 * L'animation se répète indéfiniment tant que le composant est monté.
 * @constructor
 */
export default function LoadingIcon({size = 30} : {size?: number}) {

    const playerRef = useRef<Player>(null);

    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, []);

    return (
        <Player
            ref={playerRef}
            size={size}
            icon={ ICON }
            colorize={"var(--foreground)"}
            onComplete={() => playerRef.current?.playFromBeginning()}
        />
    )
}