import React from 'react';
import THREE from 'three';

// Outer array: -119.401 to -119.8 longitude (.001 step)
// Inner array: 37.7 to 37.8 latitude
// The first value is the elevation at 37.7 latitude, and subsequent values are deltas
// e.g., [ 2810, -21, 5, -7, ... ] => [ 2810, 2789, 2794, 2787, ... ]
import yos from './yosemite.json';

const Component = React.createClass({
    componentDidMount: function() {
        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 10, 200);

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);

        var xMiddle = Math.floor(yos.length / 2),
            yMiddle = Math.floor(yos[0].length / 2);

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.up = new THREE.Vector3( 0, 0, 1 );
        camera.position.x = yos.length + 10;
        camera.position.y = yMiddle;
        camera.position.z = 30;
        camera.lookAt(new THREE.Vector3(xMiddle, yMiddle, 0));

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, xMiddle, 200);
        spotLight.castShadow = true;
        scene.add(spotLight);

        this._el.appendChild(renderer.domElement);

        var vertices = [],
            faces = [],
            lng_n = yos.length,
            lat_n;

        // Convert from deltas and flip
        for (var x = 0; x < yos.length; ++x) {
            lat_n = yos[x].length;
            for (var y = 0; y < lat_n; ++y) {
                yos[x][y] = y ? yos[x][y-1] + yos[x][y] : yos[x][y];
            }

            yos[x].reverse();
        }

        for (var x = 0; x < yos.length; ++x) {
            lat_n = yos[x].length;
            for (var y = 0; y < lat_n; ++y) {
                vertices.push(new THREE.Vector3(x, y, yos[x][y] / 100));
            
                if (x && y) {
                    // Create two triangular sides for a square in which 
                    // this vertex is at upper right
                    let ur = vertices.length - 1,   // upper right
                        ul = ur - 1,                // upper left
                        lr = ur - lat_n,            // lower right
                        ll = lr - 1;                // lower left

                    // Clockwise
                    faces.push(new THREE.Face3(ur, lr, ll));
                    faces.push(new THREE.Face3(ul, ur, ll));
                }
            }
        }

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        var materials = [
            new THREE.MeshLambertMaterial({ color: 0x444444 })
        ];

        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
        scene.add(mesh);

        render();

        function render() {
            camera.position.x -= .1;

            if (camera.position.x < 0) {
                camera.position.x = yos.length + 200;
            }

            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onResize, false);
    },
    render() {
        return (
            <div className="peaks" ref={(c) => this._el = c}></div>
        );
    }
});

export default Component;
