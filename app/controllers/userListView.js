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
	o.description = "dfasdfasdfasdfasdfasefasdf";

	return o;
};

$.listView.addEventListener('itemclick', function(e){
    // var item = e.section.getItemAt(e.itemIndex);
    // if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
        // item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
    // }
    // else {
        // item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
    // }
    // e.section.updateItemAt(e.itemIndex, item);  
    alert(
        "ItemId: " + e.itemId + "\n" +
        "BindId: " + e.bindId + "\n" +
        "Section Index: " + e.sectionIndex + ", Item Index: " + e.itemIndex
    );   
    if( e.bindId === "profileImage" ){
		Ti.Platform.openURL("fb://profile/" + e.itemId);
    }
});

// users.fetch();
users.fetchFromServer();



// $.win.addEventListener("close", function(){
    // $.destroy();
// } ;