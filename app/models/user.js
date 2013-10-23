exports.definition = {
	config: {
		"columns": {
			"external_type": "TEXT",	// "twitter" or "facebook"
			
			// facebook columns
			"fb_id": "TEXT",
			// "name": "TEXT",
			"picture_url": "TEXT",
			
			// twitter columns
			// "id_str":"TEXT",
			// "name":"TEXT",
			// "screen_name":"TEXT",
			// "profile_image_url_https":"TEXT",
			// "profile_background_image_url": "TEXT",
			
			// ACS columns
			"acs_id": "TEXT",
			"first_name": "TEXT",
			"last_name": "TEXT",
			"donations": "INTEGER",
			"message":"TEXT",
			
			// for this app
			// "cached_at":
		},
		"defaults": {
		},
		"adapter": {
			"idAttribute": "acs_id",
			"type": "sql",
			"collection_name": "user"
		}
	},		

	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			getUser: function(purpose, params, callback) {
				var twitterAPI = this.ownerAccount.twitterAPI;
				var destinationParams = {
					'include_entities': true,
					'skip_status': true
				};
				_.extend(destinationParams, params);
				twitterAPI.getFromServer(purpose, destinationParams, callback);
				return "babe";
			},
			getMetaData: function(purpose, params, callback) {
				var twitterAPI = this.ownerAccount.twitterAPI;
				params = params || {};
				twitterAPI.getFromServer(purpose, params, callback);
				return "babe";
			},
			/**
			 * @method fetchFromServer
			 * designed like backbone.fetch()
			 * @param {Object} options
			 * @param {String} options.purpose Will match url
			 * @param {Object} options.params Will use url parameter
			 * @param {Function} [options.success] Callback function executed after a successful fetch tweets.
			 * @param {Function} [options.error] Callback function executed after a failed fetch.
			 */
			fetchFromServer: function(options){
				var params = {
					'include_entities': true,
					'skip_status': true
				}; 
				_.extend(params, options.params);
				var success = options.success;
				var error = options.error;
				
				var thisModel = this;
				var twitterApi = this.twitterApi;
				twitterApi.fetch({
					'purpose': options.purpose,
					'params': params,
					'onSuccess': function( resultJSON ){
						// thisModel.clear();
						thisModel.set( resultJSON );
						if( success ){
							success();
						}
					},
					'onFailure': function( resultJSON ){
						if( error ){
							error();
						}
					}
				});
			},
			
			fetchMetaData: function(options){
				var params = {};
				_.extend(params, options.params);
				var success = options.success;
				var error = options.error;
				
				var twitterApi = this.twitterApi;
				twitterApi.fetch({
					'purpose': options.purpose,
					'params': params,
					'onSuccess': function( resultJSON ){
						success( resultJSON );
					},
					'onFailure': function( resultJSON ){
						error( resultJSON );
					}
			 	});
			}
		}); // end extend
		
		return Model;
	},
	
	
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			/**
			 * @method fetchFromServer
			 * designed like backbone.fetch()
			 * @param {Object} options
			 * @param {String} options.purpose Will match url
			 * @param {Object} options.params Will use url parameter
			 * @param {Function} [options.success] Callback function executed after a successful fetch tweets.
			 * @param {Function} [options.error] Callback function executed after a failed fetch.
			 */
			'fetchFromServer': function(options){
				var success = options.success;
				var thisCollection = this;
				// var Cloud = Alloy.Globals.Cloud;

// thisCollection.add({
    // "acs_id": "52624d7cd72ec85152001bd7",
    // "donations": 0,
    // "fb_id": "100005482740868",
    // "first_name": "rapodor",
    // "last_name": "don",
    // "message": "fuck"
// });
// thisCollection.add({
    // "acs_id": "522db010a508bb0b14010a52",
    // "donations": 5.94,
    // "fb_id": "1463107549",
    // "first_name": "shin",
    // "last_name": "da",
    // "message": "Hello "
// });
// return;

				Cloud.Users.query({
					page : 1,
					per_page : 100,
				    // 'limit': 999, // 1000 is maxium
				    // 'order': 'custom_fields.donations',
				    order: '-donations',
					where : {
						// "external_accounts.external_id" : query.id,
						// age : {
							// '$gt' : 28
						// },
						// favorite_color : 'blue',
						// first_name : 'joe'
					}
				}, function(e) {
					if (e.success) {
						var fb_ids = [];
						/** there is no {merge:true} options in backbone 0.9.2 **/
						var tempUser;
						_.each(e.users, function(userJSON){
							var tempUser = thisCollection.where({'acs_id': userJSON.id}).pop();
							if( tempUser ){
								tempUser.set({
									// 'fb_id' : userJSON.external_accounts[0].external_id,
									// 'first_name' : userJSON.first_name,
									// 'last_name' : userJSON.last_name,
									'donations' : userJSON.custom_fields.donations,
									'message' : userJSON.custom_fields.message
								}); 
							}else{
								thisCollection.add({
									'acs_id': userJSON.id,
									'fb_id' : userJSON.external_accounts[0].external_id,
									'first_name' : userJSON.first_name,
									'last_name' : userJSON.last_name,
									'donations' : userJSON.custom_fields.donations,
									'message' : userJSON.custom_fields.message
								});
							}
							
							fb_ids.push( userJSON.external_accounts[0].external_id );
						});
						thisCollection.sort();
						/** there is no sort event in backbone 0.9.2 **/
						thisCollection.trigger('sort');
						
						// fb_ids = ["1463107549", "100006520249939", "100005482740868"];
						Facebook.requestWithGraphPath('', {
							ids: fb_ids,
							format: 'json',
							// width: 200,
							// height: 200,
							// fields: ['first_name', 'last_name', 'email', 'picture', 'link']
							fields: ['first_name', 'last_name', 'email', 'link']
						}, 'GET', function(e) {
							if (e.success) {
								var result = JSON.parse(e.result);
								_.each(fb_ids, function(fb_id){
									if( !result[fb_id] ){
										// non public fb user
										Ti.API.info(" fb_id: "+ fb_id);
										return;
									}
									Ti.API.info("result fb_id: 	" + fb_id);
									thisCollection.where({'fb_id': fb_id}).pop().set({
										'first_name': result[fb_id].first_name,
										'last_name': result[fb_id].last_name,
										'email': result[fb_id].email,
										'link': result[fb_id].link
										// 'picture_url': result[fb_id].picture.data.url
										// 'picture_url': "https://graph.facebook.com/"+fb_id+"/picture?width=96&height=96"
									});
								});
							} else if (e.error) {
								Ti.API.warn(e.error);
							} else {
								Ti.API.warn('Unknown response');
							}
						}); 
		
						if( success ){
							success(thisCollection, e.users, options);
						}
					} else {
						alert('acs Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						Ti.API.info( ((e.error && e.message) || JSON.stringify(e)));
					}
				});

			}
		}); // end extend
		
		return Collection;
	}
};

