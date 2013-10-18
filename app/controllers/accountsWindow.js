var args = arguments[0] || {};
// var Facebook = Alloy.Globals.Facebook;

$.backgroundView.addEventListener('click', function(e) {
	$.accountsWindow.close();
});

$.facebookLoginButton.style = Facebook.BUTTON_STYLE_WIDE;

// var winBG = Titanium.UI.createWindow({
    // backgroundColor:'#000',
    // opacity:0.3,
    // zIndex: 9
// });
// winBG.addEventListener('click', function(){
	// $.accountsWindow.close();
	// winBG.close();
// });
// winBG.open();

