import { GnoClient } from '.';

const ACCOUNT_ADDRESS = 'g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae';
const ACCOUNT_ADDRESS_INITIALIZE = 'g1qgr7980ry7f6rqr9cs6d45y09k5u6dzhjksksn';
const ACCOUNT_ADDRESS_INVALID = 'aaa';

let gnoClient;

/**
 * 테스트 초기화 함수
 * 1. GnoClient 초기화
 * 2. 환경변수 등록
 */
beforeEach(() => {
  require('dotenv').config('./.env');
  gnoClient = GnoClient.createByNetworkTest2();
});

describe('GnoClient, 생성자', () => {
  test('환경변수 확인', async () => {
    const host = process.env.NETWORK_TEST2_HOST;

    expect(host).not.toBeUndefined();
  });

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
  /**
   * 0: description
   * 1: address
   * 2: expected_status
   */
  test.each([
    ['정상회원, 상태값: ACTIVE', ACCOUNT_ADDRESS, 'ACTIVE'],
    ['트랜잭션이 없는 회원, 상태값: IN_ACTIVE', ACCOUNT_ADDRESS_INITIALIZE, 'IN_ACTIVE'],
    ['없는회원, 상태값: NONE', ACCOUNT_ADDRESS_INVALID, 'NONE'],
  ])('%s', async (_, address, expectedStatus) => {
    const account = await gnoClient.getAccount(address);

    expect(account).toBeInstanceOf(Object);
    expect(account).toHaveProperty('address');
    expect(account).toHaveProperty('coins');
    expect(account).toHaveProperty('publicKey');
    expect(account).toHaveProperty('accountNumber');
    expect(account).toHaveProperty('sequence');

    expect(account.status).toBe(expectedStatus);
  });
});

describe('GnoClient, 잔액조회 - getBalances ', () => {
  /**
   * 0: description
   * 1: address
   * 2: expected_has_data
   */
  test.each([
    ['정상회원, 값 존재여부: true', ACCOUNT_ADDRESS, true],
    ['트랜잭션이 없는 회원, 값 존재여부: false', ACCOUNT_ADDRESS_INITIALIZE, false],
    ['없는회원, 값 존재여부: false', ACCOUNT_ADDRESS_INVALID, false],
  ])('%s', async (_, address: string, expectedHasData) => {
    const balances = await gnoClient.getBalances(address);

    expect(balances).toBeInstanceOf(Object);
    expect(balances).toHaveProperty('balances');
    expect(balances.balances !== '').toBe(expectedHasData);
  });
});
