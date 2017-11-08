class ray {
	constructor (a = new vec3(0,0,0), b= new vec3(0,0,0)) {
		this.A = a;
		this.B = b;
	}
	get origin () {
		return this.A;
	}
	get direction () {
		return this.B;
	}
	point_at_parameter (t = 0.0) {
		 return v3.add(this.A ,v3.mul_t(t, this.B));
	}
}
