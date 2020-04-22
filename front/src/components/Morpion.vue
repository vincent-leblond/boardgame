<template>
  <v-container fluid>
    <v-row>
      <v-col col="6" md="6">
        <v-row v-if="type=='calcul'">
          <v-col col="2" md="2">
            <v-btn color="primary" @click="launch_die(2)">Lancer</v-btn>
          </v-col>
          <v-col col="1" md="1">
            <img
              :src="'static/Dice-' + game.params.dice[0] + '.svg'"
              height="42"
              width="42"
            />
          </v-col>
          <v-col col="1" md="1">
            <img
              :src="'static/Dice-' + game.params.dice[1] + '.svg'"
              height="42"
              width="42"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12" md="12">
            {{ message }}
            <div class="ma-n2" id="morpionboard">
              <svg
                :width="game.params.svg_size"
                :height="game.params.svg_size"
                id="svgMorpionBoard"
              >
                <!-- add board -->
                <g v-for="item in game.board" :key="item.id">
                  <g :transform="'translate(' + item.x + ', ' + item.y + ')'">
                    <rect
                      v-show="item.visibility"
                      :id="item.id"
                      x="0"
                      y="0"
                      :width="item.width"
                      :height="item.height"
                      style="fill-opacity:0;stroke-width:3;stroke:rgb(0,0,0)"
                      @click="updateMorpion($event, '')"
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
  </v-container>
</template>

<script>
export default {
  name: "Morpion",
  props: ["message", "one_screen", "player_order", "mode_morpion", "type"],
  components: {},
  data() {
    return {
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
  created() {},
  computed: {},
  mounted() {
    this.drawMorpion();

    // game update listener
    window.APIClient.on("update", (player, info) => {
      if (Object.keys(info).indexOf("game") > -1) {
        this.game = info.game;
      }
      if (Object.keys(info).indexOf("player_order") > -1) {
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
      window.APIClient.sendGameUpdate(this.game);
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
    }
  }
};
</script>