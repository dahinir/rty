var args = arguments[0] || {};

// var rankWindow = Alloy.createController('rankWindow');
$.titleLabel.text = L('rank');
$.userListView.getView().setTop($.navBarView.getHeight());

$.accountButton.addEventListener('click', function() {
	Alloy.createController('accountsWindow').getView().open();
});

$.donateButton.addEventListener('click', function() {
	Alloy.createController('composeMessageWindow').getView().open();
});

$.mainWindow.open();

