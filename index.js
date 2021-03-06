const core = require('@actions/core');
// const github = require('@actions/github');
const spawn  = require('child_process');
const fs = require('fs')
const base64encode = (b) => Buffer.from(b).toString('base64');
const npmrc = "./.npmrc"
async function run() {
    try {
        const user = core.getInput("nexus-user")
        const pswd = core.getInput("nexus-password")
        if (fs.existsSync(npmrc)) {
            core.info("Using existing .npmrc")
        } else {
            core.info("Creating .npmrc configuration...")
            createNpmConfig()
        }

        core.info("Authenticating to Nexus repository...")
        spawn.exec('npm set _auth ' + base64encode( `${user}:${pswd}`) )

        core.info("Publishing...")
        spawn.exec('npm publish')
        core.info("The module is successfully published!")
    } catch (error) {
        core.setFailed(error.message);
    }
}
function createNpmConfig() {
    const pullRegistry    = core.getInput("nexus-registry")
    const publishRegistry = core.getInput("nexus-publish-registry")
    const publishScope    = core.getInput("nexus-publish-scope")
    const email           = core.getInput("email")
    const config =
        `registry=${pullRegistry}\n` +
        `${publishScope}:registry=${publishRegistry}/\n` +
        `email=${email}`
    fs.writeFileSync(npmrc, config)
}
run();
