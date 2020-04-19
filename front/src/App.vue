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
      width="620px"
    >
      <v-container v-if="visio">
        <iframe
            
            id="myIframe"
            allow="camera; microphone"
            width="600"
            height="400"
            :src="'https://meet.jit.si/' + room"
        ></iframe>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :clipped-right="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <v-toolbar-title style="width: 400px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">
          Jeux d'enfants
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-tabs
          v-model="tabModel"
          centered
          slider-color="secondary"
          background-color="transparent"
          class="pt-1"
        >
          <v-tab>Morpion</v-tab>
          <!-- <v-tab>Jeu 2</v-tab> -->
        </v-tabs>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height class="pa-0">
        <v-tabs-items v-model="tabModel" style="height: 100%; width: 100%">
          <!-- TAB 1 -->
          <v-tab-item style="height: 100%">
            <v-container fluid>
              <v-row>
                <v-col col="6" md="6">
                  <v-card class="pa-0">
                    <div class="ma-n2" id="morpionboard">
                      <svg
                        :width="games.morpion.params.svg_size"
                        :height="games.morpion.params.svg_size"
                        id="svgMorpionBoard">
                        <!-- add board -->
                        <g v-for="item in games.morpion.board" :key="item.id">
                          <rect
                            v-show="item.visibility"
                            :id="item.id"
                            :x="item.x"
                            :y="item.y"
                            :width="item.width"
                            :height="item.height"
                            style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)"
                            @click="updateMorpion"
                          />
                        </g>
                        <!-- add cicles -->
                        <g v-for="item in games.morpion.circle" :key="item.id">
                          <circle
                            v-show="item.visibility"
                            :id="item.id"
                            :cx="item.cx"
                            :cy="item.cy"
                            :r="item.r"
                            :stroke="item.color"
                            stroke-width="4"
                            fill="none"
                          />
                        </g>
                        <!-- add cross -->
                        <g v-for="item in games.morpion.cross" :key="item.id">
                          <g :id="item.id" v-show="item.visibility">
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
                      </svg>
                    </div>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="primary"
                          @click="clearMorpion"
                          v-on="on"
                          icon
                        >
                          <v-icon large>close</v-icon>
                        </v-btn>
                      </template>
                      <span>Effacer</span>
                    </v-tooltip>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <!-- TAB 2 -->
          <v-tab-item style="height: 100%">
            <v-container fluid>
              Jeu 2
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
      items: [],
      games: {
        morpion: {
          params: {
            n_cell: 3,
            size: 100,
            svg_size: 350,
            left_margin: 20,
            top_margin: 20,
            board: {
              default_visibility: true
            },
            cross: {
              margin: 15,
              color: "#0000FF",
              size: "4",
              default_visibility: false,
              n_checked: 0
            },
            circle: {
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
      tabModel: null,
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
      vm.games.morpion = info;
    });
  },
  methods: {
    // draw Morpion game board
    drawMorpion() {
      // draw morpion board
      let size = this.games.morpion.params.size;
      let cross = this.games.morpion.params.cross;
      let circle = this.games.morpion.params.circle;
      let n_cell = this.games.morpion.params.n_cell;
      let left_margin = this.games.morpion.params.left_margin;
      let top_margin = this.games.morpion.params.top_margin;
      for(let row=0;row<n_cell;row++) {
        for(let col=0;col<n_cell;col++) {
          this.games.morpion.board.push(
            {
              id: "board_" + (row + 1) + "_" + (col + 1),
              x: row * size + left_margin,
              y: col * size + top_margin,
              width: size,
              height: size,
              visibility: true
            }
          );

          this.games.morpion.circle.push(
            {
              id: "circle_" + (row + 1) + "_" + (col + 1),
              cx: (row + 0.5) * size + left_margin,
              cy: (col + 0.5) * size + top_margin,
              r: size / circle.proportion,
              visibility: circle.default_visibility,
              color: circle.color,
              size: circle.size
            }
          );

          this.games.morpion.cross.push(
            {
              id: "cross_" + (row + 1) + "_" + (col + 1),
              x1: [
                row * size + cross.margin + left_margin,
                row * size + cross.margin + left_margin,
                ],
              x2: [
                (row + 1) * size - cross.margin + left_margin,
                (row + 1) * size - cross.margin + left_margin,
              ],
              y1: [
                col * size + cross.margin + top_margin,
                (col + 1) * size - cross.margin + top_margin
              ],
              y2: [
                (col + 1) * size - cross.margin + top_margin,
                col * size + cross.margin + top_margin
              ],
              visibility: cross.default_visibility,
              color: cross.color,
              size: cross.size
            }
          )
        }
      }
    },
    // clear objects of Morpion
    clearMorpion() {
      let vm = this;

      let n_cell = this.games.morpion.params.n_cell;
      for(let row=1;row<=n_cell;row++) {
        for(let col=1;col<=n_cell;col++) {
          let objId = row + "_" + col;
          vm.updateObjectVisibility(objId, "circle", false);
          vm.updateObjectVisibility(objId, "cross", false);
        }
      }
      this.games.morpion.params.circle.n_checked = 0;
      this.games.morpion.params.cross.n_checked = 0;
    },
    // update object visibility
    updateObjectVisibility(objId, objectType, visibility) {
      let vm = this;
      
      for(let c=0;c<this.games.morpion[objectType].length;c++) {
        if(this.games.morpion[objectType][c].id === objectType + "_" + objId) {
          this.games.morpion[objectType][c].visibility = visibility;
        }
      }
      window.APIClient.sendGameUpdate(vm.games.morpion);
    },
    addObject(board_id) {
      let selectedObjectType = "";

      // get object type to add
      if(this.games.morpion.params.circle.n_checked === this.games.morpion.params.cross.n_checked) {
        selectedObjectType = "circle";
      } else {
        selectedObjectType = "cross";
      }

      // no new object if all filled
      let n_cell = this.games.morpion.params.n_cell;
      if(this.games.morpion.params.circle.n_checked + this.games.morpion.params.cross.n_checked === n_cell * n_cell) {
        selectedObjectType = "";
      }

      // if there is already an object
      let circle_visibility = this.games.morpion.circle.filter(
        d => d.id === "circle_" + board_id[1] + "_" + board_id[2]
        )[0].visibility;
      let cross_visibility = this.games.morpion.cross.filter(
        d => d.id === "cross_" + board_id[1] + "_" + board_id[2]
        )[0].visibility;
      if(circle_visibility || cross_visibility) {
        selectedObjectType = "";
      }

      if(selectedObjectType !== "") {
        this.updateObjectVisibility(
          board_id[1] + "_" + board_id[2],
          selectedObjectType,
          true
        );
        this.games.morpion.params[selectedObjectType].n_checked++;
      }
    },
    // update Morpion
    updateMorpion(event) {
      let vm = this;

      let board_id = event.currentTarget.id.split("_");

      vm.addObject(board_id);
      window.APIClient.sendGameUpdate(vm.games.morpion);
    }
  }
};
</script>

<style>
.v-overlay__scrim {
  background-color: #37ab9c !important;
}

</style>

