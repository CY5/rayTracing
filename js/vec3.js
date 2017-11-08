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
		return this;
	}
	get neg_xyz() {
		return new vec3(-this.e[0],-this.e[1],-this.e[2]);
	}
	get make_unit_vector () {
		let k = 1.0 / Math.sqrt(this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2]);
		this.e[0] *= k; this.e[1] *= k; this.e[2] *= k;
	}
	get length () {
		return Math.sqrt(this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2]);
	}
	get squared_length () {
		return this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2];
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
	mul_t (t){
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
		unit_vector : _unit_vector,
		copyProperties : _copyProperties
	}
})();


