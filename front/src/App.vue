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
                    <div id="test"></div>
                    <div class="ma-n2" id="morpionboard">
                      <svg width="500" height="500" id="svgMorpionBoard">
                        <g v-for="item in items" :key="item.id">
                          <rect
                            :id="item.id"
                            :x="item.x"
                            :y="item.y"
                            width="100"
                            height="100"
                            style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)"
                            @click="sendmessage"
                          />
                        </g>
                      </svg>
                    </div>
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
    let size = 100;
    for(let row=1;row<=3;row++) {
      for(let col=1;col<=3;col++)
      this.items.push(
        {
          id: row * 10 + col,
          x: row * size,
          y: col * size
        }
      )
    }

    window.APIClient.joinGame(this.room);
    window.APIClient.on("message", (player, msg) => {
      // eslint-disable-next-line
      console.log("NEW MESSAGE");
      // eslint-disable-next-line
      console.log(msg);
    });
  },
  methods: {
    sendmessage(event) {
      window.APIClient.sendMessage(event.currentTarget.id);
    }
  }
};
</script>

<style>
.v-overlay__scrim {
  background-color: #37ab9c !important;
}

</style>

