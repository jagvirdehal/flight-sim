import { Box, Cylinder, Extrude, Plane, PerspectiveCamera, OrbitControls, useKeyboardControls } from "@react-three/drei";
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils, Quaternion, Vector3 } from "three";
import { Matrix4 } from "three";
import { useSpring, animated, config } from '@react-spring/three';
import { lerp } from "three/src/math/MathUtils";

function AirplaneModel(props) {
    const BODY_SIZE = 0.01;
    
    const bodyExtrusion = {
        steps: 4,
        depth: 3,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 0.5 - BODY_SIZE,
        bevelOffset: 0,
        bevelSegments: 5
    };

    const bodyShape = React.useMemo(() => {
        const _shape = new THREE.Shape();

        _shape.moveTo(-BODY_SIZE, -BODY_SIZE);
        _shape.lineTo(BODY_SIZE, -BODY_SIZE);
        _shape.lineTo(BODY_SIZE, BODY_SIZE);
        _shape.lineTo(-BODY_SIZE, BODY_SIZE);
        _shape.lineTo(-BODY_SIZE, -BODY_SIZE);

        return _shape;
    }, []);

    return(
        <group {...props}>
            <group position={[0, 0, 0]}>
                {/* Body */}
                <Extrude args={[bodyShape, bodyExtrusion]} position={[0, 0, -1.5]}>
                    <meshStandardMaterial color={props.color} />
                </Extrude>

                {/* Tail */}
                <group position={[0, 0, -2.8]}>
                    <Box args={[2.5, 0.1, 0.5]}>
                        <meshStandardMaterial color={props.color} />
                    </Box>
                    <Box args={[0.1, 1.5, 0.5]}>
                        <meshStandardMaterial color={props.color} />
                    </Box>
                </group>
            </group>

            {/* Wings */}
            <group position={[0, 0.35, 1.75]}>
                <Box args={[7, 0.2, 1]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color={props.color} />
                </Box>
                <Box args={[7, 0.2, 1]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color={props.color} />
                </Box>
            </group>

            {/* Wing connectors */}
            <group position={[0, 0.35, 1.75]}>
                <Cylinder args={[0.1, 0.1, 1, 30]} position={[-3, 0, 0]}>
                    <meshStandardMaterial color={props.secondaryColor} />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 1, 30]} position={[-1.3, 0, 0]}>
                    <meshStandardMaterial color={props.secondaryColor} />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 1, 30]} position={[1.3, 0, 0]}>
                    <meshStandardMaterial color={props.secondaryColor} />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 1, 30]} position={[3, 0, 0]}>
                    <meshStandardMaterial color={props.secondaryColor} />
                </Cylinder>
            </group>
        </group>
    );
}

export default function Airplane(props) {
    const camHeight = 0;
    const camDistance = 15;
    const camInterp = 1;
    const camRotInterp = camInterp;

    const planeObj = useRef();
    const camObj = useRef();
    const rollObj = useRef();
    const arrow = useRef();
    const arrow2 = useRef();

    const maxSpeed = 5;
    const acceleration = 0.1;
    const [speed, setSpeed] = useState(props.speed ? props.speed : 0);
    
    // const [pitch, setPitch] = useState(props.pitch ? props.pitch : 0);
    // const [yaw, setYaw] = useState(props.yaw ? props.yaw : 0);
    
    const [roll, setRoll] = useState(props.roll ? props.roll : 0);
    const [fakePitch, setFakePitch] = useState(0);

    // const [axes, setAxes] = useState([0, 0]);
    // const [sub, get] = useKeyboardControls()

    // const [camRoll, setCamRoll] = useState(roll);
    // const [camPitch, setCamPitch] = useState(pitch);
    // const [camYaw, setCamYaw] = useState(yaw);
    
    const [position, setPosition] = useState(new Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));

    const [fwdVector, setFwdVector] = useState(new Vector3(0, 0, 1));
    const [leftVector, setLeftVector] = useState(new Vector3(1, 0, 0));
    const [upVector, setUpVector] = useState(new Vector3(0, 1, 0));

    const [camPos, setCamPos] = useState(new Vector3(0, camHeight, -camDistance));

    useFrame(() => {
        setRoll(MathUtils.lerp(roll, props.roll, 0.15));
        setFakePitch(MathUtils.lerp(fakePitch, props.pitch, 0.15));
    });

    useFrame((state, delta) => {
        // Update position based on direction vector and speed
        if (speed != 0) {
            let newPosition = new Vector3();
            newPosition.copy(position);
            newPosition.addScaledVector(fwdVector, speed / 60);
            setPosition(newPosition);
        }

        if (speed < maxSpeed || acceleration < 0) {
            // Update speed based on ACCELERATION
            const newSpeed = MathUtils.clamp(speed + acceleration, 0, maxSpeed);
            setSpeed(newSpeed);
        }

        // setFakePitch(0.0);
        // setRoll(0.0);

        // Update cam position based on the plane position from 60 frames ago
        //  and distance from 30 frames ago
        // let newCamPosition = new Vector3().copy(newPosition);
        // newCamPosition.addScaledVector(direction, -camDistance);

        // Interpolate cam pos based on plane pos
        // let oldPos = new Vector3().copy(camPos);
        // setCamPos(oldPos.lerp(newCamPosition, camInterp));

        // Interpolate cam RPY based on plane RPY
        // setCamRoll(lerp(camRoll, roll, camRotInterp));
        // setCamPitch(lerp(camPitch, pitch, camRotInterp));
        // setCamYaw(lerp(camYaw, yaw, camRotInterp));
    });

    useFrame(() => {
        if (roll != 0 || fakePitch != 0) {
            const rollQuaternion = new Quaternion().setFromAxisAngle(fwdVector, roll);
            const newLeftVector = new Vector3().copy(leftVector).applyQuaternion(rollQuaternion);
            
            const pitchQuaternion = new Quaternion().setFromAxisAngle(newLeftVector, fakePitch);
            const newFwdVector = new Vector3().copy(fwdVector).applyQuaternion(pitchQuaternion);
            const newUpVector = new Vector3().copy(upVector).applyQuaternion(rollQuaternion).applyQuaternion(pitchQuaternion);
    
            setFwdVector(newFwdVector);
            setUpVector(newUpVector);
            setLeftVector(newLeftVector);
        }
    });

    useEffect(() => {
        // arrow.current.lookAt(leftVector);
        // arrow2.current.lookAt(upVector);
        planeObj.current.up = upVector;
        planeObj.current.lookAt(new Vector3().addVectors(fwdVector, position));
        
        camObj.current.up = upVector;
        camObj.current.lookAt(position);
        let newPos = position.clone().addScaledVector(fwdVector.clone().normalize(), -camDistance);
        setCamPos(newPos);
    }, [fwdVector, upVector])

    // useEffect(() => {
    //     return;
    //     const updateVectors = () => {
    //         const t = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    //         // setFwdVector(t);
    //         setFwdVector(new Vector3().setFromSphericalCoords(1, pitch + Math.PI / 2, yaw));
    //         setLeftVector(new Vector3().setFromSphericalCoords(1, Math.PI / 2, yaw + Math.PI / 2));
    //         // setUpVector(new Vector3().crossVectors(fwdVector, leftVector));
    //     };
    //     updateVectors();

    //     let newLeftVector = new Vector3();

    //     if (fakePitch != 0) {
    //         // we want to convert 'fakePitch' to a change in pitch/yaw values, based on roll
    //         const rollQuaternion = new Quaternion().setFromAxisAngle(fwdVector, roll);
    //         newLeftVector = new Vector3().copy(leftVector).applyQuaternion(rollQuaternion);
    
    //         const pitchQuaternion = new Quaternion().setFromAxisAngle(newLeftVector, fakePitch);
    //         const newFwdVector = new Vector3().copy(fwdVector).applyQuaternion(pitchQuaternion);
            
    //         const Sphere = new THREE.Spherical().setFromVector3(newFwdVector);
    //         const newPitch = Sphere.phi - Math.PI / 2;
    //         const newYaw = Sphere.theta;

    //         // const { x, y } = newFwdVector;
    //         // const newPitch = Math.asin(y);
    //         // const newYaw = Math.asin(x / Math.cos(newPitch));
    
    //         // console.log(fwdVector, newFwdVector);

    //         // console.log("pitch:", newPitch - pitch, newFwdVector, x, y);
    //         // console.log("yaw:", newYaw - yaw);
    
    //         setPitch(newPitch);
    //         setYaw(newYaw);
    //         // setFakePitch(0);

    //         updateVectors();
    //     }

    //     arrow.current.lookAt(fwdVector);
    //     arrow2.current.lookAt(newLeftVector);
    //     // boxObj.current.up = upVector;
    //     boxObj.current.lookAt(fwdVector);
    // }, [roll, fakePitch, temp]);

    /*
    useEffect(() => {
        const fwdVector = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
        // const leftVector = new Vector3(Math.cos(roll) * Math.cos(yaw), Math.sin(roll), Math.sin(yaw));
        // const upVector = new Vector3(-Math.sin(roll), Math.cos(roll) * Math.cos(pitch), -Math.sin(pitch));
        const bwdVector = new Vector3().copy(fwdVector).negate();

        const randoUpVector = new Vector3(
            Math.cos(pitch)*Math.sin(-roll),
            -Math.sin(yaw)*Math.sin(pitch)*Math.sin(-roll) + Math.cos(yaw)*Math.cos(-roll),
            -Math.cos(yaw)*Math.sin(pitch)*Math.sin(-roll) - Math.sin(yaw)*Math.cos(-roll),
        )
        const upVector = new Vector3().copy(randoUpVector);

        const newFwdVector = new Vector3().copy(fwdVector);
        const newUpVector = new Vector3().copy(upVector);
        
        newFwdVector.lerp(upVector, fakePitch);
        newUpVector.lerp(bwdVector, fakePitch);

        const newBwdVector = new Vector3().copy(newFwdVector).negate();

        // console.log(fwdVector, newFwdVector, "\n", upVector, newUpVector, "\n", bwdVector, newBwdVector);
        console.log("dot:", newFwdVector.dot(newUpVector));
        // fwdVector.copy(newFwdVector);
        // bwdVector.copy(newBwdVector);
        // upVector.copy(newUpVector);

        const newPitch = Math.asin(newFwdVector.y);
        const newYaw = Math.asin(newFwdVector.x / Math.cos(newPitch));
        const newRoll = -Math.asin(newUpVector.x / Math.cos(newPitch));

        // setPitch(newPitch);
        // setYaw(newYaw);
        // setRoll(newRoll);

        // console.log("roll:", roll, newRoll);

        // console.log("w");

        // console.log(newPitch, newYaw);

        // arrow.current.lookAt(randoUpVector);
        arrow2.current.lookAt(fwdVector);

        // console.log(randoUpVector.equals(upVector));
        // boxObj.current.rotateOnAxis(new Vector3(0, 0, 1), roll);
        boxObj.current.up = newUpVector;
        boxObj.current.lookAt(newFwdVector);

        if (fakePitch != 0) {
            console.log(fakePitch);
            setFakePitch(0);
        }

        // console.log(roll, pitch, yaw);

        setDirection(fwdVector);
    }, [roll, fakePitch]);
    */

    return(
        <group>
            <group position={position}>
                <group ref={planeObj}>
                    {/* <Box args={[1, 1, 3]}>
                        <meshStandardMaterial color="green" />
                    </Box>
                    <Box position-z={2.5} position-y={-.2} args={[1, 0.5, 1]}>
                        <meshStandardMaterial color="green" />
                    </Box> */}
                    <AirplaneModel {...props} />
                    <PerspectiveCamera makeDefault={true} position={[0, camHeight, -camDistance]} rotation={[0, Math.PI, 0]} />
                </group>
            </group>
            {/* <group>
                <group ref={arrow}>
                    <Cylinder args={[0, 0.5, 8, 10]} position-y={0} rotation-x={Math.PI / 2}>
                        <meshBasicMaterial color="green"/>
                    </Cylinder> 
                </group>
            </group>
            <group ref={arrow2}>
                <Cylinder args={[0, 0.5, 8, 10]} position-y={0} rotation-x={Math.PI / 2}>
                    <meshBasicMaterial color="blue" />
                </Cylinder> 
            </group> */}
            {/* <group rotation-y={yaw} position={position} visible={false}>
                <group rotation-z={0}>
                    <group rotation-x={-pitch} rotation-z={roll} >
                        <group rotation-z={0}>
                            <AirplaneModel {...props} />
                        </group>
                    </group>
                </group>
            </group> */}
            <group position={camPos}>
                <group ref={camObj}>
                    {/* <PerspectiveCamera makeDefault={true} position={[0, camHeight, 0]} rotation={[0, Math.PI, 0]} /> */}
                </group>
                {/* <Box makeDefault={true} position={[0, camHeight, 0]} rotation={[0, Math.PI, 0]}></Box> */}
            </group>
            {/* <OrbitControls target={position} /> */}
        </group>
    );
}