import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const events = []; 
const originListen = browserHistory.listen;
browserHistory.listen(location => {
    for (let index = 0; index < events.length; index++){
        if (typeof (events[index]) === 'function'){
            const ret = events[index](location);
            if (ret === false) break;
        }
    }
    
});

browserHistory.listen = fn => {
    events.push(fn);
};

browserHistory.off = fn => {
    const i = events.indexOf(fn);
    if (i > -1){
        events.splice(i, 1);
        return true;
    }
    return false;
};

export default browserHistory;
