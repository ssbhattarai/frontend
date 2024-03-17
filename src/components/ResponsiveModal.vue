<script setup>
  const props = defineProps({
    submitting: {
      type: Boolean,
      default: false
    },
    submitButton: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: "50vh"
    },
    value: {
      type: Boolean,
      default: false
    },
    addnew: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "600px"
    },
  });

  const emit = defineEmits(['input', 'save'])

  const toggle = (value) => {
    emit('input', value)
  }
  const save= () => {
    emit('save');
  }
</script>

<template>
  <q-dialog
    persistent
    transition-hide="scale"
    transition-show="scale"
    :value="value"
    @input="toggle"
  >
    <q-card :style="'width:' + width + ';min-width:' + width + ';'">
      <q-card-section class="text-black">
        <q-toolbar>
          <q-toolbar-title>
            <slot name="title"/>
          </q-toolbar-title>

          <q-btn
            size="md"
            :disabled="submitting"
            color="grey-7"
            icon="mdi-window-close"
            flat
            round
            dense
            v-close-popup
          />
        </q-toolbar>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section :style="'max-height:' + height + ';'" class="row scroll">
        <div class="col-12" data-v-step="body">
          <slot name="body"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right" class="row items-center no-wrap">
        <div class="col-12">
          <q-btn
            v-if="submitButton && !addnew"
            data-v-step="submit-button"
            :loading="submitting"
            color="green"
            @click="save"
            icon="mdi-content-save"
            class="float-right">
            <div>{{ $t("button." + submitButton) }}</div>
          </q-btn>
          <q-btn-dropdown
            v-if="submitButton && addnew"
            icon="save"
            data-v-step="submit-button"
            :disable="!dirty"
            :loading="submitting"
            color="green"
            split
            @click="save"
            :label="$t('button.' + submitButton)"
            class="float-right">
            <q-list>
              <q-item clickable v-close-popup @click="saveandnew">
                <q-item-section avatar>
                  <q-avatar icon="save" color="primary" text-color="white"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("button.save_new") }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            :disabled="submitting"
            :label="$t('button.cancel')"
            v-close-popup
            class="float-right text-white q-mr-xs"
            color="red"
            icon="mdi-cancel"
          />
        </div>
      </q-card-actions>
    </q-card>
    <!-- style="height: 750px; minWidth: 50vw" -->
    <!-- <q-layout view="hHh lpr fFr" container class="bg-white">
      <q-page-container>
        <q-page data-v-step="body" class="q-pa-md">
          <slot name="body" />
        </q-page>
      </q-page-container>

      <q-footer elevated class="bg-grey-1 text-white">
        <q-toolbar>
          <q-toolbar-title>

          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>-->
  </q-dialog>
</template>

<style scoped>

</style>
