import { Plane } from "@react-three/drei"
import { DoubleSide, TextureLoader, RepeatWrapping } from "three"
import { useLoader } from '@react-three/fiber';

export default function World(props) {
    const size = props.size ? props.size : 10;
	const roughnessMap = useLoader(TextureLoader, 'grassroughness.jpg');
    const textureMap = useLoader(TextureLoader, 'grasstexture.webp');

	roughnessMap.wrapS = RepeatWrapping;
	roughnessMap.wrapT = RepeatWrapping;
	roughnessMap.repeat.set(size/10, size/10);
    // textureMap.wrapS = textureMap.wrapT = RepeatWrapping;

    // textureMap.repeat.set(size, size)

    return(
        <Plane {...props} args={[size, size]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial side={DoubleSide} roughnessMap={roughnessMap} color={"lightgreen"} roughness={1} metalness={0.6}/>
        </Plane>
    )
}
