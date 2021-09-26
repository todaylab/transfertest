# 一 启动网络
polkadot-launch config.json

# 二 安装依赖包
cd transfertest
yarn

# 三 运行测试脚本
yarn dev

# 四 查看测试结果
```
yarn run v1.22.11
$ ts-node ./src/index.ts
########## begin test
2021-09-26 19:12:10        METADATA: Unknown types found, no types for SpecVersion
########## before
2021-09-26 19:12:13        METADATA: Unknown types found, no types for SpecVersion
@@@@relaychain account_balance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY 8179818593063518n
####parachain account_balance 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 11819759978229967n
#### transfer amount 200000000000000
Status of transfer: Ready
Status of transfer: Broadcast
Status of transfer: InBlock
########## after
2021-09-26 19:12:27        METADATA: Unknown types found, no types for SpecVersion
@@@@relaychain account_balance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY 7979800461697526n
Success 0x2ef57168cc025dc55d8f0c082858603af296c2339cd9f1f61faa8ba86bb2880a
####parachain account_balance 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 12019735978229967n
########## crocess relaychain to parachain end
//////////////////////////////////////////////////
########## test crocess parachain to relaychain
########## before
####parachain account_balance 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 12019735978229967n
2021-09-26 19:13:14        METADATA: Unknown types found, no types for SpecVersion
@@@@relaychain account_balance 5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y 10000000011400000n
#### transfer amount 7000000
Status of transfer: Ready
{ ready: null }
Status of transfer: InBlock
{
  inBlock: '0xd079f7bcf46e4f7c71e2f41d61458e6324f24ed55b037efc983de32c21e89c19'
}
########## after
####parachain account_balance 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 12019735971229967n
2021-09-26 19:13:59        METADATA: Unknown types found, no types for SpecVersion
@@@@relaychain account_balance 5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y 10000000015200000n
########## end
```