class PostsController < ApplicationController
  def new
    @post = Post.new
  end

  def create
    @post = Post.create!(params.require(:post).permit!)
    redirect_to @post, notice: "Post created!"
  end

  def show
    @post = Post.find(params[:id])
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
    @post = Post.find(params[:id])
    @post.update!(params.require(:post).permit!)
    redirect_to @post, notice: "Post updated!"
  end
end

