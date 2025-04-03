const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    charsSpecials: 0,
    isClosed: true,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden", "ensureKeyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");


    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    // Campo de busca Funcional

    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      element.addEventListener("focus", (x) => {

        this._toggleCapsLock(false);

        this.open(element.value, (currentValue, el) => {

            element.value = currentValue;
          }

       
              
        );
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      /* "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",*/
      ["q", "1"],
      ["w", "2"],
      ["e", "3"],
      ["r", "4"],
      ["t", "5"],
      ["y", "6"],
      ["u", "7"],
      ["i", "8"],
      ["o", "9"],
      ["p", "0"],
      ["backspace"],
      ["a", "'"],
      ["s", "!"],
      ["d", "@"],
      ["f", "#"],
      ["g", "$"],
      ["h", "%"],
      ["j", "&"],
      ["k", "*"],
      ["l", "("],
      ["ç", ")"],

      /*'-',*/
      ["z", "-"],
      ["x", "+"],
      ["c", "="],
      ["v", "["],
      ["b", "]"],
      ["n", "{"],
      ["m", "}"],
      [",", "°"],
      [".", "_"],
      [";", ":"],
      /*
      "_",
      "@",
      "?",*/
      ["space"],
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => `<i class="material-icons">${icon_name}</i>`;

    keyLayout.forEach((key, idx) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "done", ";"].indexOf(key[0]) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");
      keyElement.array = key;
      // keyElement.setAttribute("data-idx-keyboard", idx)

      switch (key[0]) {
        case "backspace":
          keyElement.classList.add("ensure_remove");
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {

            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable"
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });

          break;

        case "123":
          keyElement.innerHTML = "123"
          keyElement.addEventListener("click", () => {
            this._toggleCharsSpecials();
          })

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", (el) => {

            this.properties.value += " ";
            this._triggerEvent("oninput",  el.currentTarget);
          });

          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            /* , keyboard = g.nodes.keyboard.nodes */

            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key[0].toLowerCase();


          keyElement.addEventListener("click", (el, idx) => {
            //      g.KeyPressed = keyElement.innerHTML;


            let a = keyElement.array;
            let b = this.properties.charsSpecials % a.length
            this.properties.value += this.properties.capsLock
              ? key[b].toUpperCase()
              : key[b].toLowerCase();
            this._triggerEvent("oninput", el.currentTarget);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName, KeyPressed) {
    let f = this.eventHandlers[handlerName]
    if (typeof  f == "function") {
      f(this.properties.value, KeyPressed);
    }
  },

  _toggleCapsLock(capsLock = !this.properties.capsLock) {
    if (capsLock != this.properties.capsLock) {
      this.properties.capsLock = capsLock;

      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase();
        }
      }
    }

  },
  _toggleCharsSpecials(charsSpecials = this.properties.charsSpecials == 0 ? 1 : 0) {
    if (charsSpecials != this.properties.charsSpecials) {
      this.properties.charsSpecials = charsSpecials

      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          let a = key.array;
          let b = a[charsSpecials % a.length]
          key.textContent =  this.properties.capsLock  ? b.toUpperCase():b.toLowerCase()
        }
      }
    }
  },



  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};

