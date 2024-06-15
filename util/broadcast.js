const broadcasts = {};
function addAction(name, callback) {
    if (!(name in broadcasts)) {
        broadcasts[name] = [];
    }
    return broadcasts[name].push(callback);
}

function broadcast(name, ...args) {
    if (name in broadcasts) {
        for (var callback of broadcasts[name]) {
            try {
                callback(args);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export { addAction, broadcast }