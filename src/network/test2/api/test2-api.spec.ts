import { Test2ApiFetcher } from '.';

let fetcher: Test2ApiFetcher;

/**
 * 테스트 초기화 함수
 * 1. 환경변수 등록
 * 2. Fetcher 초기화
 */
beforeEach(() => {
  fetcher = new Test2ApiFetcher();
});

describe('테스트넷2 Axios 인스턴스 생성', () => {
  test('성공', () => {
    const fetcher = new Test2ApiFetcher();

    expect(fetcher).not.toBeNull();
  });
});

describe('테스트넷2 API 호출', () => {
  test('서버상태 확인 - getHealth', async () => {
    const result = await fetcher.getHealth();

    expect(result).not.toBeUndefined();
  });

  test(' - getNetwrokInfo', async () => {
    const result = await fetcher.getNetwrokInfo();

    expect(result).not.toBeUndefined();
  });

  test(' - getGenesis', async () => {
    // const result = await fetcher.getGenesis();
    // expect(result).not.toBeUndefined();
  });

  test(' - getBlocks', async () => {
    const result = await fetcher.getBlocks(1, 2);

    expect(result).not.toBeUndefined();
  });

  test(' - getBlock', async () => {
    const result = await fetcher.getBlock(100);

    expect(result).not.toBeUndefined();
  });

  test(' - getBlockResults', async () => {
    const result = await fetcher.getBlockResults(1);

    expect(result).not.toBeUndefined();
  });

  test(' - getBlockCommit', async () => {
    const result = await fetcher.getBlockCommit(1);

    expect(result).not.toBeUndefined();
  });

  test(' - getValidators', async () => {
    const result = await fetcher.getValidators();

    expect(result).not.toBeUndefined();
  });

  test(' - getConsensusState', async () => {
    const result = await fetcher.getConsensusState();

    expect(result).not.toBeUndefined();
  });

  test(' - getConsensusParams', async () => {
    const result = await fetcher.getConsensusParams(1);

    expect(result).not.toBeUndefined();
  });

  test(' - getUnconfirmedTxs', async () => {
    const result = await fetcher.getUnconfirmedTxs();

    expect(result).not.toBeUndefined();
  });

  test(' - getNumUnconfirmedTxs', async () => {
    const result = await fetcher.getNumUnconfirmedTxs();

    expect(result).not.toBeUndefined();
  });

  test(' - broadcastTxCommit', async () => {
    const result = await fetcher.broadcastTxCommit('1');

    // expect(result).not.toBeUndefined();
  });

  test(' - broadcastTxSync', async () => {
    const result = await fetcher.broadcastTxSync('1');

    // expect(result).not.toBeUndefined();
  });

  test(' - broadcastTxAsync', async () => {
    const result = await fetcher.broadcastTxAsync('1');

    // expect(result).not.toBeUndefined();
  });

  test(' - getAbciInfo', async () => {
    const result = await fetcher.getAbciInfo();

    expect(result).not.toBeUndefined();
  });

  test(' - executeAbciQuery', async () => {
    const result = await fetcher.executeAbciQuery('GET_ACCOUNT_INFO', { account: 'a' });

    expect(result).not.toBeUndefined();
  });

  test('(임시) 트랜잭션 내역 조회 - getHistory', async () => {
    const result = await fetcher.getTransactionHistory('g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae');
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('height');
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('hash');
    expect(result[0]).toHaveProperty('result');
    expect(result[0]).toHaveProperty('type');
    expect(result[0]).toHaveProperty('from');
    expect(result[0]).toHaveProperty('to');
    expect(result[0]).toHaveProperty('send');
    expect(result[0]).toHaveProperty('func');
    expect(result[0]).toHaveProperty('fee');
  });
});
