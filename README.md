# Flight Simulator

## Overview

This is an accessible flight simulation experience that uses a smartphone accelerometer to control the plane. This allows users who don't have an expensive controller/joystick to have a taste for what its like to fly a plane.

This was a JavaScript project made this using **React, Three.js, Node.js, and <span>Socket.io</span>**, among other smaller libraries.

The goal of this project was to demo an immersive flight simulator that is accessible for nearly anyone to try without any fancy controllers. Personally, I enjoy the idea of creating a fun experience that anyone can enjoy, and this demo shows that a flight simulation experience can be created in such a way that is accessible to anyone with a cellphone and a computer.

## Install

### Docker (recommended):
TODO: Add install instructions with docker

### Manual install:

1. Clone the repository
2. Run `npm install` to install dependencies (node >= v14 required)
3. Run `npm start` to run airplane view (access at `localhost:3000`)
4. Enter `socket/` directory and run `node server.js` to run the socket connecting your phone to the airplane (access at `localhost:3030`)

## Next steps

- Smooth camera logic
- Plane SFX
- A QR code to connect with phone
- Dynamic terrain/scenes to fly in
	- Google earth support?
- Support for multiple socket connections on the same server


