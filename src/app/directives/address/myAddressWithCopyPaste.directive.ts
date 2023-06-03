import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myAddressWithCopyPaste]'
})
export class MyAddressWithCopyPasteDirective {
	constructor(element: ElementRef) {

	}

	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~!@$%^&*()_+\=\[\]{};"`':'\\|<>\?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}

	@HostListener("paste", ["$event"]) blockPaste(ev: any,event: KeyboardEvent) {
		let clipboardData =(ev !=undefined) ? ev.clipboardData : undefined;
		let pastedText = (clipboardData !=undefined) ? (clipboardData.getData('text')) : undefined;
		const regex = new RegExp(/^[~!@$%^&*()_+\=\[\]{};"`':'\\|<>\?]*$/);
		 // const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		  let flag=false;
		  if(pastedText !=null && pastedText != undefined && pastedText.length >0)
		  {
			Array.from(pastedText).forEach(element => {
				console.log(element);
				if (element !=null && element !=undefined && regex.test(element.toString())) {
					flag=true;
				  }
			});
		  }
		  if(flag)
		  ev.preventDefault();
		}

}