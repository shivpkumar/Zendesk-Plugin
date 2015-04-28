Discourse.ZendeskButton = Discourse.ButtonView.extend({
  rerenderTriggers: ['controller.zendeskTicket.exists'],

  classNames: ['zendesk'],
  classNameBindings: ['controller.zendeskTicket.css_class'],
  titleBinding: 'controller.zendeskTicket.title',
  textBinding: 'controller.zendeskTicket.text',

  click: function() {
    if (this.get('controller.zendeskTicket.exists')) {
      this.get('controller').send('redirectToZendesk', this.get('controller.zendeskTicket.url'));
    } else {
      this.get('controller').send('sendToZendesk', this.get('controller.postStream.posts'), this.get('controller.currentUser'), this.get('controller.postStream.firstLoadedPost.username'));
    }
  },

  renderIcon: function(buffer) {
    buffer.push("<i class='fa fa-ticket'></i>");
  }
});

Discourse.TopicFooterButtonsView.reopen({
  addZendeskButton: function() {
    if (this.get('controller.currentUser.staff')) {
      this.attachViewClass(Discourse.ZendeskButton);
    }
  }.on("additionalButtons")
});
