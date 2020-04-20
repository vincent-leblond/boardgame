<template>
  <v-app id="inspire">
    <v-overlay opacity="1" :value="overlay" z-index="10" :dark="true">
      <div
        class="d-flex flex-column align-center"
        :style="{ background: $vuetify.theme.themes.light.primary}"
      >
        <v-row justify="center" align="center">
        </v-row>
        <v-row justify="start" align="center">
          <v-col col="12" md="12" class="text-center">
            <br />
            <h1>Jeux d'enfants</h1>
            <br />
            <v-btn
              @click="overlay = false;"
              :color="$vuetify.theme.themes.light.secondary"
            >
              Entrer
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-overlay>

    <v-navigation-drawer
      class="elevation-1"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      width="150px"
    >
      <v-list dense>
        <v-list-item link @click="tabModel=0">
          <v-list-item-content>
            <v-list-item-title>Morpion</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="tabModel=1">
          <v-list-item-content>
            <v-list-item-title>Morpion calcul</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
<!--       <v-container v-if="visio">
        <iframe
            
            id="myIframe"
            allow="camera; microphone"
            width="600"
            height="400"
            :src="'https://meet.jit.si/' + room"
        ></iframe>
      </v-container> -->
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :clipped-right="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="white"
            @click.stop="drawer = !drawer"
            v-on="on"
            icon
          >
            <v-icon large>view_headline</v-icon>
          </v-btn>
        </template>
        <span>Effacer</span>
      </v-tooltip>
      <v-toolbar-title class="ml-0 pl-4">
        Jeux d'enfants
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height class="pa-0">
        <v-tabs-items v-model="tabModel" style="height: 100%; width: 100%">
          <!-- TAB 0 -->
          <v-tab-item style="height: 100%">
            <v-container fluid>
              <v-row>
                <v-col col="6" md="6">
                  <v-row>
                    <v-col col="12" md="12">
                      <div class="ma-n2" id="morpionboard">
                        <svg
                          :width="games.morpion.params.svg_size"
                          :height="games.morpion.params.svg_size"
                          id="svgMorpionBoard">
                          <!-- add board -->
                          <g v-for="item in games.morpion.board" :key="item.id">
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
                          <g v-for="item in games.morpion.circle" :key="item.id">
                            <g
                              v-show="item.visibility"
                              :id="item.id"
                              :transform="'translate(' + item.x + ', ' + item.y + ')'"
                            >
                              <image
                                href="https://www.pokepedia.fr/images/thumb/archive/e/e7/20141118205626%21Pikachu-RFVF.png/120px-Pikachu-RFVF.png"
                                x="5" y="5"
                                height="90px" width="90px"
                                v-if="games.morpion.params.mode_morpion==='pokemon'"
                              />
                              <circle
                                :cx="item.cx"
                                :cy="item.cy"
                                :r="item.r"
                                :stroke="item.color"
                                stroke-width="4"
                                fill="none"
                                v-if="games.morpion.params.mode_morpion==='normal'"
                              />
                            </g>
                          </g>
                          <!-- add cross -->
                          <g v-for="item in games.morpion.cross" :key="item.id">
                            <g
                              :id="item.id"
                              v-show="item.visibility"
                              :transform="'translate(' + item.x + ', ' + item.y + ')'"
                            >
                              <image
                                href="https://www.pokepedia.fr/images/thumb/2/24/Tortank-RFVF.png/552px-Tortank-RFVF.png"
                                x="5" y="5"
                                height="90px" width="90px"
                                v-if="games.morpion.params.mode_morpion==='pokemon'"
                              />
                              <g v-if="games.morpion.params.mode_morpion==='normal'">
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
                  <v-row>
                    <v-col col="12" md="12">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="primary"
                            @click="clearMorpion('')"
                            v-on="on"
                          >
                            Rejouer
                          </v-btn>
                        </template>
                        <span>Rejouer</span>
                      </v-tooltip>
                      {{ games.morpion.params.end_game_msg }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <!-- TAB 1 -->
          <v-tab-item style="height: 100%">
            <v-container fluid>
              <v-row>
                <v-col col="6" md="6">
                  <v-row>
                    <v-col col="2" md="2">
                      <v-btn color="primary" @click="launch_die('morpion_calcul', 2)">Lancer</v-btn>
                    </v-col>
                    <v-col col="1" md="1">
                      <img
                        :src="'static/Dice-' + games.morpion_calcul.params.dice[0] + '.svg'"
                        height="42" width="42"
                      > 
                    </v-col>
                    <v-col col="1" md="1">
                      <img
                        :src="'static/Dice-' + games.morpion_calcul.params.dice[1] + '.svg'"
                        height="42" width="42"
                      > 
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col col="12" md="12">
                      <div class="ma-n2" id="morpionboard">
                        <svg
                          :width="games.morpion_calcul.params.svg_size"
                          :height="games.morpion_calcul.params.svg_size"
                          id="svgMorpionBoard">
                          <!-- add board -->
                          <g v-for="item in games.morpion_calcul.board" :key="item.id">
                            <g :transform="'translate(' + item.x + ', ' + item.y + ')'">
                              <text :x="item.width*0.4" :y="item.width*0.6" font-size="40px">
                                {{ item.num }}
                              </text>
                              <rect
                                v-show="item.visibility"
                                :id="item.id"
                                x="0"
                                y="0"
                                :width="item.width"
                                :height="item.height"
                                style="fill-opacity:0;stroke-width:3;stroke:rgb(0,0,0)"
                                @click="updateMorpion($event, 'calcul')"
                              />
                            </g>
                          </g>
                          <!-- add cicles -->
                          <g v-for="item in games.morpion_calcul.circle" :key="item.id">
                            <g
                              v-show="item.visibility"
                              :id="item.id"
                              :transform="'translate(' + item.x + ', ' + item.y + ')'"
                            >
                              <image
                                href="https://www.pokepedia.fr/images/thumb/archive/e/e7/20141118205626%21Pikachu-RFVF.png/120px-Pikachu-RFVF.png"
                                x="5" y="5"
                                height="90px" width="90px"
                                v-if="games.morpion_calcul.params.mode_morpion==='pokemon'"
                              />
                              <circle
                                :cx="item.cx"
                                :cy="item.cy"
                                :r="item.r"
                                :stroke="item.color"
                                stroke-width="4"
                                fill="none"
                                v-if="games.morpion_calcul.params.mode_morpion==='normal'"
                              />
                            </g>
                          </g>
                          <!-- add cross -->
                          <g v-for="item in games.morpion_calcul.cross" :key="item.id">
                            <g
                              :id="item.id"
                              v-show="item.visibility"
                              :transform="'translate(' + item.x + ', ' + item.y + ')'"
                            >
                              <image
                                href="https://www.pokepedia.fr/images/thumb/2/24/Tortank-RFVF.png/552px-Tortank-RFVF.png"
                                x="5" y="5"
                                height="90px" width="90px"
                                v-if="games.morpion_calcul.params.mode_morpion==='pokemon'"
                              />
                              <g v-if="games.morpion_calcul.params.mode_morpion==='normal'">
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
                  <v-row>
                    <v-col col="12" md="12">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="primary"
                            @click="clearMorpion('calcul')"
                            v-on="on"
                          >
                            Rejouer
                          </v-btn>
                        </template>
                        <span>Rejouer</span>
                      </v-tooltip>
                      {{ games.morpion_calcul.params.end_game_msg }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  data() {
    return {
      one_screen: false,
      player_order: 0, // 0 if all players on same screen, 1 if first, etc
      drawer: null,
      items: [],
      games: {
        morpion: {
          morpion: "name",
          params: {
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
        },
        morpion_calcul: {
          morpion_calcul: "name",
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
      },
      overlay: false,
      error_msg: "",

      visio: true,
      tabModel: 0,
      isLoading: false,
      errormsg: "",
      tab: null,
      room: "boardgame"
    };
  },
  created() {
    let vm = this;

    // get url params without vue-route
    let uri = window.location.search.substring(1); 
    let params = new URLSearchParams(uri);

    let development_mode = params.get("dev");
    let room = params.get("room");
    let visio = params.get("visio");
    let one_screen = params.get("one_screen");
    let mode_morpion = params.get("mode_morpion");

    if(visio === undefined) {
      vm.visio = true;
    } else if (visio == "false") {
      vm.visio = false;
    }

    if(development_mode === undefined) {
      vm.development_mode = false;
    } else if (development_mode == "true") {
      vm.development_mode = true;
    }

    if(room !== null) {
      vm.room = vm.room + "_" + room;
    }

    if(one_screen !== null) {
      if(one_screen === "true") {
        vm.one_screen = true;
      } else {
        vm.one_screen = false;
      }
    }

    if(mode_morpion !== null) {
      this.games.morpion.params.mode_morpion = mode_morpion;
      this.games.morpion_calcul.params.mode_morpion = mode_morpion;
    } else {
      this.games.morpion.params.mode_morpion = "normal";
      this.games.morpion_calcul.params.mode_morpion = "normal";
    }
  },
  computed: {
  },
  mounted() {
    let vm = this;

    this.drawMorpion();

    // join game on connect
    window.APIClient.on("connect", () => {
      window.APIClient.joinGame(this.room);
    })
    // game update listener
    window.APIClient.on("update", (player, info) => {
      if(Object.keys(info).indexOf("morpion") > -1) {
        vm.games.morpion = info;
      }
      if(Object.keys(info).indexOf("morpion_calcul") > -1) {
        vm.games.morpion_calcul = info;
      }
      if(Object.keys(info).indexOf("player_order") > -1) {
        this.player_order = info.player_order;
      }
    });
  },
  methods: {
    // launch dice
    launch_die(game, number) {
      let vm = this;
      if(number == 2) {
        this.games[game].params.dice = [
          Math.floor(Math.random() * 6 + 1),
          Math.floor(Math.random() * 6 + 1)
        ]
      }
      window.APIClient.sendGameUpdate(vm.games[game]);
    },
    // draw Morpion game board
    drawMorpion() {
      let types = ["", "calcul"];

      for (const type of types) {
        let t = "";
        if(type === "") {
          t = "morpion";
        } else {
          t = "morpion_" + type;
        }

        // draw morpion board
        let size = this.games[t].params.size;
        let cross = this.games[t].params.cross;
        let circle = this.games[t].params.circle;
        let n_cell = this.games[t].params.n_cell;
        let left_margin = this.games[t].params.left_margin;
        let top_margin = this.games[t].params.top_margin;
        for(let row=0;row<n_cell;row++) {
          for(let col=0;col<n_cell;col++) {
            this.games[t].board.push(
              {
                id: "board_" + (row + 1) + "_" + (col + 1),
                x: row * size + left_margin,
                y: col * size + top_margin,
                width: size,
                height: size,
                visibility: true,
                num: (row + 1) + col * n_cell
              }
            );

            this.games[t].circle.push(
              {
                id: "circle_" + (row + 1) + "_" + (col + 1),
                cx: size / 2, //(row + 0.5) * size + left_margin,
                cy: size / 2, //(col + 0.5) * size + top_margin,
                x: row * size + left_margin,
                y: col * size + top_margin,
                r: size / circle.proportion,
                visibility: circle.default_visibility,
                color: circle.color,
                size: circle.size
              }
            );

            this.games[t].cross.push(
              {
                id: "cross_" + (row + 1) + "_" + (col + 1),
                x: row * size + left_margin,
                y: col * size + top_margin,
                x1: [
                  cross.margin,
                  cross.margin
                  ],
                x2: [
                  size - cross.margin,
                  size - cross.margin
                ],
                y1: [
                  cross.margin,
                  size - cross.margin
                ],
                y2: [
                  size - cross.margin,
                  cross.margin
                ],
                visibility: cross.default_visibility,
                color: cross.color,
                size: cross.size
              }
            )
          }
        }
      }
    },
    // clear objects of Morpion
    clearMorpion(type) {
      let vm = this;

      let t = "";
      if(type === "") {
        t = "morpion";
      } else {
        t = "morpion_" + type;
      }

      let n_cell = this.games[t].params.n_cell;
      for(let row=1;row<=n_cell;row++) {
        for(let col=1;col<=n_cell;col++) {
          let objId = row + "_" + col;
          vm.updateObjectVisibility(objId, "circle", false, t);
          vm.updateObjectVisibility(objId, "cross", false, t);
        }
      }
      this.games[t].params.circle.n_checked = 0;
      this.games[t].params.cross.n_checked = 0;

      this.games[t].params.end_game_msg = "";
      window.APIClient.sendGameUpdate(vm.games[t]);
      this.player_order = 0;
      window.APIClient.sendGameUpdate({player_order:0});
    },
    // update object visibility
    updateObjectVisibility(objId, objectType, visibility, t) {
      let vm = this;

      for(let c=0;c<this.games[t][objectType].length;c++) {
        if(this.games[t][objectType][c].id === objectType + "_" + objId) {
          this.games[t][objectType][c].visibility = visibility;
        }
      }
      window.APIClient.sendGameUpdate(vm.games[t]);
    },
    // add an object on board
    addObject(board_id, t) {
      let selectedObjectType = "";

      // get object type to add
      if(this.one_screen) {
        if(this.games[t].params.circle.n_checked === this.games[t].params.cross.n_checked) {
          selectedObjectType = "circle";
        } else {
          selectedObjectType = "cross";
        }
      } else {
        // if game start
        if(this.player_order === 0 && this.games[t].params.circle.n_checked === 0) {
          selectedObjectType = "circle";
          this.player_order = 1;
        } else if(this.player_order === 0 && this.games[t].params.circle.n_checked === 1) {
          selectedObjectType = "cross";
          this.player_order = 2;
        } else if(this.player_order === 1) {
          selectedObjectType = "circle";
          if(this.games[t].params.circle.n_checked > this.games[t].params.cross.n_checked) {
            selectedObjectType = "";
          }
        } else if(this.player_order === 2) {
          selectedObjectType = "cross";
          if(this.games[t].params.circle.n_checked === this.games[t].params.cross.n_checked) {
            selectedObjectType = "";
          }
        }
      }

      // no new object if all filled
      let n_cell = this.games[t].params.n_cell;
      if(this.games[t].params.circle.n_checked + this.games[t].params.cross.n_checked === n_cell * n_cell) {
        selectedObjectType = "";
      }

      // if there is already an object
      let circle_visibility = this.games[t].circle.filter(
        d => d.id === "circle_" + board_id[1] + "_" + board_id[2]
        )[0].visibility;
      let cross_visibility = this.games[t].cross.filter(
        d => d.id === "cross_" + board_id[1] + "_" + board_id[2]
        )[0].visibility;
      if(circle_visibility || cross_visibility) {
        selectedObjectType = "";
      }

      if(selectedObjectType !== "") {
        this.updateObjectVisibility(
          board_id[1] + "_" + board_id[2],
          selectedObjectType,
          true,
          t
        );
        this.games[t].params[selectedObjectType].n_checked++;
      }
      return selectedObjectType;
    },
    // update Morpion
    updateMorpion(event, type) {
      let vm = this;

      let t = "";
      if(type === "") {
        t = "morpion";
      } else {
        t = "morpion_" + type;
      }

      let n_cell = this.games[t].params.n_cell;
      let board_id = event.currentTarget.id.split("_");
      let row_cell = parseInt(board_id[1]);
      let col_cell = parseInt(board_id[2]);

      let row = row_cell - 1;
      let col = col_cell - 1;
      let cell_num = (row + 1) + col * n_cell;

      // check allowed to add object
      // detect winner or draw
      if(this.games[t].params.end_game_msg === "") {
        let selectedObjectType = "";
        // check if allowed to add an object
        if(type === "calcul") {
          let dice1 = this.games[t].params.dice[0];
          let dice2 = this.games[t].params.dice[1];
          if(cell_num === (dice1 - dice2) || cell_num === (dice2 - dice1) || cell_num === (dice1 + dice2)) {
            selectedObjectType = this.addObject(board_id, t)
          }
        } else {
          selectedObjectType = this.addObject(board_id, t);
        }

        if(selectedObjectType !== "") {
          // check if win or draw
          let objects = this.games[t][selectedObjectType];

          let public_name = this.games[t].params[selectedObjectType].public_name[
            this.games[t].params.mode_morpion
          ];

          // vertical
          let obj1 = objects.filter(d => d.id === selectedObjectType + "_" + row_cell + "_1")[0].visibility;
          let obj2 = objects.filter(d => d.id === selectedObjectType + "_" + row_cell + "_2")[0].visibility;
          let obj3 = objects.filter(d => d.id === selectedObjectType + "_" + row_cell + "_3")[0].visibility;
          if(obj1 && obj2 && obj3) {
            this.games[t].params.end_game_msg = "Victoire de " + public_name;
          }

          // horizontal
          obj1 = objects.filter(d => d.id === selectedObjectType + "_1_" + col_cell)[0].visibility;
          obj2 = objects.filter(d => d.id === selectedObjectType + "_2_" + col_cell)[0].visibility;
          obj3 = objects.filter(d => d.id === selectedObjectType + "_3_" + col_cell)[0].visibility;
          if(obj1 && obj2 && obj3) {
            this.games[t].params.end_game_msg = "Victoire de " + public_name;
          }

          // diagonal 1 descendant
          obj1 = objects.filter(d => d.id === selectedObjectType + "_1_1")[0].visibility;
          obj2 = objects.filter(d => d.id === selectedObjectType + "_2_2")[0].visibility;
          obj3 = objects.filter(d => d.id === selectedObjectType + "_3_3")[0].visibility;
          if(obj1 && obj2 && obj3) {
            this.games[t].params.end_game_msg = "Victoire de " + public_name;
          }

          // diagonal 2 ascendant
          obj1 = objects.filter(d => d.id === selectedObjectType + "_1_3")[0].visibility;
          obj2 = objects.filter(d => d.id === selectedObjectType + "_2_2")[0].visibility;
          obj3 = objects.filter(d => d.id === selectedObjectType + "_3_1")[0].visibility;
          if(obj1 && obj2 && obj3) {
            this.games[t].params.end_game_msg = "Victoire de " + public_name;
          }
          
          // all filled
          if(this.games[t].params.end_game_msg === "") {
            if(this.games[t].params.circle.n_checked + this.games[t].params.cross.n_checked === n_cell * n_cell) {
              this.games[t].params.end_game_msg = "Fin de partie : égalité";
            }
          }

          // send game update
          window.APIClient.sendGameUpdate(vm.games[t]);

          if(vm.games[t].params.end_game_msg !== "") {
            this.player_order = 0;
            window.APIClient.sendGameUpdate({player_order:0});
          }
        }
      }
    }
  }
};
</script>

<style>
.v-overlay__scrim {
  background-color: #37ab9c !important;
}

</style>

