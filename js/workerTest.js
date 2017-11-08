importScripts("vec3.js");
importScripts("ray.js");
importScripts("hitable.js");
importScripts("hitable_list.js");
importScripts("sphere.js");
importScripts("camera.js");
importScripts("material.js");
importScripts("helper.js");

//const MAXFLOAT = Number.MAX_VALUE;

	const MAXFLOAT = Number("3.40282E28");
var pixels;
var numPixels;
var acc = null;
var sample = 0;
var sample_rate = 0;
const ty = Math.random();

const MIN = 0.001,
  MAX = 0.9;


var cam = null;

var _world = random_scene();
var is_ray_scene = true;


var depth_recur = 1;
var camera_setting = {
	origin : [0,0,0],
	aperature : 3,
	focus_dist : 10
}
var action = {
	trace : true,
	auto_sample : false,
}



self.addEventListener('message', function(e) {
  pixels = e.data.imageData.data;
	camera_setting  = Object.assign({}, camera_setting, e.data.camera_setting);
	action  = Object.assign({}, action, e.data.action);

  numPixels = pixels.length / 4;


	if (action.trace && !is_ray_scene){
		_world = random_scene();
		is_ray_scene = true;
		acc = new Float32Array(numPixels * 3);
	} else if (!action.trace && is_ray_scene){
		_world = rasterizing_scene();
		depth_recur = 1;
		is_ray_scene = false;
		acc = new Float32Array(numPixels * 3);
	} else {
		if (!action.auto_sample){
			acc = new Float32Array(numPixels * 3);
		} else{
			acc = acc || new Float32Array(numPixels * 3);
		}
	}
	//acc = new Float32Array(numPixels * 3);
  sample = Number(e.data.sample) || 1;

	sample_rate = Number(e.data.sample_rate) * 5;
  cam = cam_m(e.data.width, e.data.height);
	depth_recur = Number(e.data.depth_recur);





  main(e.data.width, e.data.height);
  self.postMessage({
    "imageData": e.data.imageData
  });
}, false);


// function getRandom(min, max) {
//   return Math.random() * (max - min) + min;
// }

function cam_m(w, h) {
  let nx = w,
    ny = h;
  let list = [];
  let R = Math.cos(Math.PI / 2);
	//let lookfrom =  new vec3(13,2,3);
  let lookfrom = new vec3(camera_setting.origin[0],camera_setting.origin[1], camera_setting.origin[2]);
  let lookat = new vec3(0,0,0);
  let dist_to_focus = Number(camera_setting.focus_dist);
  let aperature =    Number(camera_setting.aperature) / Number(camera_setting.focus_dist);
  aspect = nx / ny;
  let cam = new camera(lookfrom, lookat, new vec3(0, 1, 0), 20, aspect, aperature, dist_to_focus);

  return cam;
}

function random_scene() {
  let list = [];
	list[0] = new sphere(new vec3(0, -1000, 0), 1000, new metal(new vec3(0.5, 0.7, 0.5)),0.8);
	let i = 1;


	list[i++] = new sphere(new vec3(4, 0.7, 3), 0.7, new metal(new vec3(Math.random(), Math.random(),Math.random()), 0.0));
	list[i++] = new sphere(new vec3(2, 0.7, 1.3), 0.7, new metal(new vec3(Math.random(), Math.random(),Math.random()), 0.0));
	list[i++] = new sphere(new vec3(2, 0.7, -0.2), 0.7, new metal(new vec3(Math.random(), Math.random(),Math.random()), 0.0));
	list[i++] = new sphere(new vec3(2, 0.7, -1.8), 0.7, new metal(new vec3(Math.random(), Math.random(),Math.random()), 0.0));

	list[i++] = new sphere(new vec3(5, 0.5, 1.5), 0.5, new dielectric(1.7));
	list[i++] = new sphere(new vec3(5, 0.4, 0), 0.4, new dielectric(1.7));


	list[i++] = new sphere(new vec3(6, 0.3, 3.5), 0.3, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
	list[i++] = new sphere(new vec3(6, 0.3, 2.5), 0.3, new metal(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
		list[i++] = new sphere(new vec3(6, 0.2, 1.5), 0.2, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
		list[i++] = new sphere(new vec3(6, 0.2, 0.5), 0.2, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
  return new hitable_list(list, i);
}

function rasterizing_scene() {
  let list = [];
	list[0] = new sphere(new vec3(0, -1000, 0), 1000, new lambertian(new vec3(Math.random(), Math.random(),Math.random())),0.8);
	let i = 1;


	list[i++] = new sphere(new vec3(4, 0.7, 3), 0.7, new lambertian(new vec3(Math.random(), Math.random(),Math.random())));
	list[i++] = new sphere(new vec3(2, 0.7, 1.3), 0.7, new lambertian(new vec3(Math.random(), Math.random(),Math.random())));
	list[i++] = new sphere(new vec3(2, 0.7, -0.2), 0.7, new lambertian(new vec3(Math.random(), Math.random(),Math.random())));
	list[i++] = new sphere(new vec3(2, 0.7, -1.8), 0.7, new lambertian(new vec3(Math.random(), Math.random(),Math.random())));

	list[i++] = new sphere(new vec3(5, 0.5, 1.5), 0.5, new lambertian(new vec3(0.8,0.8,0.8)));
	list[i++] = new sphere(new vec3(5, 0.4, 0), 0.4, new lambertian(new vec3(0.8,0.8,0.8)));


	list[i++] = new sphere(new vec3(6, 0.3, 3.5), 0.3, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
	list[i++] = new sphere(new vec3(6, 0.3, 2.5), 0.3, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
		list[i++] = new sphere(new vec3(6, 0.2, 1.5), 0.2, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
		list[i++] = new sphere(new vec3(6, 0.2, 0.5), 0.2, new lambertian(new vec3(Math.random()*Math.random(), Math.random()*Math.random(),Math.random()*Math.random())));
  return new hitable_list(list, i);
}

function color(r = new ray(), world = new hitable(), depth = 0) {
  let rec = hit_record();
  if (world.hit(r, 0.001, MAXFLOAT, rec)) {
    let scattered = new ray();
    let attenuation = new vec3(0, 0, 0);
    if (depth < depth_recur && rec.mat_ptr.scatter(r, rec, attenuation, scattered)) {
      return v3.mul(attenuation, color(scattered, world, depth + 1));
    }
    return new vec3(0, 0, 0);
  }
  let unit_direction = v3.unit_vector(r.direction);
  let t = 0.5 * (unit_direction.y + 1.0);
  return v3.mul_t(1.0 - t, new vec3(1.0, 1.0, 1.0)).add(v3.mul_t(t, new vec3(0.5,0.7,1.0)));
}


function main(width, height) {
  let nx = width,
    ny = height;
		if (action.auto_sample) {
			ns = 3;
		} else {
			ns = sample_rate;
		}


  //var cam = new camera(...cam_args[0]);

  for (let j = ny-1; j >=0; j--) {
    for (let i = 0; i < nx; i++) {
      let col = new vec3(0, 0, 0);
      for (let s = 0; s < ns; s++) {
        let u = parseFloat(i + Math.random()) / parseFloat(nx);
        let v = parseFloat(j + Math.random()) / parseFloat(ny);

				let r = cam.get_ray(u, v);
        let p = r.point_at_parameter(2.0);
        col.add(color(r, _world, 0));
      }
      var index = ((ny - j - 1) * nx + i) * 3;

      acc[index] += col.r;
      acc[index + 1] += col.g;
      acc[index + 2] += col.b;
    }
  }


  for (var p = 0; p < numPixels; p++) {
    var pi = p * 4;
    var ai = p * 3;
		if (action.auto_sample){
			pixels[pi] = Math.floor(Math.sqrt(acc[ai]/sample) * 255.99);
			pixels[pi + 1] = Math.floor(Math.sqrt(acc[ai + 1]/sample) * 255.99);
			pixels[pi + 2] = Math.floor(Math.sqrt(acc[ai + 2]/sample) * 255.99);
			pixels[pi + 3] = 255;
		} else {
			pixels[pi] = Math.floor(Math.sqrt(acc[ai]/sample_rate) * 255.99);
			pixels[pi + 1] = Math.floor(Math.sqrt(acc[ai + 1]/sample_rate) * 255.99);
			pixels[pi + 2] = Math.floor(Math.sqrt(acc[ai + 2]/sample_rate) * 255.99);
			pixels[pi + 3] = 255;
		}
  }
}

function attach(obj, originalclass) {
  obj.__proto__ = originalclass.prototype;
}
