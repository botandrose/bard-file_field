import { DirectUploadController } from '@rails/activestorage';

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$2=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$2.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$2.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$2=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$1,defineProperty:e$1,getOwnPropertyDescriptor:r$2,getOwnPropertyNames:h$1,getOwnPropertySymbols:o$1,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$1(t,s),y$1={attribute:!0,type:String,converter:u$1,reflect:!1,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=y$1){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,s);void 0!==r&&e$1(this.prototype,t,r);}}static getPropertyDescriptor(t,s,i){const{get:e,set:h}=r$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get(){return e?.call(this)},set(s){const r=e?.call(this);h.call(this,s),this.requestUpdate(t,r,i);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...h$1(t),...o$1(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return !1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$Eg=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$ES(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$E_??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$E_?.delete(t);}_$ES(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$E_?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$E_?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$EO(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==r?this.removeAttribute(e):this.setAttribute(e,r),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e,this[e]=r.fromAttribute(s,t.type),this._$Em=null;}}requestUpdate(t,s,i,e=!1,r){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??f$1)(e?r:this[t],s))return;this.C(t,s,i);}!1===this.isUpdatePending&&(this._$Eg=this._$EP());}C(t,s,i){this._$AL.has(t)||this._$AL.set(t,s),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t);}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t)!0!==i.wrapped||this._$AL.has(s)||void 0===this[s]||this.C(s,this[s],i);}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$E_?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$ET();}catch(s){throw t=!1,this._$ET(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$E_?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$ET(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(t){return !0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EO(t,this[t]))),this._$ET();}updated(t){}firstUpdated(t){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[d$1("elementProperties")]=new Map,b[d$1("finalized")]=new Map,p$1?.({ReactiveElement:b}),(a$1.reactiveElementVersions??=[]).push("2.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.trustedTypes,s$1=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${(Math.random()+"").slice(9)}$`,o="?"+h,n=`<${o}>`,r$1=document,l=()=>r$1.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),w=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),A=new WeakMap,E=r$1.createTreeWalker(r$1,129);function C(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const P=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [C(t,l+(t[s]||"<?>")+(2===i?"</svg>":"")),o]};class V{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=P(t,s);if(this.el=V.createElement(f,n),E.currentNode=this.el.content,2===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=E.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?k:"?"===e[1]?H:"@"===e[1]?I:R}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),E.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$1.createElement("template");return s.innerHTML=t,s}}function N(t,i,s=t,e){if(i===w)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=N(t,h._$AS(t,i.values),h,e)),i}class S{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$1).importNode(i,!0);E.currentNode=e;let h=E.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new M(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new L(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=E.nextNode(),o++);}return E.currentNode=r$1,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=N(this,t,i),c(t)?t===T||null==t||""===t?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==w&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):u(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==T&&c(this._$AH)?this._$AA.nextSibling.data=t:this.$(r$1.createTextNode(t)),this._$AH=t;}g(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=V.createElement(C(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new S(e,this),s=t.u(this.options);t.p(i),this.$(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new V(t)),i}T(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new M(this.k(l()),this.k(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=T;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=N(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==w,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=N(this,e[s+n],i,n),r===w&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===T?t=T:t!==T&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.O(t);}O(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class k extends R{constructor(){super(...arguments),this.type=3;}O(t){this.element[this.name]=t===T?void 0:t;}}class H extends R{constructor(){super(...arguments),this.type=4;}O(t){this.element.toggleAttribute(this.name,!!t&&t!==T);}}class I extends R{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=N(this,t,i,0)??T)===w)return;const s=this._$AH,e=t===T&&s!==T||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==T&&(s===T||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t);}}const Z=t.litHtmlPolyfillSupport;Z?.(V,M),(t.litHtmlVersions??=[]).push("3.1.0");const j=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new M(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class s extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=j(i,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return w}}s._$litElement$=!0,s[("finalized")]=!0,globalThis.litElementHydrateSupport?.({LitElement:s});const r=globalThis.litElementPolyfillSupport;r?.({LitElement:s});(globalThis.litElementVersions??=[]).push("4.0.2");

var styles$1 = i$2`
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

`;

const DirectUpload = superClass => class extends superClass {
  constructor() {
    super();

    this.addEventListener("direct-upload:initialize", event => this.init(event));
    this.addEventListener("direct-upload:start", event => this.start(event));
    this.addEventListener("direct-upload:progress", event => this.progress(event));
    this.addEventListener("direct-upload:error", event => this.error(event));
    this.addEventListener("direct-upload:end", event => this.end(event));
  }

  init(event) {
    const { id, file } = event.detail;
    const bardFile = this.files.find(bf => bf.file === file);
    bardFile.state = "pending";
    bardFile.percent = 0;
    this.requestUpdate();
    this.formController.init(event);
  }

  start(event) {
    const { id, file } = event.detail;
    const bardFile = this.files.find(bf => bf.file === file);
    bardFile.state = "pending";
    this.requestUpdate();
    this.formController.start(event);
  }

  progress(event) {
    const { id, file, progress } = event.detail;
    const bardFile = this.files.find(bf => bf.file === file);
    bardFile.percent = progress;
    this.requestUpdate();
    this.formController.progress(event);
  }

  error(event) {
    event.preventDefault();
    const { id, file, error } = event.detail;
    const bardFile = this.files.find(bf => bf.file === file);
    bardFile.state = "error";
    bardFile.error = error;
    this.requestUpdate();
    this.formController.error(event);
  }

  end(event) {
    const { id, file } = event.detail;
    const bardFile = this.files.find(bf => bf.file === file);
    bardFile.state = "complete";
    bardFile.percent = 100;
    this.requestUpdate();
    this.formController.end(event);
  }
};

const Validations = superClass => class extends superClass {
  checkValidity() {
    let errors = [];
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText;

    this.files.forEach(file => {
      errors.push(...new Accepts(file, label, this.accepts).errors);
      errors.push(...new Max(file, label, this.max).errors);
    });

    this.setCustomValidity(errors.join(" "));
    this.reportValidity();
    return errors.length === 0
  }

  setCustomValidity(msg) {
    this.fileTarget.setCustomValidity(msg);
  }

  reportValidity() {
    this.fileTarget.reportValidity();
  }

  get validationMessage() {
    return this.fileTarget.validationMessage
  }
};

class Accepts {
  constructor(file, label, acceptsString) {
    this.errors = [];

    const accepts = acceptsString ? acceptsString.split(/,\s*/) : [];
    const regexes = accepts.map(accept => {
      const regex = this.regexMap[accept];
      if(!regex) console.error(`Unknown accepts type: ${accept}`);
      return regex
    }).filter(r => !!r); // discard not found

    if(regexes.length > 0 && !regexes.some(regex => regex.test(file.mimetype))) {
      this.errors.push(`${label} must be a ${this.joinWords(accepts)}.`);
    }
  }

  get regexMap() {
    return {
      image: new RegExp("^image/.+$"),
      video: new RegExp("^video/.+$"),
      pdf: new RegExp("^application/pdf$"),
    }
  }

  joinWords(words) {
    if(words.length >= 3) {
      return (words.slice(0, -1) + [`or ${words.at(-1)}`]).join(", ")
    } else {
      return words.join(" or ")
    }
  }
}

class Max {
  constructor(file, label, max) {
    this.file = file;
    this.label = label;
    this.max = max;
    this.errors = [];

    if(this.max && this.file.size > this.max) {
      this.errors.push(this.errorMessage);
    }
  }

  get errorMessage() {
    return [
      `${this.label} must be smaller than ${this.formatBytes(this.max)},`,
      `and "${this.file.filename}" is ${this.formatBytes(this.file.size)}.`,
      `Please attach a smaller file.`,
    ].join(" ")
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
  }
}

class DragAndDrop extends s {
  static properties = {
    target: { type: String },
  }

  createRenderRoot() {
    return this
  }

  get fileTarget() {
    return document.getElementById(this.target)
  }

  constructor() {
    super();

    this.addEventListener("dragover", event => this.highlight(event));
    this.addEventListener("dragleave", event => this.unhighlight(event));
    this.addEventListener("drop", event => this.drop(event));

    this.addEventListener("click", event => this.fileTarget.click(event));
  }

  drop(event) {
    this.unhighlight(event);
    this.fileTarget.files = event.dataTransfer.files;
    this.fileTarget.dispatchEvent(new Event("change"));
  }

  highlight(event) {
    this.halt(event);
    this.classList.add("-dragover");
  }

  unhighlight(event) {
    this.halt(event);
    this.classList.remove("-dragover");
  }

  halt(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

customElements.define("drag-and-drop", DragAndDrop);

const Rendering = superClass => class extends superClass {
  firstUpdated() {
    this.fileTarget = this.querySelector("input[type=file]");
  }

  renderLightDOM() {
    j(x`
      <input type="file"
        style="opacity: 0.01; position: absolute; z-index: -999"
        id="${this.originalId}"
        .multiple="${this.multiple}"
        data-direct-upload-url="${this.directupload}"
        @change="${this.fileTargetChanged}"
        ?required=${this.files.length === 0 && this.required}
      >
      ${this.files.length > 0
        ? this.files
        : x`<input type="hidden" name=${this.name}>`
      }
    `, this, { host: this });
  }

  render() { // Shadow DOM
    this.renderLightDOM();

    return x`
      <drag-and-drop target="${this.originalId}">
        <i class="drag-icon"></i>
        <strong>Choose ${this.multiple ? "files" : "file"} </strong>
        <span>or drag ${this.multiple ? "them" : "it"} here.</span>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}">
          <slot>
          </slot>
        </div>
      </drag-and-drop>
    `
  }
};

var styles = i$2`
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

`;

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function Mime$2() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

Mime$2.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] === '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = (ext[0] !== '*') ? ext : ext.substr(1);
    }
  }
};

Mime$2.prototype.getType = function(path) {
  path = String(path);
  let last = path.replace(/^.*[/\\]/, '').toLowerCase();
  let ext = last.replace(/^.*\./, '').toLowerCase();

  let hasPath = last.length < path.length;
  let hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

Mime$2.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime$2;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/mrb-consumer+xml":["*xdf"],"application/mrb-publish+xml":["*xdf"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["*xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/ttml+xml":["ttml"],"application/ubjson":["ubj"],"application/urc-ressheet+xml":["rsheet"],"application/urc-targetdesc+xml":["td"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-error+xml":["xer"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["*xsl","xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/amr":["amr"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx","opus"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/avif":["avif"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/ktx2":["ktx2"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/spdx":["spdx"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/iso.segment":["m4s"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var others = {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"]};

let Mime = Mime_1;
var src = new Mime(standard, others);

var Mime$1 = /*@__PURE__*/getDefaultExportFromCjs(src);

class FetchResponse {
  constructor (response) {
    this.response = response;
  }

  get statusCode () {
    return this.response.status
  }

  get redirected () {
    return this.response.redirected
  }

  get ok () {
    return this.response.ok
  }

  get unauthenticated () {
    return this.statusCode === 401
  }

  get unprocessableEntity () {
    return this.statusCode === 422
  }

  get authenticationURL () {
    return this.response.headers.get('WWW-Authenticate')
  }

  get contentType () {
    const contentType = this.response.headers.get('Content-Type') || '';

    return contentType.replace(/;.*$/, '')
  }

  get headers () {
    return this.response.headers
  }

  get html () {
    if (this.contentType.match(/^(application|text)\/(html|xhtml\+xml)$/)) {
      return this.text
    }

    return Promise.reject(new Error(`Expected an HTML response but got "${this.contentType}" instead`))
  }

  get json () {
    if (this.contentType.match(/^application\/.*json$/)) {
      return this.responseJson || (this.responseJson = this.response.json())
    }

    return Promise.reject(new Error(`Expected a JSON response but got "${this.contentType}" instead`))
  }

  get text () {
    return this.responseText || (this.responseText = this.response.text())
  }

  get isTurboStream () {
    return this.contentType.match(/^text\/vnd\.turbo-stream\.html/)
  }

  async renderTurboStream () {
    if (this.isTurboStream) {
      if (window.Turbo) {
        await window.Turbo.renderStreamMessage(await this.text);
      } else {
        console.warn('You must set `window.Turbo = Turbo` to automatically process Turbo Stream events with request.js');
      }
    } else {
      return Promise.reject(new Error(`Expected a Turbo Stream response but got "${this.contentType}" instead`))
    }
  }
}

class RequestInterceptor {
  static register (interceptor) {
    this.interceptor = interceptor;
  }

  static get () {
    return this.interceptor
  }

  static reset () {
    this.interceptor = undefined;
  }
}

function getCookie (name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = cookies.find(cookie => cookie.startsWith(prefix));

  if (cookie) {
    const value = cookie.split('=').slice(1).join('=');

    if (value) {
      return decodeURIComponent(value)
    }
  }
}

function compact (object) {
  const result = {};

  for (const key in object) {
    const value = object[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result
}

function metaContent (name) {
  const element = document.head.querySelector(`meta[name="${name}"]`);
  return element && element.content
}

function stringEntriesFromFormData (formData) {
  return [...formData].reduce((entries, [name, value]) => {
    return entries.concat(typeof value === 'string' ? [[name, value]] : [])
  }, [])
}

function mergeEntries (searchParams, entries) {
  for (const [name, value] of entries) {
    if (value instanceof window.File) continue

    if (searchParams.has(name) && !name.includes('[]')) {
      searchParams.delete(name);
      searchParams.set(name, value);
    } else {
      searchParams.append(name, value);
    }
  }
}

class FetchRequest {
  constructor (method, url, options = {}) {
    this.method = method;
    this.options = options;
    this.originalUrl = url.toString();
  }

  async perform () {
    try {
      const requestInterceptor = RequestInterceptor.get();
      if (requestInterceptor) {
        await requestInterceptor(this);
      }
    } catch (error) {
      console.error(error);
    }

    const response = new FetchResponse(await window.fetch(this.url, this.fetchOptions));

    if (response.unauthenticated && response.authenticationURL) {
      return Promise.reject(window.location.href = response.authenticationURL)
    }

    const responseStatusIsTurboStreamable = response.ok || response.unprocessableEntity;

    if (responseStatusIsTurboStreamable && response.isTurboStream) {
      await response.renderTurboStream();
    }

    return response
  }

  addHeader (key, value) {
    const headers = this.additionalHeaders;
    headers[key] = value;
    this.options.headers = headers;
  }

  sameHostname () {
    if (!this.originalUrl.startsWith('http:')) {
      return true
    }

    try {
      return new URL(this.originalUrl).hostname === window.location.hostname
    } catch (_) {
      return true
    }
  }

  get fetchOptions () {
    return {
      method: this.method.toUpperCase(),
      headers: this.headers,
      body: this.formattedBody,
      signal: this.signal,
      credentials: this.credentials,
      redirect: this.redirect
    }
  }

  get headers () {
    const baseHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': this.contentType,
      Accept: this.accept
    };

    if (this.sameHostname()) {
      baseHeaders['X-CSRF-Token'] = this.csrfToken;
    }

    return compact(
      Object.assign(baseHeaders, this.additionalHeaders)
    )
  }

  get csrfToken () {
    return getCookie(metaContent('csrf-param')) || metaContent('csrf-token')
  }

  get contentType () {
    if (this.options.contentType) {
      return this.options.contentType
    } else if (this.body == null || this.body instanceof window.FormData) {
      return undefined
    } else if (this.body instanceof window.File) {
      return this.body.type
    }

    return 'application/json'
  }

  get accept () {
    switch (this.responseKind) {
      case 'html':
        return 'text/html, application/xhtml+xml'
      case 'turbo-stream':
        return 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml'
      case 'json':
        return 'application/json, application/vnd.api+json'
      default:
        return '*/*'
    }
  }

  get body () {
    return this.options.body
  }

  get query () {
    const originalQuery = (this.originalUrl.split('?')[1] || '').split('#')[0];
    const params = new URLSearchParams(originalQuery);

    let requestQuery = this.options.query;
    if (requestQuery instanceof window.FormData) {
      requestQuery = stringEntriesFromFormData(requestQuery);
    } else if (requestQuery instanceof window.URLSearchParams) {
      requestQuery = requestQuery.entries();
    } else {
      requestQuery = Object.entries(requestQuery || {});
    }

    mergeEntries(params, requestQuery);

    const query = params.toString();
    return (query.length > 0 ? `?${query}` : '')
  }

  get url () {
    return (this.originalUrl.split('?')[0]).split('#')[0] + this.query
  }

  get responseKind () {
    return this.options.responseKind || 'html'
  }

  get signal () {
    return this.options.signal
  }

  get redirect () {
    return this.options.redirect || 'follow'
  }

  get credentials () {
    return this.options.credentials || 'same-origin'
  }

  get additionalHeaders () {
    return this.options.headers || {}
  }

  get formattedBody () {
    const bodyIsAString = Object.prototype.toString.call(this.body) === '[object String]';
    const contentTypeIsJson = this.headers['Content-Type'] === 'application/json';

    if (contentTypeIsJson && !bodyIsAString) {
      return JSON.stringify(this.body)
    }

    return this.body
  }
}

async function get(url, payload) {
  const request = new FetchRequest("get", url, {
    headers: { Accept: "application/json" },
    body: payload,
  });
  const response = await request.perform();
  // FIXME doesn't deal with 304s. push upstream?
  if(response.response.ok) {
    return response.json
  }
}

class UploadedFile extends s {
  static styles = styles

  static properties = {
    name: { type: String, reflect: true },
    value: { type: String, reflect: true },
    filename: { type: String, reflect: true },
    src: { type: String, reflect: true },
    mimetype: { type: String, reflect: true },
    size: { type: Number, reflect: true },

    state: { state: true },
    percent: { state: true },
    file: { state: true },
  }

  static fromProperties(props) {
    return Object.assign(new UploadedFile(), {
      ...props,
      size: 0, // HACK always pass max file check
      state: "complete",
      percent: 100,
      file: null,
    })
  }

  static fromFile(file, props={}) {
    const extension = file.name.split(".").at(-1);
    return Object.assign(new UploadedFile(), {
      ...props,
      src: URL.createObjectURL(file),
      filename: file.name,
      mimetype: Mime$1.getType(extension),
      size: file.size,
      state: "pending",
      percent: 0,
      file: file,
    })
  }

  static fromSignedId(signedId, props={}) {
    return get(`/rails/active_storage/blobs/info/${signedId}`).then(blob => {
      return UploadedFile.fromProperties({
        ...props,
        filename: blob.filename,
        mimetype: blob.content_type,
        size: blob.byte_size,
        value: signedId,
      })
    })
  }

  render() {
    let klass, media;
    if(["image/jpeg", "image/png"].includes(this.mimetype)) {
      klass = "image-preview";
      media = x`<img src='${this.src}'>`;
    } else if(this.mimetype === "video/mp4") {
      klass = "video-preview";
      media = x`<video src='${this.src}' onclick='this.paused ? this.play() : this.pause(); return false'>`;
    } else {
      klass = "missing-preview";
      media = "This media does not offer a preview";
    }

    return x`
      <slot>
      </slot>
      <figure class="${klass}">
        <div class="direct-upload separate-upload direct-upload--${this.state}">
          <div class="direct-upload__progress" style="width: ${this.percent}%"></div>
          <span class="direct-upload__filename">${this.filename}</span>
        </div>
        <a class="remove-media" @click=${this.removeSelf} href="#">
          <span>Remove media</span>
        </a>
        <p>${media}</p>
      </figure>
    `
  }

  removeSelf(event) {
    event.stopPropagation();
    event.preventDefault();
    this.parentNode.removeFile(this);
  }

  updated(changedProperties) {
    j(x`
      <input type="hidden" name="${this.name}" value="${this.value}">
    `, this, { host: this });
  }
}

customElements.define('uploaded-file', UploadedFile);

class MyDirectUploadController extends DirectUploadController {
  constructor(input, bardFile) {
    super(input, bardFile.file);
    this.bardFile = bardFile;
  }

  start(callback) {
    this.dispatch("start");
    this.directUpload.create(((error, attributes) => {
      if (error) {
        this.dispatchError(error);
      } else {
        this.bardFile.value = attributes.signed_id;
      }
      this.dispatch("end");
      callback(error);
    }));
  }
}

class FormController {
  static forForm(form) {
    return form.bardFileFormController ||= new FormController(form)
  }

  constructor(form) {
    this.element = form;
    this.progressTargetMap = {};
    this.controllers = [];
    this.processing = false;
    this.errors = false;

    this.element.insertAdjacentHTML("beforeend",
      `<dialog id="form-controller-dialog">
        <div class="direct-upload-wrapper">
          <div class="direct-upload-content">
            <h3>Uploading your media</h3>
            <div id="progress-container"></div>
          </div>
        </div>
      </dialog>`);

    this.dialog = this.element.querySelector("#form-controller-dialog");
    this.progressContainerTarget = this.dialog.querySelector("#progress-container");

    this.element.addEventListener("submit", event => this.submit(event));
    window.addEventListener("beforeunload", event => this.beforeUnload(event));
  }

  beforeUnload(event) {
    if(this.processing) {
      event.preventDefault();
      return (event.returnValue = "")
    }
  }

  uploadFiles(bardFileInput) {
    Array.from(bardFileInput.files).forEach(bardFile => {
      if(bardFile.state === "pending") {
        const controller = new MyDirectUploadController(bardFileInput.fileTarget, bardFile);
        controller.bardFileInput = bardFileInput;
        this.controllers.push(controller);
        this.startNextController();
      }
    });
  }

  submit(event) {
    event.preventDefault();
    this.submitted = true;
    this.startNextController();
    if(this.processing) {
      this.dialog.showModal();
    }
  }

  startNextController() {
    if(this.processing) return

    const controller = this.controllers.shift();
    if(controller) {
      this.processing = true;
      controller.start(error => {
        if(error) {
          Array.from(this.element.querySelectorAll("input[type=file]"))
            .forEach(e => e.disabled = false);
          this.errors = true;
        } else {
          this.processing = false;
          this.startNextController();
        }
      });
    } else {
      this.submitForm();
    }
  }

  submitForm() {
    if(this.submitted && !this.errors) {
      Array.from(this.element.querySelectorAll("input[type=file]"))
        .forEach(e => e.disabled = true);
      this.element.submit();
    }
  }

  init(event) {
    const { id, file } = event.detail;

    this.progressContainerTarget.insertAdjacentHTML("beforebegin", `
      <div id="direct-upload-${id}" class="direct-upload direct-upload--pending">
        <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: 0%"></div>
        <span class="direct-upload__filename">${file.name}</span>
      </div>
    `);
    const progressTarget = document.getElementById(`direct-upload-${id}`);
    this.progressTargetMap[id] = progressTarget;
  }

  start(event) {
    this.progressTargetMap[event.detail.id].classList.remove("direct-upload--pending");
  }

  progress(event) {
    const { id, progress } = event.detail;
    const progressElement = document.getElementById(`direct-upload-progress-${id}`);
    progressElement.style.width = `${progress}%`;
  }

  error(event) {
    event.preventDefault();
    const { id, error } = event.detail;
    const target = this.progressTargetMap[id];
    target.classList.add("direct-upload--error");
    target.setAttribute("title", error);
  }

  end(event) {
    this.progressTargetMap[event.detail.id].classList.add("direct-upload--complete");
  }
}

class BardFileField extends DirectUpload(Validations(Rendering(s))) {
  static styles = styles$1

  static properties = {
    name: { type: String },
    directupload: { type: String },
    multiple: { type: Boolean },

    required: { type: Boolean },
    accepts: { type: String },
    max: { type: Number },

    files: { state: true },
  }

  constructor() {
    super();

    this.files = [];
    this.originalId = this.id;
    this.removeAttribute("id");
  }

  connectedCallback() {
    super.connectedCallback();
    this.formController = FormController.forForm(this.closest("form"));
  }

  get value() {
    return this.files.map(uploadedFile => uploadedFile.value)
  }

  set value(val) {
    this.files = [];
    const signedIds = this.signedIdsFromValue(val);
    const promises = signedIds.map(signedId => {
      return UploadedFile.fromSignedId(signedId, { name: this.name })
    });
    Promise.all(promises).then(uploadedFiles => {
      this.assignFiles(uploadedFiles);
    });
  }

  signedIdsFromValue(value) {
    let signedIds = [];
    if(typeof value == "string" && value.length > 0) {
      signedIds = value.split(",");
    }
    if(Array.isArray(value)) {
      signedIds = value;
    }
    return signedIds.filter(signedId => {
      return signedId.toString().length > 0
    })
  }

  fileTargetChanged(event) {
    const uploadedFiles = Array.from(this.fileTarget.files).map(file => {
      return UploadedFile.fromFile(file, { name: this.name })
    });
    this.fileTarget.value = null;
    this.assignFiles(uploadedFiles);
    if(this.checkValidity()) {
      this.formController.uploadFiles(this);
    } else {
      this.files = [];
    }
  }

  assignFiles(bardFiles) {
    if(this.multiple) {
      this.files.push(...bardFiles);
    } else {
      this.files = bardFiles.slice(-1);
    }
    this.requestUpdate();
    this.dispatchEvent(new Event("change"));
  }

  removeFile(file) {
    const index = this.files.indexOf(file);
    this.files.splice(index, 1);
    this.requestUpdate();
    this.dispatchEvent(new Event("change"));
  }
}

customElements.define("bard-file", BardFileField);
