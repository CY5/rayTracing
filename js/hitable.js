function hit_record(){
	return {
		t : 0,
		p: new vec3(0,0,0),
		normal : new vec3(0,0,0),
		mat_ptr : new material()
	}
}
class hitable {
	
	hit (r = new ray(), t_min=0.0, t_max=0.0, rec=hit_record()) {};
	
}