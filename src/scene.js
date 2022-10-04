import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, useKeyboardControls } from "@react-three/drei";
import World from "./world";
import Airplane from "./airplane";

export default function Scene() {
    const [sub, get] = useKeyboardControls();
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);

    useEffect(() => {
        return sub(
            (state) => [-state.up + state.down, -state.left + state.right],
            (axes) => {
                setPitch(axes[0] * 0.01);
                setRoll(axes[1] * 0.01);
            },
        )
    }, []);

    useEffect(() => {
        fetch('http://localhost:3030/api/gyro').then(res => res.json()).then(data => {console.log(data);})
    });

    return(
        <Canvas>
            <World size={1000} position={[0, -2, 0]} />
            <Airplane
                position={[0, 0, 0]}
                color="red"
                secondaryColor="lightgrey"
                scale={1}
                roll={roll}
                pitch={pitch}
                />

            <pointLight position={[5,3,4]}/>
            <pointLight position={[-5,3,4]}/>
            <pointLight position={[0,2,-4]}/>
            <ambientLight />
        </Canvas>
    );
}