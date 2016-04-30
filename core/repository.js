/* globals atomic */
var Repository = function(){
	var public = {},
		userName,
		githubApiUrl = "https://api.github.com/",
		starredRepositories = [];

	function getValidaCallback(callback) {
		if(typeof callback !== 'function') {
			callback = function(){};
		}

		return callback;
	}

	public.getNextUserStarredRepoPage = (function() {
		var actualPage = 0,
			pageSize;

		return function (callback) {
			if(typeof userName !== 'string'){
				throw "O user name precisa ser especificado";
			}

			callback = getValidaCallback(callback);

			atomic.get(githubApiUrl + 'users/' + userName + '/starred?page=' + (actualPage + 1))
			.success(function (pageData) {
				if(pageData.length !== 0) {
					if(!pageSize) {
						pageSize = pageData.length;
					}

					starredRepositories = starredRepositories.concat(pageData);
					actualPage++;
				}

				callback(null, pageData);
			})
			.error(function (error) {
				callback(error, null);
			});

		};

	})();

	public.getUserStarredRepositories = function () {
		return starredRepositories;
	};

	public.setUserName = function setUser(user, callback) {
		if(typeof user !== 'string'){
			throw "O user name precisa ser especificado";
		}

		callback = getValidaCallback(callback);

		atomic
		.get(githubApiUrl + 'search/users?q=' + user)
		.success(function(data){
			if(data && data.total_count > 0) {
				userName = user;

				starredRepositories = [];
				userName = user.toLowerCase();

				callback(null, true);
			} else {
				callback(null, false);
			}
		})
		.error(function (error) {
			callback(error);
		});
	};

	public.getLanguageListFromStarredRepositories = function () {
		var i = 0,
			item,
			options = [];

		if(typeof userName !== 'string'){
			return [];
		}

		for (; i < starredRepositories.length; i++) {
			item = starredRepositories[i];
			if(item.language && options.indexOf(item.language) === -1) {
				options.push(item.language);
			}
		}

		return options;
	};

	return public;
};
