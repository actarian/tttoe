declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export type WebpackWorkerFactory = {
    default: typeof WebpackWorker,
  };
  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
