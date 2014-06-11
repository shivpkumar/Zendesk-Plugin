class ::ZendeskController < ::ApplicationController
  require 'zendesk_api'

  def create_ticket            
    ticket = NewZendeskTicket.new(
      ticket_data: {
        external_id: params[:external_id],
        subject: params[:post_title],
        requester: params[:requester],
        collaborators: [params[:collaborator_email]]
      },
      post_url: params[:post_url],
      html_comment: params[:html_comment]
    )

    render_ticket_json(ticket)
  end

  def find_ticket
    return render nothing: true unless current_user && current_user.staff?
    ticket = ExistingZendeskTicket.new(params[:external_id])
    render_ticket_json(ticket)
  end

  def render_ticket_json(ticket)
    if ticket.exists?
      render json: { url: ticket.url, text: ticket.text, title: ticket.title, css_class: ticket.status, exists: true }
    else
      render json: { text: 'Create Zendesk Ticket', title: 'Click to create a new ticket in Zendesk', exists: false }
    end
  end
end