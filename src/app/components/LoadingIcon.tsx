import ICON from "../../../public/ico/loader.json";
import {Player} from "@lordicon/react";
import {useEffect, useRef} from "react";

/**
 * Loader (icone de chargement) utilisant une animation de Lordicon.
 * L'animation se répète indéfiniment tant que le composant est monté.
 * @constructor
 */
export default function LoadingIcon() {

    const playerRef = useRef<Player>(null);

    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, []);

    return (
        <Player
            ref={playerRef}
            icon={ ICON }
            onComplete={() => playerRef.current?.playFromBeginning()}
        />
    )
}