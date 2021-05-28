const core = require('@actions/core');
// const github = require('@actions/github');
// const spawn  = require('child_process');
const { exec } = require("child_process");
const fs = require('fs')

const base64encode = (b) => Buffer.from(b).toString('base64');
const npmrc = "./.npmrc"

async function run() {
    try {

        const user = core.getInput("nexus-user")
        const pswd = core.getInput("nexus-password")
        const login = user+":"+pswd
        if (fs.existsSync(npmrc)) {
            core.info("Using existing .npmrc")
        } else {
            core.info("Creating .npmrc configuration...")
            createNpmConfig()
        }

        core.info("Authenticating to Nexus repository...")
        let { stdout, stderr } = await exec('npm config set _auth=' + base64encode(login));

          if (stderr) {
            console.error(`error: ${stderr}`);
          }
          console.log(`authenticated ${stdout}`);
        
        core.info("Publishing...")
        let { stdout:pubout, stderr:puberr} = await exec('npm publish');

          if (stderr) {
            console.error(`error: ${puberr}`);
          }
          console.log(`Published ${pubout}`);
        
//         await exec('npm publish')


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



