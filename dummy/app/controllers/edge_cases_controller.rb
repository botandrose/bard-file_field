class EdgeCasesController < ApplicationController
  def show
    @post = Post.find_or_initialize_by(id: params[:post_id])
    render action: params[:id]
  end

  def update
    @post = Post.new(post_params)
    if @post.save
      redirect_to({ id: params[:id], post_id: @post.id }, notice: "Post created!")
    else
      flash.now.alert = @post.errors.full_messages.join("<br>")
      render action: params[:id]
    end
  end

  private

  def post_params
    params.require(:post).permit!
  end
end

