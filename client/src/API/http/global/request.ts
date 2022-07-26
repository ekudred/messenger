import FP from '@fingerprintjs/fingerprintjs'

export class GlobalAPI {
  public static async getResultFP() {
    return await FP.load().then((agent) => agent.get())
  }
}
