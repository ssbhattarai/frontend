<script setup>
import {ref, onMounted, computed, onBeforeMount} from 'vue'
import { useI18n } from 'vue-i18n'
import {useUserStore} from "stores/user-store";
import {api} from "boot/axios";


const userStore = useUserStore();

const { t } = useI18n()

const columns = [
  {
    name:'id',
    required: true,
    label: 'table.sn',
    align: 'left',
    field: 'id',
    sortable: false
  },
  {
    name:'name',
    required: true,
    label: 'table.name',
    align: 'center',
    field: '',
    sortable: false
  },
  { name: 'email', align: 'center', label: 'table.email', field: 'email', sortable: false },
  { name: 'role', align: 'center', label: 'table.role', field: 'role', sortable: false },
  { name: 'created_at',align: 'left', label: 'table.created_date', field: 'created_at', sortable: true }
]

const rows = ref([])
const filter = ref('');

const fetchUsers = () => {
  userStore.fetchData();
}
fetchUsers();
function onRequest (props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

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
          <div class="text-h6">{{ $t('users') }}</div>
        </template>
        <template v-slot:no-data>
          <p style="font-size:12px">
            <q-icon size="20px" name="warning"/> {{ $t('record_not_found') }}
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
            <q-td :props="props" key="name">
              User
            </q-td>
            <q-td :props="props" key="created_at">
              {{ props.row.created_at}}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input outlined dense debounce="300" v-model="userStore.query" :placeholder="$t('table.search')">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

      </q-table>
    </div>
  </q-page>
</template>

<style scoped>

</style>
