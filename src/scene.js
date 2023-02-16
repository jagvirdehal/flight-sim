import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import World from "./world";
import Airplane from "./airplane";

export default function Scene(props) {
    const [sub, get] = useKeyboardControls();
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [turbo, setTurbo] = useState(false);
    const [deadZoneH, deadZoneV] = [2, 2];

    const gyroLoop = (url) => setInterval(() => {
        fetch(url).then(res => res.json()).then(data => {
            let gyro = data.gyro.slice(-sampleCount);
            let [x, y, z] = [0, 0, 0];

            gyro.forEach(val => {
                x += val.x / sampleCount;
                y += val.y / sampleCount;
                z += val.z / sampleCount;
            })

            const deadZone = (val, range) => {
                if (val >= range) {
                    return val - range;
                } else if (val <= -range) {
                    return val + range;
                } else {
                    return 0;
                }
            }

            let axes = [
                deadZone(x, deadZoneV),
                deadZone(z, deadZoneH),
            ];

            if (axes[0] !== 0 || axes[1] !== 0) {
                setRoll(axes[1] * Math.PI / 16);
                setPitch(axes[0] * Math.PI / 16);
            }
        })
    }, 100);

    useEffect(() => {
        const newUrl = `http://localhost:3030/api/gyro?remoteId=${props.remoteId}`;
        const loop = gyroLoop(newUrl);

        return () => clearInterval(loop);
    }, [props.remoteId])

    useEffect(() => {
        return sub(
            (state) => [state.up - state.down, -state.left + state.right, state.turbo],
            (axes) => {
                setRoll(axes[1] * Math.PI / 4);
                setPitch(axes[0] * Math.PI / 6);
                setTurbo(axes[2] ? true : false);
            },
        )
    }, []);

    const sampleCount = 5;
    // useEffect(() => {
        
    //     return () => clearInterval(loop);
    // }, []);

    return(
        <Canvas>
            <World size={10000} position={[0, -2, 0]} />
            <Airplane
                position={[0, -0.5, 0]}
                color="red"
                secondaryColor="lightgrey"
                scale={1}
                roll={roll}
                pitch={pitch}
                turbo={turbo}
                />

            {/* <pointLight position={[5,3,4]}/>
            <pointLight position={[-5,3,4]}/>
            <pointLight position={[0,2,-4]}/> */}
            <pointLight position={[250, 1000, 500]} />
            {/* <pointLight position={[-500, 100, 500]} />
            <pointLight position={[500, 100, -500]} />
            <pointLight position={[-500, 100, -500]} /> */}
            <ambientLight intensity={0.4} />
        </Canvas>
    );
}
