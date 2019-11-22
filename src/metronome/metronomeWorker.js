export default () => {

    var timerID = null;
    var interval = null;

    self.addEventListener('message', e => { /* eslint-disable-line no-restricted-globals */
        if (e.data === "start") {
            timerID = setInterval(function () {
                postMessage("click");
            }, interval)
        } else if (e.data.interval) {
            interval = e.data.interval;         
        } else if (e.data === "stop") {
            clearInterval(timerID);
            timerID = null;
        }
    });
}