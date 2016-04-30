;(function(jQuery){
    jQuery.fn.repoStar = function(){
		var elements = {},
			template,
			repository = Repository(),
			starredReposityList = [],
			userName,
			isLoading = false,
			app =  jQuery(this);

		elements.search = {};
		elements.search.button = app.find('.js-search-button');
		elements.search.input = app.find('.js-search-input');

		elements.content = app.find('.js-content');
		elements.btLoadMore = app.find('.js-load-more');
		elements.languageSelect = app.find('.js-language-select');
		elements.sortSelect = app.find('.js-sort-select');

		template = app.find("#templateRepository").html();

		function renderTemplate(template, data) {

            template = $(template);

            template.find('[data-attr="name"]').text(data['card-name']);
            template.find('[data-attr="language"]').text(data['card-language']);
            template.find('[data-attr="owner"]').text(data['card-owner']);
            template.find('[data-attr="avatar"]').attr('src', data['card-avatar']);
            template.find('[data-attr="description"]').text(data['card-description']);
            template.find('[data-attr="stars"]').text(data['card-stars']);
            template.find('[data-attr="issues"]').text(data['card-issues']);
            template.find('[data-attr="created"]').text(data['card-created']);
            template.find('[data-attr="pushed"]').text(data['card-pushed']);

            return template;
        }

		function formatItem(item) {
			var newItem = {};

 			newItem['card-name'] = item['name'];
 			newItem['card-language'] = item['language'];
 			newItem['card-owner'] = item['owner']['login'];
            newItem['card-avatar'] = item['owner']['avatar_url'];
            newItem['card-description'] = item['description'];
            newItem['card-stars'] = item['stargazers_count'];
            newItem['card-issues'] = item['open_issues_count'];
            newItem['card-created'] = item['created_at'];
            newItem['card-pushed'] = item['pushed_at'];

			return newItem;
		}

		function render(starredReposityList) {
			var i = 0;

			starredReposityList = sortListBySelectedValue(starredReposityList);

			for(; i < starredReposityList.length; i++) {
				elements.content.append(renderTemplate(template, formatItem(starredReposityList[i])));
			}
		}

		function paginate() {
			if(isLoading) return;

			repository.getNextUserStarredRepoPage(function (err, pageData) {
				if(!err && pageData.length) {
					elements.btLoadMore.show();
					starredReposityList = starredReposityList.concat(pageData);

					elements.sortSelect.val("");
					updateLanguageFilter(starredReposityList);
					render(pageData);
				}

				if(pageData.length < repository.getPageSize()) {
					elements.btLoadMore.hide();
				}
			});

			elements.sortSelect.off("change");
			elements.sortSelect.on("change", function(){
				elements.content.empty();
				render(starredReposityList);
			});
		}

		function sortListBySelectedValue(starredReposityList) {
			var sortOption = jQuery(".js-sort-select").val();

			if(sortOption !== "") {
				switch(sortOption) {
					case "alphabetic": {
						return starredReposityList.sort(function(before, after) {
							if(before.name.toLowerCase() < after.name.toLowerCase()) {
								return -1;
							} else if(before.name.toLowerCase() > after.name.toLowerCase()) {
								return 1;
							} else {
								return 0;
							}
						});
					}
					case "stars": {
						return starredReposityList.sort(function(before, after) {
							if(before.stargazers_count > after.stargazers_count) {
								return -1;
							} else if(before.stargazers_count < after.stargazers_count) {
								return 1;
							} else {
								return 0;
							}
						});
					}
					case "open_ussues": {
						return starredReposityList.sort(function(before, after) {
							if(before.open_issues_count > after.open_issues_count) {
								return -1;
							} else if(before.open_issues_count < after.open_issues_count) {
								return 1;
							} else {
								return 0;
							}
						});
					}
				}
			}

			return starredReposityList;
		}

		function getLanguageListFromStarredRepositories (starredReposityList) {
			var i = 0,
				item,
				options = [];

			for (; i < starredReposityList.length; i++) {
				item = starredReposityList[i];
				if(item.language && options.indexOf(item.language) === -1) {
					options.push(item.language);
				}
			}

			return options;
		}

		function updateLanguageFilter(starredReposityList) {
			var i = 0,
				options;

			options = getLanguageListFromStarredRepositories(starredReposityList);
			elements.languageSelect.empty().append('<option value="">Languages</option>');

			for (; i < options.length; i++) {
				elements.languageSelect.append('<option>' + options[i] + '</option>');
			}
		}

		function filterByLanguage(starredReposityList, language) {
			return starredReposityList.filter(function(item){
				if(language === item.language) {
					return true;
				}
			});
		}

		elements.btLoadMore.on("click", paginate);
		elements.languageSelect.on("change", function(){
			var list,
				selected = jQuery(this).val();

			elements.content.empty();
			elements.btLoadMore.hide();

			if(selected !== "") {
				list = filterByLanguage(starredReposityList, selected);
			} else {
				list = starredReposityList;
				elements.btLoadMore.show();
			}

			render(list);

			elements.sortSelect.off("change");
			elements.sortSelect.on("change", function(){
				elements.content.empty();
				render(list);
			});
		});

		elements.search.button.bind("click", function() {
			var _userName;
			if(isLoading) return;

			_userName = elements.search.input.val();
			if(userName === _userName) return;

			isLoading = true;
			app.addClass("is-waiting");

			repository.setUserName(_userName, function (err, userExists) {
				isLoading = false;
				if(userExists) {
					userName = _userName;
					elements.search.input.removeClass("is-error");
					app.removeClass("is-waiting");

					elements.content.empty();
					starredReposityList = [];

					paginate();
				} else {
					elements.search.input.addClass("is-error");
				}
			});
		});

        return this;
    };
})(jQuery);
