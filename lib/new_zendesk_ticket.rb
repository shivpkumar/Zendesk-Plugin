class NewZendeskTicket < ZendeskTicket
  def initialize(params)
    super
    @comment = format_comment(params[:post_url], params[:html_comment])
    @ticket = @client.tickets.create(params[:ticket_data].merge(additional_data))
  end

  private

  def format_comment(post_url, html_comment)
    body_to_text = Nokogiri::HTML(html_comment).text
    return "Link to forum topic:\n#{post_url}\n\nComment:\n#{body_to_text}"
  end

  def additional_data
    { :comment => { :value => @comment }, :tags => ['forum-beta'] }
  end
end