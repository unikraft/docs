import React, { useEffect, useRef, useState } from 'react'
import 'asciinema-player/dist/bundle/asciinema-player.css'
import { useColorModeValue } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

type AsciinemaPlayerProps = {
    src: string;
    cols?: string;
    rows?: string;
    // autoPlay?: boolean
    // preload?: boolean;
    // loop?: boolean | number;
    startAt?: number | string;
    speed?: number;
    idleTimeLimit?: number;
    poster?: string;
    fit?: string;
    fontSize?: string;
};

function AsciinemaPlayer ({src, ...props}) {
    const ref = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState<typeof import("asciinema-player")>()
    
    const {
        cols,
        rows,
        autoPlay,
        preload,
        loop,
        startAt,
        speed,
        idleTimeLimit,
        poster,
        fit,
        fontSize,
        ...rest
    } = props;

    const theme = useColorModeValue('docs-light', 'docs-dark');

    useEffect(() => {
        import("asciinema-player").then(p => {setPlayer(p)})
    }, [])

    useEffect(() => {
        const currentRef = ref.current
        const instance = player?.create(
            src,
            currentRef,
            {
                cols: cols,
                rows: rows,
                autoPlay: true,
                preload: true,
                loop: true,
                startAt: startAt,
                speed: speed,
                idleTimeLimit: idleTimeLimit,
                theme: theme,
                poster: poster,
                fit: fit,
                fontSize: fontSize,
            },
        );
        return () => {instance?.dispose()}
    }, [src, player, props]);

    return <Box ref={ref} {...rest} />;
}

export default AsciinemaPlayer
