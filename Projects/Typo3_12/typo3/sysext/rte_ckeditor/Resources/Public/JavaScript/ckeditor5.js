/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __decorate=function(e,t,o,r){var i,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,o,r);else for(var l=e.length-1;l>=0;l--)(i=e[l])&&(s=(n<3?i(s):n>3?i(t,o,s):i(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s};import{html,LitElement}from"lit";import{customElement,property,query}from"lit/decorators.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import{prefixAndRebaseCss}from"@typo3/rte-ckeditor/css-prefixer.js";import{ClassicEditor}from"@ckeditor/ckeditor5-editor-classic";const defaultPlugins=[{module:"@ckeditor/ckeditor5-block-quote",exports:["BlockQuote"]},{module:"@ckeditor/ckeditor5-essentials",exports:["Essentials"]},{module:"@ckeditor/ckeditor5-find-and-replace",exports:["FindAndReplace"]},{module:"@ckeditor/ckeditor5-heading",exports:["Heading"]},{module:"@ckeditor/ckeditor5-indent",exports:["Indent"]},{module:"@ckeditor/ckeditor5-link",exports:["Link"]},{module:"@ckeditor/ckeditor5-list",exports:["DocumentList"]},{module:"@ckeditor/ckeditor5-paragraph",exports:["Paragraph"]},{module:"@ckeditor/ckeditor5-clipboard",exports:["PastePlainText"]},{module:"@ckeditor/ckeditor5-paste-from-office",exports:["PasteFromOffice"]},{module:"@ckeditor/ckeditor5-remove-format",exports:["RemoveFormat"]},{module:"@ckeditor/ckeditor5-table",exports:["Table","TableToolbar","TableProperties","TableCellProperties"]},{module:"@ckeditor/ckeditor5-typing",exports:["TextTransformation"]},{module:"@ckeditor/ckeditor5-source-editing",exports:["SourceEditing"]},{module:"@ckeditor/ckeditor5-alignment",exports:["Alignment"]},{module:"@ckeditor/ckeditor5-style",exports:["Style"]},{module:"@ckeditor/ckeditor5-html-support",exports:["GeneralHtmlSupport"]},{module:"@ckeditor/ckeditor5-basic-styles",exports:["Bold","Italic","Subscript","Superscript","Strikethrough","Underline"]},{module:"@ckeditor/ckeditor5-special-characters",exports:["SpecialCharacters","SpecialCharactersEssentials"]},{module:"@ckeditor/ckeditor5-horizontal-line",exports:["HorizontalLine"]}];let CKEditor5Element=class extends LitElement{constructor(){super(...arguments),this.options={},this.formEngine={},this.styleSheets=new Map}connectedCallback(){if(super.connectedCallback(),Array.isArray(this.options.contentsCss))for(const e of this.options.contentsCss)this.prefixAndLoadContentsCss(e,this.getAttribute("id"))}disconnectedCallback(){super.disconnectedCallback(),document.adoptedStyleSheets=document.adoptedStyleSheets.filter((e=>!this.styleSheets.has(e))),this.styleSheets.clear()}async firstUpdated(){if(!(this.target instanceof HTMLElement))throw new Error("No rich-text content target found.");const{importModules:e,removeImportModules:t,width:o,height:r,readOnly:i,debug:n,toolbar:s,placeholder:l,htmlSupport:d,wordCount:a,typo3link:c,removePlugins:p,...u}=this.options;"extraPlugins"in u&&delete u.extraPlugins,"contentsCss"in u&&delete u.contentsCss;const m=await this.resolvePlugins(defaultPlugins,e,t),h={...u,toolbar:s,plugins:m,placeholder:l,wordCount:a,typo3link:c||null,removePlugins:p||[]};void 0!==d&&(h.htmlSupport=convertPseudoRegExp(d)),ClassicEditor.create(this.target,h).then((e=>{if(this.applyEditableElementStyles(e,o,r),this.handleWordCountPlugin(e,a),this.applyReadOnly(e,i),e.plugins.has("SourceEditing")){const t=e.plugins.get("SourceEditing");e.model.document.on("change:data",(()=>{t.isSourceEditingMode||e.updateSourceElement(),this.target.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))}))}n&&import("@ckeditor/ckeditor5-inspector").then((({default:t})=>t.attach(e,{isCollapsed:!0})))}))}createRenderRoot(){return this}render(){return html`
      <textarea
        id="${this.formEngine.id}"
        name="${this.formEngine.name}"
        class="form-control"
        rows="18"
        data-formengine-validation-rules="${this.formEngine.validationRules}"
        >${this.formEngine.value}</textarea>
    `}async resolvePlugins(e,t,o){const r=normalizeImportModules(o||[]),i=normalizeImportModules([...e,...t||[]]).map((e=>{const{module:t}=e;let{exports:o}=e;for(const e of r)e.module===t&&(o=o.filter((t=>!e.exports.includes(t))));return{module:t,exports:o}})),n=await Promise.all(i.map((async e=>{try{return{module:await import(e.module),exports:e.exports}}catch(t){return console.error(`Failed to load CKEditor5 module ${e.module}`,t),{module:null,exports:[]}}}))),s=[];n.forEach((({module:e,exports:t})=>{for(const o of t)o in e?s.push(e[o]):console.error(`CKEditor5 plugin export "${o}" not available in`,e)}));const l=s.filter((e=>e.overrides?.length>0)).map((e=>e.overrides)).flat(1);return s.filter((e=>!l.includes(e)))}async prefixAndLoadContentsCss(e,t){let o;try{const t=await new AjaxRequest(e).get();o=await t.resolve()}catch{return}const r=prefixAndRebaseCss(o,e,`#${t} .ck-content`),i=new CSSStyleSheet;await i.replace(r),this.styleSheets.set(i,!0),document.adoptedStyleSheets=[...document.adoptedStyleSheets,i]}applyEditableElementStyles(e,t,o){const r=e.editing.view,i={"min-height":o,"min-width":t};Object.keys(i).forEach((e=>{const t=i[e];if(!t)return;let o;o="number"!=typeof t&&Number.isNaN(Number(o))?t:`${t}px`,r.change((t=>{t.setStyle(e,o,r.document.getRoot())}))}))}handleWordCountPlugin(e,t){if(e.plugins.has("WordCount")&&(t?.displayWords||t?.displayCharacters)){const t=e.plugins.get("WordCount");this.renderRoot.appendChild(t.wordCountContainer)}}applyReadOnly(e,t){t&&e.enableReadOnlyMode("typo3-lock")}};__decorate([property({type:Object})],CKEditor5Element.prototype,"options",void 0),__decorate([property({type:Object,attribute:"form-engine"})],CKEditor5Element.prototype,"formEngine",void 0),__decorate([query("textarea")],CKEditor5Element.prototype,"target",void 0),CKEditor5Element=__decorate([customElement("typo3-rte-ckeditor-ckeditor5")],CKEditor5Element);export{CKEditor5Element};function walkObj(e,t){if("object"==typeof e){if(Array.isArray(e))return e.map((e=>t(e)??walkObj(e,t)));const o={};for(const[r,i]of Object.entries(e))o[r]=t(i)??walkObj(i,t);return o}return e}function convertPseudoRegExp(e){return walkObj(e,(e=>{if("object"==typeof e&&"pattern"in e&&"string"==typeof e.pattern){const t=e;return new RegExp(t.pattern,t.flags||void 0)}return null}))}function normalizeImportModules(e){return e.map((e=>"string"==typeof e?{module:e,exports:["default"]}:e))}