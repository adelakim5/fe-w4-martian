import { hexadecimals, selectors, rotateState, times } from "../util.js";
import MyPromise from "../Promise.js";

const turn = (diff, currDeg, element, isClockWise) => {
  element.style.transition = `${times.transition}ms`;
  if (isClockWise) {
    element.style.transform = `translate3d(-50%, -50%, 0) rotate(${currDeg + diff * 22.5}deg)`;
    currDeg += diff * 22.5;
  }
  if (!isClockWise) {
    element.style.transform = `translate3d(-50%, -50%, 0) rotate(${currDeg - diff * 22.5}deg)`;
    currDeg -= diff * 22.5;
  }
  return currDeg;
};

const lightOn = (target) => target[1].classList.add("light");

const lightOut = (target) => target[1].classList.remove("light");

const findTextTarget = (elements, capital) => {
  // console.log(elements);
  return Object.entries(elements).find((item) => item[1].dataset.id === capital);
};

const getHTMLElements = (className) => document.querySelectorAll(`.${className}`);

const getDiff = ({ state, key }, endPoint) => {
  const diff = endPoint - state[key];
  const absDiff = Math.abs(diff);
  return { diff, absDiff };
};

const turnAsDirection = ({ state, key }, element, { diff, absDiff }) => {
  // console.log(state, key);
  // console.log(element);
  // console.log(diff, absDiff);
  let currDeg = state[key];
  if (absDiff > 7) currDeg = diff <= 0 ? turn(16 - absDiff, currDeg, element, true) : turn(16 - absDiff, currDeg, element, false);
  if (absDiff <= 7) currDeg = diff <= 0 ? turn(absDiff, currDeg, element, false) : turn(absDiff, currDeg, element, true);
  return currDeg;
};

const getEndPoint = (array, target) => array.findIndex((item) => item.toString() === target);

const capital = (letter) => letter.toUpperCase();

const adela = (f, ...fns) => (...arg) => {
  return arg.length
    ? f(
        ...fns.reduce((acc, fn, i) => {
          acc.push(fn(arg[i]));
          return acc;
        }, [])
      )
    : f(...fns);
};

const rotate = (letter, i) =>
  new MyPromise((resolve, reject) =>
    setTimeout(() => {
      if (rotateState.pastTarget) lightOut(rotateState.pastTarget);
      const endPoint = getEndPoint(hexadecimals, capital(letter));
      const target = adela(findTextTarget, getHTMLElements, capital)("line__text", letter);
      lightOn(target);
      rotateState.pastTarget = target;
      const diff = adela(getDiff, { state: rotateState, key: "currPoint" }, endPoint);
      const direction = adela(turnAsDirection, { state: rotateState, key: "currDeg" }, selectors.arrow, diff());
      rotateState.currDeg = direction();
      rotateState.currPoint = endPoint;
      resolve(capital(letter));
    }, times.send * (i + 1))
  );

export { rotate, lightOut };
