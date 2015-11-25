import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import THREE from 'three';
import yos from './elevations.json';

const Component = React.createClass({
    componentDidMount: function() {
        var scene = new THREE.Scene();
        // scene.fog = new THREE.FogExp2(0xffffff, 0.015);
        scene.fog = new THREE.Fog(0xffffff, 10, 200);

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);

        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        var xMiddle = Math.floor(yos[0].length / 2);
        var yMiddle = Math.floor(yos.length / 2);
        camera.position.x = xMiddle;
        camera.position.y = -20; // End of valley
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(xMiddle, 150, 0));

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, yMiddle, 100);
        spotLight.castShadow = true;
        scene.add(spotLight);

        this._el.appendChild(renderer.domElement);

        var vertices = [],
            faces = [];

        var lng_n = yos.length,
            lat_n,
            z;

        for (var x = 0; x < yos.length; ++x) {
            lat_n = yos[x].length;
            for (var y = 0; y < lat_n; ++y) {
                lat_n = yos[x].length;
                z = 0 === y ? yos[x][y] : z + yos[x][y];
                vertices.push(new THREE.Vector3(x, y, z / 100)); // Math.random() * 2;
            
                if (x && y) {
                    // Create two triangular sides for a square in which 
                    // this vertex is the upper right corner
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
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x444444 })
        ];

        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
        scene.add(mesh);

        render();

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
    render() {
        return (
            <div className="peaks" ref={(c) => this._el = c}></div>
        );
    }
});

export default Component;
