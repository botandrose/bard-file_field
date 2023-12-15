module Bard
  module FileField
    class Field < ActionView::Helpers::Tags::TextField
      def render &block
        options = @options.stringify_keys
        options["directupload"] = "/rails/active_storage/direct_uploads"
        add_default_name_and_id(options)

        content_tag("bard-file", options) do
          next block.call(options) if block
          attachment = object.try(@method_name)
          if attachment&.attached?
            content_tag("uploaded-file", nil, {
              name: options["name"],
              src: @template_object.url_for(attachment),
              filename: attachment.filename,
              value: attachment.signed_id,
            })
          end
        end
      end
    end
  end
end

