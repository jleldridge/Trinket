const commander = require("commander");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const chalk = require("chalk");
// const spawn = require("cross-spawn");
const execSync = require("child_process").execSync;

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
  createRailsApp(root, appName);
  setupNginx(root, appName);
}

function setupDocker(root, appName) {
  console.log("Setting up Docker");
  console.log("Creating Dockerfile");
  fs.copySync(
    require.resolve("./app/docker-templates/Dockerfile"),
    path.join(root, "Dockerfile")
  );

  let dockerComposeTemplate = fs.readFileSync(
    require.resolve("./app/docker-templates/docker-compose.yml"),
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

  execSync(
    `${require.resolve(
      "./node_modules/ember-cli/bin/ember"
    )} init --name=${appName}`,
    {
      cwd: path.join(root, "web"),
      stdio: "inherit",
    }
  );

  console.log(chalk.green(`Finished creating Ember app in ${root}/web`));
}

function createRailsApp(root, appName) {
  console.log(`Creating Rails app in ${root}/api`);
  fs.ensureDirSync(path.join(projectDirectory, "api"));

  console.log("Building intermediary docker image and container");
  execSync(
    `docker build -t ${appName}-api -f ${require.resolve(
      "./app/utils/api-setup.dockerfile"
    )} .`,
    {
      cwd: root,
      stdio: "inherit",
    }
  );
  execSync(`docker create --name ${appName}-api-container ${appName}-api`, {
    cwd: root,
    stdio: "inherit",
  });
  execSync(`docker cp ${appName}-api-container:"/api" .`, {
    cwd: root,
    stdio: "inherit",
  });

  console.log("Removing intermediary docker image and container");
  execSync(`docker container rm ${appName}-api-container`, {
    cwd: root,
    stdio: "inherit",
  });
  execSync(`docker image rm ${appName}-api --force`, {
    cwd: root,
    stdio: "inherit",
  });

  console.log(chalk.green(`Finished creating Rails app in ${root}/api`));
}

function setupNginx(root, appName) {
  // TODO: add .docker folder and default.conf file for nginx
}

init();
