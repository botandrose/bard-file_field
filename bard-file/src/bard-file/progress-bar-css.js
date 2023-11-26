import { css } from 'lit'

export default css`
  :host {
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

  .bar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0.2;
    background: #398927;
    transition: width 120ms ease-out, opacity 60ms 60ms ease-in;
    transform: translate3d(0, 0, 0);
  }
`
