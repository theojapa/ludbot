import React from 'react';
import THREE from 'three';

// Outer array: -119.401 to -119.8 longitude (.001 step)
// Inner array: 37.7 to 37.8 latitude
// The first value is the elevation at 37.7 latitude, and subsequent values are deltas
// e.g., [ 2810, -21, 5, -7, ... ] => [ 2810, 2789, 2794, 2787, ... ]
import yos from './yosemite.json';

var zDivider = 100;

const Component = React.createClass({
    componentDidMount: function() {
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);

        var xMiddle = Math.floor(yos.length / 2),
            yMiddle = Math.floor(yos[0].length / 2);

        var steer = { x: 0, y: 0, z: 0 };

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.up = new THREE.Vector3(0, 0, 1);
        camera.position.set(yos.length + 10, yMiddle, 30);
        camera.lookAt(new THREE.Vector3(xMiddle, yMiddle, 0));

        var spotlight = new THREE.SpotLight(0xffffff);
        spotlight.position.set(-100, xMiddle, 200);

        this._el.appendChild(renderer.domElement);

        // Convert from deltas and flip
        yos.forEach(function(lng) {
            lng.forEach(function(z, y) {
                lng[y] = y ? lng[y - 1] + z : z;
            });
            lng.reverse();
        });

        var vertices = [],
            faces = [],
            xyz = {};

        yos.forEach(function(lng, x) {
            xyz[x] = {};
            lng.forEach(function(z, y) {
                vertices.push(new THREE.Vector3(x, y, z / zDivider));

                xyz[x][y] = z;
            
                if (x && y) {
                    // Create two triangular sides for a square in which 
                    // this vertex is upper right
                    let ur = vertices.length - 1,   // upper right
                        ul = ur - 1,                // upper left
                        lr = ur - lng.length,       // lower right
                        ll = lr - 1;                // lower left

                    // Clockwise
                    faces.push(new THREE.Face3(ur, lr, ll));
                    faces.push(new THREE.Face3(ul, ur, ll));
                }            
            });
        });

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        var materials = [
            new THREE.MeshLambertMaterial({ color: 0x444444 })
        ];

        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);

        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 10, 200);
        scene.add(spotlight);
        scene.add(mesh);

        function renderScene() {
            var y, z;

            camera.position.x -= 0.1;
            camera.position.y += steer.y;
            camera.position.z += steer.z;

            if (camera.position.x < 0) {
                camera.position.x = yos.length + 200;
            }

            // Prevent crashing into the ground
            y = xyz[Math.floor(camera.position.x)];
            if (y) {
                z = y[Math.floor(camera.position.y)];
                if (undefined !== z) {
                    z = z / zDivider;
                }

                if (camera.position.z < z) {
                    camera.position.z = z + 1;
                    steer.z = 0.1;
                } else if (camera.position.z - 2 < z) {
                    steer.z = 0.0;
                }
            }

            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
        }

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', handleResize, false);
        window.addEventListener('mousemove', handleMouseMove, false);

        function handleMouseMove(ev) {
            if (ev.pageY < window.innerHeight / 3) {
                steer.z = 0.1; // Ascend if mouse in top third
            } else if (ev.pageY > window.innerHeight * 2 / 3) {
                steer.z = -0.1; // Descend if mouse in bottom third
            } else {
                steer.z = 0.0;
            }

            if (ev.pageX < window.innerWidth / 3) {
                steer.y = -0.1; // Move left if mouse in left third
            } else if (ev.pageX > window.innerWidth * 2 / 3) {
                steer.y = 0.1; // Move right if mouse in right third
            } else {
                steer.y = 0.0;
            }
        }

        renderScene();
    },
    render() {
        return (
            <div className="peaks" ref={(c) => this._el = c}></div>
        );
    }
});

export default Component;
