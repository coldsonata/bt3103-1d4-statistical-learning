/* Credits to https://gist.github.com/adambene/b3de67803e634be8f7d6baa273b5f447 
for coroutine and delay code */
const coroutine = nextValue => iterator => {
  const { done, value } = iterator.next(nextValue);

  if (done) {
    return;
  }

  if (value.constructor === Promise) {
    value.then(promiseValue => {
      coroutine(promiseValue)(iterator);
    });
  } else {
    coroutine(value)(iterator);
  }
};

const delay = (ms, result) =>
  new Promise(resolve => setTimeout(() => resolve(result), ms));
  
// This one's stolen from https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
const arraysEqual = function(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

Vue.component("variableblock", {
    props: ["name"],
    template: `
    <span class="unselectable draggable block" @mousedown="handleMouseDown($event)" @mouseup="handleMouseUp($event)">
    {{name}}
    </span>
  `,
    methods: {
        initialize: async function(e) {
            this.$emit("initialize", this);
        },
        handleMouseDown(e) {
            this.$el.style.position = "absolute";
            this.$el.style.zIndex = 9001;
            document.body.appendChild(this.$el);

            this.moveAt(e.pageX, e.pageY);

            if (this.onMouseMove) return;

            this.onMouseMove = (e) => {
                this.moveAt(e.pageX, e.pageY);
                let elemsBelow = document.elementsFromPoint(e.clientX, e.clientY);

                let foundDroppable = false;
                for (candidate of elemsBelow) {
                    if (candidate.className.includes("droppable")) {
                        if (this.currentDroppable != candidate) {
                            this.currentDroppable = candidate;
                        }
                        foundDroppable = true;
                        break;
                    }
                }
                if (!foundDroppable) {
                    if (this.currentDroppable) {
                        this.currentDroppable = null;
                    }
                }
            };
            document.addEventListener("mousemove", this.onMouseMove);
        },
        moveAt(pageX, pageY) {
            this.$el.style.left = pageX - this.$el.offsetWidth / 2 + 'px';
            this.$el.style.top = pageY - this.$el.offsetHeight / 2 + 'px';
        },
        handleMouseUp(e) {
            document.removeEventListener("mousemove", this.onMouseMove);
            this.onMouseMove = null;
            this.$el.style.position = "";
            this.$el.style.zIndex = "";
            this.$el.style.left = "";
            this.$el.style.top = "";
            if (this.currentDroppable !== null) {
                this.currentDroppable.appendChild(this.$el);
                if (this.currentDroppable !== this.previousParent) {
                    this.$emit("itemclicked");
                }
                this.previousParent = this.currentDroppable;
            } else {
                this.previousParent.appendChild(this.$el);
            }
        },
    },
    data() {
        return {
            imageUrl: "",
            currentDroppable: null,
            previousParent: null,
            onMouseMove: null,
        }
    },
    created() {
        this.initialize();
    }
});

Vue.component("bar", {
    props: ["name", "val"],
    template: `
    <div style="height:16px; margin:10px;">
      <div class="bar-description">{{name}}</div>
        <div class="bar" :style="{width:size*60+'%','background-color':colour}"></div>
        <div class="bar-description" style="margin-left:10px">{{Math.round(this.size*1000)/1000}}</div>
      </div>
    </div>
    `,
    data() {
        return {
            size: 0,
            colour: "#CCC",
            targetValue: null
        }
    },
    methods : {
        *adjustBar() {
            while (Math.abs(this.size - this.targetValue) > 0.001) {
                this.size = (this.size) + 0.2*(this.targetValue - this.size);
                if (this.size > 0.05) {
                    this.colour = "#EBB";
                } else {
                    this.colour = "#CCC";
                }
                yield delay(25, null);
            }
            this.size = this.targetValue;
            this.targetValue = null;
        }
    },
    watch: {
        val(newValue, oldValue) {
            if (this.targetValue == null) {
                this.targetValue = newValue;
                coroutine()(this.adjustBar());
            } else {
                this.targetValue = newValue;
            }
        }
    },
    created() {
        this.targetValue = this.val;
        coroutine()(this.adjustBar());
    }
});

Vue.component("rsqbar", {
    props: ["val", "target"],
    template: `
    <div style="height:22px">
      <div class="bar-description">Adj R^2</div>
      <div class="bar-container">
        <div class="bar" :style="{width:size*100+'%','background-color':colour}"></div>
        <div :style="{position:'absolute', left:target*100+'%'}">
            | &larr; {{size > target ? "Reached!" : "Goal"}}
        </div>
      </div>
    </div>
    `,
    data() {
        return {
            size: this.val,
            colour: "#CCC",
            targetValue: null
        }
    },
    methods : {
        *adjustBar() {
            while (Math.abs(this.size - this.targetValue) > 0.00001) {
                if (this.size < this.targetValue) {
                    this.colour = "#EEA";
                } else {
                    this.colour = "#EBB";
                }
                this.size = (this.size) + 0.2*(this.targetValue - this.size);
                yield delay(25, null);
            }
            if (this.size > this.target) {
                this.colour = "#9E9";
            } else {
                this.colour = "#CCC";
            }
            this.size = this.targetValue;
            this.targetValue = null;
        }
    },
    watch: {
        val(newValue, oldValue) {
            if (this.targetValue == null) {
                this.targetValue = newValue;
                coroutine()(this.adjustBar());
            } else {
                this.targetValue = newValue;
            }
        }
    },
});

Vue.component("feedback", {
    props: ["status", "correct", "incorrect"],
    template: `
        <div class="feedback">
            <div style="color:green; display:none">{{correct}}</div>
            <div style="color:red; display:none">{{incorrect}}</div>
            <div style="color:black; display:none">Checking answer...</div>
        </div>
    `,
    watch: {
        status(newValue, oldValue) {
            const children = $(this.$el).children();
            let correctElement = children.eq(0);
            let incorrectElement = children.eq(1);
            let checkingElement = children.eq(2);
            switch (newValue) {
                case "correct":
                    correctElement.slideDown(500);
                    incorrectElement.slideUp(500);
                    checkingElement.slideUp(500);
                    break;
                case "incorrect":
                    correctElement.slideUp(500);
                    incorrectElement.slideDown(500);
                    checkingElement.slideUp(500);
                    break;
                case "checking":
                    correctElement.slideUp(500);
                    incorrectElement.slideUp(500);
                    checkingElement.slideDown(500);
                    break;
                default:
                    correctElement.slideUp(500);
                    incorrectElement.slideUp(500);
                    checkingElement.slideUp(500);
                    break;
            }
        }
    },
});