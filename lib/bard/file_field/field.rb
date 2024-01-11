module Bard
  module FileField
    class Field < ActionView::Helpers::Tags::TextField
      def render &block
        options = @options.stringify_keys.reverse_merge({
          "directupload" => "/rails/active_storage/direct_uploads",
          "preview" => true,
        })
        add_default_name_and_id(options)

        content_tag("bard-file", options) do
          next block.call(options) if block
          Array(object.try(@method_name)).map do |attachment|
            content_tag("uploaded-file", nil, {
              name: options["name"],
              src: @template_object.url_for(attachment),
              filename: attachment.filename,
              value: attachment.signed_id,
              preview: options["preview"],
            })
          end.join("\n").html_safe
        end
      end
    end
  end
end

