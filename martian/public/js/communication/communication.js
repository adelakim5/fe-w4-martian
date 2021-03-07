import * as convert from "./convertor.js";
import { rotateRoulette } from "./rotation.js";

const isString = ({ keyCode }) => (keyCode >= 65 && keyCode <= 90) || keyCode === 32;

const registerEvent = (type, element, ...fns) => element.addEventListener(type, (e) => fns.forEach((fn) => fn(e)));

const isLast = (index, iterator) => index === iterator.length - 1;

const response = (content, receivers) => {
  const { receivedContentHex, translatorButton } = receivers;
  for (let i = 0; i < content.length; i++) {
    const letter = content[i];
    rotateRoulette(letter, i, isLast(i, content)).then((res) => {
      receivedContentHex.value += res;
      translatorButton.disabled = isLast(i, content) ? false : true;
    });
  }
};

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const communicate = (senders, receivers) => {
  const { sentContentHex, sendToEarthButton } = senders;
  const { receivedContentHex, translatorButton, receivedContentText } = receivers;
  let translatedWord = ``;

  const convertKeydown = (e) => (isString(e) ? (translatedWord += convert.textToHex(e)) : (translatedWord = sentContentHex.value));

  const convertKeyup = (e) => (sentContentHex.value = isString(e) ? translatedWord : sentContentHex.value);

  const sendToEarth = () => {
    const content = sentContentHex.value;
    response(content, { receivedContentHex, translatorButton });
    sentContentHex.value = ``;
    translatedWord = ``;
  };

  const translate = () => {
    receivedContentText.innerText += `${convert.hexToText(receivedContentHex.value)}\n`;
    receivedContentHex.value = ``;
    translatorButton.disabled = true;
  };

  registerEvent("keydown", sentContentHex, convertKeydown);
  registerEvent("keyup", sentContentHex, convertKeyup);
  registerEvent("click", sendToEarthButton, sendToEarth);
  registerEvent("click", translatorButton, translate);
};

export { communicate };
