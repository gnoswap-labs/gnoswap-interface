import { GnoClient } from '..';

const ACCOUNT_ADDRESS = 'g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae';

describe('GnoClient, 생성자', () => {
  test('성공', async () => {
    const gnoClient = GnoClient.createByNetworkTest2();
    expect(gnoClient).not.toBeNull();
  });
});

describe('GnoClient, 상태검사 - isHealth ', () => {
  test('성공', async () => {
    const gnoClient = GnoClient.createByNetworkTest2();
    const isHealth = await gnoClient.isHealth();
    expect(isHealth).toBe(true);
  });
});

describe('GnoClient, 계정조회 - getAccount ', () => {
  test('성공', async () => {
    const gnoClient = GnoClient.createByNetworkTest2();
    const account = await gnoClient.getAccount(ACCOUNT_ADDRESS);

    expect(account).toBeInstanceOf(Object);
    expect(account).toHaveProperty('address');
    expect(account).toHaveProperty('coins');
    expect(account).toHaveProperty('publicKey');
    expect(account).toHaveProperty('accountNumber');
    expect(account).toHaveProperty('sequence');
  });
});

describe('GnoClient, 잔액조회 - getBalances ', () => {
  test('성공', async () => {
    const gnoClient = GnoClient.createByNetworkTest2();
    const balances = await gnoClient.getBalances(ACCOUNT_ADDRESS);

    expect(balances).toBeInstanceOf(Object);
    expect(balances).toHaveProperty('balances');
  });
});
