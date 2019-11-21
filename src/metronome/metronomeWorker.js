export default () => {

    var timerID = null;
    var interval = 0;

    self.addEventListener('message', e => { /* eslint-disable-line no-restricted-globals */
        if (e.data === "start") {
            console.log()
            timerID = setInterval(function () {
                postMessage("click");
            }, interval)
        } else if (e.data.interval) {
            interval = e.data.interval;
        } else if (e.data === "stop") {
            clearInterval(timerID);
            postMessage("stop");
            timerID = null;
        }
    });
}