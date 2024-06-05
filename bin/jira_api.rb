require 'net/http'
require 'json'
require 'uri'

class JiraApi
  JIRA_USERNAME = ENV['JIRA_USERNAME']
  JIRA_API_TOKEN = ENV['JIRA_API_TOKEN']
  JIRA_SITE = 'https://yg-hpw.atlassian.net'

  def self.build_branch_name(jira_ticket_url)
    if JIRA_USERNAME.nil? || JIRA_API_TOKEN.nil?
      puts 'Please set JIRA_USERNAME and JIRA_API_TOKEN environment variables'
      return
    end

    issue_key = extract_issue_key(jira_ticket_url)
    issue_title = fetch_issue_title(issue_key)
    format_branch_name(issue_key, issue_title)
  end

  private

  def self.extract_issue_key(url)
    url.match(%r{/browse/([A-Z]+-\d+)})[1]
  end

  def self.fetch_issue_title(issue_key)
    uri = URI("#{JIRA_SITE}/rest/api/3/issue/#{issue_key}")
    request = Net::HTTP::Get.new(uri)
    request.basic_auth(JIRA_USERNAME, JIRA_API_TOKEN)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    data = JSON.parse(response.body)
    data['fields']['summary']
  end

  def self.format_branch_name(issue_key, issue_title)
    formatted_title = issue_title.downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9\-]/, '')
    "#{issue_key.downcase}/#{formatted_title}"
  end
end
