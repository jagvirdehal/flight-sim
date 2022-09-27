import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import World from "./world";
import Airplane from "./airplane";

export default function Scene() {
    return(
        <Canvas>
            <World size={1000} position={[0, -2, 0]} />
            <Airplane position={[0, 0, 0]} color="red" secondaryColor="lightgrey" scale={1} />

            <pointLight position={[5,3,4]}/>
            <pointLight position={[-5,3,4]}/>
            <pointLight position={[0,2,-4]}/>
            <ambientLight />
        </Canvas>
    );
}