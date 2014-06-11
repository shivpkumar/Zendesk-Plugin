Discourse.TopicController.reopen({
  zendeskTicket: {
    text: 'Create Zendesk Ticket',
    title: 'Click to create a new ticket in Zendesk',
    exists: false
  },

  actions: {
    sendToZendesk: function(posts, currentUser, topicCreatorUsername) {
      var topicController = this,
          post = posts.shift(),
          title = post.topic.title,
          bodyAsHtml = post.cooked,
          createdAt = post.created_at,
          topicId = post.topic_id,
          categoryId = post.topic.category_id,
          topicSlug = post.topic_slug,
          collaboratorEmail = false,
          requesterInfo = false,
          categoryName = false;

      var makeAjaxCall = function() {
        if (collaboratorEmail && requesterInfo && categoryName) {
          return Discourse.ajax("/zendesk/create_ticket", {
            dataType: 'json',
            data: { post_title: title,
                    html_comment: bodyAsHtml,
                    created_at: createdAt,
                    requester: requesterInfo,
                    collaborator_email: collaboratorEmail,
                    category_name: categoryName,
                    external_id: topicSlug + topicId,
                    post_url: window.location.href },
            type: 'POST'
          }).then(function (ticket) {
            topicController.setProperties({ zendeskTicket: ticket });
          });
        }
      };
      
      Discourse.User.findByUsername(currentUser.get('username')).then(function (currentUser) {
        collaboratorEmail = currentUser.get('email');
      }).then(makeAjaxCall);

      Discourse.User.findByUsername(topicCreatorUsername).then(function (topicCreator) {
        requesterInfo = { name: topicCreator.get('name'), email: topicCreator.get('email')};
      }).then(makeAjaxCall);

      Discourse.Category.reloadBySlugOrId(categoryId).then(function (category) {
        categoryName = category.get('name');
      }).then(makeAjaxCall);
    },

    redirectToZendesk: function(url) { window.open(url); }
  }
});