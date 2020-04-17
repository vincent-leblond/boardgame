import { v4 as uuid } from "uuid";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

class WebSocketClient {
  constructor() {
    this.gameId = undefined;
    this.listeners = {};
    this.ws = new WebSocket("ws://localhost:8081");
    this.ws.onopen = () => {};
    this.ws.onmessage = ({ data }) => {
      if (data.startsWith("CMD:")) {
        let info = /CMD:(?<cmd>[^:]+):(?<args>.*)/.exec(data);
        if (!info) {
          // eslint-disable-next-line
          console.error("Cannot parse WS command", data);
          return;
        }
        // eslint-disable-next-line
        console.log(data);
        if (this.listeners[info.groups.cmd]) {
          this.listeners[info.groups.cmd].forEach((listener) => {
            listener(...JSON.stringify(info.groups.args));
          });
        }
      }
    };
  }

  sendRaw(cmd) {
    this.ws.send(cmd);
  }

  sendCommand(command, ...args) {
    let cmdId = uuid();
    this.sendRaw(`CMD:${cmdId}:${this.gameId}:${command}:${JSON.stringify(args)}`);
  }

  joinGame(id) {
    this.gameId = id;
    this.sendCommand("join");
  }

  sendGameUpdate(info) {
    this.sendCommand("update", info);
  }

  sendMessage(msg) {
    this.sendCommand("message", msg);
  }

  sendPrivateMessage(player, msg) {
    this.sendCommand("privateMessage", player, msg);
  }

  endGame() {
    this.sendCommand("quit");
  }

  on(event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
  }
}
// eslint-disable-next-line
const APIClient = new WebSocketClient();
window.APIClient = APIClient;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
