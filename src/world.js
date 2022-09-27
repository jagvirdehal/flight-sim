import { Plane } from "@react-three/drei"
import { DoubleSide } from "three"

export default function World(props) {
    const size = props.size ? props.size : 10;

    return(
        <Plane {...props} args={[size, size, size, size]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="lightgreen" side={DoubleSide} wireframe />
        </Plane>
    )
}