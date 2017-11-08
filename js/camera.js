function random_in_unit_disk() {
  let p = new vec3(0, 0, 0);
  do {
    p = v3.sub(v3.mul_t(2.0, new vec3(Math.random(), Math.random(), 0)), new vec3(1, 1, 0));
  } while (v3.dot(p, p) >= 1.0);
  return p;
}

class camera {
  constructor(lookfrom = new vec3(0, 0, 0), lookat = new vec3(0, 0, 0), vup = new vec3(0, 0, 0), vfov = 0.0, aspect = 0.0, aperture = 0.0, focus_dist = 0.0) {
    this.lens_radius = aperture / 2;
    this.theta = vfov * Math.PI / 180;
    this.half_height = Math.tan(this.theta / 2);
    this.half_width = aspect * this.half_height;
    this.origin = lookfrom;
    this.w = v3.unit_vector(v3.sub(lookfrom, lookat));
    this.u = v3.unit_vector(v3.cross(vup, this.w));
    this.v = v3.cross(this.w, this.u);
    this.lower_left_corner = v3.sub(this.origin, v3.mul_t(this.half_width * focus_dist, this.u)).sub(v3.mul_t(this.half_height * focus_dist, this.v)).sub(v3.mul_t(focus_dist, this.w));

    this.horizontal = v3.mul_t((2 * this.half_width * focus_dist), this.u);
    this.vertical = v3.mul_t((2 * this.half_height * focus_dist), this.v);
    this.get_ray = function(s = 0.0, t = 0.0) {
      let rd = v3.mul_t(this.lens_radius, random_in_unit_disk());
      let offset = v3.add(v3.mul_t(rd.x, this.u), v3.mul_t(rd.y, this.v));
      return new ray(v3.add(this.origin, offset), v3.add(this.lower_left_corner, v3.mul_t(s, this.horizontal)).add(v3.mul_t(t, this.vertical)).sub(this.origin).sub(offset));
    }
  }

}
