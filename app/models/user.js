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
				
				var thisCollection = this;
				// var Cloud = Alloy.Globals.Cloud;

				Cloud.Users.query({
					page : 1,
					per_page : 10,
					where : {
						// age : {
							// '$gt' : 28
						// },
						// favorite_color : 'blue',
						// first_name : 'joe'
					}
				}, function(e) {
					if (e.success) {
						// alert('Success:\n' + 'Count: ' + e.users.length);
						var fb_ids = [];
						for(var i = 0; i < e.users.length; i++){
							e.users[i].acs_id = e.users[i].id;
							e.users[i].fb_id = e.users[i].external_accounts[0].external_id;
							e.users[i].donations = e.users[i].custom_fields.donations;
							e.users[i].message = e.users[i].custom_fields.message;
							fb_ids.push( e.users[i].fb_id );
					// alert(e.users[i].custom_fields.donations + e.users[i].custom_fields.message);
							var user = thisCollection.get( e.users[i].acs_id );
							if( user ){
								user.set( e.users[i] );
							}else{
								thisCollection.add( e.users[i] );
							}
							// if( Alloy.Globals.users.length > 1024 ){
								// Alloy.Globals.users.reset();
							// }
						}
						
						// Alloy.Globals.Facebook.requestWithGraphPath('', {
						// alert(fb_ids);
						Facebook.requestWithGraphPath('', {
							ids: fb_ids,
							// format: 'json',
							// width: 200,
							// height: 200,
							// fields: ['first_name', 'last_name', 'email', 'picture', 'link']
							fields: ['first_name', 'last_name', 'email', 'link']
						}, 'GET', function(e) {
							if (e.success) {
								var result = JSON.parse(e.result);
								// alert(fb_ids.length);
								var fb_id;
								for(var i = 0; fb_ids.length; i++){
									fb_id = fb_ids.pop();
									thisCollection.where({'fb_id': fb_id}).pop().set({
										'first_name': result[fb_id].first_name,
										'last_name': result[fb_id].last_name,
										'email': result[fb_id].email,
										'link': result[fb_id].link
										// 'picture_url': result[fb_id].picture.data.url
										// 'picture_url': "https://graph.facebook.com/"+fb_id+"/picture?width=96&height=96"
									});
								}
								// Ti.API.info(result[fb_id].picture.data.url);
								// alert(fb_ids.length);
							} else if (e.error) {
								alert(e.error);
							} else {
								alert('Unknown response');
							}
						}); 
		
						// if( success ){
							// success(thisCollection, e.users, options);
						// }
						
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

