class ZendeskTicket
  def initialize(params)
    @client = ZendeskAPI::Client.new do |config|
      config.url = "https://support.newrelic.com/api/v2"
      config.username = ENV['ZENDESK_USERNAME']
      config.token = ENV['ZENDESK_TOKEN']
    end
  end

  def url
    "https://newrelic.zendesk.com/agent/#/tickets/#{@ticket.id}"
  end

  def status
    @ticket.status.titleize
  end

  def text
    return "View #{status} Zendesk Ticket"
  end

  def title
    case status
      when "New" then "Ticket is New. "
      when "Open" then "Ticket is Open. "
      when "Pending" then "Ticket is Pending. "
      when "Solved" then "Ticket has been Solved. "
      when "Closed" then "Ticket has been Closed. "
      else "Ticket text is unknown. "
    end + "Click to view in Zendesk"
  end
end