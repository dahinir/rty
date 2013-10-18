var args = arguments[0] || {};
var users = Alloy.Collections.user;
// var users = Alloy.Collections.user;


var doTransform = function (model) {
	var o = model.toJSON();
	if (o.subtitle) {
		if (o.image) {
			o.template = 'fullItem';
		} else {
			o.template = 'titleAndSub';
		}
	} else {
		o.template = 'title';
	}
	o.template = 'facebook';
	o.name = o.first_name + ' ' + o.last_name;
	o.picture_url = "https://graph.facebook.com/"+o.fb_id+"/picture?width=96&height=96";

	return o;
};


// users.fetch();
users.fetchFromServer();


// $.win.addEventListener("close", function(){
    // $.destroy();
// } ;