class ExistingZendeskTicket < ZendeskTicket
  def initialize(existing_id)
    super
    @ticket = @client.search(:query => existing_id).to_a.try(:first)
  end
end