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
              @click="one_screen = false;dialog_url = true;"
              :color="$vuetify.theme.themes.light.secondary"
            >
              <v-icon left>people_alt</v-icon> Jouer à plusieurs
            </v-btn>
            <br />
            <br />
            <v-btn
              @click="overlay = false;one_screen = true;"
              :color="$vuetify.theme.themes.light.secondary"
            >
              <v-icon left>person</v-icon> Un seul écran
            </v-btn>
          </v-col>
        </v-row>
      </div>
        <v-dialog v-model="dialog_url" max-width="400px">
          <v-card color="primary">
            <v-card-title>
              <h3 style="color:white">Partagez ce lien avec votre ami</h3>
            </v-card-title>
            <v-card-text>
              <v-row justify="center" align="center">
                {{ url }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn class="ma-2" large color="white" icon
                      v-clipboard:copy="url"
                      v-on="on">
                      <v-icon dark>filter_none</v-icon>
                    </v-btn>
                  </template>
                  <span>Copier</span>
                </v-tooltip>
              </v-row>
              <v-row justify="center" align="center">
                <v-btn
                  @click="dialog_url = false;overlay = false;"
                  :color="$vuetify.theme.themes.light.secondary"
                >
                  Jouer
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
    </v-overlay>

    <v-navigation-drawer
      class="elevation-1"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      :width="navigation_width"
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
      <v-divider></v-divider>
      <v-container v-if="visio">
        <iframe
            id="visio"
            allow="camera; microphone"
            width="620"
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
            <morpion
              :one_screen="one_screen"
              type=""
              >
            </morpion>
          </v-tab-item>
          <!-- TAB 1 -->
          <v-tab-item style="height: 100%">
            <morpion
              :one_screen="one_screen"
              type="calcul"
              >
            </morpion>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Morpion from "./components/Morpion";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "App",
  components: {
    "morpion": Morpion,
  },
  data() {
    return {
      one_screen: false,
      drawer: null,
      navigation_width: "650px",
      overlay: true,
      error_msg: "",
      visio: true,
      tabModel: 0,
      isLoading: false,
      errormsg: "",
      tab: null,
      room: "boardgame",
      url: null,
      dialog_url: false
    };
  },
  created() {
    this.party_url = uuidv4();

    // get url params without vue-route
    let uri = window.location.search.substring(1); 
    let params = new URLSearchParams(uri);

    let room = params.get("room");
    let visio = params.get("visio");
    let one_screen = params.get("one_screen");

    if(visio === null) {
      this.visio = false;
    } else if (visio == "true") {
      this.visio = true;
    }
    if(window.innerWidth < 500) {
      this.visio = false;
      this.navigation_width = "150px";
    }

    if(!this.visio) {
      this.navigation_width = "150px";
    }

    if(room === null) {
      this.room = uuidv4().split("-")[0];
      this.url = top.location + "?room=" +
        this.room;
    } else {
      this.room = room;
      this.overlay = false;
    }

    if(one_screen !== null) {
      if(one_screen === "true") {
        this.one_screen = true;
      } else {
        this.one_screen = false;
      }
    }
  },
  computed: {
  },
  mounted() {
    // join game on connect
    window.APIClient.on("connect", () => {
      window.APIClient.joinGame(this.room);
    })
  },
  methods: {
  }
};
</script>

<style>
.v-overlay__scrim {
  background-color: #37ab9c !important;
}
</style>

