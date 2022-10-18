import { Secp256k1HdWallet } from '@cosmjs/amino';

export default class GnoClient {
  private address: string;

  constructor(address: string) {
    this.address = address;
  }

  public async getWallet(passowrd: string) {
    const secp256k1HdWallet: Secp256k1HdWallet = await Secp256k1HdWallet.deserialize(
      this.address,
      passowrd,
    );

    return secp256k1HdWallet;
  }
}
