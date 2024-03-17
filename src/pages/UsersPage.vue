<script setup>
import {ref, onMounted, computed, onBeforeMount} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from "stores/user-store";
import ResponsiveModal from "components/ResponsiveModal.vue";
import {useCustomValidations} from "src/composables/validations";

const userStore = useUserStore();
userStore.updateStateValue('users');

const {t} = useI18n()

const {rules} = useCustomValidations();
const columns = [
  {
    name: 'id',
    required: true,
    label: 'table.sn',
    align: 'left',
    field: 'id',
    sortable: false
  },
  {
    name: 'name',
    required: true,
    label: 'table.name',
    align: 'center',
    field: '',
    sortable: false
  },
  {name: 'email', align: 'center', label: 'table.email', field: 'email', sortable: false},
  {name: 'role', align: 'center', label: 'table.role', field: 'role', sortable: false},
  {name: 'created_at', align: 'left', label: 'table.created_date', field: 'created_at', sortable: true}
]

columns.push({
  name: "actions",
  align: "center",
  label: "table.actions",
  field: "actions",
  sortable: false
});

const rows = ref([])
const filter = ref('');
const openDialog = ref(false);
const loading = ref(false);
const user = ref({});
const userModal = ref(null);
const isPwd = ref(true);
const saveFormData = () => {
  userModal.value.validate().then(success => {
    if (success) {
      console.log(success, 'Success')
    } else {
      loading.value = false;
    }
  })
}
const createUser = () => {
  openDialog.value = true;
}
const fetchUsers = () => {
  userStore.fetchData();
}
fetchUsers();

function onRequest(props) {
  const {page, rowsPerPage, sortBy, descending} = props.pagination

  userStore.serverPagination.page = page;
  userStore.serverPagination.rowsPerPage = rowsPerPage;
  fetchUsers();
}

</script>

<template>
  <q-page class="q-mt-md">
    <div class="q-pa-md">
      <q-table
        flat bordered
        :rows="userStore.all"
        :columns="columns"
        row-key="id"
        v-model:pagination="userStore.serverPagination"
        :loading="userStore.loading"
        :filter="userStore.query"
        binary-state-sort
        @request="onRequest"
        :rows-per-page-label="$t('table.rows_per_page')"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="fa-bold"
            >
              {{ $t(col.label) }}
            </q-th>
          </q-tr>
        </template>
        <template #loading>
          <q-inner-loading
            showing
            color="secondary"
            label="Please wait..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </template>
        <template v-slot:top-left>
          <div class="text-h6">{{ $t(userStore.title) }}</div>
        </template>
        <template v-slot:no-data>
          <p style="font-size:12px">
            <q-icon size="20px" name="warning"/>
            {{ $t('record_not_found') }}
          </p>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td :props="props" key="id">
              {{

                userStore.all.indexOf(props.row) +
                1 +
                userStore.serverPagination.rowsPerPage *
                (userStore.serverPagination.page - 1)
              }}
            </q-td>
            <q-td :props="props" key="name">
              {{ props.row.name }}
            </q-td>
            <q-td :props="props" key="name">
              {{ props.row.email }}
            </q-td>
            <q-td :props="props" key="role">
              {{ props.row.roles }}
            </q-td>
            <q-td :props="props" key="created_at">
              {{ props.row.created_at }}
            </q-td>
            <q-td :props="props" key="actions">
              <div class="q-gutter-sm">
                <q-btn round color="primary" @click="createUser" dense icon="mdi-plus">
                  <q-tooltip>
                    {{ $t('tooltip.add', { name: $t('user') })}}
                  </q-tooltip>
                </q-btn>

                <q-btn round color="secondary" dense icon="mdi-pencil">
                  <q-tooltip>
                    {{ $t('tooltip.edit', { name: $t('user') })}}
                  </q-tooltip>
                </q-btn>

                <q-btn round color="negative" dense icon="mdi-delete">
                  <q-tooltip>
                    {{ $t('tooltip.delete', { name: $t('user') })}}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input outlined dense debounce="300" v-model="userStore.query" :placeholder="$t('table.search')">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>

      </q-table>
    </div>

    <div>
      <ResponsiveModal
        v-model="openDialog"
        :submitting="loading"
        submit-button="submit"
        @save="saveFormData()"
        :width="'900px'"
      >
        <template #title>
          {{ user.id ? $t('tooltip.edit', { name: $t('user') }) : $t('tooltip.add', { name: $t('user') }) }}
        </template>
        <template #body>
          <q-form ref="userModal">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6 col-md-6 col-sm-12">
                <q-input
                  outlined
                  :label="$t('form.name') + ' *'"
                  v-model="user.name"
                  :rules="[rules.required]"
                />
              </div>
              <div class="col-6 col-md-6 col-sm-12">
                <q-input
                  :label="$t('form.email') + ' *'"
                  outlined
                  v-model="user.email"
                  :rules="[rules.required, rules.email]"
                />
              </div>
              <div class="col-6 col-md-6 col-sm-12">
                <q-input v-model="user.password" outlined :label="$t('form.password') + ' *'" :type="isPwd ? 'password' : 'text'" :rules="[rules.required, rules.password]">
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>

          </div>
          </q-form>
        </template>
      </ResponsiveModal>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>

</style>
