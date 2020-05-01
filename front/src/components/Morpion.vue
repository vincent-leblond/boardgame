<template>
  <v-container fluid>
    <v-row>
      <v-col col="6" md="6">
        <v-row v-if="type=='calcul'">
          <v-col col="4" md="4">
            <v-btn color="primary" @click="launch_die(2)">Lancer</v-btn>
          </v-col>
          <v-col col="8" md="8">
            <img :src="'static/Dice-' + game.params.dice[0] + '.svg'" height="42" width="42" />
            <v-spacer></v-spacer>
            <img :src="'static/Dice-' + game.params.dice[1] + '.svg'" height="42" width="42" />
          </v-col>

        </v-row>
        <v-row>
          <v-col col="12" md="12">
            <div class="ma-n2" id="morpionboard">
              <svg
                :width="game.params.svg_size"
                :height="game.params.svg_size"
                id="svgMorpionBoard"
              >
                <!-- add board -->
                <g v-for="item in game.board" :key="item.id">
                  <g :transform="'translate(' + item.x + ', ' + item.y + ')'">
                    <text
                      v-if="type=='calcul'"
                      :x="item.width*0.4"
                      :y="item.width*0.6"
                      font-size="40px"
                    >{{ item.num }}</text>
                    <rect
                      v-show="item.visibility"
                      :id="item.id"
                      x="0"
                      y="0"
                      :width="item.width"
                      :height="item.height"
                      style="fill-opacity:0;stroke-width:3;stroke:rgb(0,0,0)"
                      @click="updateMorpion($event)"
                    />
                  </g>
                </g>
                <!-- add cicles -->
                <g v-for="item in game.circle" :key="item.id">
                  <g
                    v-show="item.visibility"
                    :id="item.id"
                    :transform="'translate(' + item.x + ', ' + item.y + ')'"
                  >
                    <image
                      href="https://www.pokepedia.fr/images/thumb/archive/e/e7/20141118205626%21Pikachu-RFVF.png/120px-Pikachu-RFVF.png"
                      x="5"
                      y="5"
                      height="90px"
                      width="90px"
                      v-if="game.params.mode_morpion==='pokemon'"
                    />
                    <circle
                      :cx="item.cx"
                      :cy="item.cy"
                      :r="item.r"
                      :stroke="item.color"
                      stroke-width="4"
                      fill="none"
                      v-if="game.params.mode_morpion==='normal'"
                    />
                  </g>
                </g>
                <!-- add cross -->
                <g v-for="item in game.cross" :key="item.id">
                  <g
                    :id="item.id"
                    v-show="item.visibility"
                    :transform="'translate(' + item.x + ', ' + item.y + ')'"
                  >
                    <image
                      href="https://www.pokepedia.fr/images/thumb/2/24/Tortank-RFVF.png/552px-Tortank-RFVF.png"
                      x="5"
                      y="5"
                      height="90px"
                      width="90px"
                      v-if="game.params.mode_morpion==='pokemon'"
                    />
                    <g v-if="game.params.mode_morpion==='normal'">
                      <line
                        v-show="item.visibility"
                        :x1="item.x1[0]"
                        :y1="item.y1[0]"
                        :x2="item.x2[0]"
                        :y2="item.y2[0]"
                        :stroke="item.color"
                        :stroke-width="item.size"
                      />
                      <line
                        v-show="item.visibility"
                        :x1="item.x1[1]"
                        :y1="item.y1[1]"
                        :x2="item.x2[1]"
                        :y2="item.y2[1]"
                        :stroke="item.color"
                        :stroke-width="item.size"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" md="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" @click="clearMorpion(false)" v-on="on">Rejouer</v-btn>
          </template>
          <span>Rejouer</span>
        </v-tooltip>
        {{ game.params.end_game_msg }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Morpion",
  props: ["one_screen", "mode_morpion", "type"],
  components: {},
  data() {
    return {
      player_order: 0,
      game: {
        params: {
          dice: [1, 1],
          end_game_msg: "",
          n_cell: 3,
          size: 100,
          svg_size: 350,
          left_margin: 20,
          top_margin: 20,
          mode: "normal",
          board: {
            default_visibility: true
          },
          cross: {
            public_name: {
              normal: "croix",
              pokemon: "Tortank"
            },
            margin: 15,
            color: "#0000FF",
            size: "4",
            default_visibility: false,
            n_checked: 0
          },
          circle: {
            public_name: {
              normal: "cercle",
              pokemon: "Pikachu"
            },
            proportion: 2.5,
            color: "#FF0000",
            size: "3",
            default_visibility: false,
            n_checked: 0
          }
        },
        board: [],
        circle: [],
        cross: []
      }
    };
  },
  created() {
    if (this.mode_morpion !== null) {
      this.game.params.mode_morpion = this.mode_morpion;
    } else {
      this.game.params.mode_morpion = "normal";
    }
  },
  computed: {},
  mounted() {
    this.drawMorpion();

    // game update listener
    window.APIClient.on("update", (player, info) => {
      // end game
      if (Object.keys(info).indexOf("end_game_msg") > -1) {
        // eslint-disable-next-line
        console.log("end game");
        this.game.params.end_game_msg = info.end_game_msg;
      }
      // position visibility
      if (Object.keys(info).indexOf("visibility") > -1) {
        // eslint-disable-next-line
        console.log("visibility");
        this.updateObjectVisibility(
          info.visibility.objId,
          info.visibility.objectType,
          info.visibility.visibility,
          info.visibility.local
        )
      }
      // clear game
      if (Object.keys(info).indexOf("clear") > -1) {
        // eslint-disable-next-line
        console.log("clear");
        this.clearMorpion(info.clear)
      }
      // update dices
      if (Object.keys(info).indexOf("dice") > -1) {
        // eslint-disable-next-line
        console.log("dice");
        this.game.params.dice = info.dice;
      }
      if (Object.keys(info).indexOf("params") > -1) {
        // eslint-disable-next-line
        console.log("big update");
        this.game = info;
      }
      if (Object.keys(info).indexOf("player_order") > -1) {
        // eslint-disable-next-line
        console.log("player_order");
        this.player_order = info.player_order;
      }
    });
  },
  methods: {
    // launch dice
    launch_die(number) {
      if (number == 2) {
        this.game.params.dice = [
          Math.floor(Math.random() * 6 + 1),
          Math.floor(Math.random() * 6 + 1)
        ];
      }
      window.APIClient.sendGameUpdate({
        dice: this.game.params.dice
      });
    },
    // draw Morpion game board
    drawMorpion() {
      // draw morpion board
      let size = this.game.params.size;
      let cross = this.game.params.cross;
      let circle = this.game.params.circle;
      let n_cell = this.game.params.n_cell;
      let left_margin = this.game.params.left_margin;
      let top_margin = this.game.params.top_margin;
      for (let row = 0; row < n_cell; row++) {
        for (let col = 0; col < n_cell; col++) {
          this.game.board.push({
            id: "board_" + (row + 1) + "_" + (col + 1),
            x: row * size + left_margin,
            y: col * size + top_margin,
            width: size,
            height: size,
            visibility: true,
            num: row + 1 + col * n_cell
          });

          this.game.circle.push({
            id: "circle_" + (row + 1) + "_" + (col + 1),
            cx: size / 2, //(row + 0.5) * size + left_margin,
            cy: size / 2, //(col + 0.5) * size + top_margin,
            x: row * size + left_margin,
            y: col * size + top_margin,
            r: size / circle.proportion,
            visibility: circle.default_visibility,
            color: circle.color,
            size: circle.size
          });

          this.game.cross.push({
            id: "cross_" + (row + 1) + "_" + (col + 1),
            x: row * size + left_margin,
            y: col * size + top_margin,
            x1: [cross.margin, cross.margin],
            x2: [size - cross.margin, size - cross.margin],
            y1: [cross.margin, size - cross.margin],
            y2: [size - cross.margin, cross.margin],
            visibility: cross.default_visibility,
            color: cross.color,
            size: cross.size
          });
        }
      }
    },
    // clear objects of Morpion
    clearMorpion(local = false) {
      let n_cell = this.game.params.n_cell;
      for (let row = 1; row <= n_cell; row++) {
        for (let col = 1; col <= n_cell; col++) {
          let objId = row + "_" + col;
          this.updateObjectVisibility(objId, "circle", false, local);
          this.updateObjectVisibility(objId, "cross", false, local);
        }
      }
      this.game.params.circle.n_checked = 0;
      this.game.params.cross.n_checked = 0;

      this.game.params.end_game_msg = "";

      if(!local) {
        window.APIClient.sendGameUpdate({ clear: true });
      }
      this.player_order = 0;
      window.APIClient.sendGameUpdate({ player_order: 0 });
    },
    // update object visibility
    updateObjectVisibility(objId, objectType, visibility, local = false) {
      for (let c = 0; c < this.game[objectType].length; c++) {
        if (this.game[objectType][c].id === objectType + "_" + objId) {
          this.game[objectType][c].visibility = visibility;
        }
      }
      
      this.game.params[objectType].n_checked++;
      
      if(!local) {
        window.APIClient.sendGameUpdate({
          visibility: {
            objId: objId,
            objectType: objectType,
            visibility: visibility,
            local: true
          }
        })
      }
      // window.APIClient.sendGameUpdate(this.game);
    },
    // add an object on board
    addObject(board_id) {
      let selectedObjectType = "";

      // get object type to add
      if (this.one_screen) {
        if (
          this.game.params.circle.n_checked === this.game.params.cross.n_checked
        ) {
          selectedObjectType = "circle";
        } else {
          selectedObjectType = "cross";
        }
      } else {
        // if game start
        if (
          this.player_order === 0 &&
          this.game.params.circle.n_checked === 0
        ) {
          selectedObjectType = "circle";
          this.player_order = 1;
        } else if (
          this.player_order === 0 &&
          this.game.params.circle.n_checked === 1
        ) {
          selectedObjectType = "cross";
          this.player_order = 2;
        } else if (this.player_order === 1) {
          selectedObjectType = "circle";
          if (
            this.game.params.circle.n_checked > this.game.params.cross.n_checked
          ) {
            selectedObjectType = "";
          }
        } else if (this.player_order === 2) {
          selectedObjectType = "cross";
          if (
            this.game.params.circle.n_checked ===
            this.game.params.cross.n_checked
          ) {
            selectedObjectType = "";
          }
        }
      }

      // no new object if all filled
      let n_cell = this.game.params.n_cell;
      if (
        this.game.params.circle.n_checked + this.game.params.cross.n_checked ===
        n_cell * n_cell
      ) {
        selectedObjectType = "";
      }

      // if there is already an object
      let circle_visibility = this.game.circle.filter(
        d => d.id === "circle_" + board_id[1] + "_" + board_id[2]
      )[0].visibility;
      let cross_visibility = this.game.cross.filter(
        d => d.id === "cross_" + board_id[1] + "_" + board_id[2]
      )[0].visibility;
      if (circle_visibility || cross_visibility) {
        selectedObjectType = "";
      }

      if (selectedObjectType !== "") {
        this.updateObjectVisibility(
          board_id[1] + "_" + board_id[2],
          selectedObjectType,
          true
        );
      }
      return selectedObjectType;
    },
    // update Morpion
    updateMorpion(event) {
      let n_cell = this.game.params.n_cell;
      let board_id = event.currentTarget.id.split("_");
      let row_cell = parseInt(board_id[1]);
      let col_cell = parseInt(board_id[2]);

      let row = row_cell - 1;
      let col = col_cell - 1;
      let cell_num = row + 1 + col * n_cell;
      // check allowed to add object
      // detect winner or draw
      if (this.game.params.end_game_msg === "") {
        let selectedObjectType = "";
        // check if allowed to add an object
        if (this.type === "calcul") {
          let dice1 = this.game.params.dice[0];
          let dice2 = this.game.params.dice[1];
          if (
            cell_num === dice1 - dice2 ||
            cell_num === dice2 - dice1 ||
            cell_num === dice1 + dice2
          ) {
            selectedObjectType = this.addObject(board_id);
          }
        } else {
          selectedObjectType = this.addObject(board_id);
        }

        if (selectedObjectType !== "") {
          // check if win or draw
          let objects = this.game[selectedObjectType];

          let public_name = this.game.params[selectedObjectType].public_name[
            this.game.params.mode_morpion
          ];

          // vertical
          let obj1 = objects.filter(
            d => d.id === selectedObjectType + "_" + row_cell + "_1"
          )[0].visibility;
          let obj2 = objects.filter(
            d => d.id === selectedObjectType + "_" + row_cell + "_2"
          )[0].visibility;
          let obj3 = objects.filter(
            d => d.id === selectedObjectType + "_" + row_cell + "_3"
          )[0].visibility;
          if (obj1 && obj2 && obj3) {
            this.game.params.end_game_msg = "Victoire de " + public_name;
          }

          // horizontal
          obj1 = objects.filter(
            d => d.id === selectedObjectType + "_1_" + col_cell
          )[0].visibility;
          obj2 = objects.filter(
            d => d.id === selectedObjectType + "_2_" + col_cell
          )[0].visibility;
          obj3 = objects.filter(
            d => d.id === selectedObjectType + "_3_" + col_cell
          )[0].visibility;
          if (obj1 && obj2 && obj3) {
            this.game.params.end_game_msg = "Victoire de " + public_name;
          }

          // diagonal 1 descendant
          obj1 = objects.filter(d => d.id === selectedObjectType + "_1_1")[0]
            .visibility;
          obj2 = objects.filter(d => d.id === selectedObjectType + "_2_2")[0]
            .visibility;
          obj3 = objects.filter(d => d.id === selectedObjectType + "_3_3")[0]
            .visibility;
          if (obj1 && obj2 && obj3) {
            this.game.params.end_game_msg = "Victoire de " + public_name;
          }

          // diagonal 2 ascendant
          obj1 = objects.filter(d => d.id === selectedObjectType + "_1_3")[0]
            .visibility;
          obj2 = objects.filter(d => d.id === selectedObjectType + "_2_2")[0]
            .visibility;
          obj3 = objects.filter(d => d.id === selectedObjectType + "_3_1")[0]
            .visibility;
          if (obj1 && obj2 && obj3) {
            this.game.params.end_game_msg = "Victoire de " + public_name;
          }

          // all filled
          if (this.game.params.end_game_msg === "") {
            if (
              this.game.params.circle.n_checked +
                this.game.params.cross.n_checked ===
              n_cell * n_cell
            ) {
              this.game.params.end_game_msg = "Fin de partie : égalité";
            }
          }

          // send game update
          window.APIClient.sendGameUpdate({
            end_game_msg: this.game.params.end_game_msg
          });

          if (this.game.params.end_game_msg !== "") {
            this.player_order = 0;
            window.APIClient.sendGameUpdate({ player_order: 0 });
          }
        }
      }
    }
  }
};
</script>