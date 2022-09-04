const CHILDREN = "children";
const STYLE = "style";
const DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";

function setValueForStyles(domElement: Element, propValue: any) {
  // TODO:
}

function setInnerHTML(domElement: Element, propValue: any) {
  // TODO:
}

function setTextContent(domElement: Element, propValue: any) {
  // TODO:
}

function setValueForProperty(
  domElement: Element,
  propKey: any,
  propValue: any
) {
  // TODO:
}

const updateDomProperties = (domElement: Element, updatePayload: any[]) => {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue);
    }
  }
};

export const updateProperties = (
  domElement: Element,
  updatePayload: any, // TODO:
  type: string,
  lastRawProps: any,
  nextRawProps: any
) => {
  updateDomProperties(domElement, updatePayload);

  // TODO: special props
  // switch (tag) {
  //     case 'input':
  //         // Update the wrapper around inputs *after* updating props. This has to
  //         // happen after `updateDOMProperties`. Otherwise HTML5 input validations
  //         // raise warnings and prevent the new value from being assigned.
  //         ReactDOMInputUpdateWrapper(domElement, nextRawProps);
  //         break;
  //     case 'textarea':
  //         ReactDOMTextareaUpdateWrapper(domElement, nextRawProps);
  //         break;
  //     case 'select':
  //         // <select> value update needs to occur after <option> children
  //         // reconciliation
  //         ReactDOMSelectPostUpdateWrapper(domElement, nextRawProps);
  //         break;
  // }
};
