;(function(jQuery){
    jQuery.fn.repoStar = function(){
		var elements = {},
			template,
			repository = Repository(),
			starredReposityList = [],
			userName,
			isLoading = false;

		elements.search = {};
		elements.search.button = jQuery('.js-search-button');
		elements.search.input = jQuery('.js-search-input');

		elements.content = jQuery('.js-content');
		elements.btLoadMore = jQuery('.js-load-more');
		elements.languageSelect = jQuery('.js-language-select');

		template = jQuery("#templateRepository").html();

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
					updateLanguageFilter(starredReposityList);
					render(pageData);
				} else {
					elements.btLoadMore.hide();
				}
			});
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
			var filteredList,
				selected = jQuery(this).val();

			elements.content.empty();

			if(selected !== "") {
				filteredList = filterByLanguage(starredReposityList, selected);
				render(filteredList);
			} else {
				render(starredReposityList);
			}
		});

		elements.search.button.bind("click", function() {
			if(isLoading) return;
			isLoading = true;

			repository.setUserName(elements.search.input.val(), function (err, userExists) {
				isLoading = false;
				if(userExists) {
					elements.search.input.removeClass("is-error");
					elements.content.empty();
					paginate();
				} else {
					elements.search.input.addClass("is-error");
				}
			});
		});

        return this;
    };
})(jQuery);
