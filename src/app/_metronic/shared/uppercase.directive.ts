import {
  Directive,
  ElementRef,
  HostListener,
  Optional,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upper = input.value.toUpperCase();

    // Update UI
    input.value = upper;

    // 🔥 Update Angular form model
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(upper, { emitEvent: false });
    }

    // Restore cursor position
    input.setSelectionRange(start!, end!);
  }
}
