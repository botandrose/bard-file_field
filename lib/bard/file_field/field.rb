module Bard
  module FileField
    class Field < ActionView::Helpers::Tags::TextField
      def render
        options = @options.stringify_keys
        options["directupload"] = "/rails/active_storage/direct_uploads"
        add_default_name_and_id(options)

        attachment = object.try(@method_name)
        if attachment&.attached?
          options["previewsrc"] = @template_object.url_for(attachment)
          options["previewfilename"] = attachment.filename
          options["previewmimetype"] = attachment.content_type
        end

        tag("bard-file", options)
      end
    end
  end
end

