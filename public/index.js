import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r116/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js"
import { GUI } from "/jsm/libs/dat.gui.module.js";

function xmlToJson(xml) {
  "use strict";
  // Create the return object
  var obj = {}, i, j, attribute, item, nodeName, old;

  if (xml.nodeType === 1) {
    // element
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
      if (nodeName !== "#text") {
        if (obj[nodeName] === undefined) {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (obj[nodeName].push === undefined) {
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
}

function getDataXML() {
  "use strict";
  var objectXML;
  $.ajax({
    url: "https://s3.amazonaws.com/CMSTest/squaw_creek_container_info.xml?fbclid=IwAR0YUCBa-S_HrMLiXeJTsXdmBXJbLa3PoyCBjJKNlRggthLfNYcCxTogiuo",
    async: false,
    dataType: "xml",
    success: function (data) {
      objectXML = xmlToJson($(data)[0]);
    },
  });
  return objectXML;
}


// function latLongToVector3(lat, long, hei) {
//   var x, y, z, N, r, a;

//   r = 6378137;
//   a = 8.1819190842622e-2;

//   N = r / Math.sqrt(1 - a * a * (Math.sin(lat) * Math.sin(lat)));

//   x = ((N + hei) * Math.cos(lat) * Math.cos(long)) / 1000;
//   y = ((N + hei) * Math.cos(lat) * Math.sin(long)) / 1000;
//   z = (((1 - a * a) * N + hei) * Math.sin(lat)) / 1000;
//   return new THREE.Vector3(x, y, z);
// }
// console.log(ver);

// Begin draw
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

scene.add(camera);

const gui = new GUI();

camera.position.set(-1, -71, 25);

gui.add(camera.position, "x", -200, 200);
gui.add(camera.position, "y", -200, 200);
gui.add(camera.position, "z", -200, 200);

var vertices = [
  -299673.1829118491, -4736349.431700787, 4247329.0190194715,
  -299683.75567808107, -4736346.400899762, 4247330.887736429,
  -299686.47704424936, -4736349.380582796, 4247329.159059745,
  -299687.49707444344, -4736345.486630319, 4247331.419204011,
  -299698.10118465766, -4736342.951403661, 4247332.5946447505,
  -299700.42901396856, -4736349.718622892, 4247329.116138522,
  -299675.51727689285, -4736356.302768064, 4247325.06389721,
  
  -299675.51727689285, -4736356.302768064, 4247325.06389721,
  -299700.42901396856, -4736349.718622892, 4247329.116138522,
  -299702.52224061463, -4736352.778208504, 4247321.72004692,
  -299691.9449975159, -4736355.738383255, 4247319.787530456,
  -299689.3572582798, -4736354.870678427, 4247322.852532186,
  -299688.2031954035, -4736356.646364558, 4247319.250382354,
  -299677.6091616693, -4736359.341382719, 4247317.648865235,
  
  -299664.7487515364, -4736346.231732143, 4247324.521079485,
  -299668.4765837109, -4736355.111091173, 4247314.466152737,
  -299672.2734050699, -4736355.072686807, 4247315.788332212,
  -299668.54700283107, -4736346.216045543, 4247325.863768734,
  
  -299668.54700283107, -4736346.216045543, 4247325.863768734,
  -299672.2734050699, -4736355.072686807, 4247315.788332212,
  -299675.33106528764, -4736353.359703116, 4247315.562693783,
  -299671.6038879732, -4736344.490891364, 4247325.627137025,
  
  -299689.3572582798, -4736354.870678427, 4247322.852532186,
  -299691.9449975159, -4736355.738383255, 4247319.787530456,
  -299690.1507566152, -4736357.403922765, 4247320.042379992,
  
  -299685.6875141501, -4736346.910009401, 4247332.025791558,
  -299686.47704424936, -4736349.380582796, 4247329.159059745,
  -299687.49707444344, -4736345.486630319, 4247331.419204011,
  
  -299683.75567808107, -4736346.400899762, 4247330.887736429,
  -299685.6875141501, -4736346.910009401, 4247332.025791558,
  -299686.47704424936, -4736349.380582796, 4247329.159059745,
  
  -299689.3572582798, -4736354.870678427, 4247322.852532186,
  -299690.1507566152, -4736357.403922765, 4247320.042379992,
  -299688.2031954035, -4736356.646364558, 4247319.250382354
];

const geometry = new THREE.Geometry();
var i, j, face;
for (i = 0; i < vertices.length; i += 3) {
  geometry.vertices.push(new THREE.Vector3(
      vertices[i] + 299660,
      vertices[i + 1] + 4736330,
      vertices[i + 2] - 4247310
    )
  );
}

// var faces = [
//   [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
// ]
var faces = [
  [0, 1, 2], 
  [2, 3, 4], 
  [4, 5, 6], 
  [4, 6, 2], 
  [2, 6, 0],
  [7, 8, 9], 
  [9, 10, 11], 
  [11, 12, 13], 
  [7, 11, 13], 
  [7, 9, 11],
  [15, 14, 16], 
  [16, 14, 17],
  [19, 18, 20], 
  [20, 18, 21],
  [22, 23, 24],
  [31, 32, 33],
  [3, 2, 25],
  [28, 29, 30],
];

for (i = 0; i < faces.length; i += 1) {
  face = faces[i];
  for (j = 0; j < face.length; j += 3) {
    geometry.faces.push(new THREE.Face3(face[j], face[j + 1], face[j + 2]))
  }
}
console.log(geometry.faces);

const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
geometry.computeFaceNormals();
scene.add(mesh);

  //Set background color
  // const light = new THREE.PointLight(0xff0000, 2, 100);
  // light.position.set(50, 50, 50);
  // scene.add(light);
  // renderer.setClearColor (0x000000);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);

animate();

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};


