module Bard
  module FileField
    class Field < ActionView::Helpers::Tags::TextField
      def render &block
        options = @options.stringify_keys
        options["directupload"] = "/rails/active_storage/direct_uploads"
        add_default_name_and_id(options)

        content_tag("bard-file", options) do
          next block.call if block
          attachment = object.try(@method_name)
          if attachment&.attached?
            content_tag("uploaded-file", nil, {
              src: @template_object.url_for(attachment),
              filename: attachment.filename,
              mimetype: attachment.content_type,
            })
          end
        end
      end
    end
  end
end

