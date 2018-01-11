class vec3 {
	constructor (e0, e1, e2) {
		this.e = [e0, e1, e2];
	}
	get x(){
		return this.e[0];
	}
	get y(){
		return this.e[1];
	}
	get z(){
		return this.e[2];
	}
	get r(){
		return this.e[0];
	}
	get g(){
		return this.e[1];
	}
	get b(){
		return this.e[2];
	}
	get xyz(){
		return new vec3(this.e[0],this.e[1],this.e[2]);
	}
	get neg_xyz() {
		return new vec3(-this.e[0],-this.e[1],-this.e[2]);
	}
	get length () {
		return Math.sqrt(this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2]);
	}
	get squared_length () {
		return this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2];
	}

	set x(x = 0.0){
		this.e[0] = x;
	}
	set y(y = 0.0){
		this.e[1] = y;
	}

	set z(x = 0.0){
		this.e[2] = z;
	}

	set(x, y, z) {
		this.e[0] = x;
		this.e[1] = y;
		this.e[2] = z;
		return this;
	}

	add (v){
		this.e[0]  += v.e[0];
    	this.e[1]  += v.e[1];
    	this.e[2]  += v.e[2];
    	return this;
	}
	mul (v){
		this.e[0] *= v.e[0];
    	this.e[1] *= v.e[1];
    	this.e[2] *= v.e[2];
    	return this;
	}
	div (v){
		this.e[0] /= v.e[0];
    	this.e[1] /= v.e[1];
    	this.e[2] /= v.e[2];
    	return this;
	}
	sub (v){
		this.e[0] -= v.e[0];
    	this.e[1] -= v.e[1];
    	this.e[2] -= v.e[2];
    	return this;
	}
	add_t (t){
		this.e[0] += t;
    	this.e[1] += t;
    	this.e[2] += t;
    	return this;
	}
	sub_t (t){
		this.e[0] -= t;
    	this.e[1] -= t;
    	this.e[2] -= t;
    	return this;
	}
	mul_t (t = 0.0){
		this.e[0] *= t;
    	this.e[1] *= t;
    	this.e[2] *= t;
    	return this;
	}
	div_t (t){
		this.e[0] /= t;
    	this.e[1] /= t;
    	this.e[2] /= t;
    	return this;
	}
	normalize () {
		return this.length === 0 ? this : this.div_t(this.length);
	}
	limit (t) {
		let  sq_l = this.squared_length;
		if (sq_l > t*t){
			this.div_t(Math.sqrt(sq_l));
			this.mul_t(t);
		}
		return this;
	}
	setMag (t) {
		return  this.normalize().mul_t(t);
	}

}

let v3 = (function () {
	_add = function(v1, v2) { return  new vec3(v1.e[0] + v2.e[0], v1.e[1] + v2.e[1], v1.e[2] + v2.e[2]);}
	_sub = function(v1, v2) { return new vec3(v1.e[0] - v2.e[0], v1.e[1] - v2.e[1], v1.e[2] - v2.e[2]);}
	_mul = function(v1, v2) { return  new vec3(v1.e[0] * v2.e[0], v1.e[1] * v2.e[1], v1.e[2] * v2.e[2]);}
	_div = function(v1, v2) { return  new vec3(v1.e[0] / v2.e[0], v1.e[1] / v2.e[1], v1.e[2] / v2.e[2]);}
	_mul_t = function(t, v) { return  new vec3(t*v.e[0], t*v.e[1], t*v.e[2]);}
	_div_t = function(t, v) { return  new vec3(v.e[0]/t, v.e[1]/t, v.e[2]/t);}
	_dot = function(v1, v2) { return v1.e[0] *v2.e[0] + v1.e[1] * v2.e[1]  + v1.e[2] * v2.e[2];}
	_cross = function(v1, v2) { return  new vec3(v1.e[1]*v2.e[2] - v1.e[2]*v2.e[1],-(v1.e[0]*v2.e[2] - v1.e[2]*v2.e[0]),v1.e[0]*v2.e[1] - v1.e[1]*v2.e[0]);}
	function _dist(v1, v2) {
		let dx = v1.x - v2.x;
		let dy = v1.y - v2.y;
		let dz = v1.z - v2.z;
		return Math.sqrt( dx * dx + dy * dy + dz * dz );
	}
	function _map (value, low1, high1, low2, high2) {
	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
	function _unit_vector(v) {
		return this.div_t(v.length, v);
	}
	function _copyProperties(target, source) {
	    Object.getOwnPropertyNames(source).forEach(function(name){
	        Object.defineProperty(
	            target,
	            name,
	            Object.getOwnPropertyDescriptor(source, name)
	        );
	    });
	    return target;
	}
	return {
		add : _add,
		sub : _sub,
		mul : _mul,
		div : _div,
		mul_t : _mul_t,
		div_t : _div_t,
		dot : _dot,
		cross : _cross,
		map : _map,
		dist : _dist,
		unit_vector : _unit_vector,
		copyProperties : _copyProperties
	}
})();