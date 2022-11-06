<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ethers } from 'ethers';

import { NTabs, NTabPane } from 'naive-ui';

import { makeKeypair } from '@/utils/rsa/keys';
import { HashAlg, KeyUse } from '@/utils/rsa/types';

import {
  sign, verify,
} from '@/utils/rsa/operations';
import { checkIsKey } from '@/utils/rsa/errors';

const route = useRoute();
const router = useRouter();

const message = 'My secret message';

// const connectWallet = async () => {
//   provider = new ethers.providers.Web3Provider(window.ethereum);
//
//   window.ethereum.on('accountsChanged', ([newAddress]) => {
//     console.log('account changed');
//     console.log(newAddress);
//   });
//
//   await provider.send('eth_requestAccounts', []);
// };

const createVoting = async () => {
  const multipleChoice = false;
  const dateOfStart = Math.round(Date.now() / 1000) - 60;
  const dateOfEnd = Math.round(Date.now() / 1000) + 86400;
  const dateOfEndAddPrivateKeys = Math.round(Date.now() / 1000) + 86400;
  const candidates: { id: number, name: string }[] = [{ id: 0, name: 'yes' }, { id: 1, name: 'no' }];
  const votersCount = 1000;
  // await contract.createVote(multipleChoice, dateOfStart, dateOfEnd, dateOfEndAddPrivateKeys, candidates, votersCount, 10, 12);
};

// onMounted(async () => {
//   await connectWallet();
//   await connectToContract();
//   await createVoting();
// });

onMounted(async () => {
  const keypair = await makeKeypair(512, HashAlg.SHA_256, KeyUse.Write);
  const publicKey = checkIsKey(keypair.publicKey);
  const privateKey = checkIsKey(keypair.privateKey);

  const signature = await sign(message, privateKey, 16);
  const verifyResult = await verify(message, signature, publicKey, 16, HashAlg.SHA_256);

  // const messageSigned = await sign(message, privateKey, 16);
  // const verifyResult = await verify(message, messageSigned, publicKey, 16, HashAlg.SHA_256);
});

const tabsValue = ref(route.name);
const onTabClickHandler = async (tabName: string) => {
  tabsValue.value = tabName;
  await router.push({ name: tabName });
};
</script>

<template>
  <div class="main">
    <h2>Голосования</h2>
    <n-tabs
      v-model:value="tabsValue"
      class="tabs"
      default-value="votes"
      size="large"
      :animated="true"
      :on-update:value="onTabClickHandler"
    >
      <n-tab-pane name="votes" tab="Голосования">
        <router-view />
      </n-tab-pane>
      <n-tab-pane name="my-votes" tab="Мои голосования">
        <router-view />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.main {
  background-color: #ffffff;
  padding: 1.5rem;

  .tabs {
    margin-top: 1rem;
  }
}
</style>
