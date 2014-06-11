var args = arguments[0] || {};

AG.mainWindow = $.mainWindow;
AG.mainWindow.addEventListener("haha", function(){
	// $.mainWindow.setTitlePrompt(null);
	if( $.mainWindow.getTitlePrompt() ){
		$.mainWindow.setTitlePrompt( null );
		
		$.mainWindow.setTitle("Rank");
		$.mainWindow.setTitleControl(null);
	}else{
		$.mainWindow.setTitlePrompt( "Rank" );
		
		var toolbar2 = Ti.UI.createView({
			backgroundColor: "yellow",
			width: 64,
			height:10
		});
		$.mainWindow.setTitleControl(toolbar2);
	}
});
 

// $.titleLabel.text = L('rank');
// $.userListView.getView().setTop($.navBarView.getHeight());

$.accountButton.addEventListener('click', function() {
	// Alloy.createController('accountsWindow').getView().open();
	// $.index.add(Alloy.createController('accountWindow').getView());

	var bgView = Titanium.UI.createView({
		backgroundColor : '#000',
		opacity: 0.4,
		zIndex: 9,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL
	});
	bgView.addEventListener('click', function() {
		Ti.API.info("clickeddd");
		$.mainWindow.remove(bgView);
		$.mainWindow.remove(accountsView);
	});
	$.mainWindow.add(bgView);

	var view = Titanium.UI.createView({
		borderRadius : 10,
		backgroundColor : 'red',
		zIndex: 2,
		width : 50,
		height : 50
	});
	// $.mainWindow.add(view);
	var accountsView = Alloy.createController('accountsView').getView();
	$.mainWindow.add(accountsView);
});

$.donateButton.addEventListener('click', function() {
	Alloy.createController('composeMessageWindow').getView().open();
});

// AG.mainNavWindow = $.mainNavWindow;
// $.mainNavWindow.open();
$.index.open();
