Discourse.TopicController = Discourse.TopicController.extend({
  zendeskTicket: { 
    text: 'Create Zendesk Ticket', 
    title: 'Click to create a new ticket in Zendesk',
    exists: false
  },

  actions: {
    sendToZendesk: function(posts, user) {
      var topicController = this,
          post = posts.shift(),
          title = post.topic.title,
          bodyAsHtml = post.cooked,
          createdAt = post.created_at,
          topicId = post.topic_id,
          categoryId = post.topic.category_id,
          topicSlug = post.topic_slug,
          email = false,
          categoryName = false;

      var makeAjaxCall = function() {
        if (email && categoryName) {
          return Discourse.ajax("/zendesk/create_ticket", {
            dataType: 'json',
            data: { post_title: title,
                    html_comment: bodyAsHtml,
                    created_at: createdAt,
                    email: email,
                    category_name: categoryName,
                    external_id: topicSlug + topicId,
                    post_url: window.location.href },
            type: 'POST'
          }).then(function (ticket) {
            topicController.setProperties({ zendeskTicket: ticket });
          });
        }
      };
      
      Discourse.User.findByUsername(user.get('username')).then(function (user) {
        email = user.get('email');
      }).then(makeAjaxCall);

      Discourse.Category.reloadBySlugOrId(categoryId).then(function (category) {
        categoryName = category.get('name');
      }).then(makeAjaxCall);
    },

    redirectToZendesk: function(url) { window.open(url); }
  }
});