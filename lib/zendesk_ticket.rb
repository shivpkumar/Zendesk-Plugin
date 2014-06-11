class ZendeskTicket
  def initialize(params)
    @client = ZendeskAPI::Client.new do |config|
      config.url = "#{ENV['ZENDESK_API_URL']}/api/v2" # e.g. https://support.mydesk.com
      config.username = ENV['ZENDESK_USERNAME']
      config.token = ENV['ZENDESK_TOKEN']
      
      require 'logger'
      config.logger = Logger.new(File.join(Rails.root, "plugins", "zendesk", "logs", "zendesk.log"))
    end
  end

  def url
    # ENV['ZENDESK_TICKET_URL'] => e.g. https://mydesk.newrelic.com
    "#{ENV['ZENDESK_TICKET_URL']}/agent/#/tickets/#{@ticket.id}"
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
      when "Hold" then "Ticket is On Hold. "
      when "Solved" then "Ticket has been Solved. "
      when "Closed" then "Ticket has been Closed. "
      else "Ticket text is unknown. "
    end + "Click to view in Zendesk"
  end
end
