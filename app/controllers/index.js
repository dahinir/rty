var args = arguments[0] || {};

// var rankWindow = Alloy.createController('rankWindow');
$.titleLabel.text = L('rank');
$.userListView.getView().setTop($.navBarView.getHeight());

$.accountButton.addEventListener('click', function() {
	// Alloy.createController('accountsWindow').getView().open();
	// $.mainWindow.add(Alloy.createController('accountWindow').getView());

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

$.mainWindow.open();

