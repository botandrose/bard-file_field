# frozen_string_literal: true

require_relative "file_field/version"

module Bard
  module FileField
    class Engine < ::Rails::Engine
      initializer "bard-file_field.assets" do
        if Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += %w[
            bard-file.js
            bard-file/css.js
            bard-file/form-controller.js
            bard-file/format-bytes.js
            bard-file/get-mime-type.js
            bard-file/is-constructor.js
          ]
        end
      end

      config.after_initialize do
        ActionView::Base.default_form_builder.include Module.new {
          def bard_file_field method, options={}
            self.multipart = true
            BardFileField.new(@object_name, method, @template, objectify_options(options)).render
          end
        }
      end
    end

    class BardFileField < ActionView::Helpers::Tags::TextField
      def render
        options = @options.stringify_keys
        options["directupload"] = "/rails/active_storage/direct_uploads"
        add_default_name_and_id(options)

        preview_method = @method_name.to_s.sub(/_file$/,"").to_sym
        preview = object.try(preview_method)
        options["previewfilename"] = preview&.filename
        options["previewsrc"] = preview && @template.url_for(preview.thumb_src)

        tag("bard-file", options)
      end
    end
  end
end
