import { IOptionItem } from './common.type';

/** 自定义元素类型 */
export type IMyElement = HTMLAnchorElement &
  HTMLAreaElement &
  HTMLAudioElement &
  HTMLBaseElement &
  HTMLQuoteElement &
  HTMLBodyElement &
  HTMLBRElement &
  HTMLButtonElement &
  HTMLCanvasElement &
  HTMLTableCaptionElement &
  HTMLTableColElement &
  HTMLTableColElement &
  HTMLDataElement &
  HTMLDataListElement &
  HTMLModElement &
  HTMLDetailsElement &
  HTMLDialogElement &
  HTMLDivElement &
  HTMLDListElement &
  HTMLEmbedElement &
  HTMLFieldSetElement &
  HTMLFormElement &
  HTMLHeadingElement &
  HTMLHeadingElement &
  HTMLHeadingElement &
  HTMLHeadingElement &
  HTMLHeadingElement &
  HTMLHeadingElement &
  HTMLHeadElement &
  HTMLHRElement &
  HTMLHtmlElement &
  HTMLIFrameElement &
  HTMLImageElement &
  HTMLInputElement &
  HTMLModElement &
  HTMLLabelElement &
  HTMLLegendElement &
  HTMLLIElement &
  HTMLLinkElement &
  HTMLMapElement &
  HTMLMenuElement &
  HTMLMetaElement &
  HTMLMeterElement &
  HTMLObjectElement &
  HTMLOListElement &
  HTMLOptGroupElement &
  HTMLOptionElement &
  HTMLOutputElement &
  HTMLParagraphElement &
  HTMLPictureElement &
  HTMLPreElement &
  HTMLProgressElement &
  HTMLQuoteElement &
  HTMLScriptElement &
  HTMLSelectElement &
  HTMLSlotElement &
  HTMLSourceElement &
  HTMLSpanElement &
  HTMLStyleElement &
  HTMLTableElement &
  HTMLTableSectionElement &
  HTMLTemplateElement &
  HTMLTextAreaElement &
  HTMLTableSectionElement &
  HTMLTableSectionElement &
  HTMLTimeElement &
  HTMLTitleElement &
  HTMLTableRowElement &
  HTMLTrackElement &
  HTMLUListElement &
  HTMLVideoElement &
  HTMLElement & {
    [key: string]: any;
  };

export interface IRangeItem extends IOptionItem {
  min: number;
  max: number;
}
