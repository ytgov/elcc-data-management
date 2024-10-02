require 'json'

##
# Example usage:
#
# Suppose 'prosemirror_json' is the JSON data you've provided.
#
# Load the JSON data
# prosemirror_json = DownloadJiraDescription.call(jira_ticket_url)
#
# markdown = ProseMirrorToMarkdown.call(prosemirror_json)
# puts markdown
class ProseMirrorToMarkdown
  def self.call(prosemirror_json)
    new(prosemirror_json).to_markdown
  end

  def initialize(prosemirror_json)
    @doc = prosemirror_json
  end

  def to_markdown
    process_nodes(@doc['content']).join("\n")
  end

  private

  def process_nodes(nodes)
    nodes.flat_map { |node| process_node(node) }
  end

  def process_node(node)
    case node['type']
    when 'doc'
      process_nodes(node['content'])
    when 'paragraph'
      process_paragraph(node)
    when 'heading'
      process_heading(node)
    when 'blockquote'
      process_blockquote(node)
    when 'orderedList'
      process_ordered_list(node)
    when 'bulletList'
      process_bullet_list(node)
    when 'listItem'
      process_list_item(node)
    when 'text'
      process_text(node)
    else
      # For any other nodes, process their content if they have any
      if node['content']
        process_nodes(node['content'])
      else
        []
      end
    end
  end

  def process_paragraph(node)
    [process_inline_content(node['content'])]
  end

  def process_heading(node)
    level = node['attrs']['level']
    content = process_inline_content(node['content'])
    ["\n#{'#' * level} #{content}\n"]
  end

  def process_blockquote(node)
    content = process_nodes(node['content']).map { |line| "> #{line}" }.join("\n")
    ["#{content}\n"]
  end

  def process_ordered_list(node)
    start_number = node['attrs']['order'] || 1
    items = node['content']
    process_list_items(items, ordered: true, start_number: start_number)
  end

  def process_bullet_list(node)
    items = node['content']
    process_list_items(items, ordered: false)
  end

  def process_list_items(items, ordered:, start_number: 1)
    counter = start_number
    items.flat_map do |item|
      lines = process_nodes(item['content'])
      prefix = ordered ? "#{counter}. " : "- "
      counter += 1
      lines.map.with_index do |line, idx|
        if idx == 0
          "#{prefix}#{line}"
        else
          "   #{line}"
        end
      end
    end
  end

  def process_text(node)
    text = node['text']
    if node['marks']
      node['marks'].each do |mark|
        case mark['type']
        when 'bold'
          text = "**#{text}**"
        when 'italic'
          text = "*#{text}*"
        when 'code'
          text = "`#{text}`"
        when 'link'
          href = mark['attrs']['href']
          text = "[#{text}](#{href})"
        when 'strike'
          text = "~~#{text}~~"
        # Add more mark types as needed
        end
      end
    end
    text
  end

  def process_inline_content(content)
    content.map { |node| process_node(node) }.join
  end
end
