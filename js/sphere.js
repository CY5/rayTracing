class sphere extends hitable {
	constructor(cen, r, m) {
		super();
		this.center = cen;
		this.radius = r;
		this.mat_ptr = m;
		this.hit = function(r, t_min, t_max, rec) {
			let oc = v3.sub(r.origin, this.center);
			let  a = v3.dot(r.direction, r.direction);
			let  b = v3.dot(oc, r.direction);
			let  c = v3.dot(oc, oc) - this.radius * this.radius;
			let discriminant = b*b - a*c;
			if (discriminant > 0) {
				let temp = (-b - Math.sqrt(discriminant)) / a;
				if (temp < t_max && temp > t_min) {
					rec.t = temp;
					rec.p = r.point_at_parameter(rec.t);
					rec.normal = v3.sub(rec.p,this.center);
					rec.normal.div_t(this.radius);
					rec.mat_ptr = this.mat_ptr;
					return true;
				}
				temp = (-b + Math.sqrt(discriminant)) / a;
				if (temp < t_max && temp > t_min) {
					rec.t = temp;
					rec.p = r.point_at_parameter(rec.t);
					rec.normal = v3.sub(rec.p,this.center);
					rec.normal.div_t(this.radius);
					rec.mat_ptr = this.mat_ptr;
					return true;
				}
			}
			return false;
		}
	}
}
