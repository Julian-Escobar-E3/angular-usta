// dom-utils.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomUtilsService {
  select(el: string, all: boolean = false): Element | Element[] | null {

    el = el.trim();
    if (all) {
      return Array.from(document.querySelectorAll(el));
    } else {
      return document.querySelector(el);
    }
  }

  on( type: string, el: string, listener: EventListener, all: boolean = false ): void {

    const elements = this.select(el, all);
    if (all && Array.isArray(elements)) {
      elements.forEach((e: Element) => e.addEventListener(type, listener));
    } else if (elements) {
      (elements as Element).addEventListener(type, listener);
    }
  }

}
