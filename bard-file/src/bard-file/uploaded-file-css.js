import { css } from 'lit'

export default css`
  img, video{
    max-width: 100%;
  }
  figure{
    flex: 1 0 100%;
    margin: 0 1px;
    text-align: center;
    font-size: 0.8em;
    display: flex;
    flex-wrap: wrap;
  }

  figure > *:nth-last-child(1){
    flex: 1 0 100%;
  }

  .remove-media{
    flex: 0 0 30px;
    display: flex;
    align-items: center;
    opacity: 0.25;
  }

  .remove-media:hover{
    opacity: 0.5;
  }

  .remove-media::before{
    content: "";
    background: transparent url('data:image/svg+xml;utf8,<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve"><g><path d="M0,19.9C0.2,8.5,9.2-0.1,20.1,0C31.8,0.1,40.2,9.5,40,20.4c-0.2,11-8.9,19.7-20.1,19.6C8,39.9,0,30.5,0,19.9z M20,3.7 c-9,0-16.3,7-16.3,16.2C3.7,29,10.9,36.3,20,36.3c9,0,16.3-7.1,16.4-16.3C36.3,11,29.2,3.8,20,3.7z"/><path d="M17.3,20c-0.2-0.2-0.3-0.4-0.5-0.6c-1-1-2-1.9-2.9-2.9c-0.5-0.5-0.8-1.1-0.7-1.9c0.1-0.7,0.5-1.2,1.2-1.4 c0.8-0.2,1.5,0,2.1,0.6c1,1,2,2,3,3.1c0.3,0.4,0.6,0.3,0.9,0c1-1,2-2,3-3c0.3-0.3,0.7-0.5,1.1-0.6c0.8-0.2,1.6,0.1,2,0.8 c0.4,0.8,0.3,1.7-0.4,2.4c-1,1-2,2-3,3c-0.2,0.2-0.3,0.4-0.5,0.6c1.2,1.2,2.3,2.3,3.4,3.4c0.6,0.6,0.9,1.3,0.6,2.2 c-0.4,1.1-1.7,1.6-2.6,1c-0.3-0.2-0.5-0.4-0.8-0.6c-1-1-1.9-1.9-2.9-2.9c-0.3-0.3-0.5-0.3-0.9,0c-1,1-2,2.1-3,3 c-0.4,0.4-1,0.6-1.5,0.8c-0.6,0.1-1.2-0.2-1.5-0.8c-0.4-0.6-0.5-1.3-0.1-1.9c0.2-0.3,0.4-0.5,0.6-0.7C15.1,22.3,16.2,21.2,17.3,20z "/></g></svg>') no-repeat 100% 50%;
    width: 30px;
    height: 20px;
    background-size: contain;
    display: inline-block;
  }

  .remove-media span{
    display: inline-block;
    text-indent: -9999px;
    color: transparent;
  }

  // UPLOADER

  .direct-upload-wrapper{
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(#333, 0.9);
  }

  .direct-upload-content{
    display: block;
    background: #fcfcfc;
    padding: 40px 60px 60px;
    border-radius: 3px;
    width: 60vw;
  }
  .direct-upload-content h3{
    border-bottom: 2px solid #1f1f1f;
    margin-bottom: 20px;
  }

  .direct-upload{
    display: block;
    position: relative;
    padding: 0 20px;
    margin: 0 0px 10px 0;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    font-size: 18px;
    line-height: 2;
    flex: 0 0 calc(100% - 30px);
    text-align: left;
  }
  .direct-upload.separate-upload{
    padding: 0 10px;
    margin-top: 10px;
    font-size: 0.9em;
  }

  .direct-upload--pending{
    opacity: 0.6;
  }

  .direct-upload__progress{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0.2;
    background: #398927;
    transition: width 120ms ease-out, opacity 60ms 60ms ease-in;
    transform: translate3d(0, 0, 0);
  }

  .direct-upload--complete .direct-upload__progress{
    opacity: 0.4;
  }

  .direct-upload--error{
    border-color: red;
  }

  .video-preview *{
    max-width: 100%;
  }

`
