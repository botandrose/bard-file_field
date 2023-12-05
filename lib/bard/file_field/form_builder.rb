require_relative "field"

module Bard
  module FileField
    module FormBuilder
      def bard_file_field method, options={}, &block
        self.multipart = true
        Field.new(@object_name, method, @template, objectify_options(options)).render(&block)
      end
    end
  end
end
