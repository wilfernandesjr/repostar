/* globals atomic */
var Repository = function(){
	var public = {},
		userName,
		githubApiUrl = "https://api.github.com/",
		starredRepositories = [],
		pageSize = 10,
		actualPage = 0;

	function getValidaCallback(callback) {
		if(typeof callback !== 'function') {
			callback = function(){};
		}

		return callback;
	}

	public.getNextUserStarredRepoPage = function (callback) {
			if(typeof userName !== 'string'){
				throw "O user name precisa ser especificado";
			}

			callback = getValidaCallback(callback);

			atomic.get(githubApiUrl + 'users/' + userName + '/starred?page=' + (actualPage + 1) + '&per_page=' + pageSize)
			.success(function (pageData) {
				if(pageData.length !== 0) {
					starredRepositories = starredRepositories.concat(pageData);
					actualPage++;
				}

				callback(null, pageData);
			})
			.error(function (error) {
				callback(error, null);
			});

		};

	public.getUserStarredRepositories = function () {
		return starredRepositories;
	};

	public.setUserName = function setUser(user, callback) {
		if(typeof user !== 'string'){
			throw "O user name precisa ser especificado";
		}

		callback = getValidaCallback(callback);

		if(user === userName) {
			callback(null, true);
			return;
		}

		atomic
		.get(githubApiUrl + 'search/users?q=' + user)
		.success(function(data){
			if(data && data.total_count > 0) {
				userName = user;

				starredRepositories = [];
				actualPage = 0;

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

	public.getPageSize = function getPageSize() {
		return pageSize;
	};

	return public;
};
