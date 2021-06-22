const commander = require("commander");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");

function init() {
  const program = new commander.Command();
  createApp();
}

function createApp() {
  setupDocker();
  createEmberApp();
  createRailsApp();
  setupNginx();
}

function setupDocker() {}

function createEmberApp() {
  // TODO: create 'web' folder and initialize a basic ember app
}

function createRailsApp() {
  // TODO: create 'api' folder and initialize a basic rails app
}

function setupNginx() {
  // TODO: add .docker folder and default.conf file for nginx
}
