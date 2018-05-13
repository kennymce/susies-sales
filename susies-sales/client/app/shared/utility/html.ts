export namespace HtmlUtility {
  export function resetElementValue(theElement) {
    (<HTMLInputElement>document.getElementById(
      theElement
    )).value = '';
  }
  export function getElementValue(theElement){
    return (<HTMLInputElement>document.getElementById(
      theElement
    )).value;
  }
  export function setElementValue(theElement, theValue){
    (<HTMLInputElement>document.getElementById(
      theElement
    )).value = theValue;
  }
}

