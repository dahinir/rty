var args = arguments[0] || {};
// var chats = ownerAccount.getChats();	// all chats that relevant ownerAccount
// Alloy.Globals.chats.fetch();

var softKeyboardHeight = 0;

// $.titleImageView.setImage( ownerAccount.get('profile_image_url_https') );
$.titleLabel.setText( L('leave-a-msg') );

// $.remainCountToBurn.setText( YOTOO_CONVERSATION_LIMIT );
$.donationTextField.setHintText( L('1.00') );

var setSoftKeyboardHeight = function(e){
	softKeyboardHeight = e.keyboardFrame.height;
	$.messageTextArea.fireEvent('focus');
	Ti.App.removeEventListener('keyboardFrameChanged', setSoftKeyboardHeight);
};
Ti.App.addEventListener('keyboardFrameChanged', setSoftKeyboardHeight);


var multipleQuantity;
$.picker.addEventListener('change', function(e){
	// alert(e.rowIndex);
	pickerIndex = e.rowIndex;
	// alert(e.selectedValue);
	Ti.API.info( e.rowIndex);
	Ti.API.info( e.selectedValue[0] );
	Ti.API.info( e.row.multipleQuantity );
	multipleQuantity = e.row.multipleQuantity;
});


for (var i = 1; i < 10; i++) {
	var dollar = 99 * i / 100;
	var newRow = Ti.UI.createPickerRow({
		title : String.formatCurrency( dollar )
		// multipleQuantity: i
	});
	newRow.multipleQuantity = i;
	$.pickerColumn.addRow( newRow );
}

var postMessage = function(e){
	if( e.state !== Storekit.PURCHASED ){
		return;
	}
	Cloud.Users.update({
	    // first_name: 'joe',
	    // last_name: 'user',
	    custom_fields: {
	    	message:  $.messageTextArea.getValue(),
	    	donations: 99 * multipleQuantity / 100
	    }
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        alert('Success:\n' +
	            'id: ' + user.id + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);
	    } else {
	        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

if( OS_IOS ){
	Storekit.addEventListener('transactionState', postMessage);
}

$.closeButton.addEventListener('click', function(e){
	$.composeMessageWindow.close();
});
$.sendButton.addEventListener('click', function(e){
	// alert( $.messageTextArea.getValue() );
	// e.state = Storekit.PURCHASED;
	// postMessage(e);
	// return;

	if(OS_IOS){
		Storekit.requestProducts(['com.dasolute.rty.leave'], function(e){
			Ti.API.info(e);
			// alert(e);
			if( e.success ){
				Ti.API.info("request products success: "+ e.products[0]);
				Storekit.purchase( e.products[0] , multipleQuantity);
			}
		});
	}
});

$.messageTextArea.addEventListener('focus', function(e){
	$.messageTextArea.setBottom( softKeyboardHeight );
});

$.messageTextArea.addEventListener('postlayout', function(){
	$.donationTextField.focus();
});

$.messageTextArea.addEventListener('doubletap', function(e){
	$.messageTextArea.blur();
	$.messageTextArea.setBottom( 0 );
});

$.composeMessageWindow.addEventListener('close', function(){
	Ti.App.removeEventListener('keyboardFrameChanged', setSoftKeyboardHeight);
	if( OS_IOS ){
		Storekit.removeEventListener('transactionState', postMessage);
	}
	$.destroy();
});

/////////
// $.tweetTextArea.top = $.navBarView.height;
// $.tweetTextArea.height = Ti.Platform.displayCaps.platformHeight - ($.tweetTextArea.top + $.toolbarView.height + $.toolbarView.bottom + 20);






