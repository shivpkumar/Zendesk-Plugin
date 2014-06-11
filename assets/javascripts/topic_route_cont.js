Discourse.TopicRoute.on("setupTopicController", function(event) {
  Discourse.ajax("/zendesk/find_ticket", {
    dataType: 'json',
    data: { external_id: event.currentModel.slug + event.currentModel.id },
    type: 'GET'
  }).then(function (ticket) {
    if (ticket) event.controller.setProperties({ zendeskTicket: ticket });
  });
});