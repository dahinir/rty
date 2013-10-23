var args = arguments[0] || {};
// var users = Alloy.Collections.user;
var users = Alloy.createCollection('user');
var section = $.section;
var listView = $.listView;

/* sort this users by order of donations */ 
users.comparator = function(user){
	return -user.get('donations');
};

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
	o.description = "des";

	return o;
};

var _getIndexByItemId = function(itemId){
	var index;
	var listDataItems = section.getItems();
	for ( index = 0; index < listDataItems.length; index++) {
		if (listDataItems[index].properties.itemId === itemId) {
			break;
		}
	}
	if( index === listDataItems.length){
		Ti.API.warn("[userListView.js] there is no matched itemId");
	}
	return index;
};
var _settingData = function(user){
	var data = {
		profileImage: {
			image: "https://graph.facebook.com/"+ user.get('fb_id') +"/picture?width=96&height=96"
		},
		name: {
			text: user.get('first_name') + ' ' + user.get('last_name')
		},
		donations: {
			text: user.get('donations')
		},
		message: {
			text: user.get('message')
		},
		
		properties: {
			itemId: user.get('fb_id')
		},
		template: 'facebook'
	};
	return data;
};
var addRows = function(options){
	var addedUsers = options.addedUsers;
	var reset = options.reset;
	var dataArray = [];
	
	if( addedUsers.map ){
		for(var i = 0; i < addedUsers.length; i++){
			dataArray.push( _settingData( addedUsers.at(i) ) );
		}
	}else{
		dataArray.push( _settingData( addedUsers ) );
	}
	
	if( reset ){
		// listView.deleteSectionAt(0);
		section.setItems(dataArray, {'animated': true});
	}else{
		section.appendItems(dataArray, {'animated': true});
	}

	if (listView.getSectionCount() === 0) {
		listView.setSections([section]);
	} else {
		listView.replaceSectionAt(0, section, {'animated': true});
		//, {animated: true, position: Ti.UI.iPhone.ListViewScrollPosition.TOP});
	}
	listView.scrollToItem(0, 0);
};

users.on('add', function(model, collection, options){
	addRows({ 
		'addedUsers': model,
		'reset': false 
	});
});
users.on('change', function(changedUser){
	var index = _getIndexByItemId(changedUser.get('fb_id'));
	var data = _settingData( changedUser );
	section.updateItemAt(index, data, {'animated': true});
});
users.on('sort', function(collection, options){ // when the collection has been re-sorted.
	alert('sort');
	var dataArray = [];
	_.each(collection, function(user){
		dataArray.push( _settingData( user ) );
	});
	section.setItems(dataArray);
});

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

// users.fetchFromServer();

var button = Ti.UI.createButton({
   title: 'refresh',
   top: 300,
   width: 100,
   height: 50
});
button.addEventListener('click', function(e){
	users.fetchFromServer({
		success: function(){
			addRows({
				'addedUsers': users,
				'reset': true
			});
		}
	});
});
$.listView.add(button);

var button2 = Ti.UI.createButton({
   title: 'ref',
   top: 350,
   width: 100,
   height: 50
});

button2.addEventListener('click', function(e){
	for(var i=0; i < users.length; i++){
		Ti.API.info(users.at(i).get('first_name') + users.at(i).get('donations'));
	}
	users.at(1).set({'donations': 100});
	users.sort();
	for(var i=0; i < users.length; i++){
		Ti.API.info(users.at(i).get('first_name') + users.at(i).get('donations'));
	}

	users.at(0).set({'message': "Rrrr.."});
});
$.listView.add(button2);

// $.win.addEventListener("close", function(){
    // $.destroy();
// } ;