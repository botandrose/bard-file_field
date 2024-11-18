/**
 * A collection of default build flags for a Stencil project.
 *
 * This collection can be found throughout the Stencil codebase, often imported from the `@app-data` module like so:
 * ```ts
 * import { BUILD } from '@app-data';
 * ```
 * and is used to determine if a portion of the output of a Stencil _project_'s compilation step can be eliminated.
 *
 * e.g. When `BUILD.allRenderFn` evaluates to `false`, the compiler will eliminate conditional statements like:
 * ```ts
 * if (BUILD.allRenderFn) {
 *   // some code that will be eliminated if BUILD.allRenderFn is false
 * }
 * ```
 *
 * `@app-data`, the module that `BUILD` is imported from, is an alias for the `@stencil/core/internal/app-data`, and is
 * partially referenced by {@link STENCIL_APP_DATA_ID}. The `src/compiler/bundle/app-data-plugin.ts` references
 * `STENCIL_APP_DATA_ID` uses it to replace these defaults with {@link BuildConditionals} that are derived from a
 * Stencil project's contents (i.e. metadata from the components). This replacement happens at a Stencil project's
 * compile time. Such code can be found at `src/compiler/app-core/app-data.ts`.
 */
const BUILD = {
    allRenderFn: false,
    cmpDidLoad: true,
    cmpDidUnload: false,
    cmpDidUpdate: true,
    cmpDidRender: true,
    cmpWillLoad: true,
    cmpWillUpdate: true,
    cmpWillRender: true,
    connectedCallback: true,
    disconnectedCallback: true,
    element: true,
    event: true,
    hasRenderFn: true,
    lifecycle: true,
    hostListener: true,
    hostListenerTargetWindow: true,
    hostListenerTargetDocument: true,
    hostListenerTargetBody: true,
    hostListenerTargetParent: false,
    hostListenerTarget: true,
    member: true,
    method: true,
    mode: true,
    observeAttribute: true,
    prop: true,
    propMutable: true,
    reflect: true,
    scoped: true,
    shadowDom: true,
    slot: true,
    cssAnnotations: true,
    state: true,
    style: true,
    formAssociated: false,
    svg: true,
    updatable: true,
    vdomAttribute: true,
    vdomXlink: true,
    vdomClass: true,
    vdomFunctional: true,
    vdomKey: true,
    vdomListener: true,
    vdomRef: true,
    vdomPropOrAttr: true,
    vdomRender: true,
    vdomStyle: true,
    vdomText: true,
    watchCallback: true,
    taskQueue: true,
    hotModuleReplacement: false,
    isDebug: false,
    isDev: false,
    isTesting: false,
    hydrateServerSide: false,
    hydrateClientSide: false,
    lifecycleDOMEvents: false,
    lazyLoad: false,
    profile: false,
    slotRelocation: true,
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
    appendChildSlotFix: false,
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
    cloneNodeFix: false,
    hydratedAttribute: false,
    hydratedClass: true,
    scriptDataOpts: false,
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
    scopedSlotTextContentFix: false,
    // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
    shadowDomShim: false,
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
    slotChildNodesFix: false,
    invisiblePrehydration: true,
    propBoolean: true,
    propNumber: true,
    propString: true,
    constructableCSS: true,
    cmpShouldUpdate: true,
    devTools: false,
    shadowDelegatesFocus: true,
    initializeNextTick: false,
    asyncLoading: false,
    asyncQueue: false,
    transformTagName: false,
    attachStyles: true,
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
    experimentalSlotFixes: false,
};

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
let scopeId;
let contentRef;
let hostTagName;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;
let renderingRef = null;
let queuePending = false;
const createTime = (fnName, tagName = '') => {
    {
        return () => {
            return;
        };
    }
};
/**
 * Constant for styles to be globally applied to `slot-fb` elements for pseudo-slot behavior.
 *
 * Two cascading rules must be used instead of a `:not()` selector due to Stencil browser
 * support as of Stencil v4.
 */
const SLOT_FB_CSS = 'slot-fb{display:contents}slot-fb[hidden]{display:none}';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};
/**
 * Namespaces
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const isDef = (v) => v != null;
/**
 * Check whether a value is a 'complex type', defined here as an object or a
 * function.
 *
 * @param o the value to check
 * @returns whether it's a complex type or not
 */
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */
function queryNonceMetaTagContent(doc) {
    var _a, _b, _c;
    return (_c = (_b = (_a = doc.head) === null || _a === void 0 ? void 0 : _a.querySelector('meta[name="csp-nonce"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content')) !== null && _c !== void 0 ? _c : undefined;
}
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let key = null;
    let slotName = null;
    let simple = false;
    let lastSimple = false;
    const vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if ((simple = typeof nodeName !== 'function' && !isComplexType(child))) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        if (vnodeData.key) {
            key = vnodeData.key;
        }
        if (vnodeData.name) {
            slotName = vnodeData.name;
        }
        // normalize class / className attributes
        {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class =
                    typeof classData !== 'object'
                        ? classData
                        : Object.keys(classData)
                            .filter((k) => classData[k])
                            .join(' ');
            }
        }
    }
    if (typeof nodeName === 'function') {
        // nodeName is a functional component
        return nodeName(vnodeData === null ? {} : vnodeData, vNodeChildren, vdomFnUtils);
    }
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    {
        vnode.$key$ = key;
    }
    {
        vnode.$name$ = slotName;
    }
    return vnode;
};
/**
 * A utility function for creating a virtual DOM node from a tag and some
 * possible text content.
 *
 * @param tag the tag for this element
 * @param text possible text content for the node
 * @returns a newly-minted virtual DOM node
 */
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null,
    };
    {
        vnode.$attrs$ = null;
    }
    {
        vnode.$key$ = null;
    }
    {
        vnode.$name$ = null;
    }
    return vnode;
};
const Host = {};
/**
 * Check whether a given node is a Host node or not
 *
 * @param node the virtual DOM node to check
 * @returns whether it's a Host node or not
 */
const isHost = (node) => node && node.$tag$ === Host;
/**
 * Implementation of {@link d.FunctionalUtilities} for Stencil's VDom.
 *
 * Note that these functions convert from {@link d.VNode} to
 * {@link d.ChildNode} to give functional component developers a friendly
 * interface.
 */
const vdomFnUtils = {
    forEach: (children, cb) => children.map(convertToPublic).forEach(cb),
    map: (children, cb) => children.map(convertToPublic).map(cb).map(convertToPrivate),
};
/**
 * Convert a {@link d.VNode} to a {@link d.ChildNode} in order to present a
 * friendlier public interface (hence, 'convertToPublic').
 *
 * @param node the virtual DOM node to convert
 * @returns a converted child node
 */
const convertToPublic = (node) => ({
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$,
});
/**
 * Convert a {@link d.ChildNode} back to an equivalent {@link d.VNode} in
 * order to use the resulting object in the virtual DOM. The initial object was
 * likely created as part of presenting a public API, so converting it back
 * involved making it 'private' again (hence, `convertToPrivate`).
 *
 * @param node the child node to convert
 * @returns a converted virtual DOM node
 */
const convertToPrivate = (node) => {
    if (typeof node.vtag === 'function') {
        const vnodeData = Object.assign({}, node.vattrs);
        if (node.vkey) {
            vnodeData.key = node.vkey;
        }
        if (node.vname) {
            vnodeData.name = node.vname;
        }
        return h(node.vtag, vnodeData, ...(node.vchildren || []));
    }
    const vnode = newVNode(node.vtag, node.vtext);
    vnode.$attrs$ = node.vattrs;
    vnode.$children$ = node.vchildren;
    vnode.$key$ = node.vkey;
    vnode.$name$ = node.vname;
    return vnode;
};
// Private
const computeMode = (elm) => modeResolutionChain.map((h) => h(elm)).find((m) => !!m);
/**
 * Parse a new property value for a given property type.
 *
 * While the prop value can reasonably be expected to be of `any` type as far as TypeScript's type checker is concerned,
 * it is not safe to assume that the string returned by evaluating `typeof propValue` matches:
 *   1. `any`, the type given to `propValue` in the function signature
 *   2. the type stored from `propType`.
 *
 * This function provides the capability to parse/coerce a property's value to potentially any other JavaScript type.
 *
 * Property values represented in TSX preserve their type information. In the example below, the number 0 is passed to
 * a component. This `propValue` will preserve its type information (`typeof propValue === 'number'`). Note that is
 * based on the type of the value being passed in, not the type declared of the class member decorated with `@Prop`.
 * ```tsx
 * <my-cmp prop-val={0}></my-cmp>
 * ```
 *
 * HTML prop values on the other hand, will always a string
 *
 * @param propValue the new value to coerce to some type
 * @param propType the type of the prop, expressed as a binary number
 * @returns the parsed/coerced value
 */
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if (propType & 4 /* MEMBER_FLAGS.Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return propValue === 'false' ? false : propValue === '' || !!propValue;
        }
        if (propType & 2 /* MEMBER_FLAGS.Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
        if (propType & 1 /* MEMBER_FLAGS.String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const getElement = (ref) => (ref);
const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* EVENT_FLAGS.Bubbles */),
                composed: !!(flags & 2 /* EVENT_FLAGS.Composed */),
                cancelable: !!(flags & 1 /* EVENT_FLAGS.Cancellable */),
                detail,
            });
        },
    };
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
const emitEvent = (elm, name, opts) => {
    const ev = plt.ce(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};
const rootAppliedStyles = /*@__PURE__*/ new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    if (supportsConstructableStylesheets && allowCS) {
        style = (style || new CSSStyleSheet());
        if (typeof style === 'string') {
            style = cssText;
        }
        else {
            style.replaceSync(cssText);
        }
    }
    else {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode) => {
    var _a;
    const scopeId = getScopeId(cmpMeta, mode);
    const style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = styleContainerNode.nodeType === 11 /* NODE_TYPE.DocumentFragment */ ? styleContainerNode : doc$1;
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
            }
            if (!appliedStyles.has(scopeId)) {
                {
                    styleElm = doc$1.createElement('style');
                    styleElm.innerHTML = style;
                    // Apply CSP nonce to the style tag if it exists
                    const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc$1);
                    if (nonce != null) {
                        styleElm.setAttribute('nonce', nonce);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                // Add styles for `slot-fb` elements if we're using slots outside the Shadow DOM
                if (cmpMeta.$flags$ & 4 /* CMP_FLAGS.hasSlotRelocation */) {
                    styleElm.innerHTML += SLOT_FB_CSS;
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if (!styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
        }
    }
    return scopeId;
};
const attachStyles = (hostRef) => {
    const cmpMeta = hostRef.$cmpMeta$;
    const elm = hostRef.$hostElement$;
    const flags = cmpMeta.$flags$;
    const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
    const scopeId = addStyle(elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(), cmpMeta, hostRef.$modeName$);
    if (flags & 10 /* CMP_FLAGS.needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
        if (flags & 2 /* CMP_FLAGS.scopedCssEncapsulation */) {
            elm.classList.add(scopeId + '-s');
        }
    }
    endAttachStyles();
};
const getScopeId = (cmp, mode) => 'sc-' + (mode && cmp.$flags$ & 32 /* CMP_FLAGS.hasMode */ ? cmp.$tagName$ + '-' + mode : cmp.$tagName$);
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
/**
 * When running a VDom render set properties present on a VDom node onto the
 * corresponding HTML element.
 *
 * Note that this function has special functionality for the `class`,
 * `style`, `key`, and `ref` attributes, as well as event handlers (like
 * `onClick`, etc). All others are just passed through as-is.
 *
 * @param elm the HTMLElement onto which attributes should be set
 * @param memberName the name of the attribute to set
 * @param oldValue the old value for the attribute
 * @param newValue the new value for the attribute
 * @param isSvg whether we're in an svg context or not
 * @param flags bitflags for Vdom variables
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue !== newValue) {
        let isProp = isMemberInElement(elm, memberName);
        let ln = memberName.toLowerCase();
        if (memberName === 'class') {
            const classList = elm.classList;
            const oldClasses = parseClassList(oldValue);
            const newClasses = parseClassList(newValue);
            classList.remove(...oldClasses.filter((c) => c && !newClasses.includes(c)));
            classList.add(...newClasses.filter((c) => c && !oldClasses.includes(c)));
        }
        else if (memberName === 'style') {
            // update style attribute, css properties and values
            {
                for (const prop in oldValue) {
                    if (!newValue || newValue[prop] == null) {
                        if (prop.includes('-')) {
                            elm.style.removeProperty(prop);
                        }
                        else {
                            elm.style[prop] = '';
                        }
                    }
                }
            }
            for (const prop in newValue) {
                if (!oldValue || newValue[prop] !== oldValue[prop]) {
                    if (prop.includes('-')) {
                        elm.style.setProperty(prop, newValue[prop]);
                    }
                    else {
                        elm.style[prop] = newValue[prop];
                    }
                }
            }
        }
        else if (memberName === 'key')
            ;
        else if (memberName === 'ref') {
            // minifier will clean this up
            if (newValue) {
                newValue(elm);
            }
        }
        else if ((!elm.__lookupSetter__(memberName)) &&
            memberName[0] === 'o' &&
            memberName[1] === 'n') {
            // Event Handlers
            // so if the member name starts with "on" and the 3rd characters is
            // a capital letter, and it's not already a member on the element,
            // then we're assuming it's an event listener
            if (memberName[2] === '-') {
                // on- prefixed events
                // allows to be explicit about the dom event to listen without any magic
                // under the hood:
                // <my-cmp on-click> // listens for "click"
                // <my-cmp on-Click> // listens for "Click"
                // <my-cmp on-ionChange> // listens for "ionChange"
                // <my-cmp on-EVENTS> // listens for "EVENTS"
                memberName = memberName.slice(3);
            }
            else if (isMemberInElement(win, ln)) {
                // standard event
                // the JSX attribute could have been "onMouseOver" and the
                // member name "onmouseover" is on the window's prototype
                // so let's add the listener "mouseover", which is all lowercased
                memberName = ln.slice(2);
            }
            else {
                // custom event
                // the JSX attribute could have been "onMyCustomEvent"
                // so let's trim off the "on" prefix and lowercase the first character
                // and add the listener "myCustomEvent"
                // except for the first character, we keep the event name case
                memberName = ln[2] + memberName.slice(3);
            }
            if (oldValue || newValue) {
                // Need to account for "capture" events.
                // If the event name ends with "Capture", we'll update the name to remove
                // the "Capture" suffix and make sure the event listener is setup to handle the capture event.
                const capture = memberName.endsWith(CAPTURE_EVENT_SUFFIX);
                // Make sure we only replace the last instance of "Capture"
                memberName = memberName.replace(CAPTURE_EVENT_REGEX, '');
                if (oldValue) {
                    plt.rel(elm, memberName, oldValue, capture);
                }
                if (newValue) {
                    plt.ael(elm, memberName, newValue, capture);
                }
            }
        }
        else {
            // Set property if it exists and it's not a SVG
            const isComplex = isComplexType(newValue);
            if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
                try {
                    if (!elm.tagName.includes('-')) {
                        const n = newValue == null ? '' : newValue;
                        // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                        if (memberName === 'list') {
                            isProp = false;
                        }
                        else if (oldValue == null || elm[memberName] != n) {
                            elm[memberName] = n;
                        }
                    }
                    else {
                        elm[memberName] = newValue;
                    }
                }
                catch (e) {
                    /**
                     * in case someone tries to set a read-only property, e.g. "namespaceURI", we just ignore it
                     */
                }
            }
            /**
             * Need to manually update attribute if:
             * - memberName is not an attribute
             * - if we are rendering the host element in order to reflect attribute
             * - if it's a SVG, since properties might not work in <svg>
             * - if the newValue is null/undefined or 'false'.
             */
            let xlink = false;
            {
                if (ln !== (ln = ln.replace(/^xlink\:?/, ''))) {
                    memberName = ln;
                    xlink = true;
                }
            }
            if (newValue == null || newValue === false) {
                if (newValue !== false || elm.getAttribute(memberName) === '') {
                    if (xlink) {
                        elm.removeAttributeNS(XLINK_NS, memberName);
                    }
                    else {
                        elm.removeAttribute(memberName);
                    }
                }
            }
            else if ((!isProp || flags & 4 /* VNODE_FLAGS.isHost */ || isSvg) && !isComplex) {
                newValue = newValue === true ? '' : newValue;
                if (xlink) {
                    elm.setAttributeNS(XLINK_NS, memberName, newValue);
                }
                else {
                    elm.setAttribute(memberName, newValue);
                }
            }
        }
    }
};
const parseClassListRegex = /\s/;
/**
 * Parsed a string of classnames into an array
 * @param value className string, e.g. "foo bar baz"
 * @returns list of classes, e.g. ["foo", "bar", "baz"]
 */
const parseClassList = (value) => (!value ? [] : value.split(parseClassListRegex));
const CAPTURE_EVENT_SUFFIX = 'Capture';
const CAPTURE_EVENT_REGEX = new RegExp(CAPTURE_EVENT_SUFFIX + '$');
const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = newVnode.$elm$.nodeType === 11 /* NODE_TYPE.DocumentFragment */ && newVnode.$elm$.host
        ? newVnode.$elm$.host
        : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};
/**
 * Create a DOM Node corresponding to one of the children of a given VNode.
 *
 * @param oldParentVNode the parent VNode from the previous render
 * @param newParentVNode the parent VNode from the current render
 * @param childIndex the index of the VNode, in the _new_ parent node's
 * children, for which we will create a new DOM node
 * @param parentElm the parent DOM node which our new node will be a child of
 * @returns the newly created node
 */
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    var _a;
    // tslint:disable-next-line: prefer-const
    const newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    let oldVNode;
    if (!useNativeShadowDom) {
        // remember for later we need to check to relocate nodes
        checkSlotRelocate = true;
        if (newVNode.$tag$ === 'slot') {
            if (scopeId) {
                // scoped css needs to add its scoped id to the parent element
                parentElm.classList.add(scopeId + '-s');
            }
            newVNode.$flags$ |= newVNode.$children$
                ? // slot element has fallback content
                    2 /* VNODE_FLAGS.isSlotFallback */
                : // slot element does not have fallback content
                    1 /* VNODE_FLAGS.isSlotReference */;
        }
    }
    if (newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc$1.createTextNode(newVNode.$text$);
    }
    else if (newVNode.$flags$ & 1 /* VNODE_FLAGS.isSlotReference */) {
        // create a slot reference node
        elm = newVNode.$elm$ =
            doc$1.createTextNode('');
    }
    else {
        if (!isSvgMode) {
            isSvgMode = newVNode.$tag$ === 'svg';
        }
        // create element
        elm = newVNode.$elm$ = (doc$1.createElementNS(isSvgMode ? SVG_NS : HTML_NS, newVNode.$flags$ & 2 /* VNODE_FLAGS.isSlotFallback */
                ? 'slot-fb'
                : newVNode.$tag$)
            );
        if (isSvgMode && newVNode.$tag$ === 'foreignObject') {
            isSvgMode = false;
        }
        // add css classes, attrs, props, listeners, etc.
        {
            updateElement(null, newVNode, isSvgMode);
        }
        if (isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i, elm);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.appendChild(childNode);
                }
            }
        }
        {
            if (newVNode.$tag$ === 'svg') {
                // Only reset the SVG context when we're exiting <svg> element
                isSvgMode = false;
            }
            else if (elm.tagName === 'foreignObject') {
                // Reenter SVG context when we're exiting <foreignObject> element
                isSvgMode = true;
            }
        }
    }
    {
        elm['s-hn'] = hostTagName;
        if (newVNode.$flags$ & (2 /* VNODE_FLAGS.isSlotFallback */ | 1 /* VNODE_FLAGS.isSlotReference */)) {
            // remember the content reference comment
            elm['s-sr'] = true;
            // Persist the name of the slot that this slot was going to be projected into.
            elm['s-fs'] = (_a = newVNode.$attrs$) === null || _a === void 0 ? void 0 : _a.slot;
            // remember the content reference comment
            elm['s-cr'] = contentRef;
            // remember the slot name, or empty string for default slot
            elm['s-sn'] = newVNode.$name$ || '';
            // check if we've got an old vnode for this slot
            oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
            if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
                // we've got an old slot vnode and the wrapper is being replaced
                // so let's move the old slot content back to it's original location
                putBackInOriginalLocation(oldParentVNode.$elm$, false);
            }
        }
    }
    return elm;
};
const putBackInOriginalLocation = (parentElm, recursive) => {
    var _a;
    plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
    const oldSlotChildNodes = parentElm.childNodes;
    for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
        const childNode = oldSlotChildNodes[i];
        if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
            // // this child node in the old element is from another component
            // // remove this node from the old slot's parent
            // childNode.remove();
            // and relocate it back to it's original location
            parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));
            // remove the old original location comment entirely
            // later on the patch function will know what to do
            // and move this to the correct spot if need be
            childNode['s-ol'].remove();
            childNode['s-ol'] = undefined;
            // Reset so we can correctly move the node around again.
            childNode['s-sh'] = undefined;
            // When putting an element node back in its original location,
            // we need to reset the `slot` attribute back to the value it originally had
            // so we can correctly relocate it again in the future
            if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                childNode.setAttribute('slot', (_a = childNode['s-sn']) !== null && _a !== void 0 ? _a : '');
            }
            checkSlotRelocate = true;
        }
        if (recursive) {
            putBackInOriginalLocation(childNode, recursive);
        }
    }
    plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
};
/**
 * Create DOM nodes corresponding to a list of {@link d.Vnode} objects and
 * add them to the DOM in the appropriate place.
 *
 * @param parentElm the DOM node which should be used as a parent for the new
 * DOM nodes
 * @param before a child of the `parentElm` which the new children should be
 * inserted before (optional)
 * @param parentVNode the parent virtual DOM node
 * @param vnodes the new child virtual DOM nodes to produce DOM nodes for
 * @param startIdx the index in the child virtual DOM nodes at which to start
 * creating DOM nodes (inclusive)
 * @param endIdx the index in the child virtual DOM nodes at which to stop
 * creating DOM nodes (inclusive)
 */
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = ((parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm);
    let childNode;
    if (containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx, parentElm);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode, referenceNode(before) );
            }
        }
    }
};
/**
 * Remove the DOM elements corresponding to a list of {@link d.VNode} objects.
 * This can be used to, for instance, clean up after a list of children which
 * should no longer be shown.
 *
 * This function also handles some of Stencil's slot relocation logic.
 *
 * @param vnodes a list of virtual DOM nodes to remove
 * @param startIdx the index at which to start removing nodes (inclusive)
 * @param endIdx the index at which to stop removing nodes (inclusive)
 */
const removeVnodes = (vnodes, startIdx, endIdx) => {
    for (let index = startIdx; index <= endIdx; ++index) {
        const vnode = vnodes[index];
        if (vnode) {
            const elm = vnode.$elm$;
            nullifyVNodeRefs(vnode);
            if (elm) {
                {
                    // we're removing this element
                    // so it's possible we need to show slot fallback content now
                    checkSlotFallbackVisibility = true;
                    if (elm['s-ol']) {
                        // remove the original location comment
                        elm['s-ol'].remove();
                    }
                    else {
                        // it's possible that child nodes of the node
                        // that's being removed are slot nodes
                        putBackInOriginalLocation(elm, true);
                    }
                }
                // remove the vnode's element from the dom
                elm.remove();
            }
        }
    }
};
/**
 * Reconcile the children of a new VNode with the children of an old VNode by
 * traversing the two collections of children, identifying nodes that are
 * conserved or changed, calling out to `patch` to make any necessary
 * updates to the DOM, and rearranging DOM nodes as needed.
 *
 * The algorithm for reconciling children works by analyzing two 'windows' onto
 * the two arrays of children (`oldCh` and `newCh`). We keep track of the
 * 'windows' by storing start and end indices and references to the
 * corresponding array entries. Initially the two 'windows' are basically equal
 * to the entire array, but we progressively narrow the windows until there are
 * no children left to update by doing the following:
 *
 * 1. Skip any `null` entries at the beginning or end of the two arrays, so
 *    that if we have an initial array like the following we'll end up dealing
 *    only with a window bounded by the highlighted elements:
 *
 *    [null, null, VNode1 , ... , VNode2, null, null]
 *                 ^^^^^^         ^^^^^^
 *
 * 2. Check to see if the elements at the head and tail positions are equal
 *    across the windows. This will basically detect elements which haven't
 *    been added, removed, or changed position, i.e. if you had the following
 *    VNode elements (represented as HTML):
 *
 *    oldVNode: `<div><p><span>HEY</span></p></div>`
 *    newVNode: `<div><p><span>THERE</span></p></div>`
 *
 *    Then when comparing the children of the `<div>` tag we check the equality
 *    of the VNodes corresponding to the `<p>` tags and, since they are the
 *    same tag in the same position, we'd be able to avoid completely
 *    re-rendering the subtree under them with a new DOM element and would just
 *    call out to `patch` to handle reconciling their children and so on.
 *
 * 3. Check, for both windows, to see if the element at the beginning of the
 *    window corresponds to the element at the end of the other window. This is
 *    a heuristic which will let us identify _some_ situations in which
 *    elements have changed position, for instance it _should_ detect that the
 *    children nodes themselves have not changed but merely moved in the
 *    following example:
 *
 *    oldVNode: `<div><element-one /><element-two /></div>`
 *    newVNode: `<div><element-two /><element-one /></div>`
 *
 *    If we find cases like this then we also need to move the concrete DOM
 *    elements corresponding to the moved children to write the re-order to the
 *    DOM.
 *
 * 4. Finally, if VNodes have the `key` attribute set on them we check for any
 *    nodes in the old children which have the same key as the first element in
 *    our window on the new children. If we find such a node we handle calling
 *    out to `patch`, moving relevant DOM nodes, and so on, in accordance with
 *    what we find.
 *
 * Finally, once we've narrowed our 'windows' to the point that either of them
 * collapse (i.e. they have length 0) we then handle any remaining VNode
 * insertion or deletion that needs to happen to get a DOM state that correctly
 * reflects the new child VNodes. If, for instance, after our window on the old
 * children has collapsed we still have more nodes on the new children that
 * we haven't dealt with yet then we need to add them, or if the new children
 * collapse but we still have unhandled _old_ children then we need to make
 * sure the corresponding DOM nodes are removed.
 *
 * @param parentElm the node into which the parent VNode is rendered
 * @param oldCh the old children of the parent node
 * @param newVNode the new VNode which will replace the parent
 * @param newCh the new children of the parent node
 */
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let idxInOld = 0;
    let i = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    let elmToMove;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // VNode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            // if the start nodes are the same then we should patch the new VNode
            // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
            // indices to reflect that. We don't need to move any DOM Nodes around
            // since things are matched up in order.
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // likewise, if the end nodes are the same we patch new onto old and
            // decrement our end indices, and also likewise in this case we don't
            // need to move any DOM Nodes.
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // case: "Vnode moved right"
            //
            // We've found that the last node in our window on the new children is
            // the same VNode as the _first_ node in our window on the old children
            // we're dealing with now. Visually, this is the layout of these two
            // nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //                                    ^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //              ^^^^^^^^^^^^^
            //
            // In this situation we need to patch `newEndVnode` onto `oldStartVnode`
            // and move the DOM element for `oldStartVnode`.
            if ((oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
            }
            patch(oldStartVnode, newEndVnode);
            // We need to move the element for `oldStartVnode` into a position which
            // will be appropriate for `newEndVnode`. For this we can use
            // `.insertBefore` and `oldEndVnode.$elm$.nextSibling`. If there is a
            // sibling for `oldEndVnode.$elm$` then we want to move the DOM node for
            // `oldStartVnode` between `oldEndVnode` and it's sibling, like so:
            //
            // <old-start-node />
            // <some-intervening-node />
            // <old-end-node />
            // <!-- ->              <-- `oldStartVnode.$elm$` should be inserted here
            // <next-sibling />
            //
            // If instead `oldEndVnode.$elm$` has no sibling then we just want to put
            // the node for `oldStartVnode` at the end of the children of
            // `parentElm`. Luckily, `Node.nextSibling` will return `null` if there
            // aren't any siblings, and passing `null` to `Node.insertBefore` will
            // append it to the children of the parent element.
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // case: "Vnode moved left"
            //
            // We've found that the first node in our window on the new children is
            // the same VNode as the _last_ node in our window on the old children.
            // Visually, this is the layout of these two nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //              ^^^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //                                    ^^^^^^^^^^^
            //
            // In this situation we need to patch `newStartVnode` onto `oldEndVnode`
            // (which will handle updating any changed attributes, reconciling their
            // children etc) but we also need to move the DOM node to which
            // `oldEndVnode` corresponds.
            if ((oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
            }
            patch(oldEndVnode, newStartVnode);
            // We've already checked above if `oldStartVnode` and `newStartVnode` are
            // the same node, so since we're here we know that they are not. Thus we
            // can move the element for `oldEndVnode` _before_ the element for
            // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
            // future.
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            // Here we do some checks to match up old and new nodes based on the
            // `$key$` attribute, which is set by putting a `key="my-key"` attribute
            // in the JSX for a DOM element in the implementation of a Stencil
            // component.
            //
            // First we check to see if there are any nodes in the array of old
            // children which have the same key as the first node in the new
            // children.
            idxInOld = -1;
            {
                for (i = oldStartIdx; i <= oldEndIdx; ++i) {
                    if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
                        idxInOld = i;
                        break;
                    }
                }
            }
            if (idxInOld >= 0) {
                // We found a node in the old children which matches up with the first
                // node in the new children! So let's deal with that
                elmToMove = oldCh[idxInOld];
                if (elmToMove.$tag$ !== newStartVnode.$tag$) {
                    // the tag doesn't match so we'll need a new DOM element
                    node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
                }
                else {
                    patch(elmToMove, newStartVnode);
                    // invalidate the matching old node so that we won't try to update it
                    // again later on
                    oldCh[idxInOld] = undefined;
                    node = elmToMove.$elm$;
                }
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                // We either didn't find an element in the old children that matches
                // the key of the first new child OR the build is not using `key`
                // attributes at all. In either case we need to create a new element
                // for the new node.
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                // if we created a new node then handle inserting it to the DOM
                {
                    parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        // we have some more new nodes to add which don't match up with old nodes
        addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if (newStartIdx > newEndIdx) {
        // there are nodes in the `oldCh` array which no longer correspond to nodes
        // in the new array, so lets remove them (which entails cleaning up the
        // relevant DOM nodes)
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
};
/**
 * Compare two VNodes to determine if they are the same
 *
 * **NB**: This function is an equality _heuristic_ based on the available
 * information set on the two VNodes and can be misleading under certain
 * circumstances. In particular, if the two nodes do not have `key` attrs
 * (available under `$key$` on VNodes) then the function falls back on merely
 * checking that they have the same tag.
 *
 * So, in other words, if `key` attrs are not set on VNodes which may be
 * changing order within a `children` array or something along those lines then
 * we could obtain a false negative and then have to do needless re-rendering
 * (i.e. we'd say two VNodes aren't equal when in fact they should be).
 *
 * @param leftVNode the first VNode to check
 * @param rightVNode the second VNode to check
 * @returns whether they're equal or not
 */
const isSameVnode = (leftVNode, rightVNode) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (leftVNode.$tag$ === rightVNode.$tag$) {
        if (leftVNode.$tag$ === 'slot') {
            return leftVNode.$name$ === rightVNode.$name$;
        }
        // this will be set if components in the build have `key` attrs set on them
        {
            return leftVNode.$key$ === rightVNode.$key$;
        }
    }
    return false;
};
const referenceNode = (node) => {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return (node && node['s-ol']) || node;
};
const parentReferenceNode = (node) => (node['s-ol'] ? node['s-ol'] : node).parentNode;
/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */
const patch = (oldVNode, newVNode) => {
    const elm = (newVNode.$elm$ = oldVNode.$elm$);
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    const tag = newVNode.$tag$;
    const text = newVNode.$text$;
    let defaultHolder;
    if (text === null) {
        {
            // test if we're rendering an svg element, or still rendering nodes inside of one
            // only add this to the when the compiler sees we're using an svg somewhere
            isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : isSvgMode;
        }
        {
            if (tag === 'slot')
                ;
            else {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, isSvgMode);
            }
        }
        if (oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            // so we need to call `updateChildren` to reconcile them
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if (oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if (oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
        if (isSvgMode && tag === 'svg') {
            isSvgMode = false;
        }
    }
    else if ((defaultHolder = elm['s-cr'])) {
        // this element has slotted content
        defaultHolder.parentNode.textContent = text;
    }
    else if (oldVNode.$text$ !== text) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.data = text;
    }
};
/**
 * Adjust the `.hidden` property as-needed on any nodes in a DOM subtree which
 * are slot fallbacks nodes.
 *
 * A slot fallback node should be visible by default. Then, it should be
 * conditionally hidden if:
 *
 * - it has a sibling with a `slot` property set to its slot name or if
 * - it is a default fallback slot node, in which case we hide if it has any
 *   content
 *
 * @param elm the element of interest
 */
const updateFallbackSlotVisibility = (elm) => {
    const childNodes = elm.childNodes;
    for (const childNode of childNodes) {
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */) {
            if (childNode['s-sr']) {
                // this is a slot fallback node
                // get the slot name for this slot reference node
                const slotName = childNode['s-sn'];
                // by default always show a fallback slot node
                // then hide it if there are other slots in the light dom
                childNode.hidden = false;
                // we need to check all of its sibling nodes in order to see if
                // `childNode` should be hidden
                for (const siblingNode of childNodes) {
                    // Don't check the node against itself
                    if (siblingNode !== childNode) {
                        if (siblingNode['s-hn'] !== childNode['s-hn'] || slotName !== '') {
                            // this sibling node is from a different component OR is a named
                            // fallback slot node
                            if (siblingNode.nodeType === 1 /* NODE_TYPE.ElementNode */ &&
                                (slotName === siblingNode.getAttribute('slot') || slotName === siblingNode['s-sn'])) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                        else {
                            // this is a default fallback slot node
                            // any element or text node (with content)
                            // should hide the default fallback slot node
                            if (siblingNode.nodeType === 1 /* NODE_TYPE.ElementNode */ ||
                                (siblingNode.nodeType === 3 /* NODE_TYPE.TextNode */ && siblingNode.textContent.trim() !== '')) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                    }
                }
            }
            // keep drilling down
            updateFallbackSlotVisibility(childNode);
        }
    }
};
/**
 * Component-global information about nodes which are either currently being
 * relocated or will be shortly.
 */
const relocateNodes = [];
/**
 * Mark the contents of a slot for relocation via adding references to them to
 * the {@link relocateNodes} data structure. The actual work of relocating them
 * will then be handled in {@link renderVdom}.
 *
 * @param elm a render node whose child nodes need to be relocated
 */
const markSlotContentForRelocation = (elm) => {
    // tslint:disable-next-line: prefer-const
    let node;
    let hostContentNodes;
    let j;
    for (const childNode of elm.childNodes) {
        // we need to find child nodes which are slot references so we can then try
        // to match them up with nodes that need to be relocated
        if (childNode['s-sr'] && (node = childNode['s-cr']) && node.parentNode) {
            // first get the content reference comment node ('s-cr'), then we get
            // its parent, which is where all the host content is now
            hostContentNodes = node.parentNode.childNodes;
            const slotName = childNode['s-sn'];
            // iterate through all the nodes under the location where the host was
            // originally rendered
            for (j = hostContentNodes.length - 1; j >= 0; j--) {
                node = hostContentNodes[j];
                // check that the node is not a content reference node or a node
                // reference and then check that the host name does not match that of
                // childNode.
                // In addition, check that the slot either has not already been relocated, or
                // that its current location's host is not childNode's host. This is essentially
                // a check so that we don't try to relocate (and then hide) a node that is already
                // where it should be.
                if (!node['s-cn'] &&
                    !node['s-nr'] &&
                    node['s-hn'] !== childNode['s-hn'] &&
                    (!BUILD.experimentalSlotFixes  )) {
                    // if `node` is located in the slot that `childNode` refers to (via the
                    // `'s-sn'` property) then we need to relocate it from it's current spot
                    // (under the host element parent) to the right slot location
                    if (isNodeLocatedInSlot(node, slotName)) {
                        // it's possible we've already decided to relocate this node
                        let relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                        // made some changes to slots
                        // let's make sure we also double check
                        // fallbacks are correctly hidden or shown
                        checkSlotFallbackVisibility = true;
                        // ensure that the slot-name attr is correct
                        node['s-sn'] = node['s-sn'] || slotName;
                        if (relocateNodeData) {
                            relocateNodeData.$nodeToRelocate$['s-sh'] = childNode['s-hn'];
                            // we marked this node for relocation previously but didn't find
                            // out the slot reference node to which it needs to be relocated
                            // so write it down now!
                            relocateNodeData.$slotRefNode$ = childNode;
                        }
                        else {
                            node['s-sh'] = childNode['s-hn'];
                            // add to our list of nodes to relocate
                            relocateNodes.push({
                                $slotRefNode$: childNode,
                                $nodeToRelocate$: node,
                            });
                        }
                        if (node['s-sr']) {
                            relocateNodes.map((relocateNode) => {
                                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                                    relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                                    if (relocateNodeData && !relocateNode.$slotRefNode$) {
                                        relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                                    }
                                }
                            });
                        }
                    }
                    else if (!relocateNodes.some((r) => r.$nodeToRelocate$ === node)) {
                        // the node is not found within the slot (`childNode`) that we're
                        // currently looking at, so we stick it into `relocateNodes` to
                        // handle later. If we never find a home for this element then
                        // we'll need to hide it
                        relocateNodes.push({
                            $nodeToRelocate$: node,
                        });
                    }
                }
            }
        }
        // if we're dealing with any type of element (capable of itself being a
        // slot reference or containing one) then we recur
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */) {
            markSlotContentForRelocation(childNode);
        }
    }
};
/**
 * Check whether a node is located in a given named slot.
 *
 * @param nodeToRelocate the node of interest
 * @param slotName the slot name to check
 * @returns whether the node is located in the slot or not
 */
const isNodeLocatedInSlot = (nodeToRelocate, slotName) => {
    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        if (nodeToRelocate.getAttribute('slot') === null && slotName === '') {
            // if the node doesn't have a slot attribute, and the slot we're checking
            // is not a named slot, then we assume the node should be within the slot
            return true;
        }
        if (nodeToRelocate.getAttribute('slot') === slotName) {
            return true;
        }
        return false;
    }
    if (nodeToRelocate['s-sn'] === slotName) {
        return true;
    }
    return slotName === '';
};
/**
 * 'Nullify' any VDom `ref` callbacks on a VDom node or its children by calling
 * them with `null`. This signals that the DOM element corresponding to the VDom
 * node has been removed from the DOM.
 *
 * @param vNode a virtual DOM node
 */
const nullifyVNodeRefs = (vNode) => {
    {
        vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
        vNode.$children$ && vNode.$children$.map(nullifyVNodeRefs);
    }
};
/**
 * The main entry point for Stencil's virtual DOM-based rendering engine
 *
 * Given a {@link d.HostRef} container and some virtual DOM nodes, this
 * function will handle creating a virtual DOM tree with a single root, patching
 * the current virtual DOM tree onto an old one (if any), dealing with slot
 * relocation, and reflecting attributes.
 *
 * @param hostRef data needed to root and render the virtual DOM tree, such as
 * the DOM node into which it should be rendered.
 * @param renderFnResults the virtual DOM nodes to be rendered
 * @param isInitialLoad whether or not this is the first call after page load
 */
const renderVdom = (hostRef, renderFnResults, isInitialLoad = false) => {
    var _a, _b;
    const hostElm = hostRef.$hostElement$;
    const cmpMeta = hostRef.$cmpMeta$;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    // if `renderFnResults` is a Host node then we can use it directly. If not,
    // we need to call `h` again to wrap the children of our component in a
    // 'dummy' Host node (well, an empty vnode) since `renderVdom` assumes
    // implicitly that the top-level vdom node is 1) an only child and 2)
    // contains attrs that need to be set on the host element.
    const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
    hostTagName = hostElm.tagName;
    if (cmpMeta.$attrsToReflect$) {
        rootVnode.$attrs$ = rootVnode.$attrs$ || {};
        cmpMeta.$attrsToReflect$.map(([propName, attribute]) => (rootVnode.$attrs$[attribute] = hostElm[propName]));
    }
    // On the first render and *only* on the first render we want to check for
    // any attributes set on the host element which are also set on the vdom
    // node. If we find them, we override the value on the VDom node attrs with
    // the value from the host element, which allows developers building apps
    // with Stencil components to override e.g. the `role` attribute on a
    // component even if it's already set on the `Host`.
    if (isInitialLoad && rootVnode.$attrs$) {
        for (const key of Object.keys(rootVnode.$attrs$)) {
            // We have a special implementation in `setAccessor` for `style` and
            // `class` which reconciles values coming from the VDom with values
            // already present on the DOM element, so we don't want to override those
            // attributes on the VDom tree with values from the host element if they
            // are present.
            //
            // Likewise, `ref` and `key` are special internal values for the Stencil
            // runtime and we don't want to override those either.
            if (hostElm.hasAttribute(key) && !['key', 'ref', 'style', 'class'].includes(key)) {
                rootVnode.$attrs$[key] = hostElm[key];
            }
        }
    }
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* VNODE_FLAGS.isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = (hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    {
        contentRef = hostElm['s-cr'];
        useNativeShadowDom = (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) !== 0;
        // always reset
        checkSlotFallbackVisibility = false;
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
    {
        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        if (checkSlotRelocate) {
            markSlotContentForRelocation(rootVnode.$elm$);
            for (const relocateData of relocateNodes) {
                const nodeToRelocate = relocateData.$nodeToRelocate$;
                if (!nodeToRelocate['s-ol']) {
                    // add a reference node marking this node's original location
                    // keep a reference to this node for later lookups
                    const orgLocationNode = doc$1.createTextNode('');
                    orgLocationNode['s-nr'] = nodeToRelocate;
                    nodeToRelocate.parentNode.insertBefore((nodeToRelocate['s-ol'] = orgLocationNode), nodeToRelocate);
                }
            }
            for (const relocateData of relocateNodes) {
                const nodeToRelocate = relocateData.$nodeToRelocate$;
                const slotRefNode = relocateData.$slotRefNode$;
                if (slotRefNode) {
                    const parentNodeRef = slotRefNode.parentNode;
                    // When determining where to insert content, the most simple case would be
                    // to relocate the node immediately following the slot reference node. We do this
                    // by getting a reference to the node immediately following the slot reference node
                    // since we will use `insertBefore` to manipulate the DOM.
                    //
                    // If there is no node immediately following the slot reference node, then we will just
                    // end up appending the node as the last child of the parent.
                    let insertBeforeNode = slotRefNode.nextSibling;
                    // If the node we're currently planning on inserting the new node before is an element,
                    // we need to do some additional checks to make sure we're inserting the node in the correct order.
                    // The use case here would be that we have multiple nodes being relocated to the same slot. So, we want
                    // to make sure they get inserted into their new how in the same order they were declared in their original location.
                    //
                    // TODO(STENCIL-914): Remove `experimentalSlotFixes` check
                    {
                        let orgLocationNode = (_a = nodeToRelocate['s-ol']) === null || _a === void 0 ? void 0 : _a.previousSibling;
                        while (orgLocationNode) {
                            let refNode = (_b = orgLocationNode['s-nr']) !== null && _b !== void 0 ? _b : null;
                            if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
                                refNode = refNode.nextSibling;
                                if (!refNode || !refNode['s-nr']) {
                                    insertBeforeNode = refNode;
                                    break;
                                }
                            }
                            orgLocationNode = orgLocationNode.previousSibling;
                        }
                    }
                    if ((!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) ||
                        nodeToRelocate.nextSibling !== insertBeforeNode) {
                        // we've checked that it's worth while to relocate
                        // since that the node to relocate
                        // has a different next sibling or parent relocated
                        if (nodeToRelocate !== insertBeforeNode) {
                            if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                                // probably a component in the index.html that doesn't have its hostname set
                                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
                            }
                            // Add it back to the dom but in its new home
                            // If we get to this point and `insertBeforeNode` is `null`, that means
                            // we're just going to append the node as the last child of the parent. Passing
                            // `null` as the second arg here will trigger that behavior.
                            parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
                        }
                    }
                }
                else {
                    // this node doesn't have a slot home to go to, so let's hide it
                    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                        nodeToRelocate.hidden = true;
                    }
                }
            }
        }
        if (checkSlotFallbackVisibility) {
            updateFallbackSlotVisibility(rootVnode.$elm$);
        }
        // done moving nodes around
        // allow the disconnect callback to work again
        plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        // always reset
        relocateNodes.length = 0;
    }
};
const attachToAncestor = (hostRef, ancestorComponent) => {
};
const scheduleUpdate = (hostRef, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* HOST_FLAGS.isQueuedForUpdate */;
    }
    attachToAncestor(hostRef, hostRef.$ancestorComponent$);
    // there is no ancestor component or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
    return writeTask(dispatch) ;
};
/**
 * Dispatch initial-render and update lifecycle hooks, enqueuing calls to
 * component lifecycle methods like `componentWillLoad` as well as
 * {@link updateComponent}, which will kick off the virtual DOM re-render.
 *
 * @param hostRef a reference to a host DOM node
 * @param isInitialLoad whether we're on the initial load or not
 * @returns an empty Promise which is used to enqueue a series of operations for
 * the component
 */
const dispatchHooks = (hostRef, isInitialLoad) => {
    const elm = hostRef.$hostElement$;
    const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
    const instance = elm;
    // We're going to use this variable together with `enqueue` to implement a
    // little promise-based queue. We start out with it `undefined`. When we add
    // the first function to the queue we'll set this variable to be that
    // function's return value. When we attempt to add subsequent values to the
    // queue we'll check that value and, if it was a `Promise`, we'll then chain
    // the new function off of that `Promise` using `.then()`. This will give our
    // queue two nice properties:
    //
    // 1. If all functions added to the queue are synchronous they'll be called
    //    synchronously right away.
    // 2. If all functions added to the queue are asynchronous they'll all be
    //    called in order after `dispatchHooks` exits.
    let maybePromise;
    if (isInitialLoad) {
        {
            // If `componentWillLoad` returns a `Promise` then we want to wait on
            // whatever's going on in that `Promise` before we launch into
            // rendering the component, doing other lifecycle stuff, etc. So
            // in that case we assign the returned promise to the variable we
            // declared above to hold a possible 'queueing' Promise
            maybePromise = safeCall(instance, 'componentWillLoad');
        }
    }
    else {
        {
            // Like `componentWillLoad` above, we allow Stencil component
            // authors to return a `Promise` from this lifecycle callback, and
            // we specify that our runtime will wait for that `Promise` to
            // resolve before the component re-renders. So if the method
            // returns a `Promise` we need to keep it around!
            maybePromise = safeCall(instance, 'componentWillUpdate');
        }
    }
    {
        maybePromise = enqueue(maybePromise, () => safeCall(instance, 'componentWillRender'));
    }
    endSchedule();
    return enqueue(maybePromise, () => updateComponent(hostRef, instance, isInitialLoad));
};
/**
 * This function uses a Promise to implement a simple first-in, first-out queue
 * of functions to be called.
 *
 * The queue is ordered on the basis of the first argument. If it's
 * `undefined`, then nothing is on the queue yet, so the provided function can
 * be called synchronously (although note that this function may return a
 * `Promise`). The idea is that then the return value of that enqueueing
 * operation is kept around, so that if it was a `Promise` then subsequent
 * functions can be enqueued by calling this function again with that `Promise`
 * as the first argument.
 *
 * @param maybePromise either a `Promise` which should resolve before the next function is called or an 'empty' sentinel
 * @param fn a function to enqueue
 * @returns either a `Promise` or the return value of the provided function
 */
const enqueue = (maybePromise, fn) => isPromisey(maybePromise) ? maybePromise.then(fn) : fn();
/**
 * Check that a value is a `Promise`. To check, we first see if the value is an
 * instance of the `Promise` global. In a few circumstances, in particular if
 * the global has been overwritten, this is could be misleading, so we also do
 * a little 'duck typing' check to see if the `.then` property of the value is
 * defined and a function.
 *
 * @param maybePromise it might be a promise!
 * @returns whether it is or not
 */
const isPromisey = (maybePromise) => maybePromise instanceof Promise ||
    (maybePromise && maybePromise.then && typeof maybePromise.then === 'function');
/**
 * Update a component given reference to its host elements and so on.
 *
 * @param hostRef an object containing references to the element's host node,
 * VDom nodes, and other metadata
 * @param instance a reference to the underlying host element where it will be
 * rendered
 * @param isInitialLoad whether or not this function is being called as part of
 * the first render cycle
 */
const updateComponent = async (hostRef, instance, isInitialLoad) => {
    const elm = hostRef.$hostElement$;
    const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
    elm['s-rc'];
    if (isInitialLoad) {
        // DOM WRITE!
        attachStyles(hostRef);
    }
    const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);
    {
        callRender(hostRef, instance, elm, isInitialLoad);
    }
    endRender();
    endUpdate();
    {
        postUpdateComponent(hostRef);
    }
};
/**
 * Handle making the call to the VDom renderer with the proper context given
 * various build variables
 *
 * @param hostRef an object containing references to the element's host node,
 * VDom nodes, and other metadata
 * @param instance a reference to the underlying host element where it will be
 * rendered
 * @param elm the Host element for the component
 * @param isInitialLoad whether or not this function is being called as part of
 * @returns an empty promise
 */
const callRender = (hostRef, instance, elm, isInitialLoad) => {
    // in order for bundlers to correctly tree-shake the BUILD object
    // we need to ensure BUILD is not deoptimized within a try/catch
    // https://rollupjs.org/guide/en/#treeshake tryCatchDeoptimization
    const allRenderFn = false;
    const lazyLoad = false;
    const taskQueue = true ;
    const updatable = true ;
    try {
        renderingRef = instance;
        /**
         * minification optimization: `allRenderFn` is `true` if all components have a `render`
         * method, so we can call the method immediately. If not, check before calling it.
         */
        instance = allRenderFn ? instance.render() : instance.render && instance.render();
        if (updatable && taskQueue) {
            hostRef.$flags$ &= ~16 /* HOST_FLAGS.isQueuedForUpdate */;
        }
        if (updatable || lazyLoad) {
            hostRef.$flags$ |= 2 /* HOST_FLAGS.hasRendered */;
        }
        if (BUILD.hasRenderFn || BUILD.reflect) {
            if (BUILD.vdomRender || BUILD.reflect) {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                if (BUILD.hydrateServerSide) ;
                else {
                    renderVdom(hostRef, instance, isInitialLoad);
                }
            }
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$);
    }
    renderingRef = null;
    return null;
};
const postUpdateComponent = (hostRef) => {
    const tagName = hostRef.$cmpMeta$.$tagName$;
    const elm = hostRef.$hostElement$;
    const endPostUpdate = createTime('postUpdate', tagName);
    const instance = elm;
    hostRef.$ancestorComponent$;
    {
        safeCall(instance, 'componentDidRender');
    }
    if (!(hostRef.$flags$ & 64 /* HOST_FLAGS.hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* HOST_FLAGS.hasLoadedComponent */;
        {
            safeCall(instance, 'componentDidLoad');
        }
        endPostUpdate();
    }
    else {
        {
            safeCall(instance, 'componentDidUpdate');
        }
        endPostUpdate();
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
/**
 * Allows to safely call a method, e.g. `componentDidLoad`, on an instance,
 * e.g. custom element node. If a build figures out that e.g. no component
 * has a `componentDidLoad` method, the instance method gets removed from the
 * output bundle and this function returns `undefined`.
 * @param instance any object that may or may not contain methods
 * @param method method name
 * @param arg single arbitrary argument
 * @returns result of method call if it exists, otherwise `undefined`
 */
const safeCall = (instance, method, arg) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e);
        }
    }
    return undefined;
};
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const elm = ref;
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance = elm;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    // explicitly check for NaN on both sides, as `NaN === NaN` is always false
    const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
    const didValueChange = newVal !== oldVal && !areBothNaN;
    if (didValueChange) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        {
            // get an array of method names of watch functions to call
            if (cmpMeta.$watchers$ && flags & 128 /* HOST_FLAGS.isWatchReady */) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.map((watchMethodName) => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e, elm);
                        }
                    });
                }
            }
            if ((flags & (2 /* HOST_FLAGS.hasRendered */ | 16 /* HOST_FLAGS.isQueuedForUpdate */)) === 2 /* HOST_FLAGS.hasRendered */) {
                if (instance.componentShouldUpdate) {
                    if (instance.componentShouldUpdate(newVal, oldVal, propName) === false) {
                        return;
                    }
                }
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};
/**
 * Attach a series of runtime constructs to a compiled Stencil component
 * constructor, including getters and setters for the `@Prop` and `@State`
 * decorators, callbacks for when attributes change, and so on.
 *
 * @param Cstr the constructor for a component that we need to process
 * @param cmpMeta metadata collected previously about the component
 * @param flags a number used to store a series of bit flags
 * @returns a reference to the same constructor passed in (but now mutated)
 */
const proxyComponent = (Cstr, cmpMeta, flags) => {
    var _a;
    const prototype = Cstr.prototype;
    if (cmpMeta.$members$) {
        if (Cstr.watchers) {
            cmpMeta.$watchers$ = Cstr.watchers;
        }
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        members.map(([memberName, [memberFlags]]) => {
            if ((memberFlags & 31 /* MEMBER_FLAGS.Prop */ ||
                    (memberFlags & 32 /* MEMBER_FLAGS.State */))) {
                // proxyComponent - prop
                Object.defineProperty(prototype, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        });
        {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, oldValue, newValue) {
                plt.jmp(() => {
                    var _a;
                    const propName = attrNameToPropName.get(attrName);
                    //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
                    //  in the case where an attribute was set inline.
                    //  ```html
                    //    <my-component some-attribute="some-value"></my-component>
                    //  ```
                    //
                    //  There is an edge case where a developer sets the attribute inline on a custom element and then
                    //  programmatically changes it before it has been upgraded as shown below:
                    //
                    //  ```html
                    //    <!-- this component has _not_ been upgraded yet -->
                    //    <my-component id="test" some-attribute="some-value"></my-component>
                    //    <script>
                    //      // grab non-upgraded component
                    //      el = document.querySelector("#test");
                    //      el.someAttribute = "another-value";
                    //      // upgrade component
                    //      customElements.define('my-component', MyComponent);
                    //    </script>
                    //  ```
                    //  In this case if we do not un-shadow here and use the value of the shadowing property, attributeChangedCallback
                    //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
                    //  to the value that was set inline i.e. "some-value" from above example. When
                    //  the connectedCallback attempts to un-shadow it will use "some-value" as the initial value rather than "another-value"
                    //
                    //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/un-shadowed
                    //  by connectedCallback as this attributeChangedCallback will not fire.
                    //
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
                    //
                    //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
                    //  properties here given that this goes against best practices outlined here
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
                    if (this.hasOwnProperty(propName)) {
                        newValue = this[propName];
                        delete this[propName];
                    }
                    else if (prototype.hasOwnProperty(propName) &&
                        typeof this[propName] === 'number' &&
                        this[propName] == newValue) {
                        // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
                        // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
                        // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
                        return;
                    }
                    else if (propName == null) {
                        // At this point we should know this is not a "member", so we can treat it like watching an attribute
                        // on a vanilla web component
                        const hostRef = getHostRef(this);
                        const flags = hostRef === null || hostRef === void 0 ? void 0 : hostRef.$flags$;
                        // We only want to trigger the callback(s) if:
                        // 1. The instance is ready
                        // 2. The watchers are ready
                        // 3. The value has changed
                        if (flags &&
                            !(flags & 8 /* HOST_FLAGS.isConstructingInstance */) &&
                            flags & 128 /* HOST_FLAGS.isWatchReady */ &&
                            newValue !== oldValue) {
                            const elm = this;
                            const instance = elm;
                            const entry = (_a = cmpMeta.$watchers$) === null || _a === void 0 ? void 0 : _a[attrName];
                            entry === null || entry === void 0 ? void 0 : entry.forEach((callbackName) => {
                                if (instance[callbackName] != null) {
                                    instance[callbackName].call(instance, newValue, oldValue, attrName);
                                }
                            });
                        }
                        return;
                    }
                    this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
                });
            };
            // Create an array of attributes to observe
            // This list in comprised of all strings used within a `@Watch()` decorator
            // on a component as well as any Stencil-specific "members" (`@Prop()`s and `@State()`s).
            // As such, there is no way to guarantee type-safety here that a user hasn't entered
            // an invalid attribute.
            Cstr.observedAttributes = Array.from(new Set([
                ...Object.keys((_a = cmpMeta.$watchers$) !== null && _a !== void 0 ? _a : {}),
                ...members
                    .filter(([_, m]) => m[0] & 15 /* MEMBER_FLAGS.HasAttribute */)
                    .map(([propName, m]) => {
                    var _a;
                    const attrName = m[1] || propName;
                    attrNameToPropName.set(attrName, propName);
                    if (m[0] & 512 /* MEMBER_FLAGS.ReflectAttr */) {
                        (_a = cmpMeta.$attrsToReflect$) === null || _a === void 0 ? void 0 : _a.push([propName, attrName]);
                    }
                    return attrName;
                }),
            ]));
        }
    }
    return Cstr;
};
/**
 * Initialize a Stencil component given a reference to its host element, its
 * runtime bookkeeping data structure, runtime metadata about the component,
 * and (optionally) an HMR version ID.
 *
 * @param elm a host element
 * @param hostRef the element's runtime bookkeeping object
 * @param cmpMeta runtime metadata for the Stencil component
 * @param hmrVersionId an (optional) HMR version ID
 */
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId) => {
    let Cstr;
    // initializeComponent
    if ((hostRef.$flags$ & 32 /* HOST_FLAGS.hasInitializedComponent */) === 0) {
        // Let the runtime know that the component has been initialized
        hostRef.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */;
        {
            // sync constructor component
            Cstr = elm.constructor;
            // wait for the CustomElementRegistry to mark the component as ready before setting `isWatchReady`. Otherwise,
            // watchers may fire prematurely if `customElements.get()`/`customElements.whenDefined()` resolves _before_
            // Stencil has completed instantiating the component.
            customElements.whenDefined(cmpMeta.$tagName$).then(() => (hostRef.$flags$ |= 128 /* HOST_FLAGS.isWatchReady */));
        }
        if (Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            if (typeof style !== 'string') {
                style = style[(hostRef.$modeName$ = computeMode(elm))];
            }
            const scopeId = getScopeId(cmpMeta, hostRef.$modeName$);
            if (!styles.has(scopeId)) {
                const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);
                registerStyle(scopeId, style, !!(cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */));
                endRegisterStyles();
            }
        }
    }
    // we've successfully created a lazy instance
    hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(hostRef, true);
    {
        schedule();
    }
};
const fireConnectedCallback = (instance) => {
};
const connectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const cmpMeta = hostRef.$cmpMeta$;
        const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
        if (!(hostRef.$flags$ & 1 /* HOST_FLAGS.hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* HOST_FLAGS.hasConnected */;
            {
                // initUpdate
                // if the slot polyfill is required we'll need to put some nodes
                // in here to act as original content anchors as we move nodes around
                // host element has been connected to the DOM
                if ((// TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
                        cmpMeta.$flags$ & (4 /* CMP_FLAGS.hasSlotRelocation */ | 8 /* CMP_FLAGS.needsShadowDomShim */))) {
                    setContentReference(elm);
                }
            }
            // Lazy properties
            // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            if (cmpMeta.$members$) {
                Object.entries(cmpMeta.$members$).map(([memberName, [memberFlags]]) => {
                    if (memberFlags & 31 /* MEMBER_FLAGS.Prop */ && elm.hasOwnProperty(memberName)) {
                        const value = elm[memberName];
                        delete elm[memberName];
                        elm[memberName] = value;
                    }
                });
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
        else {
            // not the first time this has connected
            // reattach any event listeners to the host
            // since they would have been removed when disconnected
            addHostEventListeners(elm, hostRef, cmpMeta.$listeners$);
            // fire off connectedCallback() on component instance
            if (hostRef === null || hostRef === void 0 ? void 0 : hostRef.$lazyInstance$) {
                fireConnectedCallback(hostRef.$lazyInstance$);
            }
            else if (hostRef === null || hostRef === void 0 ? void 0 : hostRef.$onReadyPromise$) {
                hostRef.$onReadyPromise$.then(() => fireConnectedCallback(hostRef.$lazyInstance$));
            }
        }
        endConnected();
    }
};
const setContentReference = (elm) => {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    const contentRefElm = (elm['s-cr'] = doc$1.createComment(''));
    contentRefElm['s-cn'] = true;
    elm.insertBefore(contentRefElm, elm.firstChild);
};
const disconnectedCallback = async (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        {
            if (hostRef.$rmListeners$) {
                hostRef.$rmListeners$.map((rmListener) => rmListener());
                hostRef.$rmListeners$ = undefined;
            }
        }
    }
};
const proxyCustomElement = (Cstr, compactMeta) => {
    const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
    };
    {
        cmpMeta.$members$ = compactMeta[2];
    }
    {
        cmpMeta.$listeners$ = compactMeta[3];
    }
    {
        cmpMeta.$watchers$ = Cstr.$watchers$;
    }
    {
        cmpMeta.$attrsToReflect$ = [];
    }
    const originalConnectedCallback = Cstr.prototype.connectedCallback;
    const originalDisconnectedCallback = Cstr.prototype.disconnectedCallback;
    Object.assign(Cstr.prototype, {
        __registerHost() {
            registerHost(this, cmpMeta);
        },
        connectedCallback() {
            connectedCallback(this);
            if (originalConnectedCallback) {
                originalConnectedCallback.call(this);
            }
        },
        disconnectedCallback() {
            disconnectedCallback(this);
            if (originalDisconnectedCallback) {
                originalDisconnectedCallback.call(this);
            }
        },
        __attachShadow() {
            {
                {
                    this.attachShadow({
                        mode: 'open',
                        delegatesFocus: !!(cmpMeta.$flags$ & 16 /* CMP_FLAGS.shadowDelegatesFocus */),
                    });
                }
            }
        },
    });
    Cstr.is = cmpMeta.$tagName$;
    return proxyComponent(Cstr, cmpMeta);
};
const addHostEventListeners = (elm, hostRef, listeners, attachParentListeners) => {
    if (listeners) {
        listeners.map(([flags, name, method]) => {
            const target = getHostListenerTarget(elm, flags) ;
            const handler = hostListenerProxy(hostRef, method);
            const opts = hostListenerOpts(flags);
            plt.ael(target, name, handler, opts);
            (hostRef.$rmListeners$ = hostRef.$rmListeners$ || []).push(() => plt.rel(target, name, handler, opts));
        });
    }
};
const hostListenerProxy = (hostRef, methodName) => (ev) => {
    try {
        if (BUILD.lazyLoad) ;
        else {
            hostRef.$hostElement$[methodName](ev);
        }
    }
    catch (e) {
        consoleError(e);
    }
};
const getHostListenerTarget = (elm, flags) => {
    if (flags & 4 /* LISTENER_FLAGS.TargetDocument */)
        return doc$1;
    if (flags & 8 /* LISTENER_FLAGS.TargetWindow */)
        return win;
    if (flags & 16 /* LISTENER_FLAGS.TargetBody */)
        return doc$1.body;
    return elm;
};
// prettier-ignore
const hostListenerOpts = (flags) => supportsListenerOptions
    ? ({
        passive: (flags & 1 /* LISTENER_FLAGS.Passive */) !== 0,
        capture: (flags & 2 /* LISTENER_FLAGS.Capture */) !== 0,
    })
    : (flags & 2 /* LISTENER_FLAGS.Capture */) !== 0;
/**
 * A WeakMap mapping runtime component references to their corresponding host reference
 * instances.
 */
const hostRefs = /*@__PURE__*/ new WeakMap();
/**
 * Given a {@link d.RuntimeRef} retrieve the corresponding {@link d.HostRef}
 *
 * @param ref the runtime ref of interest
 * @returns the Host reference (if found) or undefined
 */
const getHostRef = (ref) => hostRefs.get(ref);
/**
 * Register a host element for a Stencil component, setting up various metadata
 * and callbacks based on {@link BUILD} flags as well as the component's runtime
 * metadata.
 *
 * @param hostElement the host element to register
 * @param cmpMeta runtime metadata for that component
 * @returns a reference to the host ref WeakMap
 */
const registerHost = (hostElement, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: hostElement,
        $cmpMeta$: cmpMeta,
        $instanceValues$: new Map(),
    };
    addHostEventListeners(hostElement, hostRef, cmpMeta.$listeners$);
    return hostRefs.set(hostElement, hostRef);
};
const isMemberInElement = (elm, memberName) => memberName in elm;
const consoleError = (e, el) => (0, console.error)(e, el);
const styles = /*@__PURE__*/ new Map();
const modeResolutionChain = [];
const win = typeof window !== 'undefined' ? window : {};
const doc$1 = win.document || { head: {} };
const H = (win.HTMLElement || class {
});
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new CustomEvent(eventName, opts),
};
const supportsListenerOptions = /*@__PURE__*/ (() => {
    let supportsListenerOptions = false;
    try {
        doc$1.addEventListener('e', null, Object.defineProperty({}, 'passive', {
            get() {
                supportsListenerOptions = true;
            },
        }));
    }
    catch (e) { }
    return supportsListenerOptions;
})();
const promiseResolve = (v) => Promise.resolve(v);
const supportsConstructableStylesheets = /*@__PURE__*/ (() => {
        try {
            new CSSStyleSheet();
            return typeof new CSSStyleSheet().replaceSync === 'function';
        }
        catch (e) { }
        return false;
    })()
    ;
const queueDomReads = [];
const queueDomWrites = [];
const queueTask = (queue, write) => (cb) => {
    queue.push(cb);
    if (!queuePending) {
        queuePending = true;
        if (write && plt.$flags$ & 4 /* PLATFORM_FLAGS.queueSync */) {
            nextTick(flush);
        }
        else {
            plt.raf(flush);
        }
    }
};
const consume = (queue) => {
    for (let i = 0; i < queue.length; i++) {
        try {
            queue[i](performance.now());
        }
        catch (e) {
            consoleError(e);
        }
    }
    queue.length = 0;
};
const flush = () => {
    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    // DOM READS!!!
    consume(queueDomReads);
    // DOM WRITES!!!
    {
        consume(queueDomWrites);
        if ((queuePending = queueDomReads.length > 0)) {
            // still more to do yet, but we've run out of time
            // let's let this thing cool off and try again in the next tick
            plt.raf(flush);
        }
    }
};
const nextTick = (cb) => promiseResolve().then(cb);
const writeTask = /*@__PURE__*/ queueTask(queueDomWrites, true);

const filePreviewCss = ":host{display:block;font-size:13px}img,video{max-width:100%;margin-top:10px}";

const FilePreview$1 = /*@__PURE__*/ proxyCustomElement(class FilePreview extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.src = undefined;
        this.filetype = undefined;
    }
    render() {
        return (h(Host, { class: this.computeClass() }, this.isImage() && h("img", { src: this.src }), this.isVideo() && h("video", { src: this.src, onClick: toggle }), this.isOther() && "This file does not offer a preview", h("slot", null)));
    }
    computeClass() {
        if (this.isImage())
            return "image";
        if (this.isVideo())
            return "video";
        return "other";
    }
    isImage() {
        return this.filetype == "image";
    }
    isVideo() {
        return this.filetype == "video";
    }
    isOther() {
        return !this.isImage() && !this.isVideo();
    }
    static get style() { return filePreviewCss; }
}, [1, "file-preview", {
        "src": [513],
        "filetype": [513]
    }]);
const toggle = function () { this.paused ? this.play() : this.pause(); return false; };

const progressBarCss = ":host{display:block;position:relative;padding:0 20px;border:1px solid rgba(0, 0, 0, 0.3);border-radius:3px;line-height:2;flex:1 0;box-sizing:border-box;text-align:left;font-size:13px}.bar{position:absolute;top:0;left:0;bottom:0;background:rgba(57, 137, 39, 1);transition:width 120ms ease-out, opacity 60ms 60ms ease-in;transform:translate3d(0, 0, 0)}.content{position:relative;color:#fff;font-size:1em}";

const ProgressBar$1 = /*@__PURE__*/ proxyCustomElement(class ProgressBar extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.percent = 0;
    }
    render() {
        return (h(Host, null, h("div", { class: "bar", style: { width: `${this.percent}%` } }), h("span", { class: "content" }, h("slot", null))));
    }
    static get style() { return progressBarCss; }
}, [1, "progress-bar", {
        "percent": [514]
    }]);

var sparkMd5 = {
  exports: {}
};

(function(module, exports) {
  (function(factory) {
    {
      module.exports = factory();
    }
  })((function(undefined$1) {
    var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a += (b & c | ~b & d) + k[0] - 680876936 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[1] - 389564586 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[2] + 606105819 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[4] - 176418897 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[7] - 45705983 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[10] - 42063 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[13] - 40341101 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & d | c & ~d) + k[1] - 165796510 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[11] + 643717713 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[0] - 373897302 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[5] - 701558691 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[10] + 38016083 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[15] - 660478335 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[4] - 405537848 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[9] + 568446438 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[3] - 187363961 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[2] - 51403784 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b ^ c ^ d) + k[5] - 378558 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[14] - 35309556 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[7] - 155497632 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[13] + 681279174 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[0] - 358537222 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[3] - 722521979 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[6] + 76029189 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[9] - 640364487 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[12] - 421815835 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[15] + 530742520 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[2] - 995338651 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      x[0] = a + x[0] | 0;
      x[1] = b + x[1] | 0;
      x[2] = c + x[2] | 0;
      x[3] = d + x[3] | 0;
    }
    function md5blk(s) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function md5blk_array(a) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
      }
      return md5blks;
    }
    function md51(s) {
      var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      length = s.length;
      tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }
    function md51_array(a) {
      var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
      }
      a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
      length = a.length;
      tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= a[i] << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }
    function rhex(n) {
      var s = "", j;
      for (j = 0; j < 4; j += 1) {
        s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
      }
      return s;
    }
    function hex(x) {
      var i;
      for (i = 0; i < x.length; i += 1) {
        x[i] = rhex(x[i]);
      }
      return x.join("");
    }
    if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
    if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
      (function() {
        function clamp(val, length) {
          val = val | 0 || 0;
          if (val < 0) {
            return Math.max(val + length, 0);
          }
          return Math.min(val, length);
        }
        ArrayBuffer.prototype.slice = function(from, to) {
          var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
          if (to !== undefined$1) {
            end = clamp(to, length);
          }
          if (begin > end) {
            return new ArrayBuffer(0);
          }
          num = end - begin;
          target = new ArrayBuffer(num);
          targetArray = new Uint8Array(target);
          sourceArray = new Uint8Array(this, begin, num);
          targetArray.set(sourceArray);
          return target;
        };
      })();
    }
    function toUtf8(str) {
      if (/[\u0080-\uFFFF]/.test(str)) {
        str = unescape(encodeURIComponent(str));
      }
      return str;
    }
    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
      var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
      for (i = 0; i < length; i += 1) {
        arr[i] = str.charCodeAt(i);
      }
      return returnUInt8Array ? arr : buff;
    }
    function arrayBuffer2Utf8Str(buff) {
      return String.fromCharCode.apply(null, new Uint8Array(buff));
    }
    function concatenateArrayBuffers(first, second, returnUInt8Array) {
      var result = new Uint8Array(first.byteLength + second.byteLength);
      result.set(new Uint8Array(first));
      result.set(new Uint8Array(second), first.byteLength);
      return returnUInt8Array ? result : result.buffer;
    }
    function hexToBinaryString(hex) {
      var bytes = [], length = hex.length, x;
      for (x = 0; x < length - 1; x += 2) {
        bytes.push(parseInt(hex.substr(x, 2), 16));
      }
      return String.fromCharCode.apply(String, bytes);
    }
    function SparkMD5() {
      this.reset();
    }
    SparkMD5.prototype.append = function(str) {
      this.appendBinary(toUtf8(str));
      return this;
    };
    SparkMD5.prototype.appendBinary = function(contents) {
      this._buff += contents;
      this._length += contents.length;
      var length = this._buff.length, i;
      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
      }
      this._buff = this._buff.substring(i - 64);
      return this;
    };
    SparkMD5.prototype.end = function(raw) {
      var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
      }
      this._finish(tail, length);
      ret = hex(this._hash);
      if (raw) {
        ret = hexToBinaryString(ret);
      }
      this.reset();
      return ret;
    };
    SparkMD5.prototype.reset = function() {
      this._buff = "";
      this._length = 0;
      this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
      return this;
    };
    SparkMD5.prototype.getState = function() {
      return {
        buff: this._buff,
        length: this._length,
        hash: this._hash.slice()
      };
    };
    SparkMD5.prototype.setState = function(state) {
      this._buff = state.buff;
      this._length = state.length;
      this._hash = state.hash;
      return this;
    };
    SparkMD5.prototype.destroy = function() {
      delete this._hash;
      delete this._buff;
      delete this._length;
    };
    SparkMD5.prototype._finish = function(tail, length) {
      var i = length, tmp, lo, hi;
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(this._hash, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = this._length * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(this._hash, tail);
    };
    SparkMD5.hash = function(str, raw) {
      return SparkMD5.hashBinary(toUtf8(str), raw);
    };
    SparkMD5.hashBinary = function(content, raw) {
      var hash = md51(content), ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    };
    SparkMD5.ArrayBuffer = function() {
      this.reset();
    };
    SparkMD5.ArrayBuffer.prototype.append = function(arr) {
      var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
      this._length += arr.byteLength;
      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
      }
      this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
      return this;
    };
    SparkMD5.ArrayBuffer.prototype.end = function(raw) {
      var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff[i] << (i % 4 << 3);
      }
      this._finish(tail, length);
      ret = hex(this._hash);
      if (raw) {
        ret = hexToBinaryString(ret);
      }
      this.reset();
      return ret;
    };
    SparkMD5.ArrayBuffer.prototype.reset = function() {
      this._buff = new Uint8Array(0);
      this._length = 0;
      this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
      return this;
    };
    SparkMD5.ArrayBuffer.prototype.getState = function() {
      var state = SparkMD5.prototype.getState.call(this);
      state.buff = arrayBuffer2Utf8Str(state.buff);
      return state;
    };
    SparkMD5.ArrayBuffer.prototype.setState = function(state) {
      state.buff = utf8Str2ArrayBuffer(state.buff, true);
      return SparkMD5.prototype.setState.call(this, state);
    };
    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
    SparkMD5.ArrayBuffer.hash = function(arr, raw) {
      var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    };
    return SparkMD5;
  }));
})(sparkMd5);

var SparkMD5 = sparkMd5.exports;

const fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

class FileChecksum {
  static create(file, callback) {
    const instance = new FileChecksum(file);
    instance.create(callback);
  }
  constructor(file) {
    this.file = file;
    this.chunkSize = 2097152;
    this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
    this.chunkIndex = 0;
  }
  create(callback) {
    this.callback = callback;
    this.md5Buffer = new SparkMD5.ArrayBuffer;
    this.fileReader = new FileReader;
    this.fileReader.addEventListener("load", (event => this.fileReaderDidLoad(event)));
    this.fileReader.addEventListener("error", (event => this.fileReaderDidError(event)));
    this.readNextChunk();
  }
  fileReaderDidLoad(event) {
    this.md5Buffer.append(event.target.result);
    if (!this.readNextChunk()) {
      const binaryDigest = this.md5Buffer.end(true);
      const base64digest = btoa(binaryDigest);
      this.callback(null, base64digest);
    }
  }
  fileReaderDidError(event) {
    this.callback(`Error reading ${this.file.name}`);
  }
  readNextChunk() {
    if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
      const start = this.chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      const bytes = fileSlice.call(this.file, start, end);
      this.fileReader.readAsArrayBuffer(bytes);
      this.chunkIndex++;
      return true;
    } else {
      return false;
    }
  }
}

function getMetaValue(name) {
  const element = findElement(document.head, `meta[name="${name}"]`);
  if (element) {
    return element.getAttribute("content");
  }
}

function findElements(root, selector) {
  if (typeof root == "string") {
    selector = root;
    root = document;
  }
  const elements = root.querySelectorAll(selector);
  return toArray(elements);
}

function findElement(root, selector) {
  if (typeof root == "string") {
    selector = root;
    root = document;
  }
  return root.querySelector(selector);
}

function dispatchEvent$1(element, type, eventInit = {}) {
  const {disabled: disabled} = element;
  const {bubbles: bubbles, cancelable: cancelable, detail: detail} = eventInit;
  const event = document.createEvent("Event");
  event.initEvent(type, bubbles || true, cancelable || true);
  event.detail = detail || {};
  try {
    element.disabled = false;
    element.dispatchEvent(event);
  } finally {
    element.disabled = disabled;
  }
  return event;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (Array.from) {
    return Array.from(value);
  } else {
    return [].slice.call(value);
  }
}

class BlobRecord {
  constructor(file, checksum, url, customHeaders = {}) {
    this.file = file;
    this.attributes = {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
      byte_size: file.size,
      checksum: checksum
    };
    this.xhr = new XMLHttpRequest;
    this.xhr.open("POST", url, true);
    this.xhr.responseType = "json";
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("Accept", "application/json");
    this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    Object.keys(customHeaders).forEach((headerKey => {
      this.xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
    }));
    const csrfToken = getMetaValue("csrf-token");
    if (csrfToken != undefined) {
      this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
    }
    this.xhr.addEventListener("load", (event => this.requestDidLoad(event)));
    this.xhr.addEventListener("error", (event => this.requestDidError(event)));
  }
  get status() {
    return this.xhr.status;
  }
  get response() {
    const {responseType: responseType, response: response} = this.xhr;
    if (responseType == "json") {
      return response;
    } else {
      return JSON.parse(response);
    }
  }
  create(callback) {
    this.callback = callback;
    this.xhr.send(JSON.stringify({
      blob: this.attributes
    }));
  }
  requestDidLoad(event) {
    if (this.status >= 200 && this.status < 300) {
      const {response: response} = this;
      const {direct_upload: direct_upload} = response;
      delete response.direct_upload;
      this.attributes = response;
      this.directUploadData = direct_upload;
      this.callback(null, this.toJSON());
    } else {
      this.requestDidError(event);
    }
  }
  requestDidError(event) {
    this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`);
  }
  toJSON() {
    const result = {};
    for (const key in this.attributes) {
      result[key] = this.attributes[key];
    }
    return result;
  }
}

class BlobUpload {
  constructor(blob) {
    this.blob = blob;
    this.file = blob.file;
    const {url: url, headers: headers} = blob.directUploadData;
    this.xhr = new XMLHttpRequest;
    this.xhr.open("PUT", url, true);
    this.xhr.responseType = "text";
    for (const key in headers) {
      this.xhr.setRequestHeader(key, headers[key]);
    }
    this.xhr.addEventListener("load", (event => this.requestDidLoad(event)));
    this.xhr.addEventListener("error", (event => this.requestDidError(event)));
  }
  create(callback) {
    this.callback = callback;
    this.xhr.send(this.file.slice());
  }
  requestDidLoad(event) {
    const {status: status, response: response} = this.xhr;
    if (status >= 200 && status < 300) {
      this.callback(null, response);
    } else {
      this.requestDidError(event);
    }
  }
  requestDidError(event) {
    this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`);
  }
}

let id = 0;

class DirectUpload {
  constructor(file, url, delegate, customHeaders = {}) {
    this.id = ++id;
    this.file = file;
    this.url = url;
    this.delegate = delegate;
    this.customHeaders = customHeaders;
  }
  create(callback) {
    FileChecksum.create(this.file, ((error, checksum) => {
      if (error) {
        callback(error);
        return;
      }
      const blob = new BlobRecord(this.file, checksum, this.url, this.customHeaders);
      notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
      blob.create((error => {
        if (error) {
          callback(error);
        } else {
          const upload = new BlobUpload(blob);
          notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
          upload.create((error => {
            if (error) {
              callback(error);
            } else {
              callback(null, blob.toJSON());
            }
          }));
        }
      }));
    }));
  }
}

function notify(object, methodName, ...messages) {
  if (object && typeof object[methodName] == "function") {
    return object[methodName](...messages);
  }
}

class DirectUploadController$1 {
  constructor(input, file) {
    this.input = input;
    this.file = file;
    this.directUpload = new DirectUpload(this.file, this.url, this);
    this.dispatch("initialize");
  }
  start(callback) {
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = this.input.name;
    this.input.insertAdjacentElement("beforebegin", hiddenInput);
    this.dispatch("start");
    this.directUpload.create(((error, attributes) => {
      if (error) {
        hiddenInput.parentNode.removeChild(hiddenInput);
        this.dispatchError(error);
      } else {
        hiddenInput.value = attributes.signed_id;
      }
      this.dispatch("end");
      callback(error);
    }));
  }
  uploadRequestDidProgress(event) {
    const progress = event.loaded / event.total * 100;
    if (progress) {
      this.dispatch("progress", {
        progress: progress
      });
    }
  }
  get url() {
    return this.input.getAttribute("data-direct-upload-url");
  }
  dispatch(name, detail = {}) {
    detail.file = this.file;
    detail.id = this.directUpload.id;
    return dispatchEvent$1(this.input, `direct-upload:${name}`, {
      detail: detail
    });
  }
  dispatchError(error) {
    const event = this.dispatch("error", {
      error: error
    });
    if (!event.defaultPrevented) {
      alert(error);
    }
  }
  directUploadWillCreateBlobWithXHR(xhr) {
    this.dispatch("before-blob-request", {
      xhr: xhr
    });
  }
  directUploadWillStoreFileWithXHR(xhr) {
    this.dispatch("before-storage-request", {
      xhr: xhr
    });
    xhr.upload.addEventListener("progress", (event => this.uploadRequestDidProgress(event)));
  }
}

const inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";

class DirectUploadsController {
  constructor(form) {
    this.form = form;
    this.inputs = findElements(form, inputSelector).filter((input => input.files.length));
  }
  start(callback) {
    const controllers = this.createDirectUploadControllers();
    const startNextController = () => {
      const controller = controllers.shift();
      if (controller) {
        controller.start((error => {
          if (error) {
            callback(error);
            this.dispatch("end");
          } else {
            startNextController();
          }
        }));
      } else {
        callback();
        this.dispatch("end");
      }
    };
    this.dispatch("start");
    startNextController();
  }
  createDirectUploadControllers() {
    const controllers = [];
    this.inputs.forEach((input => {
      toArray(input.files).forEach((file => {
        const controller = new DirectUploadController$1(input, file);
        controllers.push(controller);
      }));
    }));
    return controllers;
  }
  dispatch(name, detail = {}) {
    return dispatchEvent$1(this.form, `direct-uploads:${name}`, {
      detail: detail
    });
  }
}

const processingAttribute = "data-direct-uploads-processing";

const submitButtonsByForm = new WeakMap;

let started = false;

function start() {
  if (!started) {
    started = true;
    document.addEventListener("click", didClick, true);
    document.addEventListener("submit", didSubmitForm, true);
    document.addEventListener("ajax:before", didSubmitRemoteElement);
  }
}

function didClick(event) {
  const {target: target} = event;
  if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
    submitButtonsByForm.set(target.form, target);
  }
}

function didSubmitForm(event) {
  handleFormSubmissionEvent(event);
}

function didSubmitRemoteElement(event) {
  if (event.target.tagName == "FORM") {
    handleFormSubmissionEvent(event);
  }
}

function handleFormSubmissionEvent(event) {
  const form = event.target;
  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault();
    return;
  }
  const controller = new DirectUploadsController(form);
  const {inputs: inputs} = controller;
  if (inputs.length) {
    event.preventDefault();
    form.setAttribute(processingAttribute, "");
    inputs.forEach(disable);
    controller.start((error => {
      form.removeAttribute(processingAttribute);
      if (error) {
        inputs.forEach(enable);
      } else {
        submitForm(form);
      }
    }));
  }
}

function submitForm(form) {
  let button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
  if (button) {
    const {disabled: disabled} = button;
    button.disabled = false;
    button.focus();
    button.click();
    button.disabled = disabled;
  } else {
    button = document.createElement("input");
    button.type = "submit";
    button.style.display = "none";
    form.appendChild(button);
    button.click();
    form.removeChild(button);
  }
  submitButtonsByForm.delete(form);
}

function disable(input) {
  input.disabled = true;
}

function enable(input) {
  input.disabled = false;
}

function autostart() {
  if (window.ActiveStorage) {
    start();
  }
}

setTimeout(autostart, 1);

class DirectUploadController {
    uploadedFile;
    file;
    directUpload;
    recordXHR;
    uploadXHR;
    callback = null;
    constructor(uploadedFile) {
        this.uploadedFile = uploadedFile;
        this.file = this.uploadedFile["file"];
        this.directUpload = new DirectUpload(this.file, this.uploadedFile.url, this);
    }
    cancel() {
        this.directUpload.url = null;
        this.abortXHR(this.recordXHR);
        this.abortXHR(this.uploadXHR);
    }
    abortXHR(xhr) {
        if (!xhr)
            return;
        xhr.addEventListener("abort", () => {
            this.complete("aborted", {});
        });
        xhr.abort();
    }
    start(callback) {
        this.callback = callback;
        this.dispatch("start");
        this.directUpload.create((error, attributes) => {
            this.complete(error, attributes);
        });
    }
    complete(error, _attributes) {
        if (error) {
            this.dispatchError(error);
        }
        this.dispatch("end");
        this.callback(error);
    }
    uploadRequestDidProgress(event) {
        const progress = event.loaded / event.total * 100;
        if (progress) {
            this.dispatch("progress", {
                progress: progress
            });
        }
    }
    dispatch(name, detail = {}) {
        return dispatchEvent(this.uploadedFile, `direct-upload:${name}`, {
            detail: {
                ...detail,
                file: this.file,
                id: this.directUpload.id,
            }
        });
    }
    dispatchError(error) {
        this.dispatch("error", {
            error: error
        });
    }
    directUploadWillCreateBlobWithXHR(xhr) {
        this.recordXHR = xhr;
        this.dispatch("before-blob-request", {
            xhr: xhr
        });
    }
    directUploadWillStoreFileWithXHR(xhr) {
        this.uploadXHR = xhr;
        this.uploadedFile.value = this.recordXHR.response.signed_id;
        this.dispatch("before-storage-request", {
            xhr: xhr
        });
        xhr.upload.addEventListener("progress", (event => this.uploadRequestDidProgress(event)));
    }
}
function dispatchEvent(element, type, eventInit = {}) {
    const { disabled: disabled } = element;
    const { bubbles: bubbles, cancelable: cancelable, detail: detail } = eventInit;
    const event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
        element.disabled = false;
        element.dispatchEvent(event);
    }
    finally {
        element.disabled = disabled;
    }
    return event;
}

class Max {
    uploadedFile;
    constructor(uploadedFile) {
        this.uploadedFile = uploadedFile;
    }
    get errors() {
        if (this.#errors)
            return this.#errors;
        this.#errors = [];
        if (!this.checkValidity()) {
            this.#errors.push(this.errorMessage);
        }
        return this.#errors;
    }
    #errors;
    checkValidity() {
        if (!this.uploadedFile.max)
            return true;
        return this.uploadedFile.size <= this.uploadedFile.max;
    }
    get errorMessage() {
        return [
            `Must be smaller than ${this.formatBytes(this.uploadedFile.max)},`,
            `and "${this.uploadedFile.filename}" is ${this.formatBytes(this.uploadedFile.size)}.`,
            `Please attach a smaller file.`,
        ].join(" ");
    }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
    }
}

class Accepts {
    uploadedFile;
    constructor(uploadedFile) {
        this.uploadedFile = uploadedFile;
    }
    get errors() {
        if (this.#errors)
            return this.#errors;
        this.#errors = [];
        const accepts = this.uploadedFile.accepts ? this.uploadedFile.accepts.split(/,\s*/) : [];
        if (accepts.length > 0 && !accepts.includes(this.uploadedFile.filetype)) {
            this.#errors.push(`Must be a ${this.joinWords(accepts)}.`);
        }
        return this.#errors;
    }
    #errors;
    joinWords(words) {
        if (words.length >= 3) {
            return (words.slice(0, -1) + [`or ${words.at(-1)}`]).join(", ");
        }
        else {
            return words.join(" or ");
        }
    }
}

const Extensions = {
    image: ["ase", "art", "bmp", "blp", "cd5", "cit", "cpt", "cr2", "cut", "dds", "dib", "djvu", "egt", "exif", "gif", "gpl", "grf", "icns", "ico", "iff", "jng", "jpeg", "jpg", "jfif", "jp2", "jps", "lbm", "max", "miff", "mng", "msp", "nef", "nitf", "ota", "pbm", "pc1", "pc2", "pc3", "pcf", "pcx", "pdn", "pgm", "PI1", "PI2", "PI3", "pict", "pct", "pnm", "pns", "ppm", "psb", "psd", "pdd", "psp", "px", "pxm", "pxr", "qfx", "raw", "rle", "sct", "sgi", "rgb", "int", "bw", "tga", "tiff", "tif", "vtf", "xbm", "xcf", "xpm", "3dv", "amf", "ai", "awg", "cgm", "cdr", "cmx", "dxf", "e2d", "egt", "eps", "fs", "gbr", "odg", "svg", "stl", "vrml", "x3d", "sxd", "v2d", "vnd", "wmf", "emf", "art", "xar", "png", "webp", "jxr", "hdp", "wdp", "cur", "ecw", "iff", "lbm", "liff", "nrrd", "pam", "pcx", "pgf", "sgi", "rgb", "rgba", "bw", "int", "inta", "sid", "ras", "sun", "tga", "heic", "heif"],
    video: ["3g2", "3gp", "3gpp", "aaf", "asf", "avchd", "avi", "drc", "flv", "m2v", "m3u8", "m4p", "m4v", "mkv", "mng", "mov", "mp2", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogg", "ogv", "qt", "rm", "rmvb", "roq", "svi", "vob", "webm", "wmv", "yuv"],
    pdf: ["pdf"],
    getFileType: function (filename) {
        const normalized = filename.toString().split(".").at(-1).toLowerCase().trim();
        if (this.video.includes(normalized))
            return "video";
        if (this.image.includes(normalized))
            return "image";
        if (this.pdf.includes(normalized))
            return "pdf";
        return "unknown";
    }
};

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

    if (searchParams.has(name)) {
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

    if (response.ok && response.isTurboStream) {
      await response.renderTurboStream();
    }

    return response
  }

  addHeader (key, value) {
    const headers = this.additionalHeaders;
    headers[key] = value;
    this.options.headers = headers;
  }

  get fetchOptions () {
    return {
      method: this.method.toUpperCase(),
      headers: this.headers,
      body: this.formattedBody,
      signal: this.signal,
      credentials: 'same-origin',
      redirect: this.redirect
    }
  }

  get headers () {
    return compact(
      Object.assign({
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': this.csrfToken,
        'Content-Type': this.contentType,
        Accept: this.accept
      },
      this.additionalHeaders)
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

const request = (verb, url, payload) => {
  const req = new FetchRequest(verb, url, {
    headers: { Accept: "application/json" },
    body: payload,
  });
  return req.perform().then(response => {
    if(response.response.ok) {
      return response.json
    } else {
      return response
    }
  })
};

const get = (url, payload) => request('get', url, payload);

var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // document-fragments dont have attributes so lets not do anything
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    // update attributes on original DOM element
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;

            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;

    if (fromNodeName === toNodeName) {
        return true;
    }

    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);

    // If the target element is a virtual DOM node or SVG node then we may
    // need to normalize the tag name before comparing. Normal HTML elements that are
    // in the "http://www.w3.org/1999/xhtml"
    // are converted to upper case
    if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
        return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
        return toNodeName === fromNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name);
        }
    }
}

var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    // Workaround for MS Edge bug where the 'selected' attribute can only be
                    // removed if set to a non-empty value:
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                // We have to reset select element's selectedIndex to -1, otherwise setting
                // fromEl.selected using the syncBooleanAttrProp below has no effect.
                // The correct selectedIndex will be set in the SELECT special handler below.
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            // We have to loop through children of fromEl, not toEl since nodes can be moved
            // from toEl to fromEl directly when morphing.
            // At the time this special handler is invoked, all children have already been morphed
            // and appended to / removed from fromEl, so using fromEl here is safe and correct.
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while(curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild;
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }

            fromEl.selectedIndex = selectedIndex;
        }
    }
};

var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
  if (node) {
    return (node.getAttribute && node.getAttribute('id')) || node.id;
  }
}

function morphdomFactory(morphAttrs) {

  return function morphdom(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }

    if (typeof toNode === 'string') {
      if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
        var toNodeHtml = toNode;
        toNode = doc.createElement('html');
        toNode.innerHTML = toNodeHtml;
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }

    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child){ return parent.appendChild(child); };
    var childrenOnly = options.childrenOnly === true;

    // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
    var fromNodesLookup = Object.create(null);
    var keyedRemovalList = [];

    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }

    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {

          var key = undefined;

          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            // If we are skipping keyed nodes then we add the key
            // to a list so that it can be handled at the very end.
            addKeyedRemoval(key);
          } else {
            // Only report the node as discarded if it is not keyed. We do this because
            // at the end we loop through all keyed elements that were unmatched
            // and then discard them in one final pass.
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }

          curChild = curChild.nextSibling;
        }
      }
    }

    /**
    * Removes a DOM node out of the original DOM
    *
    * @param  {Node} node The node to remove
    * @param  {Node} parentNode The nodes parent
    * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
    * @return {undefined}
    */
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }

      if (parentNode) {
        parentNode.removeChild(node);
      }

      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }

    // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
    // function indexTree(root) {
    //     var treeWalker = document.createTreeWalker(
    //         root,
    //         NodeFilter.SHOW_ELEMENT);
    //
    //     var el;
    //     while((el = treeWalker.nextNode())) {
    //         var key = getNodeKey(el);
    //         if (key) {
    //             fromNodesLookup[key] = el;
    //         }
    //     }
    // }

    // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
    //
    // function indexTree(node) {
    //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
    //     var el;
    //     while((el = nodeIterator.nextNode())) {
    //         var key = getNodeKey(el);
    //         if (key) {
    //             fromNodesLookup[key] = el;
    //         }
    //     }
    // }

    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }

          // Walk recursively
          indexTree(curChild);

          curChild = curChild.nextSibling;
        }
      }
    }

    indexTree(fromNode);

    function handleNodeAdded(el) {
      onNodeAdded(el);

      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;

        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          // if we find a duplicate #id node in cache, replace `el` with cache value
          // and morph it to the child node.
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          // recursively call for curChild and it's children to see if we find something in
          // fromNodesLookup
          handleNodeAdded(curChild);
        }

        curChild = nextSibling;
      }
    }

    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      // We have processed all of the "to nodes". If curFromNodeChild is
      // non-null then we still have some from nodes left over that need
      // to be removed
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
          // Since the node is keyed it might be matched up later so we defer
          // the actual removal to later
          addKeyedRemoval(curFromNodeKey);
        } else {
          // NOTE: we skip nested keyed nodes from being removed since there is
          //       still a chance they will be matched up later
          removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
        }
        curFromNodeChild = fromNextSibling;
      }
    }

    function morphEl(fromEl, toEl, childrenOnly) {
      var toElKey = getNodeKey(toEl);

      if (toElKey) {
        // If an element with an ID is being morphed then it will be in the final
        // DOM so clear it out of the saved elements collection
        delete fromNodesLookup[toElKey];
      }

      if (!childrenOnly) {
        // optional
        if (onBeforeElUpdated(fromEl, toEl) === false) {
          return;
        }

        // update attributes on original DOM element first
        morphAttrs(fromEl, toEl);
        // optional
        onElUpdated(fromEl);

        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }

      if (fromEl.nodeName !== 'TEXTAREA') {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }

    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;

      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;

      // walk the children
      outer: while (curToNodeChild) {
        toNextSibling = curToNodeChild.nextSibling;
        curToNodeKey = getNodeKey(curToNodeChild);

        // walk the fromNode children all the way through
        while (!skipFrom && curFromNodeChild) {
          fromNextSibling = curFromNodeChild.nextSibling;

          if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }

          curFromNodeKey = getNodeKey(curFromNodeChild);

          var curFromNodeType = curFromNodeChild.nodeType;

          // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
          var isCompatible = undefined;

          if (curFromNodeType === curToNodeChild.nodeType) {
            if (curFromNodeType === ELEMENT_NODE) {
              // Both nodes being compared are Element nodes

              if (curToNodeKey) {
                // The target node has a key so we want to match it up with the correct element
                // in the original DOM tree
                if (curToNodeKey !== curFromNodeKey) {
                  // The current element in the original DOM tree does not have a matching key so
                  // let's check our lookup to see if there is a matching element in the original
                  // DOM tree
                  if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                    if (fromNextSibling === matchingFromEl) {
                      // Special case for single element removals. To avoid removing the original
                      // DOM node out of the tree (since that can break CSS transitions, etc.),
                      // we will instead discard the current node and wait until the next
                      // iteration to properly match up the keyed target element with its matching
                      // element in the original tree
                      isCompatible = false;
                    } else {
                      // We found a matching keyed element somewhere in the original DOM tree.
                      // Let's move the original DOM node into the current position and morph
                      // it.

                      // NOTE: We use insertBefore instead of replaceChild because we want to go through
                      // the `removeNode()` function for the node that is being discarded so that
                      // all lifecycle hooks are correctly invoked
                      fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                      // fromNextSibling = curFromNodeChild.nextSibling;

                      if (curFromNodeKey) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                      } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                      }

                      curFromNodeChild = matchingFromEl;
                    }
                  } else {
                    // The nodes are not compatible since the "to" node has a key and there
                    // is no matching keyed node in the source tree
                    isCompatible = false;
                  }
                }
              } else if (curFromNodeKey) {
                // The original has a key
                isCompatible = false;
              }

              isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
              if (isCompatible) {
                // We found compatible DOM elements so transform
                // the current "from" node to match the current
                // target DOM node.
                // MORPH
                morphEl(curFromNodeChild, curToNodeChild);
              }

            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
              // Both nodes being compared are Text or Comment nodes
              isCompatible = true;
              // Simply update nodeValue on the original node to
              // change the text value
              if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
              }

            }
          }

          if (isCompatible) {
            // Advance both the "to" child and the "from" child since we found a match
            // Nothing else to do as we already recursively called morphChildren above
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }

          // No compatible match so remove the old node from the DOM and continue trying to find a
          // match in the original DOM. However, we only do this if the from node is not keyed
          // since it is possible that a keyed node might match up with a node somewhere else in the
          // target tree and we don't want to discard it just yet since it still might find a
          // home in the final DOM tree. After everything is done we will remove any keyed nodes
          // that didn't find a home
          if (curFromNodeKey) {
            // Since the node is keyed it might be matched up later so we defer
            // the actual removal to later
            addKeyedRemoval(curFromNodeKey);
          } else {
            // NOTE: we skip nested keyed nodes from being removed since there is
            //       still a chance they will be matched up later
            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
          }

          curFromNodeChild = fromNextSibling;
        } // END: while(curFromNodeChild) {}

        // If we got this far then we did not find a candidate match for
        // our "to node" and we exhausted all of the children "from"
        // nodes. Therefore, we will just append the current "to" node
        // to the end
        if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
          // MORPH
          if(!skipFrom){ addChild(fromEl, matchingFromEl); }
          morphEl(matchingFromEl, curToNodeChild);
        } else {
          var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
          if (onBeforeNodeAddedResult !== false) {
            if (onBeforeNodeAddedResult) {
              curToNodeChild = onBeforeNodeAddedResult;
            }

            if (curToNodeChild.actualize) {
              curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
            }
            addChild(fromEl, curToNodeChild);
            handleNodeAdded(curToNodeChild);
          }
        }

        curToNodeChild = toNextSibling;
        curFromNodeChild = fromNextSibling;
      }

      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    } // END: morphChildren(...)

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
      // Handle the case where we are given two DOM nodes that are not
      // compatible (e.g. <div> --> <span> or <div> --> TEXT)
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          // Going from an element node to a text node
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }

          return morphedNode;
        } else {
          // Text node to something else
          morphedNode = toNode;
        }
      }
    }

    if (morphedNode === toNode) {
      // The "to node" was not compatible with the "from node" so we had to
      // toss out the "from node" and use the "to node"
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }

      morphEl(morphedNode, toNode, childrenOnly);

      // We now need to loop over any keyed nodes that might need to be
      // removed. We only do the removal if we know that the keyed node
      // never found a match. When a keyed node is matched up we remove
      // it out of fromNodesLookup and we use fromNodesLookup to determine
      // if a keyed node has been matched up or not
      if (keyedRemovalList) {
        for (var i=0, len=keyedRemovalList.length; i<len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      // If we had to swap out the from node with a new node because the old
      // node was not compatible with the target node then we need to
      // replace the old DOM node in the original DOM tree. This is only
      // possible if the original DOM node was part of a DOM tree which
      // we know is the case if it has a parent node.
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
  };
}

var morphdom = morphdomFactory(morphAttrs);

function html(html) {
    const el = document.createElement("div");
    morphdom(el, `<div>${html}</div>`);
    return el.children[0];
}
function arrayRemove(arr, e) {
    const index = arr.findIndex(x => x === e);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

const uploadedFileCss = ":host{display:block;width:100%;max-width:100%;font-size:13px}figure{margin:0}.progress-details{position:relative;display:flex;align-items:center}progress-bar{flex:1 0;padding:0 10px}progress-bar.pending{opacity:0.5}progress-bar.complete{opacity:0.8}progress-bar:not(.complete)+.progress-icon{display:none}progress-bar.complete+.progress-icon{content:url('data:image/svg+xml;utf8,<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 20 20\" style=\"enable-background:new 0 0 20 20;\" xml:space=\"preserve\"><g><path d=\"M6.3,9.1c0.2,0,0.5,0.1,0.7,0.4c0.5,0.5,1,1,1.4,1.4c0.3,0.3,0.3,0.3,0.6,0c1.4-1.3,2.7-2.6,4-3.9c0.3-0.3,0.6-0.4,1-0.4 c0.5,0.1,0.9,0.6,0.7,1.1c-0.1,0.2-0.2,0.4-0.3,0.6c-1.6,1.6-3.2,3.2-4.8,4.8c-0.5,0.5-1,0.5-1.6,0c-0.8-0.7-1.5-1.5-2.3-2.3 c-0.3-0.3-0.5-0.6-0.3-1.1C5.5,9.3,5.8,9.1,6.3,9.1z\"/></g></svg>');filter:invert(100%)}.progress-icon{display:inline-block;flex:0 0 20px;width:28px;height:28px;background-size:contain;position:absolute;right:30px;z-index:1}progress-bar.error{background:#f8b3b1;background:rgba(74, 70, 70, 0.25);opacity:1}.progress-bar a{color:#fff}.download-link{padding-right:20px;color:#fff}.remove-media{display:inline-block;content:url('data:image/svg+xml;utf8,<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 40 40\" style=\"enable-background:new 0 0 40 40;\" xml:space=\"preserve\"><g><path d=\"M0,19.9C0.2,8.5,9.2-0.1,20.1,0C31.8,0.1,40.2,9.5,40,20.4c-0.2,11-8.9,19.7-20.1,19.6C8,39.9,0,30.5,0,19.9z M20,3.7 c-9,0-16.3,7-16.3,16.2C3.7,29,10.9,36.3,20,36.3c9,0,16.3-7.1,16.4-16.3C36.3,11,29.2,3.8,20,3.7z\"/><path d=\"M17.3,20c-0.2-0.2-0.3-0.4-0.5-0.6c-1-1-2-1.9-2.9-2.9c-0.5-0.5-0.8-1.1-0.7-1.9c0.1-0.7,0.5-1.2,1.2-1.4 c0.8-0.2,1.5,0,2.1,0.6c1,1,2,2,3,3.1c0.3,0.4,0.6,0.3,0.9,0c1-1,2-2,3-3c0.3-0.3,0.7-0.5,1.1-0.6c0.8-0.2,1.6,0.1,2,0.8 c0.4,0.8,0.3,1.7-0.4,2.4c-1,1-2,2-3,3c-0.2,0.2-0.3,0.4-0.5,0.6c1.2,1.2,2.3,2.3,3.4,3.4c0.6,0.6,0.9,1.3,0.6,2.2 c-0.4,1.1-1.7,1.6-2.6,1c-0.3-0.2-0.5-0.4-0.8-0.6c-1-1-1.9-1.9-2.9-2.9c-0.3-0.3-0.5-0.3-0.9,0c-1,1-2,2.1-3,3 c-0.4,0.4-1,0.6-1.5,0.8c-0.6,0.1-1.2-0.2-1.5-0.8c-0.4-0.6-0.5-1.3-0.1-1.9c0.2-0.3,0.4-0.5,0.6-0.7C15.1,22.3,16.2,21.2,17.3,20z \"/></g></svg>');flex:0 0 25px;width:25px;height:20px;align-items:center;opacity:0.25}.remove-media:hover{opacity:1;filter:invert(50%)sepia(100%)saturate(10000%)}.remove-media span{display:inline-block;text-indent:-9999px;color:transparent}";

let uid = 0;
const UploadedFile$1 = /*@__PURE__*/ proxyCustomElement(class UploadedFile extends H {
    get el() { return this; }
    removeEvent;
    removeClicked = event => {
        event.stopPropagation();
        event.preventDefault();
        this.controller?.cancel();
        this.removeEvent.emit(this);
    };
    inputTarget;
    controller;
    _file;
    uid;
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.removeEvent = createEvent(this, "uploaded-file:remove", 7);
        this.name = undefined;
        this.accepts = undefined;
        this.max = undefined;
        this.url = undefined;
        this.value = "";
        this.filename = undefined;
        this.src = undefined;
        this.filetype = undefined;
        this.size = undefined;
        this.state = "complete";
        this.percent = 100;
        this.preview = true;
        this.validationMessage = undefined;
        this.uid = uid++;
        this.inputTarget = html(`<input id="input-target-${this.uid}">`);
    }
    componentWillLoad() {
        this.el.appendChild(this.inputTarget);
        this.setMissingFiletype();
    }
    get file() {
        return this._file;
    }
    set file(file) {
        this.src = URL.createObjectURL(file);
        this.filename = file.name;
        this.size = file.size;
        this.state = "pending";
        this.percent = 0;
        this._file = file;
    }
    set signedId(val) {
        if (this.value !== val) {
            get(`/rails/active_storage/blobs/info/${val}`).then(blob => {
                this.src = `/rails/active_storage/blobs/redirect/${val}/${blob.filename}`;
                this.filename = blob.filename;
                this.size = blob.byte_size;
                this.state = "complete";
                this.percent = 100;
                this.value = val;
            });
        }
    }
    setMissingFiletype(_value, _previousValue) {
        if (!this.filetype && this.filename) {
            this.filetype = Extensions.getFileType(this.filename);
        }
    }
    start(_event) {
        this.state = "pending";
        this.percent = 0;
    }
    progress(event) {
        const { progress } = event.detail;
        this.percent = progress;
    }
    error(event) {
        event.preventDefault();
        const { error } = event.detail;
        this.state = "error";
        this.inputTarget.setCustomValidity(error);
    }
    end(_event) {
        if (this.state !== "error") {
            this.state = "complete";
            this.percent = 100;
        }
    }
    render() {
        return (h(Host, null, h("slot", null), h("figure", null, h("div", { class: "progress-details" }, h("progress-bar", { percent: this.percent, class: this.state }, h("a", { class: "download-link", href: this.src, download: this.filename, onClick: e => e.stopPropagation() }, this.filename)), h("span", { class: "progress-icon" }), h("a", { class: "remove-media", onClick: this.removeClicked, href: "#" }, h("span", null, "Remove media"))), this.preview ? h("file-preview", { src: this.src, filetype: this.filetype }) : '')));
    }
    componentDidRender() {
        morphdom(this.inputTarget, `
      <input
        id="input-target-${this.uid}"
        style="opacity: 0.01; width: 1px; height: 1px; z-index: -999; position: absolute;"
        name="${this.name}"
        value="${this.value}"
      >`);
    }
    componentDidLoad() {
        if (this.checkValidity() && this.state == "pending") {
            this.controller = new DirectUploadController(this.el);
            this.controller.dispatch("initialize", { controller: this.controller });
        }
    }
    checkValidity() {
        let errors = [];
        errors.push(...new Accepts(this).errors);
        errors.push(...new Max(this).errors);
        this.inputTarget.setCustomValidity(errors.join(" "));
        this.inputTarget.reportValidity();
        return errors.length === 0;
    }
    static get watchers() { return {
        "filename": ["setMissingFiletype"]
    }; }
    static get style() { return uploadedFileCss; }
}, [1, "uploaded-file", {
        "name": [1537],
        "accepts": [1537],
        "max": [1538],
        "url": [1537],
        "value": [1537],
        "filename": [1537],
        "src": [1537],
        "filetype": [1537],
        "size": [1538],
        "state": [1537],
        "percent": [1538],
        "preview": [1540],
        "validationMessage": [1, "validation-message"]
    }, [[0, "direct-upload:initialize", "start"], [0, "direct-upload:start", "start"], [0, "direct-upload:progress", "progress"], [0, "direct-upload:error", "error"], [0, "direct-upload:end", "end"]], {
        "filename": ["setMissingFiletype"]
    }]);

const fileDropCss = "file-drop{display:flex;flex-direction:column;justify-content:center;align-items:center;box-sizing:border-box;min-height:60px;outline-offset:-10px;padding:20px;background:rgba(255, 255, 255, 0.25);text-align:center;transition:all 0.15s ease 0s;outline:rgba(0, 0, 0, 0.25) dashed 2px;font-size:13px}";

const FileDrop$1 = /*@__PURE__*/ proxyCustomElement(class FileDrop extends H {
    constructor() {
        super();
        this.__registerHost();
        this.for = undefined;
    }
    get el() { return this; }
    get fileTarget() {
        return document.querySelector(`#${this.for}`);
    }
    openFilePicker(_event) {
        this.fileTarget.click();
    }
    highlight(event) {
        event.preventDefault();
        this.el.classList.add("-dragover");
    }
    unhighlight(_event) {
        this.el.classList.remove("-dragover");
    }
    drop(event) {
        event.preventDefault();
        this.el.classList.remove("-dragover");
        this.fileTarget.files = event.dataTransfer.files;
        const changeEvent = new Event("change", { bubbles: true });
        this.fileTarget.dispatchEvent(changeEvent);
    }
    static get style() { return fileDropCss; }
}, [0, "file-drop", {
        "for": [1537]
    }, [[0, "click", "openFilePicker"], [0, "dragover", "highlight"], [0, "dragleave", "unhighlight"], [0, "drop", "drop"]]]);

class FormController {
    static instance(form) {
        return form.bardFileFormController ||= new FormController(form);
    }
    progressContainerTarget;
    dialog;
    element;
    progressTargetMap;
    controllers;
    submitted;
    processing;
    errors;
    constructor(form) {
        this.element = form;
        this.progressTargetMap = {};
        this.controllers = [];
        this.submitted = false;
        this.processing = false;
        this.errors = false;
        this.element.insertAdjacentHTML("beforeend", `<dialog id="form-controller-dialog">
        <div class="direct-upload-wrapper">
          <div class="direct-upload-content">
            <h3>Uploading your media</h3>
            <div id="progress-container"></div>
          </div>
        </div>
      </dialog>`);
        this.dialog = this.element.querySelector("#form-controller-dialog");
        this.progressContainerTarget = this.dialog.querySelector("#progress-container");
        if (this.element.dataset.remote !== "true" && !window.Turbo?.session?.enabled) {
            this.element.addEventListener("submit", event => this.submit(event));
        }
        window.addEventListener("beforeunload", event => this.beforeUnload(event));
        this.element.addEventListener("direct-upload:initialize", event => this.init(event));
        this.element.addEventListener("direct-upload:start", event => this.start(event));
        this.element.addEventListener("direct-upload:progress", event => this.progress(event));
        this.element.addEventListener("direct-upload:error", event => this.error(event));
        this.element.addEventListener("direct-upload:end", event => this.end(event));
        this.element.addEventListener("uploaded-file:remove", event => this.removeUploadedFile(event));
    }
    beforeUnload(event) {
        if (this.processing) {
            event.preventDefault();
            return (event.returnValue = "");
        }
    }
    submit(event) {
        event.preventDefault();
        this.submitted = true;
        this.startNextController();
        if (this.processing) {
            this.dialog.showModal();
        }
    }
    startNextController() {
        if (this.processing)
            return;
        const controller = this.controllers.shift();
        if (controller) {
            this.processing = true;
            controller.start(error => {
                if (error) {
                    Array.from(this.element.querySelectorAll("input[type=file]"))
                        .forEach((e) => e.disabled = false);
                }
                this.processing = false;
                this.startNextController();
            });
        }
        else {
            this.submitForm();
        }
    }
    submitForm() {
        if (this.submitted) {
            Array.from(this.element.querySelectorAll("input[type=file]"))
                .forEach((e) => e.disabled = true);
            window.setTimeout(() => {
                this.element.submit();
            }, 10);
        }
    }
    init(event) {
        const { id, file, controller } = event.detail;
        this.progressContainerTarget.insertAdjacentHTML("beforebegin", `
      <progress-bar id="direct-upload-${id}" class="direct-upload--pending">${file.name}</progress-bar>
    `);
        const progressTarget = document.getElementById(`direct-upload-${id}`);
        this.progressTargetMap[id] = progressTarget;
        this.controllers.push(controller);
        this.startNextController();
    }
    start(event) {
        this.progressTargetMap[event.detail.id].classList.remove("direct-upload--pending");
    }
    progress(event) {
        const { id, progress } = event.detail;
        this.progressTargetMap[id].percent = progress;
    }
    error(event) {
        event.preventDefault();
        const { id, error } = event.detail;
        const target = this.progressTargetMap[id];
        target.classList.add("direct-upload--error");
        target.title = error;
    }
    end(event) {
        this.progressTargetMap[event.detail.id].classList.add("direct-upload--complete");
    }
    removeUploadedFile(event) {
        const uploadedFile = event.detail;
        const id = uploadedFile.controller?.directUpload?.id;
        if (id) {
            document.getElementById(`direct-upload-${id}`).remove();
            delete this.progressTargetMap[id];
        }
    }
}

const bardFileCss = ":host{display:block;padding:25px;color:var(--bard-file-text-color, #000);font-size:13px}:host *{box-sizing:border-box;position:relative}drag-and-drop{display:block;outline-offset:-10px;background:rgba(255,255,255, 0.25);margin:0;text-align:center;transition:all 0.15s;outline:2px dashed rgba(0,0,0,0.25);color:#444;font-size:14px}p{padding:10px 20px;margin:0}drag-and-drop.-full{width:100%}.-dragover{background:rgba(255,255,255,0.5);outline:2px dashed rgba(0,0,0,0.25)}.media-preview{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center}// UPLOADER .direct-upload-wrapper{position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:rgba(#333, 0.9)}.direct-upload-content{display:block;background:#fcfcfc;padding:40px 60px 60px;border-radius:3px;width:60vw}.direct-upload-content h3{border-bottom:2px solid #1f1f1f;margin-bottom:20px}.separate-upload{padding:0 10px;margin-top:10px;font-size:0.9em}.direct-upload--pending{opacity:0.6}.direct-upload--complete{opacity:0.4}.direct-upload--error{border-color:red}input[type=file][data-direct-upload-url][disabled]{display:none}:host.separate-upload{padding:0 10px;margin-top:10px;font-size:0.9em}";

const BardFile$1 = /*@__PURE__*/ proxyCustomElement(class BardFile extends H {
    get el() { return this; }
    forceUpdate() { this._forceUpdate = !this._forceUpdate; }
    fileTargetId;
    fileTarget;
    hiddenTargetId;
    hiddenTarget;
    _files = [];
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.name = undefined;
        this.directupload = undefined;
        this.multiple = false;
        this.required = false;
        this.accepts = undefined;
        this.max = undefined;
        this.preview = true;
        this._forceUpdate = false;
        this.fileTargetId = this.el.id;
        this.fileTarget = html(`<input id="${this.fileTargetId}">`);
        this.hiddenTargetId = `hidden-target-${this.el.getAttribute("name")}`;
        this.hiddenTarget = html(`<input id="${this.hiddenTargetId}">`);
    }
    componentWillLoad() {
        this.el.removeAttribute("id");
        FormController.instance(this.el.closest("form"));
        const existingFiles = Array.from(this.el.children).filter(e => e.tagName == "UPLOADED-FILE");
        if (existingFiles.length > 0)
            this.files = existingFiles;
    }
    // Methods
    get files() {
        return this._files;
    }
    set files(val) {
        this._files = val;
        if (!this.multiple)
            this._files = this._files.slice(-1);
        this.forceUpdate();
        this.fireChangeEvent();
    }
    get value() {
        return this.files.map(e => e.value);
    }
    set value(val) {
        const newValue = val || [];
        if (JSON.stringify(this.value) !== JSON.stringify(newValue)) { // this is insane. javascript is fucking garbage.
            this.files = newValue.map(signedId => Object.assign(new UploadedFile$1(), {
                name: this.name,
                preview: this.preview,
                signedId,
            }));
        }
    }
    fileTargetChanged(event) {
        if (event.target !== this.fileTarget)
            return;
        this.files.push(...Array.from(this.fileTarget.files).map(file => Object.assign(new UploadedFile$1(), {
            name: this.name,
            preview: this.preview,
            url: this.directupload,
            accepts: this.accepts,
            max: this.max,
            file,
        })));
        this.files = this.files;
        this.fileTarget.value = null;
    }
    removeUploadedFile(event) {
        arrayRemove(this.files, event.detail);
        this.files = this.files;
    }
    fireChangeEvent() {
        requestAnimationFrame(() => this.el.dispatchEvent(new Event("change", { bubbles: true })));
    }
    // Rendering
    render() {
        return (h(Host, null, h("file-drop", { for: this.fileTargetId }, h("p", { part: "title" }, h("strong", null, "Choose ", this.multiple ? "files" : "file", " "), h("span", null, "or drag ", this.multiple ? "them" : "it", " here.")), h("div", { class: `media-preview ${this.multiple ? '-stacked' : ''}` }, h("slot", null)))));
    }
    componentDidRender() {
        morphdom(this.fileTarget, `
      <input id="${this.fileTargetId}"
        type="file"
        ${this.multiple ? "multiple" : ""}
        ${this.required && this.files.length === 0 ? "required" : ""}
        style="opacity: 0.01; width: 1px; height: 1px; z-index: -999"
      >`);
        morphdom(this.hiddenTarget, `
      <input id="${this.hiddenTargetId}"
        type="hidden"
        name="${this.name}"
        ${this.files.length > 0 ? "disabled" : ""}
      >`);
        const wrapper = document.createElement("div");
        wrapper.replaceChildren(this.fileTarget, this.hiddenTarget, ...this.files);
        morphdom(this.el, wrapper, { childrenOnly: true });
    }
    // Validations
    checkValidity() {
        return this.fileTarget.checkValidity();
    }
    setCustomValidity(msg) {
        this.fileTarget.setCustomValidity(msg);
    }
    reportValidity() {
        this.fileTarget.reportValidity();
    }
    get validationMessage() {
        return this.fileTarget.validationMessage;
    }
    static get style() { return bardFileCss; }
}, [1, "bard-file", {
        "name": [1],
        "directupload": [1],
        "multiple": [4],
        "required": [4],
        "accepts": [1],
        "max": [2],
        "preview": [4],
        "_forceUpdate": [32]
    }, [[0, "change", "fileTargetChanged"], [0, "uploaded-file:remove", "removeUploadedFile"], [0, "direct-upload:end", "fireChangeEvent"]]]);

const BardFile = BardFile$1;

const FileDrop = FileDrop$1;

const FilePreview = FilePreview$1;

const ProgressBar = ProgressBar$1;

const UploadedFile = UploadedFile$1;

const defineCustomElements = (opts) => {
    if (typeof customElements !== 'undefined') {
        [
            BardFile,
            FileDrop,
            FilePreview,
            ProgressBar,
            UploadedFile,
        ].forEach(cmp => {
            if (!customElements.get(cmp.is)) {
                customElements.define(cmp.is, cmp, opts);
            }
        });
    }
};

defineCustomElements();
