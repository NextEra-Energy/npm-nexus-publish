const core = require('@actions/core');
// const github = require('@actions/github');
const spawn  = require('child_process');

const base64encode = (b) => Buffer.from(b).toString('base64');


async function run() {
    try {

        const user = core.getInput("nexus-user")
        const pswd = core.getInput("nexus-password")

        core.info("Authenticating to Nexus repository...")
        spawn.exec('npm set _auth ' + base64encode( `${user}:${pswd}`) )

        core.info("Publishing...")
        spawn.exec('npm publish')

        core.info("The module is successfully published!")

    } catch (error) {
        core.setFailed(error.message);
    }
}



run();



