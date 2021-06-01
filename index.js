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
        let { stdout, stderr } = await exec('npm set //nexus.nee.com/repository/npm-innersource/:_authToken ' + core.getInput("nexus-token"));

//           if (stderr) {
//             console.error('error: ' + JSON.stringify(stderr));
//           }
//           console.log('authenticated; ' + JSON.stringify(stdout));
        
//         core.info("Authenticating to Nexus...")
//         let { stdout:pubout, stderr:puberr} = await exec('npm run build && npm publish');

//           if (puberr) {
//             console.error('error: ' + JSON.stringify(puberr));
//           }
//           console.log('Published: ' + JSON.stringify(pubout));
        
        await exec('npm publish')


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
