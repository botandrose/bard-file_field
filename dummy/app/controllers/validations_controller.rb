class ValidationsController < ApplicationController
  def show
    @post = Post.find_or_initialize_by(id: params[:post_id])
    render action: params[:id]
  end

  def update
    @post = Post.create!(post_params)
    redirect_to({ id: params[:id], post_id: @post.id }, notice: "Post created!")
  end

  private

  def post_params
    params.require(:post).permit!
  end
end

