import React, { useState, useEffect } from "react";
import "./Interpreter.css";

function Interpreter() {
  const [input, updateInput] = useState("");
  const [stackState, updateStack] = useState([]);
  const [outputState, updateOutput] = useState("");
  const [interpreter, updateInterpreter] = useState();
  const [speed, updateSpeed] = useState(0);
  const [running, updateRunning] = useState(false);
  const [errorState, updateError] = useState({
    error: false,
    message: "There is an error",
  });

  let b98Int;

  useEffect(() => {
    if (errorState.error) {
      document.querySelector("#modal").style.display = "flex";
    } else {
      document.querySelector("#modal").style.display = "none";
    }
  });

  const interpret = (code) => {
    let output = "";
    let stack = [];
    let co = code.split("\n");
    let p = [];
    for (let x of co) {
      p.push(x);
    }
    let leng = p.map((x) => x.length);
    let maxL = Math.max(...leng);
    for (let i = 0; i < p.length; i++) {
      let sml = p[i].length;
      while (sml < maxL) {
        p[i] += " ";
        sml++;
      }
    }
    let x = 0;
    let y = 0;
    let dir = 2;
    function setCodeAt(x, y, v) {
      let endOfStr = p[x].substring(y + 1);
      p[x] = p[x].substring(0, y) + String.fromCharCode(v) + endOfStr;
    }
    let move = () => {
      if (dir === 1) {
        y === 0 ? (y = p.length - 1) : y--;
      }
      if (dir === 2) {
        p[y].length - x === 1 ? (x = 0) : x++;
      }
      if (dir === 3) {
        y === p.length - 1 ? (y = 0) : y++;
      }
      if (dir === 4) {
        x === 0 ? (x = p[y].length - 1) : x--;
      }
    };
    let lm = 0;
    let funcswi = (location) => {
      // eslint-disable-next-line default-case
      switch (location) {
        case "^":
          dir = 1;
          move();
          break;
        case ">":
          dir = 2;
          move();
          break;
        case "v":
          dir = 3;
          move();
          break;
        case "<":
          dir = 4;
          move();
          break;
        case " ":
          move();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
          stack.push(p[y][x]);
          move();
          break;
        case "+":
          if (stack.length >= 2) {
            stack.push(Number(stack.pop()) + Number(stack.pop()));
          }
          move();
          break;

        case "-":
          let a = stack.pop();
          let b = stack.pop();
          stack.push(b - a);
          move();
          break;
        case "*":
          stack.push(Number(stack.pop()) * Number(stack.pop()));
          move();
          break;
        case "/":
          let c = stack.pop();
          let d = stack.pop();
          stack.push(Math.floor(d / c));
          move();
          break;
        case "%":
          let e = stack.pop();
          let f = stack.pop();
          stack.push(f % e);
          move();
          break;
        case "!":
          stack.pop() == 0 ? stack.push("1") : stack.push("0");
          move();
          break;
        case "`":
          let g = stack.pop();
          let h = stack.pop();
          g >= h ? stack.push("0") : stack.push("1");
          move();
          break;
        case "?":
          dir = Math.floor(Math.random() * Math.floor(4) + 1);
          move();
          break;
        case "_":
          stack.pop() == 0 ? (dir = 2) : (dir = 4);
          move();
          break;
        case "|":
          stack.pop() == 0 ? (dir = 3) : (dir = 1);
          move();
          break;
        case "#":
          move();
          move();
          break;
        case '"':
          lm++;
          move();
          break;
        case ":":
          stack.length === 0
            ? stack.push(...[0, 0])
            : stack.push(...stack.slice(-1));
          move();
          break;
        case "\\":
          if (stack.length >= 2) {
            let i = stack.pop();
            let j = stack.pop();
            stack.push(i);
            stack.push(j);
          } else {
            stack.push(0);
          }
          move();
          break;
        case "$":
          stack.pop();
          move();
          break;
        case ".":
          output += stack.pop();
          move();
          break;
        case ",":
          output += String.fromCharCode(stack.pop());
          move();
          break;
        case "p":
          let k = stack.pop();
          let l = stack.pop();
          let m = stack.pop();
          // If statement here.
          setCodeAt(k, l, m);
          move();
          break;
        case "g":
          let n = stack.pop();
          let o = stack.pop();
          stack.push(p[n][o].charCodeAt(0));
          move();
          break;
      }
    };
    if (speed) {
      b98Int = setInterval(() => {
        updateInput(p[y][x]);
        let highlighted = p
          .map((elem, i) => {
            return elem
              .split("")
              .map((char, j) => {
                if (char === " ") {
                  char = "&nbsp;";
                }
                if (i === y && j === x) {
                  return `<mark>${char}</mark>`;
                } else {
                  return char;
                }
              })
              .join("");
          })
          .join("<br>");
        document.querySelector("#map").innerHTML = highlighted;
        updateRunning(true);
        if (p[y][x] === "@") {
          updateOutput(output);
          updateRunning(false);
          clearInterval(b98Int);
        } else {
          if (lm % 2) {
            switch (p[y][x]) {
              case '"':
                lm++;
                move();
                break;
              default:
                stack.push(p[y][x].charCodeAt(0));
                move();
                break;
            }
          } else {
            funcswi(p[y][x]);
          }
          if (output) {
            updateOutput(output);
          }
        }
        updateStack(stack);
      }, speed * 1000);
    } else {
      while (p[y][x] !== "@") {
        if (lm % 2) {
          switch (p[y][x]) {
            case '"':
              lm++;
              move();
              break;
            default:
              stack.push(p[y][x].charCodeAt(0));
              move();
              break;
          }
        } else {
          funcswi(p[y][x]);
        }
      }
      return output;
    }
  };

  const Execute = () => {
    updateOutput("");
    if (interpreter === undefined) {
      updateError({
        error: true,
        message: "You didnt enter anything.",
      });
    } else if (running === true) {
      updateError({
        error: true,
        message: "Wait for it to finish man!",
      });
    } else {
      updateOutput(interpret(interpreter));
    }
  };

  return (
    <>
      <div id="modal">
        <div id="modal-content">
          <span
            id="close"
            onClick={() => {
              updateError({
                error: false,
                message: "",
              });
            }}
          >
            &times;
          </span>
          <p>Error: {errorState.message}</p>
        </div>
      </div>
      <h1>Befunge-93 Interpreter</h1>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Befunge"
        >
          The Befunge Interpreter
        </a>{" "}
        is a two-dimensional stack-based, reflective, esoteric programming
        language. This one was created by <a href="#">Habib Vadillo</a>, an avid
        coder who spent way too much time making it. Click one of the samples to
        see it at work or find your own Befunge text for it to compile.
      </p>
      <h2>Samples</h2>
      <p
        onClick={() =>
          updateInterpreter(
            '>25*"!dlroW olleH":v\n                v:,_@\n                >  ^'
          )
        }
      >
        Hello World
      </p>
      <p
        onClick={() =>
          updateInterpreter(
            '2>:3g" "-!v\\  g30          <\n |!`"&":+1_:.:03p>03g+:"&"`|\n @               ^  p3\\" ":<\n2 2345678901234567890123456789012345678'
          )
        }
      >
        Sieve of Eratosthenes
      </p>
      <textarea
        onChange={(e) => updateInterpreter(e.target.value)}
        type="text"
        id="interpreter"
        name="interpreter"
        value={interpreter}
      ></textarea>
      <p>Map</p>
      <p id="map"></p>
      <div id="buttons">
        <select
          onChange={(e) => {
            updateSpeed(e.target.value);
          }}
        >
          <option value="">Instant</option>
          <option value={1}>Slow</option>
          <option value={0.1}>Fast</option>
        </select>
        <button onClick={Execute}>Run</button>
        <button onClick={() => window.location.reload()}>Stop</button>
      </div>
      <p>Input:</p>
      <input readOnly value={input}></input>
      <p>Stack:</p>
      <input readOnly value={JSON.stringify(stackState.map((n) => +n))}></input>
      <p>Output:</p>
      {outputState ? (
        <input readOnly value={outputState}></input>
      ) : (
        <input readOnly value=""></input>
      )}
    </>
  );
}

export default Interpreter;
