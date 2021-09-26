import  { ApiPromise, WsProvider, Keyring} from '@polkadot/api';
import { BN } from "@polkadot/util";
//import  { TokenSymbol } from 'domain-types/src/interfaces/types';
import { EventRecord, ExtrinsicStatus, MultiLocation } from '@polkadot/types/interfaces';
import type { Struct, u128} from '@polkadot/types';

export interface BalanceInfo extends Struct {
  free: u128;
}


const TEST_ACCOUNT_1 = '5EHjz3qRqXnFmfb3uKSCaVm47a2gHvk4ZjTbrF387YZJQQn4';
const TEST_ACCOUNT_2 = '5DCgh4vdAzr95gWYEaNzNXgxQ8tHuFL5jB4JgpaCK2ChabKW';

const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const CHARLIE = '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';

                                      //7000000000000000
const relay_chain_to_parachain_amount = 200000000000000;
const para_chain_to_relaychain_amount = 7000000;


const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main () {
    console.log("########## begin test");

  {
      const provider = new WsProvider('ws://127.0.0.1:9944');
      const api = await ApiPromise.create({
          provider
      });

      const keyring = new Keyring({ type: 'sr25519' });
      const alice = keyring.addFromUri('//Alice', { name: 'Alice' });
      const bob = keyring.addFromUri('//Bob', { name: 'Bob' });

      console.log("########## before");
      await getRelaychainAccountBalance(ALICE);
      await getParachainAccountBalance(BOB);

      let tt =  api.tx.xcmPallet.reserveTransferAssets( 
          {X1:{Parachain: 200}}, 
          {X1: {AccountId32: {"id": BOB}}},
          [{ConcreteFungible: {"id":"Here","amount": relay_chain_to_parachain_amount} }],
          30000000000
      )

      console.log("#### transfer amount", relay_chain_to_parachain_amount);

      //console.log("### tt", tt.method.args.toString());
      await tt.signAndSend(alice, ({ events = [], status}: { events?: EventRecord[], status: ExtrinsicStatus; }) => {
          if (status.isFinalized) {
              console.log('Success', status.asFinalized.toHex());
          } else {
              console.log('Status of transfer: ' + status.type);
          }

          // events.forEach(({ phase, event: { data, method, section } }) => {
          //     console.log(phase + ' : ' + section + '.' + method + ' ' + data);
          // });
      });
      await sleep(10000);

      console.log("########## after");
      await getRelaychainAccountBalance(ALICE);
      await sleep(40000);
      await getParachainAccountBalance(BOB);
  }


  console.log("########## crocess relaychain to parachain end");

  console.log("//////////////////////////////////////////////////");

  console.log("########## test crocess parachain to relaychain");

  {
    const provider = new WsProvider('ws://127.0.0.1:9988');
    const api = await ApiPromise.create({
        provider,
        typesAlias: {
          "tokens": {
            "AccountData": 'OrmlAccountData',
            "BalanceLock": 'OrmlBalanceLock'
          }
        },
        types: {
          "AssetInstance": "AssetInstanceV0",
          "MultiAsset": "MultiAssetV0",
          "MultiLocation": "MultiLocationV0",
          "Response": "ResponseV0",
          "Xcm": "XcmV0",
          "XcmOrder": "XcmOrderV0",
          
          "OrmlAccountData": {
            "free": "Balance",
            "reserved": "Balance",
            "frozen": "Balance"
          },
          "OrmlBalanceLock": {
            "amount": "Balance",
            "id": "LockIdentifier"
          },
          "CurrencyId": {
              "_enum": {
                  "Token": "TokenSymbol",
                  "DEXShare": "(TokenSymbol, TokenSymbol)",
                  "ERC20": "EvmAddress",
                  "ChainSafe": "[u8; 32]"
              }
          },
          "EvmAddress": "H160",
          "Currency": "CurrencyIdOf",
          "CurrencyIdOf": "CurrencyId",
          "Amount": "i128",
          "AmountOf": "Amount",
          "Order": {
              "base_currency_id": "CurrencyId",
              "base_amount": "Compact<Balance>",
              "target_currency_id": "CurrencyId",
              "target_amount": "Compact<Balance>",
              "owner": "AccountId"
          },
          "OrderOf": "Order",
          "OrderId": "u32",
          "Balance": "u128",
          "AuctionId": "u32",
          "CID": "Vec<u8>",
          "ClassId": "u32",
          "ClassIdOf": "ClassId",
          "TokenId": "u64",
          "TokenIdOf": "TokenId",
          "ClassInfoOf": {
              "metadata": "CID",
              "totalIssuance": "TokenId",
              "owner": "AccountId",
              "data": "ClassData"
          },
          "TokenInfoOf": {
              "metadata": "CID",
              "owner": "AccountId",
              "data": "TokenData"
          },
          "ClassData": {
              "deposit": "Balance",
              "properties": "Properties"
          },
          "TokenData": {
              "deposit": "Balance"
          },
          "Properties": {
              "_set": {
                  "_bitLength": 8,
                  "Transferable": 1,
                  "Burnable": 2
              }
          },
          "DomainInfo": {
              "native": "AccountId",
              "bitcoin": "Option<MultiAddress>",
              "ethereum": "Option<MultiAddress>",
              "polkadot": "Option<MultiAddress>",
              "kusama": "Option<MultiAddress>",
              "deposit": "Balance",
              "nft_token": "(ClassId, TokenId)"
          },
          "TokenSymbol": {
              "_enum": {
                  "NAME": 0,
                  "AUSD": 1,
                  "DOT": 2,
                  "LDOT": 3,
                  "RENBTC": 4,
                  "KAR": 128,
                  "KUSD": 129,
                  "KSM": 130,
                  "LKSM": 131
              }
          },
          "PoolDetails": {
              "maker": "AccountId",
              "taker": "Option<AccountId>",
              "token0": "(ClassId, TokenId)",
              "token1": "CurrencyId",
              "total1": "Balance"
          },
          "AuctionDetails": {
              "creator": "AccountId",
              "winner": "Option<AccountId>",
              "token0": "(ClassId, TokenId)",
              "token1": "CurrencyId",
              "min1": "Balance",
              "duration": "BlockNumber",
              "start_at": "BlockNumber"
          }
        }
    });

    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice' });
    const bob = keyring.addFromUri('//Bob', { name: 'Bob' });

    
    // const transfer = api.tx.balances.transfer(ALICE, 12345);
    // const hash = await transfer.signAndSend(bob);
    // console.log('Transfer sent with hash', hash.toHex());


    console.log("########## before");
    await getParachainAccountBalance(BOB);
    await getRelaychainAccountBalance(CHARLIE);

    let tt =  api.tx.xTokens.transfer( 
        {"token":"DOT"},
        new BN(para_chain_to_relaychain_amount),
        {X2: ["Parent", {"AccountId32":{network: "Any",id: CHARLIE}}]},
        400000, 
    );
    console.log("#### transfer amount", para_chain_to_relaychain_amount);

    //console.log("### tt", tt.method.args.toString());
    //console.log("### tt tx", tt.toString());

    let hash = await tt.signAndSend(bob, ({ events = [], status}) => {
        if (status.isFinalized) {
            console.log('Success', status.asFinalized.toHex());
        } else {
            console.log('Status of transfer: ' + status.type);
        }

        console.log(status.toJSON());

    });
    
    await sleep(40000);

    console.log("########## after");
    await getParachainAccountBalance(BOB);
    await getRelaychainAccountBalance(CHARLIE);
  }

  console.log("########## end");

}

async function getRelaychainAccountBalance(accountId: string) {
  {
    const provider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({
        provider
    });

    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice' });
    const bob = keyring.addFromUri('//Bob', { name: 'Bob' });

    let account_balance = await api.query.system.account(accountId);
    const balanceTest = (account_balance.data as BalanceInfo);
    console.log("@@@@relaychain account_balance", accountId, balanceTest.free.toBigInt());
  }
}

async function getParachainAccountBalance(accountId: string) {
  {
    const provider = new WsProvider('ws://127.0.0.1:9988');
    const api = await ApiPromise.create({
        provider,
        typesAlias: {
          "tokens": {
            "AccountData": 'OrmlAccountData',
            "BalanceLock": 'OrmlBalanceLock'
          }
        },
        types: {
          "OrmlAccountData": {
            "free": "Balance",
            "reserved": "Balance",
            "frozen": "Balance"
          },
          "OrmlBalanceLock": {
            "amount": "Balance",
            "id": "LockIdentifier"
          },
          "CurrencyId": {
              "_enum": {
                  "Token": "TokenSymbol",
                  "DEXShare": "(TokenSymbol, TokenSymbol)"
              }
          },
          "Currency": "CurrencyIdOf",
          "CurrencyIdOf": "CurrencyId",
          "Amount": "i128",
          "AmountOf": "Amount",
          "Order": {
              "base_currency_id": "CurrencyId",
              "base_amount": "Compact<Balance>",
              "target_currency_id": "CurrencyId",
              "target_amount": "Compact<Balance>",
              "owner": "AccountId"
          },
          "OrderOf": "Order",
          "OrderId": "u32",
          "Balance": "u128",
          "AuctionId": "u32",
          "CID": "Vec<u8>",
          "ClassId": "u32",
          "ClassIdOf": "ClassId",
          "TokenId": "u64",
          "TokenIdOf": "TokenId",
          "ClassInfoOf": {
              "metadata": "CID",
              "totalIssuance": "TokenId",
              "owner": "AccountId",
              "data": "ClassData"
          },
          "TokenInfoOf": {
              "metadata": "CID",
              "owner": "AccountId",
              "data": "TokenData"
          },
          "ClassData": {
              "deposit": "Balance",
              "properties": "Properties"
          },
          "TokenData": {
              "deposit": "Balance"
          },
          "Properties": {
              "_set": {
                  "_bitLength": 8,
                  "Transferable": 1,
                  "Burnable": 2
              }
          },
          "DomainInfo": {
              "native": "AccountId",
              "bitcoin": "Option<MultiAddress>",
              "ethereum": "Option<MultiAddress>",
              "polkadot": "Option<MultiAddress>",
              "kusama": "Option<MultiAddress>",
              "deposit": "Balance",
              "nft_token": "(ClassId, TokenId)"
          },
          "TokenSymbol": {
              "_enum": {
                  "NAME": 0,
                  "AUSD": 1,
                  "DOT": 2,
                  "LDOT": 3,
                  "RENBTC": 4,
                  "KAR": 128,
                  "KUSD": 129,
                  "KSM": 130,
                  "LKSM": 131
              }
          },
          "PoolDetails": {
              "maker": "AccountId",
              "taker": "Option<AccountId>",
              "token0": "(ClassId, TokenId)",
              "token1": "CurrencyId",
              "total1": "Balance"
          },
          "AuctionDetails": {
              "creator": "AccountId",
              "winner": "Option<AccountId>",
              "token0": "(ClassId, TokenId)",
              "token1": "CurrencyId",
              "min1": "Balance",
              "duration": "BlockNumber",
              "start_at": "BlockNumber"
          }
        }
    });

      let account_balance = await api.query.tokens.accounts(accountId, {token: "dot"});
      const balanceTest = (account_balance as BalanceInfo);
      console.log("####parachain account_balance", accountId, balanceTest.free.toBigInt());

  }

}
main().catch(console.error).finally(() => process.exit());