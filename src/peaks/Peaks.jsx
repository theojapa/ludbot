import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import THREE from 'three';

const Component = React.createClass({
    componentDidMount: function() {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // show axes in the screen
        // var axes = new THREE.AxisHelper(20);
        // scene.add(axes);

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 20;
        camera.position.z = 20;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        // var ambientLight = new THREE.AmbientLight(0x494949);
        // scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-20, 20, 20);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        this._el.appendChild(renderer.domElement);

        // call the render function
        var step = 0;

        var vertices = [],
            faces = [],
            n = 101; // Number of vertices on side

        for (var x = 0; x < n; ++x) {
            for (var y = 0; y < n; ++y) {
                vertices.push(new THREE.Vector3(x - Math.ceil(n / 2), y - Math.ceil(n / 2), Math.random() * 2));
                
                if (x && y) {
                    // Create sides for square for which this vertex is the upper right corner
                    let ur = vertices.length - 1, // upper right
                        ul = ur - 1, // upper left
                        lr = ur - n, // lower right
                        ll = lr - 1; // lower left

                    // Counter-clockwise
                    faces.push(new THREE.Face3(ll, lr, ur));
                    faces.push(new THREE.Face3(ll, ur, ul));

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
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x444444, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
        mesh.children.forEach((e) => e.castShadow = true);

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
