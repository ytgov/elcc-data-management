require "open3"
require "fileutils"

##
# Fetches and edits PR descriptions from a full GitHub PR URL using `gh api` (REST).
#
# Example:
#   PullRequestEditor.edit_pull_request_description('https://github.com/icefoganalytics/wrap/pull/263')
class PullRequestEditor
  EDITOR = ENV.fetch("EDITOR", ENV.fetch("VISUAL", "windsurf"))

  def self.edit_pull_request_description(pull_request_url)
    repo, pull_request_number = extract_repo_and_pull_request_number(pull_request_url)

    pull_request_body = fetch_pull_request_body_via_rest(repo, pull_request_number)

    app_root = File.expand_path(File.join(File.dirname(__FILE__), ".."))
    tmp_dir = File.join(app_root, "tmp")
    Dir.mkdir(tmp_dir) unless Dir.exist?(tmp_dir)

    file_path = File.join(tmp_dir, "pull_request_#{pull_request_number}.md")
    File.write(file_path, pull_request_body.to_s)
    puts "Editing: #{file_path}"

    open_in_editor_command = %(#{EDITOR} --wait "#{file_path}")
    system(open_in_editor_command)
    unless $?.success?
      raise "Failed to open in editor: '#{open_in_editor_command}' (exit code: #{$?.exitstatus})"
    end

    updated_pull_request_body = File.read(file_path)

    if updated_pull_request_body.strip != pull_request_body.to_s.strip
      update_pull_request_body_via_rest(repo, pull_request_number, file_path)
      FileUtils.rm(file_path)
    else
      puts "No changes made to the PR description."
      FileUtils.rm(file_path)
    end
  end

  private

  # Extract "owner/repo" and PR number from a full URL.
  def self.extract_repo_and_pull_request_number(pull_request_url)
    match_data = pull_request_url.match(%r{\Ahttps?://github\.com/([^/]+)/([^/]+)/pull/(\d+)}i)
    unless match_data
      raise ArgumentError, "Unsupported PR URL format: #{pull_request_url}"
    end

    repo = "#{match_data[1]}/#{match_data[2]}"
    pull_request_number = match_data[3]
    [repo, pull_request_number]
  end

  # Uses REST via `gh api` to fetch the PR body (avoids GraphQL projectCards pitfalls).
  def self.fetch_pull_request_body_via_rest(repo, pull_request_number)
    command = %(gh api "repos/#{repo}/pulls/#{pull_request_number}" --jq .body)
    puts "running: #{command}"
    stdout, stderr, status = Open3.capture3(command)

    if status.success?
      stdout
    else
      abort_with_cli_error("Error fetching PR description", stderr)
    end
  end

  # Uses REST via `gh api` to PATCH the PR body from a file.
  # `-F body=@file.md` tells gh to read the field value from the file and JSON-encode it.
  def self.update_pull_request_body_via_rest(repo, pull_request_number, new_body_file_path)
    command = %(gh api -X PATCH "repos/#{repo}/pulls/#{pull_request_number}" -F body=@#{new_body_file_path})
    puts "running: #{command}"
    stdout, stderr, status = Open3.capture3(command)

    if status.success?
      puts "PR description updated successfully."
    else
      raise "Error updating PR description: #{stderr}"
    end
  end

  def self.abort_with_cli_error(prefix, stderr)
    warn "#{prefix}: #{stderr}"
    exit(1)
  end
end
