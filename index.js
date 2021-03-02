const core = require('@actions/core');
// const github = require('@actions/github');
const spawn  = require('child_process');

const base64encode = (b) => Buffer.from(b).toString('base64');


async function run() {
    try {

        const user = core.getInput("nexus-user")
        const pswd = core.getInput("nexus-password")

        spawn.exec('npm set _auth ' + base64encode( `${user}:${pswd}`) )
        spawn.exec('npm publish')

    } catch (error) {
        core.setFailed(error.message);
    }
}



run();



