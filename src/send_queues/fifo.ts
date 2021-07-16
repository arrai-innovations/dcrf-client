import autobind from 'autobind-decorator';

import { ISendQueue } from '../interface';
import BaseSendQueue from './base';


export
class FifoQueue extends BaseSendQueue implements ISendQueue {
  public readonly queue: string[];

  constructor(sendNow?: (bytes: string) => number, canSend?: () => boolean) {
    super(sendNow, canSend);
    this.queue = [];
  }

  @autobind
  public send(bytes: string): number {
    if (this.canSend()) {
      return this.sendNow(bytes);
    } else {
      this.queueMessage(bytes);
      return -1;
    }
  }

  public queueMessage(bytes: string): boolean {
    this.queue.push(bytes);
    return true;
  }

  @autobind
  public processQueue(): number {
    let numProcessed = 0;

    if (this.queue.length) {

      while (this.queue.length) {
        const object = this.queue.shift();
        if (object !== undefined) {
          this.sendNow(object);
        }
        numProcessed++;
      }
    }

    return numProcessed;
  }
}

export default FifoQueue;
