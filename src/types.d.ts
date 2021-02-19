/*
declare module 'worker-loader!*' {
  interface WorkerConstructor {
    new(): Worker;
  }
  type Imported = {
    default: WorkerConstructor;
  };
  export = Imported;
}
*/

declare module "worker-loader!*" {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
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
