import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r116/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { GUI } from '/jsm/libs/dat.gui.module.js'

let scene, camera, renderer;

const canvas = document.querySelector('.solarsystem');

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
scene.add(camera);

renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

const gui = new  GUI();

camera.position.set(-66, -66, -10);

const folder = gui.addFolder("Thư mục vui vẻ")
folder.add(camera.position, "x", -200, 200);
folder.add(camera.position, "y", -200, 200);
folder.add(camera.position, "z", -200, 200);

function xmlToJson(xml) {
    'use strict';
    // Create the return object
    var obj = {}, i, j, attribute, item, nodeName, old;
    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["attributes"] = {};
            for (j = 0; j < xml.attributes.length; j = j + 1) {
                attribute = xml.attributes.item(j);
                obj["attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    }
    // do children
    if (xml.hasChildNodes()) {
        for (i = 0; i < xml.childNodes.length; i = i + 1) {
            item = xml.childNodes.item(i);
            nodeName = item.nodeName;
            if(nodeName !== '#text'){
                if ((obj[nodeName]) === undefined) {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if ((obj[nodeName].push) === undefined) {
                        old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
    }
    return obj;
};
function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml))
            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
}

const ver = [];
async function getData() {
    const response = await fetch(`https://s3.amazonaws.com/CMSTest/squaw_creek_container_info.xml?fbclid=IwAR0YUCBa-S_HrMLiXeJTsXdmBXJbLa3PoyCBjJKNlRggthLfNYcCxTogiuo`);
    var data = await response.text();
    const dom = parseXml(data);
    const dataXML = xmlToJson(dom)
    return dataXML;
}
getData().then(data => {
    var points = [];
    for(var i = 0 ; i < data.STRUCTURES.ROOF.POINTS.POINT.length ; i++ ){
        for(var j = 0 ; j < data.STRUCTURES.ROOF.POINTS.POINT[i].attributes.data.split(", ").length ; j++){
            var point = parseFloat((data.STRUCTURES.ROOF.POINTS.POINT[i].attributes.data.split(", ")[j]))
            points.push(point);
            if(j == 2){
                var vector = latLongToVector3(points[0],points[1],points[2]);
                ver.push(vector);
                points = []
            }
        }
        
    }
    function latLongToVector3(lat, lon,hei) {
        var rad = 6378137.0;
        var h = hei;
        var x, y, z
        
        const phi = (lon + 90) / 180 * Math.PI
        const theta = (90 - lat) / 180 * Math.PI
        var x,y,z
        z = (rad+h)* Math.sin(theta) * Math.sin(phi)
        y = (rad+h)* Math.cos(phi)
        x = (rad+h)* Math.cos(theta) * Math.sin(phi)
        
        return new THREE.Vector3(x + 4729222, y + 4269555, z + 299210);
    }
    
    var faces = [
        [0,1,2,2,3,4,4,5,6,4,6,2,2,6,0],
        [7,8,9,9,10,11,11,12,13,7,11,13,7,9,11],
        [14,17,16,16,15,14],
        [18,21,20,20,19,18],
        [22,23,24],
        [3,2,25],
        [31,32,33],
        [28,29,30],
        [0,6,2,2,6,4,6,5,4,4,3,2,2,1,0],
        [11,9,7,13,11,7,13,12,11,11,10,9,9,8,7],
        [14,15,16,16,17,14],
        [18,19,20,20,21,18],
        [24,23,22],
        [33,32,31],
        [25,2,3],
        [30,29,28],
    ];
    const geometry = new THREE.Geometry();
    var i, j, face;
    for (i = 0; i < ver.length; i++) {
        geometry.vertices.push(ver[i]);
    }
    for (i = 0; i < faces.length; i++) {
        face = faces[i];
        for (j = 0; j < face.length ; j+=3) {
            geometry.faces.push (new THREE.Face3 (face[j], face[j+1], face[j + 2]));
        }
    }
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh( geometry, material );
    geometry.computeFaceNormals();
    scene.add (mesh);
});

window.addEventListener('resize' , function(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})
controls.update();
const animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
};
animate();