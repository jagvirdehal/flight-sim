import { Box, Extrude, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from "@react-three/fiber";
import { Shape, MathUtils, Quaternion, Vector3,
    MeshStandardMaterial, BoxGeometry, CylinderGeometry, Object3D } from "three";

// Constants for settings (later?)
const camHeight = 0;
const camDistance = 15;
const maxCamDistance = 20;
const rpSmoothing = 0.15;

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
        const _shape = new Shape();

        _shape.moveTo(-BODY_SIZE, -BODY_SIZE);
        _shape.lineTo(BODY_SIZE, -BODY_SIZE);
        _shape.lineTo(BODY_SIZE, BODY_SIZE);
        _shape.lineTo(-BODY_SIZE, BODY_SIZE);
        _shape.lineTo(-BODY_SIZE, -BODY_SIZE);

        return _shape;
    }, []);

    // Materials
    const primaryMat = new MeshStandardMaterial({color: props.color ? props.color : 'red'});
    const secondaryMat = new MeshStandardMaterial({color: props.secondaryColor ? props.secondaryColor : 'lightgrey'})
    
    // Geometries
    const wingGeometry = new BoxGeometry(7, 0.2, 1);
    const wingConnectorGeometry = new CylinderGeometry(0.1, 0.1, 1, 30);

    return(
        <group {...props}>
            {/* Body */}
            <Extrude args={[bodyShape, bodyExtrusion]} material={primaryMat} position={[0, 0, -1.5]} />

            {/* Tail */}
            <group position={[0, 0, -2.3]}>
                <Box args={[2.5, 0.1, 0]} material={primaryMat} />
                <Box args={[0.1, 1.5, 0]} material={primaryMat} />
            </group>

            {/* Wings */}
            <group position={[0, 0.35, 1.75]}>
                <mesh geometry={wingGeometry} material={primaryMat} position={[0, 0.5, 0]} />
                <mesh geometry={wingGeometry} material={primaryMat} position={[0, -0.5, 0]} />

                {/* Wing connectors */}
                <mesh geometry={wingConnectorGeometry} material={secondaryMat} position={[-3, 0, 0]} />
                <mesh geometry={wingConnectorGeometry} material={secondaryMat} position={[-1.3, 0, 0]} />
                <mesh geometry={wingConnectorGeometry} material={secondaryMat} position={[1.3, 0, 0]} />
                <mesh geometry={wingConnectorGeometry} material={secondaryMat} position={[3, 0, 0]} />
            </group>
        </group>
    );
}

export default function Airplane(props) {
    const planeObj = useRef();
    const camObj = useRef();
    const dummyObj = useRef(new Object3D());

    const maxSpeed = 50;
    const turboSpeed = 75;
    const acceleration = 10;
    const [speed, setSpeed] = useState(props.speed ? props.speed : 3);
    
    const [roll, setRoll] = useState(props.roll ? props.roll : 0);
    const [pitch, setPitch] = useState(0);
    
    const [position, setPosition] = useState(new Vector3(0, 10, 0));
    const [camPos, setCamPos] = useState(new Vector3(0, camHeight, -camDistance));

    const [fwdVector, setFwdVector] = useState(new Vector3(0, 0, 1));
    const [leftVector, setLeftVector] = useState(new Vector3(1, 0, 0));
    const [upVector, setUpVector] = useState(new Vector3(0, 1, 0));

    const deltaClamp = delta => MathUtils.clamp(delta, 0, 0.05);

    useFrame((state, delta) => {
        // Update position based on direction vector and speed
        if (speed != 0) {
            let newPosition = position.clone();
            newPosition.addScaledVector(fwdVector, speed * deltaClamp(delta));
            setPosition(newPosition);

            // Camera position
            let totalDistance = camDistance + (speed / maxSpeed) * (maxCamDistance - camDistance);
            let newCamPos = newPosition.clone().addScaledVector(fwdVector, -totalDistance);
            setCamPos(newCamPos);
        }

        // Update speed based on ACCELERATION
        if (speed !== maxSpeed || acceleration < 0 || props.turbo) {
            let newSpeed = speed;
            // console.log(props.turbo);
            if (props.turbo) {
                newSpeed = MathUtils.lerp(newSpeed, turboSpeed, 0.1);
            } else if (newSpeed > maxSpeed) {
                newSpeed = MathUtils.lerp(newSpeed, maxSpeed, 0.1);
                if ((newSpeed - maxSpeed) / 100 < 1e-10) {
                    newSpeed = maxSpeed;
                }
            } else {
                newSpeed = speed + acceleration * deltaClamp(delta)
                newSpeed = MathUtils.clamp(newSpeed, 0, maxSpeed);
                // console.log('c');
            }
            
            // console.log(speed);
            setSpeed(newSpeed);
        }
    });

    useFrame((state, delta) => {
        setRoll(MathUtils.lerp(roll, props.roll, rpSmoothing));
        setPitch(MathUtils.lerp(pitch, props.pitch, rpSmoothing));

        if (roll != 0 || pitch != 0) {
            const rollSpeed = 1.5 * speed / maxSpeed;
            const pitchSpeed = 0.8 * rollSpeed;

            const rollQuaternion = new Quaternion().setFromAxisAngle(fwdVector, roll * rollSpeed * deltaClamp(delta));
            const newLeftVector = leftVector.clone().applyQuaternion(rollQuaternion);
            
            const pitchQuaternion = new Quaternion().setFromAxisAngle(newLeftVector, pitch * pitchSpeed * deltaClamp(delta));
            const newFwdVector = fwdVector.clone().applyQuaternion(pitchQuaternion);
            const newUpVector = upVector.clone().applyQuaternion(rollQuaternion).applyQuaternion(pitchQuaternion);
    
            setFwdVector(newFwdVector);
            setUpVector(newUpVector);
            setLeftVector(newLeftVector);
        }

        dummyObj.current.up = upVector;
        dummyObj.current.lookAt(fwdVector);

        // planeObj.current.up = upVector;
        // planeObj.current.lookAt(position.clone().addScaledVector(fwdVector, 1));
        planeObj.current.quaternion.slerp(dummyObj.current.quaternion, 0.9);
        camObj.current.quaternion.slerp(dummyObj.current.quaternion, 0.1);
    });

    return(
        <group>
            <group position={position}>
                <group ref={planeObj}>
                    <AirplaneModel {...props} />
                </group>
            </group>
            <group position={camPos} ref={camObj}>
                <PerspectiveCamera makeDefault={true} position={[0, camHeight, 0]} rotation={[0, Math.PI, 0]} />
            </group>
        </group>
    );
}
