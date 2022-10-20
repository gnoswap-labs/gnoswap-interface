import { GnoClient } from '..';

const ACCOUNT_ADDRESS = 'g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae';
const ACCOUNT_ADDRESS_BLANK = 'g1qgr7980ry7f6rqr9cs6d45y09k5u6dzhjksksn';
const ACCOUNT_ADDRESS_INVALID = 'aaa';

const gnoClient = GnoClient.createByNetworkTest2();

describe('GnoClient, 생성자', () => {
  test('성공', async () => {
    expect(gnoClient).not.toBeNull();
  });

  test('버전', async () => {
    expect(gnoClient.version).toBe('TEST2');
  });
});

describe('GnoClient, 상태검사 - isHealth ', () => {
  test('성공', async () => {
    const isHealth = await gnoClient.isHealth();
    expect(isHealth).toBe(true);
  });
});

describe('GnoClient, 계정조회 - getAccount ', () => {
  test('정상 회원', async () => {
    const account = await gnoClient.getAccount(ACCOUNT_ADDRESS);

    expect(account).toBeInstanceOf(Object);
    expect(account).toHaveProperty('address');
    expect(account).toHaveProperty('coins');
    expect(account).toHaveProperty('publicKey');
    expect(account).toHaveProperty('accountNumber');
    expect(account).toHaveProperty('sequence');

    expect(account.status).toBe('ACTIVE');
  });

  test('트랜잭션이 없는 회원', async () => {
    const account = await gnoClient.getAccount(ACCOUNT_ADDRESS_BLANK);

    expect(account).toBeInstanceOf(Object);
    expect(account).toHaveProperty('address');
    expect(account).toHaveProperty('coins');
    expect(account).toHaveProperty('publicKey');
    expect(account).toHaveProperty('accountNumber');
    expect(account).toHaveProperty('sequence');

    expect(account.status).toBe('IN_ACTIVE');
  });

  test('없는 회원', async () => {
    const account = await gnoClient.getAccount(ACCOUNT_ADDRESS_INVALID);

    expect(account).toBeInstanceOf(Object);
    expect(account).toHaveProperty('address');
    expect(account).toHaveProperty('coins');
    expect(account).toHaveProperty('publicKey');
    expect(account).toHaveProperty('accountNumber');
    expect(account).toHaveProperty('sequence');

    expect(account.status).toBe('NONE');
  });
});

describe('GnoClient, 잔액조회 - getBalances ', () => {
  test('정상 회원 잔액조회', async () => {
    const balances = await gnoClient.getBalances(ACCOUNT_ADDRESS);

    expect(balances).toBeInstanceOf(Object);
    expect(balances).toHaveProperty('balances');
  });

  test('비활성 회원 및 없는회원', async () => {
    const balances = await gnoClient.getBalances(ACCOUNT_ADDRESS_BLANK);

    expect(balances).toBeInstanceOf(Object);
    expect(balances).toHaveProperty('balances');
    expect(balances.balances).toBe('');
  });
});
