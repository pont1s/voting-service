<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import {
  NDatePicker, NInput, NDynamicInput, NSelect, NSwitch, NScrollbar,
} from 'naive-ui';

import { exportPublicKey, exportPrivateKey, makeKeypair } from '@/utils/rsa/keys';
import { HashAlg, KeyUse } from '@/utils/rsa/types';

import VButton from '@/components/kit/VButton.vue';
import { checkIsKey } from '@/utils/rsa/errors';
import { messageToHashInt, sign } from '@/utils/rsa/operations';

const form = reactive({
  name: {
    value: '',
  },
  dateOfStart: {
    value: null,
  },
  dateOfEnd: {
    value: null,
  },
  dateOfEndAddPrivateKeys: {
    value: null,
  },
  candidates: {
    value: ['', ''],
  },
  multipleChoice: {
    value: false,
  },
  voters: {
    value: [],
    options: [
      {
        label: 'Максим Мостовой',
        value: 123,
      },
      {
        label: 'Дмитрий Сидоров',
        value: 41,
      },
    ],
  },
});

const publicKeyPem = ref('');
const privateKeyPem = ref('');

const isKeysNotEmpty = computed(() => publicKeyPem.value && privateKeyPem.value);

const isVoteCreateAvailable = computed(() => form.name.value && form.dateOfStart.value && form.dateOfEnd.value
  && form.dateOfEndAddPrivateKeys.value && form.voters.value.length > 0 && publicKeyPem.value && privateKeyPem.value);

const onGenerateKeysButtonClickHandler = async () => {
  const keypair = await makeKeypair(512, HashAlg.SHA_256, KeyUse.Write);
  const publicKey = checkIsKey(keypair.publicKey);
  const privateKey = checkIsKey(keypair.privateKey);

  publicKeyPem.value = await exportPublicKey(publicKey);
  privateKeyPem.value = await exportPrivateKey(privateKey);

  // const signature = await sign('Hello world!', privateKey, 16);
  //
  // const signatureNumber = (new Uint8Array(signature)).toString();
};

const onFormSubmitHandler = (e: Event) => {
  console.log('submit');
};
</script>

<template>
  <div class="vote-create">
    <h2>Новое голосование</h2>
    <div class="vote-create-container">
      <form class="vote-create-form" @submit.prevent="onFormSubmitHandler">
        <div class="form-input">
          <div class="form-input-label">
            Название голосования
          </div>
          <n-input
            v-model:value="form.name.value"
            placeholder="Название голосования"
            size="large"
          />
        </div>
        <div class="form-input">
          <div class="form-input-label">
            Дата начала голосования
          </div>
          <n-date-picker
            v-model:value="form.dateOfStart.value"
            type="datetime"
            placeholder="Дата начала голосования"
            size="large"
            :update-value-on-close="true"
          />
        </div>
        <div class="form-input">
          <div class="form-input-label">
            Дата окончания голосования
          </div>
          <n-date-picker
            v-model:value="form.dateOfEnd.value"
            type="datetime"
            placeholder="Дата окончания голосования"
            size="large"
            :update-value-on-close="true"
          />
        </div>
        <div class="form-input">
          <div class="form-input-label">
            Дата окончания приема закрытых ключей
          </div>
          <n-date-picker
            v-model:value="form.dateOfEndAddPrivateKeys.value"
            type="datetime"
            placeholder="Дата окончания приема закрытых ключей"
            size="large"
            :update-value-on-close="true"
          />
        </div>
        <div class="form-input">
          <div class="form-input-label">
            Варианты голосования
          </div>
          <n-dynamic-input
            v-model:value="form.candidates.value"
            placeholder="Введите название варианта голосования"
            :min="2"
          />
          <div class="form-input-inline">
            <n-switch v-model:value="form.multipleChoice.value" />
            <div class="form-input-label-inline">разрешить выбор нескольких вариантов</div>
          </div>
        </div>
        <div class="form-input">
          <div class="form-input-label">
            Выберите избирателей
          </div>
          <n-select
            v-model:value="form.voters.value"
            :multiple="true"
            :filterable="true"
            :options="form.voters.options"
            placeholder="Избиратели"
            size="large"
          />
        </div>
        <div v-if="isKeysNotEmpty" class="vote-keys">
          <div class="vote-keys-item">
            <div class="form-input-label">
              Открытый ключ
            </div>
            <div class="vote-keys-item-content">
              <n-scrollbar>
                <div class="vote-keys-item-text">
                  {{ publicKeyPem }}
                </div>
              </n-scrollbar>
            </div>
          </div>
          <div class="vote-keys-item">
            <div class="form-input-label">
              Закрытый ключ
            </div>
            <div class="vote-keys-item-content">
              <n-scrollbar>
                <div class="vote-keys-item-text">
                  {{ privateKeyPem }}
                </div>
              </n-scrollbar>
            </div>
          </div>
        </div>
        <v-button
          v-if="!isKeysNotEmpty"
          class="vote-create-action"
          type="primary"
          @click="onGenerateKeysButtonClickHandler"
        >
          Сгенерировать ключи
        </v-button>
        <v-button
          v-else
          class="vote-create-action"
          type="primary"
          native-type="submit"
          :disabled="isVoteCreateAvailable"
        >
          Создать голосование
        </v-button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vote-create {
  padding: 1.5rem;

  .vote-create-form {
    @media (min-width: 927px) {
      max-width: 50%;
    }
  }

  .vote-create-container {
    margin-top: 1rem;
  }

  .form-input-inline {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .form-input {
    margin-top: 1rem;
  }

  .vote-create-action {
    margin-top: 1rem;
  }

  .form-input-label {
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }

  .form-input-label-inline {
    color: var(--color-text-secondary);
  }

  .vote-keys {
    margin-top: 1rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1rem;
    max-height: 200px;

    .vote-keys-item {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      .vote-keys-item-content {
        background-color: #f3f3f6;
        width: 100%;
        height: 100%;
        padding: 1rem;
        border-radius: var(--border-radius-default);
        overflow-y: auto;

        .vote-keys-item-text {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
