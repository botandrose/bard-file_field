import { css } from 'lit'

export default css`
  :host {
    display: block;
    padding: 25px;
    color: var(--bard-file-text-color, #000);
  }
  .drag-media-input{
    position: absolute;
    opacity: 0.001;
    width: 100%;
    height: 100%;
    max-width: 100% !important;
    overflow: hidden;
    top: 0;
    left: 0;
  }
  .drag-media{
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
  .drag-media.-full{
    width: 100%;
  }
  .drag-media ul{
    text-align: left;
    font-style: normal;
    font-size: 0.8em;
    list-style: outside circle;
    margin-bottom: 0;
    position: absolute;
    z-index: -1;
    top: 0px;
    left: 25px;
  }
  .drag-media ul li{
    margin: 0;
    line-height: 20px;
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
  .media-preview figure{
    flex: 1 0 100%;
    margin: 0 1px;
    text-align: center;
    font-size: 0.8em;
  }
`


