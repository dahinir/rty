// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// global variables
// var _ = require('alloy/underscore')._;
var Facebook = require('facebook');
var Cloud = require('ti.cloud');

Cloud.sessionId = Ti.App.Properties.getString('acsSessionId');


if (OS_IOS) {
	var Storekit = require('ti.storekit');
	Storekit.receiptVerificationSandbox = (Ti.App.deployType !== 'production');
	Storekit.receiptVerificationSharedSecret = "c7833388c0ab4140a4a0104e85a9da6f";
	// alert(Storekit.receiptVerificationSharedSecret);
	// imrtysuckers2@gmail.com / 1mrtySuckers

	Storekit.addEventListener('transactionState', function(evt) {
		alert("transactionState event: " + evt.state + "\n " + evt.quantity + "\n " + evt.productIdentifier);

		switch (evt.state) {
			case Storekit.FAILED:
				alert("Storekit.FAILED " + evt.message);
				if (evt.cancelled) {
					alert('Purchase cancelled');
				} else {
					alert('ERROR: Buying failed! ' + evt.message);
				}
				break;
			case Storekit.PURCHASED:
				alert("Storekit.PURCHASED!");
				alert("date:" + evt.date + "\n" + "identifier:" + evt.identifier + "\n" + "receipt:" + JSON.stringify(evt.receipt));

				if (verifyingReceipts) {
					Storekit.verifyReceipt(evt, function(e) {
						if (e.success) {
							if (e.valid) {
								alert('Thanks! Receipt Verified');
								markProductAsPurchased(evt.productIdentifier);
							} else {
								alert('Sorry. Receipt is invalid');
							}
						} else {
							alert(e.message);
						}
					});
				} else {
					alert('Thanks!');
					markProductAsPurchased(evt.productIdentifier);
				}

				break;
			case Storekit.PURCHASING:
				alert("Storekit.PURCHASING");
				Ti.API.info("Purchasing " + evt.productIdentifier);
				break;
			case Storekit.RESTORED:
				alert("Storekit.RESTORED");
				// The complete list of restored products is sent with the `restoredCompletedTransactions` event
				Ti.API.info("Restored " + evt.productIdentifier);
				break;
		}
	});
}


Facebook.appid = Ti.App.Properties.getString("ti.facebook.appid");
// To use the build-in iOS 6 login, this property cannot contain any of the following: 
// offline_access, publish_actions, publish_stream, publish_checkins, ads_management, 
// create_event, rsvp_event, manage_friendlists, manage_notifications, or manage_pages.
// facebook.permissions = ["id", "name", "first_name", "last_name", "link", "username", "gender", "locale", "age_range"];
Facebook.permissions = ["publish_stream"];
Facebook.forceDialogAuth = false;

Facebook.addEventListener('login', function(e){
	// if( Ti.App.Properties.hasProperty("fb_id") ){
		// return;
	// }
	if( e.success ){
		Ti.App.Properties.setString("fb_id", e.uid);
		
		Cloud.SocialIntegrations.externalAccountLogin({
		    type: 'facebook',
		    token: Facebook.accessToken
		}, function (e) {
		    if (e.success) {
		    	Ti.App.Properties.setString('acsSessionId', Cloud.sessionId );
		    	
		        var user = e.users[0];
		        // Ti.API.info( user );

    			if( user.custom_fields && user.custom_fields.donations >= 0 ){
    				// alert(user.custom_fields.donations + " $");
    			}else{
					Cloud.Users.update({
					    // first_name: 'joe',
					    // last_name: 'user',
					    custom_fields: {
					        donations: 0
					    }
					}, function (e) {
					    if (e.success) {
					        var user = e.users[0];
					        // alert(user);
					    } else {
					        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					    }
					});
    			}
		    } else {
		        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}else{
		alert( e.error );
	}
});
Facebook.addEventListener('logout', function(e) {
	Ti.App.Properties.removeProperty("acsSessionId");
    alert('Logged out');
});


	// Facebook.logout();
	// Facebook.reauthorize( ["publish_actions"], "everyone", function(e){
		// alert("wow");
		// alert( JSON.stringify(e) );
	// });

Alloy.Collections.user = Alloy.createCollection('user');

