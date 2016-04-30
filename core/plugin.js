;(function(jQuery){
    jQuery.fn.repoStar = function(){
		var elements = {},
			template,
			repository = Repository(),
			starredReposityList = [],
			userName;

		elements.search = {};
		elements.search.button = jQuery('.js-search-button');
		elements.search.input = jQuery('.js-search-input');

		elements.content = jQuery('.js-content');
		elements.btLoadMore = jQuery('.js-load-more');

		template = jQuery("#templateRepository").html();

		function renderTemplate(template, data) {

            template = $(template);

            template.find('[data-attr="name"]').text(data['card-name']);
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
			repository.getNextUserStarredRepoPage(function (err, pageData) {
				if(!err && pageData.length) {
					elements.btLoadMore.show();
					starredReposityList.push(pageData);
					render(pageData);
				} else {
					elements.btLoadMore.hide();
				}
			});
		}

		elements.btLoadMore.on("click", paginate);

		elements.search.button.bind("click", function() {
			repository.setUserName(elements.search.input.val(), function (err, userExists) {
				if(userExists) {
					elements.content.empty();
					paginate();
				} else {

				}
			});
		});

        return this;
    };
})(jQuery);
