const commander = require("commander");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const chalk = require("chalk");
const spawn = require("cross-spawn");

function init() {
  const program = new commander.Command();
  program.parse(process.argv);

  projectDirectory = program.args[0];

  if (typeof projectDirectory === "undefined") {
    console.error("Please specify the project directory.");
    process.exit(1);
  }

  createApp(projectDirectory);
}

function createApp(projectDirectory) {
  console.log(`Creating new Trinket app in ${chalk.cyan(projectDirectory)}`);

  const root = path.resolve(projectDirectory);
  const appName = path.basename(root);
  fs.ensureDirSync(projectDirectory);

  setupDocker(root, appName);
  createEmberApp(root, appName);
  setupNginx(root, appName);
}

function setupDocker(root, appName) {
  console.log("Setting up Docker");
  console.log("Creating Dockerfile");
  fs.copySync(
    require.resolve("./packages/docker-templates/Dockerfile"),
    path.join(root, "Dockerfile")
  );

  let dockerComposeTemplate = fs.readFileSync(
    require.resolve("./packages/docker-templates/docker-compose.yml"),
    "utf-8"
  );

  console.log("Creating docker-compose.yml");
  fs.writeFileSync(
    path.join(root, "docker-compose.yml"),
    dockerComposeTemplate.replace(/\{app\-name\}/g, appName)
  );
}

function createEmberApp(root, appName) {
  console.log(`Creating Ember app in ${root}/web`);
  fs.ensureDirSync(path.join(projectDirectory, "web"));

  // const packageJson = {
  //   name: appName,
  //   version: "0.1.0",
  //   private: true,
  // };
  // fs.writeFileSync(
  //   path.join(root, "web", "package.json"),
  //   JSON.stringify(packageJson, null, 2) + os.EOL
  // );

  const child = spawn.sync(
    `${require.resolve("./node_modules/ember-cli/bin/ember")}`,
    ["init"],
    {
      cwd: path.join(root, "web"),
      stdio: "inherit",
    }
  );
}

function setupNginx(root, appName) {
  // TODO: add .docker folder and default.conf file for nginx
}

init();
