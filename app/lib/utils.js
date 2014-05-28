/**
 * A cross platform navigation group opener
 * @param {Object} navGroup
 * @param {Object} controllerName
 * @param {Object} controllerArgument
 */
exports.openController = _.throttle(function(navGroup,name,args){
	var w=Alloy.createController(name,args).getView();
	if (OS_ANDROID){
		w.addEventListener('open',function(e){
			if (! w.getActivity()) {
	            Ti.API.error("Can't access action bar on a lightweight window.");
	        } else {
	            actionBar = w.activity.actionBar;
	            if (actionBar) {
	                actionBar.displayHomeAsUp=true;
	                actionBar.onHomeIconItemSelected = function() {
	                    w.close();
	                };
	            }
	            w.activity.invalidateOptionsMenu();
	        }
		});
		w.open();
	}else{
		if(navGroup.apiName === "Ti.UI.iOS.NavigationWindow"){
			navGroup.openWindow(w, {animated: true});				
		}else{
			navGroup.open(w, {animated: true});
		}
	}
}, 2000);
