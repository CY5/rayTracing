function schlick (cosine = 0.0, ref_idx = 0.0) {
	let r0 = (1 - ref_idx) / (1 + ref_idx);
	r0 = r0 * r0;
	return r0 + (1-r0)*Math.pow((1 - cosine), 5);
}

function refract (v = new vec3(0,0,0), n = new vec3(0,0,0), ni_over_nt = 0.0, refracted = new vec3(0,0,0)) {
	let uv = v3.unit_vector(v);
	let dt = v3.dot(uv, n);
	let discriminant = 1.0 - ni_over_nt*ni_over_nt*(1-dt*dt);
	if (discriminant > 0) {
		refracted = v3.copyProperties(refracted, v3.sub(uv, v3.mul_t(dt, n)).mul_t(ni_over_nt).sub( v3.mul_t(Math.sqrt(discriminant), n)));
		return true;
	}
	return false;

}

function reflect (v = new vec3(0,0,0), n = new vec3(0,0,0)) {
	return v3.sub(v, v3.mul_t(2*v3.dot(v, n), n));
}

function random_in_unit_sphere() {
	let p = new vec3(0,0,0);
	do {
		p = new vec3( Math.random(), Math.random(), Math.random()).mul_t(2.0).sub(new vec3(1,1,1));
	} while (p.squared_length >= 1.0);
	return p;
}
class material {
	constructor () {
		this.scatter = function(r_in, rec, attenuation, scattered) {};
	}
}
class lambertian extends material {
	constructor (a) {
		super();
		this.albedo = a;
		this.scatter = function(r_in, rec, attenuation, scattered){
			let target = v3.add(rec.p, rec.normal).add(random_in_unit_sphere());
			scattered = v3.copyProperties(scattered, new ray(rec.p, v3.sub(target, rec.p)));
			attenuation = v3.copyProperties(attenuation,this.albedo);
			return true;
		}
	}
}
class metal extends material {
	constructor (a = new vec3(0,0,0), f = 0.0) {
		super();
		this.albedo = a;
		if (f < 1)
			this.fuzz = f;
		else
			this.fuzz = 1;

		this.scatter  = function(r_in = new ray(), rec = hit_record(), attenuation = new vec3(0,0,0), scattered = new ray()) {
			let reflected = reflect(v3.unit_vector(r_in.direction), rec.normal);
			scattered = v3.copyProperties(scattered, new ray(rec.p, v3.add(reflected, v3.mul_t(this.fuzz, random_in_unit_sphere()))));
			attenuation = v3.copyProperties(attenuation, this.albedo);
			return (v3.dot(scattered.direction, rec.normal) > 0);
		}
	}

}

class dielectric extends material {
	constructor (ri = 0.0) {
		super();
		this.ref_idx = ri;
		this.scatter = function(r_in = new ray(), rec = hit_record(), attenuation = new vec3(0,0,0), scattered = new ray()) {
			let outward_normal = new vec3(0,0,0);
			let reflected = reflect(r_in.direction, rec.normal);
			let  ni_over_nt = 0.0;
			attenuation = v3.copyProperties(attenuation, new vec3(1.0,1.0,1.0));
			let refracted = new vec3(0,0,0);
			let reflect_prob=0.0;
			let cosine = 0.0;
			if (v3.dot(r_in.direction, rec.normal) > 0) {
				outward_normal = rec.normal.neg_xyz;
				ni_over_nt = this.ref_idx;
				cosine = v3.dot(r_in.direction, rec.normal) / r_in.direction.length;
				cosine = Math.sqrt(1 - this.ref_idx * this.ref_idx * (1 - cosine * cosine));
			} else {
				outward_normal = rec.normal;
				ni_over_nt = 1.0 / this.ref_idx;
				cosine = -v3.dot(r_in.direction, rec.normal) / r_in.direction.length;
			}
			if (refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
				reflect_prob = schlick (cosine, this.ref_idx);
			} else {
				reflect_prob = 1.0;
			}
			if (Math.random() < reflect_prob) {
				scattered = v3.copyProperties(scattered, new ray(rec.p, reflected));
			} else {
				scattered = v3.copyProperties(scattered, new ray(rec.p, refracted));
			}
			return true;
		}
	}
}
