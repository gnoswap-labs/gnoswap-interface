import { CommonApiFetcher } from '.';

let fetcher: CommonApiFetcher;

/**
 * 테스트 초기화 함수
 * 1. 환경변수 등록
 * 2. Fetcher 초기화
 */
beforeEach(() => {
  fetcher = new CommonApiFetcher({
    chainId: 'test2',
    chainName: 'Testnet 2',
    addressPrefix: 'g1',
    rpcUrl: 'https://rpc.test2.gno.land',
    gnoUrl: 'https://rpc.test2.gno.land',
    apiUrl: 'https://api.adena.app',
    token: {
      denom: 'GNOT',
      unit: 1,
      minimalDenom: 'gnot',
      minimalUnit: 0.000001,
    },
  });
});

describe('공통 Axios 인스턴스 생성', () => {
  test('성공', () => {
    fetcher = new CommonApiFetcher({
      chainId: 'test2',
      chainName: 'Testnet 2',
      addressPrefix: 'g1',
      rpcUrl: 'https://rpc.test2.gno.land',
      gnoUrl: 'https://rpc.test2.gno.land',
      apiUrl: 'https://api.adena.app',
      token: {
        denom: 'GNOT',
        unit: 1,
        minimalDenom: 'gnot',
        minimalUnit: 0.000001,
      },
    });
  });
});

describe('공통 API 호출', () => {
  test('서버상태 확인 - getHealth', async () => {
    const result = await fetcher.getHealth();

    expect(result).not.toBeUndefined();
  });

  test('(임시) 트랜잭션 내역 조회 - getHistory', async () => {
    const result = await fetcher.getTransactionHistory('g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae');
    expect(Array.isArray(result)).toBeTruthy();
  });
});
