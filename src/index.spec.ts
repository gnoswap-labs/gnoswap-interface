import { GnoClient } from '.';

test('two plus two is four', async () => {
  const address = 'g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae';
  const password = 'qkffhr12';

  const gnoClient = GnoClient.createByNetworkTest2();
  const account = await gnoClient.getAccount(address);
  console.log(account);
  const balances = await gnoClient.getBalances(address);
  console.log(balances);
});
