"use strict";(()=>{var _=globalThis,N=_.ShadowRoot&&(_.ShadyCSS===void 0||_.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),o1=new WeakMap,k=class{constructor(C,H,V){if(this._$cssResult$=!0,V!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=C,this.t=H}get styleSheet(){let C=this.o,H=this.t;if(N&&C===void 0){let V=H!==void 0&&H.length===1;V&&(C=o1.get(H)),C===void 0&&((this.o=C=new CSSStyleSheet).replaceSync(this.cssText),V&&o1.set(H,C))}return C}toString(){return this.cssText}},a1=M=>new k(typeof M=="string"?M:M+"",void 0,G),Q=(M,...C)=>{let H=M.length===1?M[0]:C.reduce((V,L,r)=>V+(e=>{if(e._$cssResult$===!0)return e.cssText;if(typeof e=="number")return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(L)+M[r+1],M[0]);return new k(H,M,G)},d1=(M,C)=>{if(N)M.adoptedStyleSheets=C.map(H=>H instanceof CSSStyleSheet?H:H.styleSheet);else for(let H of C){let V=document.createElement("style"),L=_.litNonce;L!==void 0&&V.setAttribute("nonce",L),V.textContent=H.cssText,M.appendChild(V)}},z=N?M=>M:M=>M instanceof CSSStyleSheet?(C=>{let H="";for(let V of C.cssRules)H+=V.cssText;return a1(H)})(M):M;var{is:X1,defineProperty:Y1,getOwnPropertyDescriptor:J1,getOwnPropertyNames:C2,getOwnPropertySymbols:H2,getPrototypeOf:V2}=Object,W=globalThis,p1=W.trustedTypes,L2=p1?p1.emptyScript:"",M2=W.reactiveElementPolyfillSupport,B=(M,C)=>M,K={toAttribute(M,C){switch(C){case Boolean:M=M?L2:null;break;case Object:case Array:M=M==null?M:JSON.stringify(M)}return M},fromAttribute(M,C){let H=M;switch(C){case Boolean:H=M!==null;break;case Number:H=M===null?null:Number(M);break;case Object:case Array:try{H=JSON.parse(M)}catch{H=null}}return H}},v1=(M,C)=>!X1(M,C),m1={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:v1};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(C){this._$Ei(),(this.l??=[]).push(C)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(C,H=m1){if(H.state&&(H.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(C)&&((H=Object.create(H)).wrapped=!0),this.elementProperties.set(C,H),!H.noAccessor){let V=Symbol(),L=this.getPropertyDescriptor(C,V,H);L!==void 0&&Y1(this.prototype,C,L)}}static getPropertyDescriptor(C,H,V){let{get:L,set:r}=J1(this.prototype,C)??{get(){return this[H]},set(e){this[H]=e}};return{get:L,set(e){let i=L?.call(this);r?.call(this,e),this.requestUpdate(C,i,V)},configurable:!0,enumerable:!0}}static getPropertyOptions(C){return this.elementProperties.get(C)??m1}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let C=V2(this);C.finalize(),C.l!==void 0&&(this.l=[...C.l]),this.elementProperties=new Map(C.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let H=this.properties,V=[...C2(H),...H2(H)];for(let L of V)this.createProperty(L,H[L])}let C=this[Symbol.metadata];if(C!==null){let H=litPropertyMetadata.get(C);if(H!==void 0)for(let[V,L]of H)this.elementProperties.set(V,L)}this._$Eh=new Map;for(let[H,V]of this.elementProperties){let L=this._$Eu(H,V);L!==void 0&&this._$Eh.set(L,H)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(C){let H=[];if(Array.isArray(C)){let V=new Set(C.flat(1/0).reverse());for(let L of V)H.unshift(z(L))}else C!==void 0&&H.push(z(C));return H}static _$Eu(C,H){let V=H.attribute;return V===!1?void 0:typeof V=="string"?V:typeof C=="string"?C.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(C=>this.enableUpdating=C),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(C=>C(this))}addController(C){(this._$EO??=new Set).add(C),this.renderRoot!==void 0&&this.isConnected&&C.hostConnected?.()}removeController(C){this._$EO?.delete(C)}_$E_(){let C=new Map,H=this.constructor.elementProperties;for(let V of H.keys())this.hasOwnProperty(V)&&(C.set(V,this[V]),delete this[V]);C.size>0&&(this._$Ep=C)}createRenderRoot(){let C=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d1(C,this.constructor.elementStyles),C}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(C=>C.hostConnected?.())}enableUpdating(C){}disconnectedCallback(){this._$EO?.forEach(C=>C.hostDisconnected?.())}attributeChangedCallback(C,H,V){this._$AK(C,V)}_$ET(C,H){let V=this.constructor.elementProperties.get(C),L=this.constructor._$Eu(C,V);if(L!==void 0&&V.reflect===!0){let r=(V.converter?.toAttribute!==void 0?V.converter:K).toAttribute(H,V.type);this._$Em=C,r==null?this.removeAttribute(L):this.setAttribute(L,r),this._$Em=null}}_$AK(C,H){let V=this.constructor,L=V._$Eh.get(C);if(L!==void 0&&this._$Em!==L){let r=V.getPropertyOptions(L),e=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:K;this._$Em=L;let i=e.fromAttribute(H,r.type);this[L]=i??this._$Ej?.get(L)??i,this._$Em=null}}requestUpdate(C,H,V,L=!1,r){if(C!==void 0){let e=this.constructor;if(L===!1&&(r=this[C]),V??=e.getPropertyOptions(C),!((V.hasChanged??v1)(r,H)||V.useDefault&&V.reflect&&r===this._$Ej?.get(C)&&!this.hasAttribute(e._$Eu(C,V))))return;this.C(C,H,V)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(C,H,{useDefault:V,reflect:L,wrapped:r},e){V&&!(this._$Ej??=new Map).has(C)&&(this._$Ej.set(C,e??H??this[C]),r!==!0||e!==void 0)||(this._$AL.has(C)||(this.hasUpdated||V||(H=void 0),this._$AL.set(C,H)),L===!0&&this._$Em!==C&&(this._$Eq??=new Set).add(C))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(H){Promise.reject(H)}let C=this.scheduleUpdate();return C!=null&&await C,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[L,r]of this._$Ep)this[L]=r;this._$Ep=void 0}let V=this.constructor.elementProperties;if(V.size>0)for(let[L,r]of V){let{wrapped:e}=r,i=this[L];e!==!0||this._$AL.has(L)||i===void 0||this.C(L,void 0,r,i)}}let C=!1,H=this._$AL;try{C=this.shouldUpdate(H),C?(this.willUpdate(H),this._$EO?.forEach(V=>V.hostUpdate?.()),this.update(H)):this._$EM()}catch(V){throw C=!1,this._$EM(),V}C&&this._$AE(H)}willUpdate(C){}_$AE(C){this._$EO?.forEach(H=>H.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(C)),this.updated(C)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(C){return!0}update(C){this._$Eq&&=this._$Eq.forEach(H=>this._$ET(H,this[H])),this._$EM()}updated(C){}firstUpdated(C){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[B("elementProperties")]=new Map,x[B("finalized")]=new Map,M2?.({ReactiveElement:x}),(W.reactiveElementVersions??=[]).push("2.1.2");var H1=globalThis,x1=M=>M,I=H1.trustedTypes,n1=I?I.createPolicy("lit-html",{createHTML:M=>M}):void 0,c1="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,h1="?"+l,r2=`<${h1}>`,s=document,y=()=>s.createComment(""),w=M=>M===null||typeof M!="object"&&typeof M!="function",V1=Array.isArray,e2=M=>V1(M)||typeof M?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,l1=/-->/g,Z1=/>/g,S=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),S1=/'/g,u1=/"/g,O1=/^(?:script|style|textarea|title)$/i,L1=M=>(C,...H)=>({_$litType$:M,strings:C,values:H}),d=L1(1),g1=L1(2),k2=L1(3),c=Symbol.for("lit-noChange"),a=Symbol.for("lit-nothing"),s1=new WeakMap,u=s.createTreeWalker(s,129);function f1(M,C){if(!V1(M)||!M.hasOwnProperty("raw"))throw Error("invalid template strings array");return n1!==void 0?n1.createHTML(C):C}var t2=(M,C)=>{let H=M.length-1,V=[],L,r=C===2?"<svg>":C===3?"<math>":"",e=P;for(let i=0;i<H;i++){let t=M[i],o,p,A=-1,m=0;for(;m<t.length&&(e.lastIndex=m,p=e.exec(t),p!==null);)m=e.lastIndex,e===P?p[1]==="!--"?e=l1:p[1]!==void 0?e=Z1:p[2]!==void 0?(O1.test(p[2])&&(L=RegExp("</"+p[2],"g")),e=S):p[3]!==void 0&&(e=S):e===S?p[0]===">"?(e=L??P,A=-1):p[1]===void 0?A=-2:(A=e.lastIndex-p[2].length,o=p[1],e=p[3]===void 0?S:p[3]==='"'?u1:S1):e===u1||e===S1?e=S:e===l1||e===Z1?e=P:(e=S,L=void 0);let n=e===S&&M[i+1].startsWith("/>")?" ":"";r+=e===P?t+r2:A>=0?(V.push(o),t.slice(0,A)+c1+t.slice(A)+l+n):t+l+(A===-2?i:n)}return[f1(M,r+(M[H]||"<?>")+(C===2?"</svg>":C===3?"</math>":"")),V]},b=class M{constructor({strings:C,_$litType$:H},V){let L;this.parts=[];let r=0,e=0,i=C.length-1,t=this.parts,[o,p]=t2(C,H);if(this.el=M.createElement(o,V),u.currentNode=this.el.content,H===2||H===3){let A=this.el.content.firstChild;A.replaceWith(...A.childNodes)}for(;(L=u.nextNode())!==null&&t.length<i;){if(L.nodeType===1){if(L.hasAttributes())for(let A of L.getAttributeNames())if(A.endsWith(c1)){let m=p[e++],n=L.getAttribute(A).split(l),E=/([.?@])?(.*)/.exec(m);t.push({type:1,index:r,name:E[2],strings:n,ctor:E[1]==="."?X:E[1]==="?"?Y:E[1]==="@"?J:g}),L.removeAttribute(A)}else A.startsWith(l)&&(t.push({type:6,index:r}),L.removeAttribute(A));if(O1.test(L.tagName)){let A=L.textContent.split(l),m=A.length-1;if(m>0){L.textContent=I?I.emptyScript:"";for(let n=0;n<m;n++)L.append(A[n],y()),u.nextNode(),t.push({type:2,index:++r});L.append(A[m],y())}}}else if(L.nodeType===8)if(L.data===h1)t.push({type:2,index:r});else{let A=-1;for(;(A=L.data.indexOf(l,A+1))!==-1;)t.push({type:7,index:r}),A+=l.length-1}r++}}static createElement(C,H){let V=s.createElement("template");return V.innerHTML=C,V}};function O(M,C,H=M,V){if(C===c)return C;let L=V!==void 0?H._$Co?.[V]:H._$Cl,r=w(C)?void 0:C._$litDirective$;return L?.constructor!==r&&(L?._$AO?.(!1),r===void 0?L=void 0:(L=new r(M),L._$AT(M,H,V)),V!==void 0?(H._$Co??=[])[V]=L:H._$Cl=L),L!==void 0&&(C=O(M,L._$AS(M,C.values),L,V)),C}var j=class{constructor(C,H){this._$AV=[],this._$AN=void 0,this._$AD=C,this._$AM=H}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(C){let{el:{content:H},parts:V}=this._$AD,L=(C?.creationScope??s).importNode(H,!0);u.currentNode=L;let r=u.nextNode(),e=0,i=0,t=V[0];for(;t!==void 0;){if(e===t.index){let o;t.type===2?o=new T(r,r.nextSibling,this,C):t.type===1?o=new t.ctor(r,t.name,t.strings,this,C):t.type===6&&(o=new C1(r,this,C)),this._$AV.push(o),t=V[++i]}e!==t?.index&&(r=u.nextNode(),e++)}return u.currentNode=s,L}p(C){let H=0;for(let V of this._$AV)V!==void 0&&(V.strings!==void 0?(V._$AI(C,V,H),H+=V.strings.length-2):V._$AI(C[H])),H++}},T=class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(C,H,V,L){this.type=2,this._$AH=a,this._$AN=void 0,this._$AA=C,this._$AB=H,this._$AM=V,this.options=L,this._$Cv=L?.isConnected??!0}get parentNode(){let C=this._$AA.parentNode,H=this._$AM;return H!==void 0&&C?.nodeType===11&&(C=H.parentNode),C}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(C,H=this){C=O(this,C,H),w(C)?C===a||C==null||C===""?(this._$AH!==a&&this._$AR(),this._$AH=a):C!==this._$AH&&C!==c&&this._(C):C._$litType$!==void 0?this.$(C):C.nodeType!==void 0?this.T(C):e2(C)?this.k(C):this._(C)}O(C){return this._$AA.parentNode.insertBefore(C,this._$AB)}T(C){this._$AH!==C&&(this._$AR(),this._$AH=this.O(C))}_(C){this._$AH!==a&&w(this._$AH)?this._$AA.nextSibling.data=C:this.T(s.createTextNode(C)),this._$AH=C}$(C){let{values:H,_$litType$:V}=C,L=typeof V=="number"?this._$AC(C):(V.el===void 0&&(V.el=b.createElement(f1(V.h,V.h[0]),this.options)),V);if(this._$AH?._$AD===L)this._$AH.p(H);else{let r=new j(L,this),e=r.u(this.options);r.p(H),this.T(e),this._$AH=r}}_$AC(C){let H=s1.get(C.strings);return H===void 0&&s1.set(C.strings,H=new b(C)),H}k(C){V1(this._$AH)||(this._$AH=[],this._$AR());let H=this._$AH,V,L=0;for(let r of C)L===H.length?H.push(V=new M(this.O(y()),this.O(y()),this,this.options)):V=H[L],V._$AI(r),L++;L<H.length&&(this._$AR(V&&V._$AB.nextSibling,L),H.length=L)}_$AR(C=this._$AA.nextSibling,H){for(this._$AP?.(!1,!0,H);C!==this._$AB;){let V=x1(C).nextSibling;x1(C).remove(),C=V}}setConnected(C){this._$AM===void 0&&(this._$Cv=C,this._$AP?.(C))}},g=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(C,H,V,L,r){this.type=1,this._$AH=a,this._$AN=void 0,this.element=C,this.name=H,this._$AM=L,this.options=r,V.length>2||V[0]!==""||V[1]!==""?(this._$AH=Array(V.length-1).fill(new String),this.strings=V):this._$AH=a}_$AI(C,H=this,V,L){let r=this.strings,e=!1;if(r===void 0)C=O(this,C,H,0),e=!w(C)||C!==this._$AH&&C!==c,e&&(this._$AH=C);else{let i=C,t,o;for(C=r[0],t=0;t<r.length-1;t++)o=O(this,i[V+t],H,t),o===c&&(o=this._$AH[t]),e||=!w(o)||o!==this._$AH[t],o===a?C=a:C!==a&&(C+=(o??"")+r[t+1]),this._$AH[t]=o}e&&!L&&this.j(C)}j(C){C===a?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,C??"")}},X=class extends g{constructor(){super(...arguments),this.type=3}j(C){this.element[this.name]=C===a?void 0:C}},Y=class extends g{constructor(){super(...arguments),this.type=4}j(C){this.element.toggleAttribute(this.name,!!C&&C!==a)}},J=class extends g{constructor(C,H,V,L,r){super(C,H,V,L,r),this.type=5}_$AI(C,H=this){if((C=O(this,C,H,0)??a)===c)return;let V=this._$AH,L=C===a&&V!==a||C.capture!==V.capture||C.once!==V.once||C.passive!==V.passive,r=C!==a&&(V===a||L);L&&this.element.removeEventListener(this.name,this,V),r&&this.element.addEventListener(this.name,this,C),this._$AH=C}handleEvent(C){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,C):this._$AH.handleEvent(C)}},C1=class{constructor(C,H,V){this.element=C,this.type=6,this._$AN=void 0,this._$AM=H,this.options=V}get _$AU(){return this._$AM._$AU}_$AI(C){O(this,C)}};var i2=H1.litHtmlPolyfillSupport;i2?.(b,T),(H1.litHtmlVersions??=[]).push("3.3.3");var k1=(M,C,H)=>{let V=H?.renderBefore??C,L=V._$litPart$;if(L===void 0){let r=H?.renderBefore??null;V._$litPart$=L=new T(C.insertBefore(y(),r),r,void 0,H??{})}return L._$AI(M),L};var M1=globalThis,v=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let C=super.createRenderRoot();return this.renderOptions.renderBefore??=C.firstChild,C}update(C){let H=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(C),this._$Do=k1(H,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return c}};v._$litElement$=!0,v.finalized=!0,M1.litElementHydrateSupport?.({LitElement:v});var A2=M1.litElementPolyfillSupport;A2?.({LitElement:v});(M1.litElementVersions??=[]).push("4.2.2");var B1="M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z";var P1="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";var y1="M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z";var w1="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var b1="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.5L20.5 19L15.5 14M9.5 14C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14M10.91 11.62L9.5 10.21L8.09 11.62L7.38 10.91L8.79 9.5L7.38 8.09L8.09 7.38L9.5 8.79L10.91 7.38L11.62 8.09L10.21 9.5L11.62 10.91L10.91 11.62Z";var T1="M16,9H13V14.5A2.5,2.5 0 0,1 10.5,17A2.5,2.5 0 0,1 8,14.5A2.5,2.5 0 0,1 10.5,12C11.07,12 11.58,12.19 12,12.5V7H16M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z";var F1="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z";var R1="M8,5.14V19.14L19,12.14L8,5.14Z";var D1="M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z";var E1="M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z";var _1="M20,6A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8C2,7.15 2.53,6.42 3.28,6.13L15.71,1L16.47,2.83L8.83,6H20M20,8H4V12H16V10H18V12H20V8M7,14A3,3 0 0,0 4,17A3,3 0 0,0 7,20A3,3 0 0,0 10,17A3,3 0 0,0 7,14Z";function r1(M,C="icon"){return d`<svg class=${C} viewBox="0 0 24 24" aria-hidden="true">${g1`<path d=${M}></path>`}</svg>`}var o2=new Set(["unavailable","unknown"]);function N1(M){return!M||o2.has(M.state)}function W1(M){let C=window;C.customCards=C.customCards||[],C.customCards.some(H=>H.type===M.type)||C.customCards.push({preview:!0,documentationURL:void 0,...M})}function a2(M){return(M?.locale?.language||M?.language||globalThis.navigator?.language||"en").toLowerCase()}function f(M,C){let H=a2(C),V=M[H]||M[H.split("-")[0]]||M.en;return(L,r={})=>(V[L]??M.en[L]??L).replace(/\{(\w+)\}/g,(i,t)=>String(r[t]??""))}var I1=["radio","artist","album","track","playlist","podcast","audiobook","other"],d2=new Set(["artist","album","track","playlist","podcast","audiobook"]),p2=/\/(radio|artist|album|track|playlist|podcast|audiobook)\//;function m2(M,C){let H=typeof M=="string"?M.toLowerCase():"";return d2.has(H)?H:H==="radio"?"radio":(typeof C=="string"?p2.exec(C):null)?.[1]??"other"}function v2(M){let C=M.indexOf(" - ");return C<=0||C+3>=M.length?{title:M}:{artist:M.slice(0,C).trim(),title:M.slice(C+3).trim()}}var x2=["track","album","artist","playlist"];function U1(M){return M==="sonos"?x2:void 0}function n2(M){let C=/^A:ALBUM\/[^/]*\/(.+)$/.exec(M);if(C)try{return decodeURIComponent(C[1]).trim()||void 0}catch{return}}function l2(M){return M.replace(/\.(m3u8?|pls|wpl|xspf)$/i,"").trim()||M}function $1(M){if(!Array.isArray(M))return[];let C=[],H=new Set;for(let V of M){if(!V||typeof V!="object")continue;let L=V,r=typeof L.media_content_id=="string"?L.media_content_id:"",e=typeof L.title=="string"?L.title.trim():"";if(!r||!e||H.has(r))continue;H.add(r);let i=m2(L.media_class,r),t=i==="track"||i==="album"?v2(e):i==="playlist"?{title:l2(e)}:{title:e},o=t.artist??(i==="album"?n2(r):void 0);C.push({contentId:r,contentType:typeof L.media_content_type=="string"&&L.media_content_type?L.media_content_type:"music",kind:i,title:t.title,artist:o,thumbnail:typeof L.thumbnail=="string"&&L.thumbnail?L.thumbnail:void 0,canPlay:L.can_play!==!1})}return C}function G1(M,C){return I1.filter(H=>!C||H===C).map(H=>({kind:H,items:M.filter(V=>V.kind===H)})).filter(H=>H.items.length>0)}function Q1(M){return I1.filter(C=>M.some(H=>H.kind===C))}function e1(M){return M.trim().replace(/\s+/g," ")}var U=class{constructor(C=30){this.max=C;this.map=new Map}get(C){let H=C.toLowerCase(),V=this.map.get(H);return V!==void 0&&(this.map.delete(H),this.map.set(H,V)),V}set(C,H){let V=C.toLowerCase();this.map.delete(V),this.map.set(V,H),this.map.size>this.max&&this.map.delete(this.map.keys().next().value)}clear(){this.map.clear()}},t1=4194304;function i1(M){let C=Number(M?.supported_features??0);return Number.isFinite(C)&&(C&t1)!==0}var z1=["replace","play","next","add"];var Z={fr:{"card.name":"Recherche de m\xE9dias","card.description":"Champ de recherche avec r\xE9sultats en direct : un appui lance la lecture sur le lecteur choisi.","search.placeholder":"Artiste, titre, album, radio, podcast\u2026","search.label":"Rechercher un m\xE9dia","search.hint":"Tapez au moins {n} lettres pour lancer la recherche.","search.loading":"Chargement","search.empty.title":"Aucun r\xE9sultat","search.empty.description":"Essayez un autre nom ou v\xE9rifiez l\u2019orthographe.","search.error":"La recherche a \xE9chou\xE9. R\xE9essayez dans un instant.","search.unsupported":"Ce lecteur ne g\xE8re pas la recherche de m\xE9dias.","search.unavailable":"Le lecteur est indisponible.","search.count":"{count} r\xE9sultats","search.count_one":"1 r\xE9sultat","filter.all":"Tout","play.failed":"Impossible de lancer la lecture.","action.play":"Lire {title}","kind.radio":"Radio","kind.artist":"Artiste","kind.album":"Album","kind.track":"Titre","kind.playlist":"Playlist","kind.podcast":"Podcast","kind.audiobook":"Livre audio","kind.other":"M\xE9dia","kinds.radio":"Radios","kinds.artist":"Artistes","kinds.album":"Albums","kinds.track":"Titres","kinds.playlist":"Playlists","kinds.podcast":"Podcasts","kinds.audiobook":"Livres audio","kinds.other":"Autres","error.entity":"Choisissez une entit\xE9 media_player","editor.entity":"Lecteur","editor.placeholder":"Texte du champ","editor.enqueue":"Au toucher","editor.enqueue.replace":"Remplacer la file et lire","editor.enqueue.play":"Lire maintenant (garde la file)","editor.enqueue.next":"Lire ensuite","editor.enqueue.add":"Ajouter \xE0 la file","editor.min_chars":"Lettres minimum","editor.max_height":"Hauteur max. de la liste (px)","editor.show_filters":"Afficher les filtres par type","editor.autofocus":"Placer le curseur dans le champ \xE0 l\u2019affichage"},en:{"card.name":"Media search","card.description":"Search box with live results: one tap starts playback on the chosen player.","search.placeholder":"Artist, track, album, radio, podcast\u2026","search.label":"Search media","search.hint":"Type at least {n} letters to search.","search.loading":"Loading","search.empty.title":"No results found","search.empty.description":"Try another name or check the spelling.","search.error":"The search failed. Try again in a moment.","search.unsupported":"This player does not support media search.","search.unavailable":"The player is unavailable.","search.count":"{count} results","search.count_one":"1 result","filter.all":"All","play.failed":"Could not start playback.","action.play":"Play {title}","kind.radio":"Radio","kind.artist":"Artist","kind.album":"Album","kind.track":"Track","kind.playlist":"Playlist","kind.podcast":"Podcast","kind.audiobook":"Audiobook","kind.other":"Media","kinds.radio":"Radio stations","kinds.artist":"Artists","kinds.album":"Albums","kinds.track":"Tracks","kinds.playlist":"Playlists","kinds.podcast":"Podcasts","kinds.audiobook":"Audiobooks","kinds.other":"Other","error.entity":"Choose a media_player entity","editor.entity":"Player","editor.placeholder":"Field placeholder","editor.enqueue":"On tap","editor.enqueue.replace":"Replace queue and play","editor.enqueue.play":"Play now (keep queue)","editor.enqueue.next":"Play next","editor.enqueue.add":"Add to queue","editor.min_chars":"Minimum letters","editor.max_height":"List max height (px)","editor.show_filters":"Show type filters","editor.autofocus":"Focus the field when shown"}};var Z2="search-media-library",h="search-media-library",F=`${h}-editor`,A1=h!==Z2,K1=A1?"Search media library (dev)":"Search media library",q1="0.4.0";var j1={enqueue:"replace",min_chars:2,max_height:360,show_filters:!0,autofocus:!1};function S2(M){return[{name:"entity",required:!0,selector:{entity:{domain:"media_player",supported_features:[t1]}}},{name:"placeholder",selector:{text:{}}},{name:"enqueue",selector:{select:{mode:"dropdown",options:z1.map(C=>({value:C,label:M(`editor.enqueue.${C}`)}))}}},{name:"show_filters",selector:{boolean:{}}},{name:"autofocus",selector:{boolean:{}}},{name:"min_chars",selector:{number:{min:1,max:5,step:1,mode:"box"}}},{name:"max_height",selector:{number:{min:120,max:900,step:20,mode:"box",unit_of_measurement:"px"}}}]}var $=class extends v{setConfig(C){this._config=C}render(){if(!this.hass||!this._config)return a;let C=f(Z,this.hass);return d`<ha-form
      .hass=${this.hass}
      .data=${{...j1,...this._config}}
      .schema=${S2(C)}
      .computeLabel=${H=>C(`editor.${H.name}`)}
      @value-changed=${this.valueChanged}
    ></ha-form>`}valueChanged(C){C.stopPropagation();let H={...C.detail.value};for(let[V,L]of Object.entries(j1))H[V]===L&&delete H[V];for(let[V,L]of Object.entries(H))(L===""||L===void 0)&&delete H[V];this._config=H,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};$.properties={hass:{attribute:!1},_config:{state:!0}};customElements.get(F)||customElements.define(F,$);var R={enqueue:"replace",min_chars:2,debounce:350,max_height:360,show_filters:!0,autofocus:!1},u2={radio:_1,artist:B1,album:P1,track:F1,playlist:D1,podcast:E1,audiobook:y1,other:T1},s2=1800,c2=500,D=class extends v{constructor(){super();this.seq=0;this.cache=new U;this.onInput=H=>{this._query=H.target.value??"",this.schedule()};this.onKeydown=H=>{if(H.key==="Escape"&&this._query)H.preventDefault(),H.stopPropagation(),this.resetSearch();else if(H.key==="Enter"){let V=e1(this._query);this._config&&V.length>=this._config.min_chars&&this._status==="loading"&&(window.clearTimeout(this.timer),this.search(V,this.seq))}};this._query="",this._status="idle",this._items=[],this._filter=null,this._spinner=!1}setConfig(H){if(!H||typeof H.entity!="string"||!H.entity.startsWith("media_player."))throw new Error(f(Z,this.hass)("error.entity"));let V={...R,...H},L=(r,e,i)=>Number.isFinite(Number(r))&&Number(r)>=i?Number(r):e;V.min_chars=Math.floor(L(V.min_chars,R.min_chars,1)),V.debounce=L(V.debounce,R.debounce,0),V.max_height=L(V.max_height,R.max_height,120),["play","replace","next","add"].includes(V.enqueue)||(V.enqueue=R.enqueue),this._config&&this._config.entity!==V.entity&&this.resetSearch(),this._config=V}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}static getConfigElement(){return document.createElement(F)}static getStubConfig(H){let V=H?.states??{};return{entity:Object.keys(V).find(r=>r.startsWith("media_player.")&&i1(V[r].attributes))??"media_player."}}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this.timer),window.clearTimeout(this.flashTimer),window.clearTimeout(this.spinnerTimer),this.seq++}firstUpdated(){this._config?.autofocus&&this.focusField()}willUpdate(H){H.has("_config")&&this._config&&this.cachePlayer!==this._config.entity&&(this.cache.clear(),this.cachePlayer=this._config.entity)}get field(){return this.renderRoot.querySelector("ha-input-search")}async focusField(){await customElements.whenDefined("ha-input-search"),this.field?.focus()}get player(){return this._config?this.hass?.states?.[this._config.entity]:void 0}stopSpinner(){window.clearTimeout(this.spinnerTimer),this._spinner=!1}schedule(){let H=this._config;if(!H)return;window.clearTimeout(this.timer);let V=++this.seq,L=e1(this._query);if(this._filter=null,L.length<H.min_chars){this.stopSpinner(),this._status="idle",this._items=[];return}let r=this.cache.get(L);if(r){this.stopSpinner(),this._items=r,this._status="done";return}this._status="loading",this._spinner||(window.clearTimeout(this.spinnerTimer),this.spinnerTimer=window.setTimeout(()=>{this._status==="loading"&&(this._spinner=!0)},c2)),this.timer=window.setTimeout(()=>{this.search(L,V)},H.debounce)}async search(H,V){let L=this._config?.entity;if(!L||!this.hass?.callWS)return;let r=this.hass,e=async i=>{let o=(await r.callWS({type:"call_service",domain:"media_player",service:"search_media",target:{entity_id:L},service_data:{search_query:H,...i?{media_content_type:i}:{}},return_response:!0}))?.response?.[L]?.result;return Array.isArray(o)?o:[]};try{let i=U1(r.entities?.[L]?.platform),t;if(i){let p=await Promise.allSettled(i.map(m=>e(m))),A=p.filter(m=>m.status==="fulfilled");if(!A.length)throw p[0].reason;t=A.flatMap(m=>m.value)}else t=await e();if(V!==this.seq)return;let o=$1(t);this.cache.set(H,o),this._items=o,this._status="done"}catch(i){if(V!==this.seq)return;console.warn("[search-media-library] recherche \xE9chou\xE9e",i),this._items=[],this._status="error"}finally{V===this.seq&&this.stopSpinner()}}resetSearch(){window.clearTimeout(this.timer),this.seq++,this.stopSpinner(),this._query="",this._items=[],this._status="idle",this._filter=null,this.field&&(this.field.value="")}async play(H){if(!(!this._config||!this.hass?.callService))try{await this.hass.callService("media_player","play_media",{entity_id:this._config.entity,media_content_id:H.contentId,media_content_type:H.contentType,enqueue:this._config.enqueue}),this._flash=H.contentId,window.clearTimeout(this.flashTimer),this.flashTimer=window.setTimeout(()=>this._flash=void 0,s2)}catch(V){console.warn("[search-media-library] lecture \xE9chou\xE9e",V),this.dispatchEvent(new CustomEvent("hass-notification",{bubbles:!0,composed:!0,detail:{message:f(Z,this.hass)("play.failed")}}))}}render(){let H=this._config;if(!H)return a;let V=f(Z,this.hass),L=this.player,r=!L||N1(L)?V("search.unavailable"):i1(L.attributes)?void 0:V("search.unsupported"),e=Q1(this._items),i=this._status==="idle"&&!r;return d`
      <ha-card style="--ms-max-height: ${H.max_height}px">
        <div class="head">
          <ha-input-search
            appearance="outlined"
            .value=${this._query}
            placeholder=${H.placeholder??V("search.placeholder")}
            accessible-label=${V("search.label")}
            hint=${i?V("search.hint",{n:H.min_chars}):""}
            ?disabled=${!!r}
            enterkeyhint="search"
            @input=${this.onInput}
            @keydown=${this.onKeydown}
          >
            ${this._spinner?d`<ha-spinner slot="end" size="tiny" aria-label=${V("search.loading")}></ha-spinner>`:a}
          </ha-input-search>
          ${H.show_filters&&e.length>1?this.renderFilters(e,V):a}
        </div>
        ${r?d`<div class="msg"><ha-alert alert-type="warning">${r}</ha-alert></div>`:this.renderBody(V)}
      </ha-card>
    `}renderFilters(H,V){let L=(r,e)=>d`
      <button class="chip ${this._filter===r?"on":""}" aria-pressed=${this._filter===r}
        @click=${()=>this._filter=r}>${e}</button>`;return d`<div class="chips" role="group">
      ${L(null,V("filter.all"))}${H.map(r=>L(r,V(`kinds.${r}`)))}
    </div>`}renderBody(H){if(this._status==="idle")return a;if(this._status==="loading"&&!this._items.length)return d`<div class="body"><div class="skeletons" role="progressbar" aria-label=${H("search.loading")}>
        ${[0,1,2,3].map(()=>d`<div class="sk">
          <ha-skeleton class="sk-thumb"></ha-skeleton>
          <div class="sk-text"><ha-skeleton-text></ha-skeleton-text><ha-skeleton-text class="short"></ha-skeleton-text></div>
        </div>`)}
      </div></div>`;if(this._status==="error")return d`<div class="msg"><ha-alert alert-type="error">${H("search.error")}</ha-alert></div>`;if(this._status==="done"&&!this._items.length)return d`<div class="empty">
        <svg class="empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${b1}></path></svg>
        <h2>${H("search.empty.title")}</h2>
        <p>${H("search.empty.description")}</p>
      </div>`;let V=G1(this._items,this._filter),L=V.reduce((r,e)=>r+e.items.length,0);return d`
      <div class="body" aria-live="polite">
        <p class="visually-hidden">${L===1?H("search.count_one"):H("search.count",{count:L})}</p>
        <div class="results ${this._status==="loading"?"stale":""}">
          ${V.map(r=>d`
            <section>
              <h3>${H(`kinds.${r.kind}`)}</h3>
              <ul>${r.items.map(e=>d`<li>${this.renderRow(e,H)}</li>`)}</ul>
            </section>`)}
        </div>
      </div>`}renderRow(H,V){let L=this._flash===H.contentId,r=V(`kind.${H.kind}`);return d`
      <button class="row ${L?"flash":""}" ?disabled=${!H.canPlay}
        aria-label=${V("action.play",{title:H.artist?`${H.title} \u2014 ${H.artist}`:H.title})}
        @click=${()=>{this.play(H)}}>
        ${this.renderThumb(H)}
        <span class="text">
          <span class="title">${H.title}</span>
          <span class="sub">${H.artist?`${H.artist} \xB7 ${r}`:r}</span>
        </span>
        <span class="act" aria-hidden="true">${r1(L?w1:R1)}</span>
      </button>`}renderThumb(H){let V=H.thumbnail&&H.thumbnail.startsWith("/")?this.hass?.hassUrl?.(H.thumbnail)??H.thumbnail:H.thumbnail;return d`<span class="thumb ${H.kind}">
      ${r1(u2[H.kind],"ph")}
      ${V?d`<img src=${V} alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"
        @error=${L=>L.target.style.display="none"} />`:a}
    </span>`}};D.properties={hass:{attribute:!1},_config:{state:!0},_query:{state:!0},_status:{state:!0},_items:{state:!0},_filter:{state:!0},_flash:{state:!0},_spinner:{state:!0}},D.styles=Q`
    :host { display: block; }
    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      --ms-muted: var(--secondary-text-color, #5e5e5e);
      --ms-hover: var(--ha-color-fill-neutral-quiet-hover, rgba(127, 127, 127, 0.14));
      --ms-focus: var(--ha-color-focus, var(--primary-color, #009ac7));
      --ms-speed: var(--ha-animation-duration-fast, 0.15s);
    }
    .head { padding: var(--ha-space-3, 12px) var(--ha-space-3, 12px) var(--ha-space-1, 4px); display: grid; gap: var(--ha-space-2, 8px); }
    ha-input-search { display: block; --ha-input-padding-bottom: 0; }

    /* Puces de filtre : pastille de 32 px (taille « s » des boutons de HA) */
    .chips { display: flex; gap: var(--ha-space-2, 8px); overflow-x: auto; scrollbar-width: none; padding-bottom: var(--ha-space-1, 4px); }
    .chips::-webkit-scrollbar { display: none; }
    .chip {
      all: unset;
      flex: none;
      box-sizing: border-box;
      height: 32px;
      padding: 0 var(--ha-space-3, 12px);
      display: inline-flex;
      align-items: center;
      border-radius: var(--ha-border-radius-pill, 9999px);
      border: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--primary-text-color);
      cursor: pointer;
      transition: background-color var(--ms-speed);
    }
    .chip:hover { background: var(--ms-hover); }
    .chip.on { background: var(--primary-color, #009ac7); border-color: var(--primary-color, #009ac7); color: var(--text-primary-color, #fff); }
    .chip:focus-visible { outline: var(--ha-border-width-md, 2px) solid var(--ms-focus); outline-offset: 2px; }

    .body {
      max-height: var(--ms-max-height, 360px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 0 var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      /* La zone défilante s'arrête au-dessus du bord de la carte : la dernière ligne n'est jamais coupée net. */
      margin-bottom: var(--ha-space-3, 12px);
      scrollbar-width: thin;
      scrollbar-color: rgba(127, 127, 127, 0.45) transparent;
    }
    .msg { padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-3, 12px); }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

    /* État vide : mêmes mesures que ha-empty-state (icône 64 px, titre h2, description) */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px);
      text-align: center;
    }
    .empty-icon { width: 64px; height: 64px; fill: var(--ms-muted); }
    .empty h2 {
      margin: 0;
      font-size: var(--ha-font-size-xl, 20px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
    }
    .empty p { margin: 0; color: var(--ms-muted); font-size: var(--ha-font-size-m, 14px); }

    .results { transition: opacity var(--ms-speed); }
    .results.stale { opacity: 0.5; }
    section + section { margin-top: var(--ha-space-1, 4px); }
    h3 {
      margin: 0;
      padding: var(--ha-space-3, 12px) var(--ha-space-5, 20px) var(--ha-space-1, 4px);
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--ms-muted);
    }
    ul { list-style: none; margin: 0; padding: 0; }

    /* Ligne de liste : 72 px (deux lignes + image de 56 px), marges latérales de 20 px */
    .row {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--ha-space-5, 20px);
      width: 100%;
      min-height: 72px;
      padding: var(--ha-space-2, 8px) var(--ha-space-5, 20px);
      border-radius: var(--ha-border-radius-lg, 12px);
      cursor: pointer;
      color: var(--primary-text-color);
      -webkit-tap-highlight-color: transparent;
      transition: background-color var(--ms-speed);
    }
    .row:hover { background: var(--ms-hover); }
    .row:focus-visible { outline: var(--ha-border-width-md, 2px) solid var(--ms-focus); outline-offset: -2px; }
    .row[disabled] { color: var(--disabled-text-color, #bdbdbd); cursor: default; }

    .thumb {
      position: relative;
      flex: none;
      width: 56px;
      height: 56px;
      border-radius: var(--ha-border-radius-md, 8px);
      overflow: hidden;
      display: grid;
      place-items: center;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
      color: var(--ms-muted);
    }
    .thumb.artist { border-radius: var(--ha-border-radius-circle, 50%); }
    .thumb .ph { width: 24px; height: 24px; fill: currentColor; }
    .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: var(--card-background-color, #fff); }

    .text { flex: 1; min-width: 0; display: grid; gap: var(--ha-space-1, 4px); }
    .title {
      font-size: var(--ha-font-size-l, 16px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      overflow-wrap: anywhere;
    }
    .sub {
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--ms-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Pictogramme décoratif : la ligne entière est la cible (72 px de haut) */
    .act { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: var(--ha-border-radius-circle, 50%); color: var(--primary-color, #009ac7); }
    .act svg { width: 24px; height: 24px; fill: currentColor; }
    .row.flash .act { background: var(--primary-color, #009ac7); color: var(--text-primary-color, #fff); }
    @media (hover: hover) {
      .row:not(.flash) .act { opacity: 0; transition: opacity var(--ms-speed); }
      .row:hover .act, .row:focus-visible .act { opacity: 1; }
    }

    /* Squelette : même gabarit que les lignes, fondu d'entrée de ~300 ms */
    .skeletons { padding: var(--ha-space-1, 4px) 0; animation: fade-in var(--ha-animation-duration-slow, 0.35s) ease-out; }
    .sk { display: flex; align-items: center; gap: var(--ha-space-5, 20px); min-height: 72px; padding: var(--ha-space-2, 8px) var(--ha-space-5, 20px); }
    .sk-thumb { width: 56px; height: 56px; flex: none; --ha-skeleton-border-radius: var(--ha-border-radius-md, 8px); }
    .sk-text { flex: 1; min-width: 0; display: grid; gap: var(--ha-space-2, 8px); font-size: var(--ha-font-size-m, 14px); }
    .sk-text ha-skeleton-text { --ha-skeleton-text-width: 70%; }
    .sk-text ha-skeleton-text.short { --ha-skeleton-text-width: 40%; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .skeletons { animation: none; }
      .results, .row, .chip, .row .act { transition: none; }
    }
  `;if(!customElements.get(h)){customElements.define(h,D);let M=(navigator.language||"en").slice(0,2);W1({type:h,name:K1,description:Z[M]?.["card.description"]??Z.en["card.description"]}),console.info(`%c ${h.toUpperCase()} %c ${q1} `,`background:${A1?"#b45309":"#0369a1"};color:#fff;border-radius:3px 0 0 3px`,"background:#334155;color:#fff;border-radius:0 3px 3px 0")}})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
