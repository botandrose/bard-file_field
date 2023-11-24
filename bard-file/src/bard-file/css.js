import { css } from 'lit'

export default css`
  :host {
    display: block;
    padding: 25px;
    color: var(--bard-file-text-color, #000);
  }
  :host *{
    box-sizing: border-box;
    position: relative;
  }
  drag-and-drop{
    display: block;
    padding: 40px;
    outline-offset: -10px;
    background: rgba(255,255,255, 0.25);
    margin: 0;
    text-align: center;
    transition: all 0.15s;
    outline: 2px dashed rgba(0,0,0,0.25);
    color: #444;
    font-size: 14px;
  }
  drag-and-drop.-full{
    width: 100%;
  }
  .-dragover{
    background: rgba(255,255,255,0.5);
    outline: 2px dashed rgba(0,0,0,0.25);
  }
  .drag-icon{
    display: block;
    text-align: center;
    font-size: 4em;
    font-style: normal;
  }
  .drag-icon::before{
    content: "";
    background: url('data:image/svg+xml;utf8,<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 159.9 159.7" style="enable-background:new 0 0 159.9 159.7;" xml:space="preserve"><g><path d="M105.7,109.8c0.4-0.7,0.5-1.1,0.7-1.4c4.1-4.1,8.2-8.3,12.4-12.4c0.6-0.6,1.8-1,2.7-1c6.9,0,13.8-0.1,20.7,0.4 c9.5,0.6,17.4,9.1,17.6,18.6c0.2,8.4,0.2,16.8,0.1,25.2c-0.1,12.1-8.8,20.4-21.2,20.4c-26.7,0-53.5,0-80.2,0c-12.2,0-24.3,0-36.5,0 c-13.2,0-21.7-8.2-21.8-21.4c-0.1-8.3-0.2-16.7,0.2-25c0.5-9.6,8.2-17.2,17.7-17.9c6.8-0.5,13.6-0.3,20.5-0.4 c0.8,0,1.9,0.3,2.5,0.8c4.3,4.2,8.5,8.5,12.7,12.7c0.2,0.2,0.3,0.6,0.5,1.2c-1.2,0.1-2.1,0.2-3.1,0.2c-9.7,0-19.5,0-29.2,0 c-5.3,0-7.1,1.8-7.1,7c0,7.1,0,14.2,0,21.2c0,5,1.7,6.7,6.8,6.7c38.9,0,77.8,0,116.7,0c5.1,0,6.8-1.7,6.9-6.9c0-7.1,0-14.2,0-21.2 c0-4.9-1.9-6.8-6.8-6.8c-9.8,0-19.7,0-29.5,0C107.9,109.9,107,109.8,105.7,109.8z"/><path d="M72.5,90.5c0-1,0-1.9,0-2.9c0-25.7,0-51.5,0-77.2c0-1.4,0.1-2.8,0.3-4.2C73.5,2.6,76.6,0,80,0c3.3,0,6.4,2.6,7,6 c0.3,1.4,0.3,2.8,0.3,4.2c0,25.9,0,51.8,0,77.7c0,0.9,0.1,1.8,0.2,3.3c1.3-1,2.1-1.6,2.8-2.3c8.2-8.2,16.4-16.4,24.6-24.5 c1.3-1.3,2.7-2.5,4.2-3.4c2.8-1.6,6.2-1,8.4,1.4c2.1,2.2,2.7,5.7,1.2,8.3c-0.7,1.3-1.7,2.5-2.7,3.6c-13.2,13.2-26.4,26.4-39.6,39.6 c-4.7,4.7-8.5,4.7-13.1,0.1c-13.4-13.4-26.8-26.7-40.1-40.1c-4.2-4.3-4.2-9.4,0-12.3c2.6-1.8,5.3-2,7.9-0.2 c1.4,0.9,2.6,2.1,3.8,3.2c8.2,8.1,16.3,16.2,24.4,24.4c0.7,0.7,1.5,1.4,2.3,2.1C72,90.8,72.2,90.7,72.5,90.5z"/><path d="M120.3,127.2c0.1-4,3.2-7.2,7.1-7.2c4,0,7.3,3.3,7.3,7.3c0,3.8-3.7,7.4-7.3,7.3C123.5,134.6,120.2,131.2,120.3,127.2z"/></g></svg>');
    opacity: 0.25;
    width: 60px;
    height: 60px;
    display: inline-block;
  }
  .media-preview {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    margin-top: 10px;
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

  input[type=file][data-direct-upload-url][disabled]{
    display: none;
  }

`
