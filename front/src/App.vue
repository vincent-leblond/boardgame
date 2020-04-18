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
            <h1>BOARD GAME</h1>
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
          Jeux
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
                      <svg width="500" height="500" id="svgMorpionBoard">
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

    // draw morpion board
    let size = this.games.morpion.params.size;
    let cross = this.games.morpion.params.cross;
    let circle = this.games.morpion.params.circle;
    let n_cell = this.games.morpion.params.n_cell;
    for(let row=1;row<=n_cell;row++) {
      for(let col=1;col<=n_cell;col++) {
        this.games.morpion.board.push(
          {
            id: "board_" + row + "_" + col,
            x: row * size,
            y: col * size,
            width: size,
            height: size,
            visibility: true
          }
        );

        this.games.morpion.circle.push(
          {
            id: "circle_" + row + "_" + col,
            cx: (row + 0.5) * size,
            cy: (col + 0.5) * size,
            r: size / circle.proportion,
            visibility: circle.default_visibility,
            color: circle.color,
            size: circle.size
          }
        );

        this.games.morpion.cross.push(
          {
            id: "cross_" + row + "_" + col,
            x1: [
              row * size + cross.margin,
              row * size + cross.margin,
              ],
            x2: [
              (row + 1) * size - cross.margin,
              (row + 1) * size - cross.margin,
            ],
            y1: [
              col * size + cross.margin,
              (col + 1) * size - cross.margin
            ],
            y2: [
              (col + 1) * size - cross.margin,
              col * size + cross.margin
            ],
            visibility: cross.default_visibility,
            color: cross.color,
            size: cross.size
          }
        )
      }
    }

    window.APIClient.joinGame(this.room);
    window.APIClient.on("message", (player, msg) => {
      // eslint-disable-next-line
      console.log("NEW MESSAGE");
      // eslint-disable-next-line
      console.log(msg);
      vm.games.morpion = msg;
    });
  },
  methods: {
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
    },
    // update object visibility
    updateObjectVisibility(objId, objectType, visibility) {
      let vm = this;
      
      for(let c=0;c<this.games.morpion[objectType].length;c++) {
        if(this.games.morpion[objectType][c].id === objectType + "_" + objId) {
          this.games.morpion[objectType][c].visibility = visibility;
        }
      }
      window.APIClient.sendMessage(vm.games.morpion);
    },
    // update Morpion
    updateMorpion(event) {
      let vm = this;
      let board_id = event.currentTarget.id.split("_");

      let selectedObjectType = "";

      if(this.games.morpion.params.circle.n_checked === this.games.morpion.params.cross.n_checked) {
        selectedObjectType = "circle";
      } else {
        selectedObjectType = "cross";
      }

      if(selectedObjectType !== "") {
        this.updateObjectVisibility(
          board_id[1] + "_" + board_id[2],
          selectedObjectType,
          true
        );
        this.games.morpion.params[selectedObjectType].n_checked++;
      }

      window.APIClient.sendMessage(vm.games.morpion);
    }
  }
};
</script>

<style>
.v-overlay__scrim {
  background-color: #37ab9c !important;
}

</style>

