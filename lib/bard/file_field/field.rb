module Bard
  module FileField
    class Field < ActionView::Helpers::Tags::TextField
      def render
        options = @options.stringify_keys
        options["directupload"] = "/rails/active_storage/direct_uploads"
        add_default_name_and_id(options)

        content_tag("bard-file", options) do
          attachment = object.try(@method_name)
          if attachment&.attached?
            tag("uploaded-file", {
              src: @template_object.url_for(attachment),
              filename: attachment.filename,
              previewmimetype: attachment.content_type,
            })
          end
        end
      end
    end
  end
end

