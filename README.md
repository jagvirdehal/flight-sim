# Flight Simulator

## Overview

![Demo Image](demo.png)

This is an accessible flight simulation experience that uses a smartphone accelerometer to control the plane. This allows users who don't have an expensive controller/joystick to have a taste for what its like to fly a plane.

This was a JavaScript project made this using **React, Three.js, Node.js, and <span>Socket.io</span>**, among other smaller libraries.

The goal of this project was to demo an immersive flight simulator that is accessible for nearly anyone to try without any fancy controllers. Personally, I enjoy the idea of creating a fun experience that anyone can enjoy, and this demo shows that a flight simulation experience can be created in such a way that is accessible to anyone with a cellphone and a computer.

## Install

### Docker (recommended):

1. Run `./docker_build.sh` to build the docker image
2. Run `./docker_run.sh` to run the container
3. Visit `http://localhost:3030` to view the simulator
4. Enter `docker stop flight-sim` to stop the container

### Manual:

1. Clone the repository
2. Run `npm install` to install dependencies (node >= v14 required)
3. Run `npm run build` to build the front-end view
4. Copy the `build/` folder to the `socket/` directory under `socket/build/`.
5. Enter `socket/` directory
	- Run `npm install` to install socket dependencies
	- Run `node server.js` to run the simulator

## Running the simulator

Simply run the simulator based on the install method chosen above. Then, scan the QR code shown with a smartphone. Once connected, it should begin to control the airplane like a joystick. Hold the phone upright, with the charging port facing down, and the screen facing to your left. Enjoy!

## Next steps

- ~~Smooth camera logic~~
- Plane SFX
- ~~A QR code to connect with phone~~
- Dynamic terrain/scenes to fly in
	- Google earth support?
- Support for multiple socket connections on the same server
- Fix quaternion calculations to smooth bumpy controls
