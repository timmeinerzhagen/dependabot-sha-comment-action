module.exports = async ({process, context, exec}) => {
    const {DIFF} = process.env;
    const payload = context.payload;

    const titleparts = payload.pull_request.title.split('to')
    const version_update = titleparts[titleparts.length - 1].trim();
    const path = DIFF.split('\n')[0].split(' ')[2].substr(2);

    // Look through DIFF for version change //
    for(const line of DIFF.split('\\n')) {
        if (line.startsWith('+') && line.includes('@')) {
            const parts = line.split("@")
            const action = parts[0].split('uses:')[1].trim();

            const owner = action.split('/')[0]
            const repo = action.split('/')[1]
            const version = parts[1].split('#')[0].trim();

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
            const sp = output.split(line.substring(1));
            const newline = line.substring(1).split('#')[0].trim() + ' # ' + version_update + '\n';

            // Save changes in file //
            await exec.exec('sed -i \"s/' + line.substring(1).trim().replace("/", "\\/") + '/' + newline.trim().replace("/", "\\/") + '/g\" ' + path);
            }
        }
    }
}