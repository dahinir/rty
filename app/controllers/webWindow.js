var args = arguments[0] || {};

// $.titleLabel.setText( L('web') );
if(args.url){
	$.webView.setUrl(args.url);
	$.webWindow.setTitle(args.url);
}
// exports.addEventListener = function(a, b ){
	// $.webView.addEventListener(a, b);
// };
// exports.setUrl = function(url){
	// $.webView.setUrl(url);
// };
// exports.stopLoading = function(){
	// $.webView.stopLoading();
// };
$.webView.addEventListener('load', function(e){
	// var titleText = e.url;
	// if(titleText.length > 27){
		// titleText = titleText.substring(0, 25) + "..";
	// }
	// $.titleLabel.setText(titleText);
});
// $.closeButton.addEventListener('click', function(e){
	// $.webWindow.close();
// });

exports.getWebView = function(){
	return $.webView;
};

