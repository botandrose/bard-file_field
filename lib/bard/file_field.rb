# frozen_string_literal: true

require_relative "file_field/version"
require_relative "file_field/form_builder"

module Bard
  module FileField
    class Engine < ::Rails::Engine
      initializer "bard-file_field.assets" do
        if Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += %w[
            bard-file.js
            bard-file/css.js
            bard-file/file.js
            bard-file/form-controller.js
            bard-file/direct-upload.js
            bard-file/drag-and-drop.js
            bard-file/validations.js
            bard-file/rendering.js
          ]
        end
      end

      config.after_initialize do
        ActionView::Base.default_form_builder.include FormBuilder
      end
    end
  end
end
