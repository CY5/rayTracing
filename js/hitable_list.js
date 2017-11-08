class hitable_list extends hitable  {
	constructor (l = new hitable(), n = 0) {
		super();
		this.list = l;
		this.list_size = n;
	}

	hit (r = new ray(), t_min = 0.0, t_max = 0.0, rec = hit_record()) {
		let temp_rec = hit_record();
		let hit_anything = false;
		let closest_so_far = t_max;
		for (let i = 0; i < this.list_size; i++) {
            if (this.list[i].hit(r, t_min, closest_so_far, temp_rec)) {
                hit_anything = true;
                closest_so_far = temp_rec.t;
                rec.t = temp_rec.t;
                rec.p = temp_rec.p;
                rec.normal = temp_rec.normal;
                rec.mat_ptr = temp_rec.mat_ptr;
            }
        }
        return hit_anything;
	}
}
