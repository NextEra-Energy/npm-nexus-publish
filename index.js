const core = require('@actions/core');
// const github = require('@actions/github');
const spawn  = require('child_process');

async function run() {
    try {

        const user = core.getInput("nexus-user")
        const pswd = core.getInput("nexus-password")

        spawn.exec('npm set _auth ' + btoa( `${user}:${pswd}`) )
        spawn.exec('npm publish')

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();



