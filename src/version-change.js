module.exports = async ({process, context, exec}) => {
    const {DIFF} = process.env;
    const payload = context.payload;

    const titleparts = payload.pull_request.title.split('to')
    const version_update = titleparts[titleparts.length - 1].trim();

    // Check if GitHub Actions file is changes //
    const path = DIFF.split('\n')[0].split(' ')[2].substr(2);
    if (!(path.startsWith('.github/workflows') && (path.endsWith('.yml') || path.endsWith('.yaml')))) {
        core.info("Not a GitHub Actions Dependabot Pull Request.");
        return;
    }

    // Look through DIFF for version change //
    for(const line of DIFF.split('\\n')) {
        if (line.startsWith('+') && line.includes('@')) {
            const version = split("@")[1].split('#')[0].trim();

            // If version is SHA, then add comment //
            if(version.length == 40) {
                let output = '', error = '';
                const options = {
                    listeners: { 
                        stdout: (data) => { output += data.toString(); },
                        stderr: (data) => { error += data.toString(); }
                    },
                    cwd: './'
                };

                // Calculate changes //
                await exec.exec('cat ', [path], options);
                const newline = line.substring(1).split('#')[0].trim() + ' # ' + version_update + '\n';

                // Save changes in file //
                await exec.exec('sed -i \"s/' + line.substring(1).trim().replace("/", "\\/") + '/' + newline.trim().replace("/", "\\/") + '/g\" ' + path);
            }
        }
    }
    return true;
}