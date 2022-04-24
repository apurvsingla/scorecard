let matchData = [];

class Scoreboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
        section.triangleGrid {
            display: grid;
            grid-template-columns: repeat(3, 33%);
            grid-template-rows: repeat(3, 33%);
            justify-items: center;
            align-items: center;
            position: absolute;
            bottom: 0;
            right: 0;
            transform: translate(-50%, -50%);
          }
          
          .scene {
            position: relative;
            width: 100px;
            height: 100px;
            grid-row: 2/3;
            grid-column: 2/3;
            perspective: 500px;
          }
          
          .triangle {
            width: inherit;
            height: inherit;
            position: relative;
            transform-style: preserve-3d;
            animation: rotateTriangle 10s linear infinite;
            
          }
          
          .triangle-face {
            width: inherit;
            height: inherit;
            position: absolute;
            background: red;
            border: solid white 2px;
            font-size: 10px;
          }
          
          .triangle-face-front {
            background: rgb(71, 71, 136);
            background-size: cover;
            opacity: 0.7;
            transform: translate3d(0, 0, 28px);
          }
          
          .triangle-face-left {
            background: rgb(90, 233, 77);
            opacity: 0.7;
            background-size: cover;
            transform: rotateY(-120deg) translate3d(0, 0, 28px);
          }
          
          .triangle-face-right {
            background: black;
            opacity: 0.7;
            background: url('images/usa2.jpg');
            background-size: cover;
            transform: rotateY(120deg) translate3d(0, 0, 28px);
          }
          
          @keyframes rotateTriangle {
            0% {
                transform: rotateY(0deg);
            }
            24%,34%{
                transform: rotateY(120deg);
            }
            58%,67%{
                transform: rotateY(240deg);
            }
            91%, 100% {
                transform: rotateY(360deg);
            }
          }
        </style>
        <main>
        <section class="triangleGrid">
          <div class="scene">
            <div class="triangle">
              <div class="triangle-face  triangle-face-front">
              </div>
              <div class="triangle-face  triangle-face-left">
              </div>
              <div class="triangle-face  triangle-face-right">
              </div>
            </div>
          </div>
        </section>
      </main>
    `;

    this.pos1 = this.pos1 || 0;
    this.pos2 = this.pos2 || 0;
    this.pos3 = this.pos3 || 0;
    this.pos4 = this.pos4 || 0;
    this.mover = this.shadowRoot.querySelector(".triangle");
    this.cont = this.shadowRoot.querySelector(".scene");
    this.front = this.shadowRoot.querySelector(".triangle-face-front");
    this.left = this.shadowRoot.querySelector(".triangle-face-left");
    this.right = this.shadowRoot.querySelector(".triangle-face-right");
    this.allT = this.shadowRoot.querySelector(".triangle-face");
    this.setBit = false;
    this.dragElement();
  }

  connectedCallback() {
    this.dragElement(this.cont);
    this.getScore();
  }

  getScore = () => {
    const options = {
      method: "GET",
      url: "https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard",
      params: { matchId: "40381" },
      headers: {
        "X-RapidAPI-Host": "unofficial-cricbuzz.p.rapidapi.com",
        "X-RapidAPI-Key": "0f92f1c569msh79fbf3b7a2e953ap19f37ejsn9e433bed1706"
      }
    };
    axios
      .request(options)
      .then(function (response) {
        matchData = { ...response.data };
      })
      .then(() => {
        this.showData();
      })
      .catch(function (error) {
        console.error(error, error.message, error.data);
      });
  };

  showData = () => {
    this.front.innerHTML = `
        <div style="padding: 10px; text-align: center; font-weight: bold;"
            id="front-display"
        >
            <img src="images/enlarge.png" style="width: 8px; height: 8px; position: absolute; left: 2px; top: 1px; cursor: pointer;"
                class="enlarge"
            />
            <img class="close-icon"
            src="images/cross.png" style="width: 8px; height: 8px; position: absolute; right: 2px; top: 1px; cursor: pointer;"/>
            <p>${matchData.appIndex.seoTitle}</p>
            <p>Score: ${matchData.scorecard[0].score}</p>
        </div>
    `;

    this.left.innerHTML = `
        <div style="padding: 10px; text-align: center; font-weight: bold;"
            id="left-display"
        >
            <img src="images/enlarge.png" style="width: 8px; height: 8px; position: absolute; left: 2px; top: 1px; cursor: pointer;"
            class="enlarge"
            />
            <img class="close-icon"
            src="images/cross.png" style="width: 8px; height: 8px; position: absolute; right: 2px; top: 1px; cursor: pointer;"/>
            <p>Current Batsman: ${matchData.scorecard[0].batsman[0].name}</p>
            <p>Runs: ${matchData.scorecard[0].batsman[0].runs}</p>
            <p>Balls Played: ${matchData.scorecard[0].batsman[0].balls}</p>
        </div>
    `;

    this.right.innerHTML = `
      <div style="padding: 10px; text-align: center; font-weight: bold;"
          id="left-display"
      >
          <img src="images/enlarge.png" style="width: 8px; height: 8px; position: absolute; left: 2px; top: 1px; cursor: pointer;"
          class="enlarge"
          />
          <img class="close-icon"
          src="images/cross.png" style="width: 8px; height: 8px; position: absolute; right: 2px; top: 1px; cursor: pointer;"/>

      </div>
`;

    let enlarge = this.shadowRoot.querySelectorAll(".enlarge");
    let closeIcon = this.shadowRoot.querySelectorAll(".close-icon");
    enlarge[0].addEventListener("click", this.enlargeDisplay);
    enlarge[1].addEventListener("click", this.enlargeDisplay);
    enlarge[2].addEventListener("click", this.enlargeDisplay);
    closeIcon[0].addEventListener("click", (e) => {
      this.style.display = "none";
    });
    closeIcon[1].addEventListener("click", (e) => {
      this.style.display = "none";
    });
    closeIcon[2].addEventListener("click", (e) => {
      this.style.display = "none";
    });
  };

  dragElement(event) {
    this.mover.addEventListener("mousedown", (e) => {
      this.sender(e);
    });
  }

  enlargeDisplay = () => {
    if (this.setBit) {
      this.cont.style.width = "100px";
      this.cont.style.height = "100px";
      this.left.style.transform = "rotateY(-120deg) translate3d(0, 0, 28px)";
      this.right.style.transform = "rotateY(120deg) translate3d(0, 0, 28px)";
      this.front.style.transform = "translate3d(0, 0, 28px)";
      this.setBit = false;
    } else {
      this.cont.style.width = "200px";
      this.cont.style.height = "200px";
      this.left.style.transform = "rotateY(-120deg) translate3d(0, 0, 57px)";
      this.right.style.transform = "rotateY(120deg) translate3d(0, 0, 57px)";
      this.front.style.transform = "translate3d(0, 0, 57px)";
      this.setBit = true;
    }
  };

  elementDrag(event) {
    event = event || window.event;
    this.moveWindow(event.clientX, event.clientY);
  }

  moveWindow(x, y) {
    let triangleGrid = this.shadowRoot.querySelector(".triangleGrid");
    this.pos1 = this.pos3 - x;
    this.pos2 = this.pos4 - y;
    this.pos3 = x;
    this.pos4 = y;
    triangleGrid.style.top = `${triangleGrid.offsetTop - this.pos2}px`;
    triangleGrid.style.left = `${triangleGrid.offsetLeft - this.pos1}px`;
    triangleGrid.style.bottom = this.offsetTop - this.pos2 + "px";
    triangleGrid.style.right = this.offsetLeft - this.pos1 + "px";
  }

  closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  sender(event) {
    event = event || window.event;
    this.pos3 = event.clientX;
    this.pos4 = event.clientY;
    document.onmouseup = this.closeDragElement;
    document.onmousemove = this.elementDrag.bind(this);
  }
}

{
  /* <p>Batting Team: ${matchData.scorecard[1].batTeamSName}</p>
<p>Score: ${matchData.scorecard[1].score}</p>
<p>Wickets: ${matchData.scorecard[1].wickets}</p>
<p>Run rate: ${matchData.scorecard[1].runRate}</p> */
}

customElements.define("as-scoreboard", Scoreboard);