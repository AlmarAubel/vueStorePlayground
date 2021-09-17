/* eslint-disable */
// @ts-nocheck
const noop = () => ({});

const fakeRedux = {
  init: noop,
  subscribe: noop,
  send: noop,
};

const reduxPlaceholder = { connect: () => fakeRedux };

const extension = !process.browser
  ? reduxPlaceholder
  : window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__ ||
    reduxPlaceholder;
const ReduxTool = extension.connect({
  trace: true,
});

/**
 * A simple interface to work with the redux devtools methods
 *
 * Usage:
 *     const devtool = ReduxHelper<MyDataInterface>('my-app-name', initialData);
 */
export default function reduxHelper<T>(name: string, initialState: T) {
  const initState = JSON.parse(JSON.stringify(initialState));
  // start with the raw state
  ReduxTool.init(initState);

  // used to keep subscribe events from triggering the send function on replays
  let ignoreNextChange = false;

  return {
    /**
     * The data to send to the devtools. Should be inside a "watcher" at the top level that listens for all changes
     */
    send(payload:any, state: T) {
      const stateClean = JSON.parse(JSON.stringify(state));
      const payloadClean = JSON.parse(JSON.stringify(payload));

      if (ignoreNextChange) {
        ignoreNextChange = false;

        return;
      }

      ReduxTool.send({ type: name, payloadClean }, stateClean);
    },
    /**
     * When a change inside the devtools is made (ex: timeline replay) this callback will be called
     * The state in the callback is a snapshot of the state at the time
     */
    subscribe(callback: Function) {
      ReduxTool.subscribe((message: any) => {
        if (message.type === "DISPATCH" && message.state) {
          // comes in as a string
          const state = JSON.parse(message.state);

          ignoreNextChange = true;
          callback(state);
        }
      });
    },
  };
}
