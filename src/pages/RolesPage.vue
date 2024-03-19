<script setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import ResponsiveModal from "components/ResponsiveModal.vue";
import {useCustomValidations} from "src/composables/validations";
import { date } from 'quasar'
import _ from 'lodash';
import { useQuasar } from 'quasar'
import {useRoleStore} from "stores/role-store";


const roleStore = useRoleStore();
roleStore.updateStateValue('roles');

const {t} = useI18n()
const {rules} = useCustomValidations();
const $q = useQuasar()

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
    name: 'permission',
    required: true,
    label: 'permission',
    align: 'center',
    field: 'permission',
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
  {
    name: 'group',
    required: true,
    label: 'table.group',
    align: 'center',
    field: '',
    sortable: false
  },
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
const permission = ref(roleStore.permission);
const permissionModal = ref(null);

const createPermission = () => {
  openDialog.value = true;
}

const editPermission = (row) => {
  openDialog.value = true;
  roleStore.permission = _.clone(row);
}

const fetchPermissions = () => {
  roleStore.fetchData();
}
fetchPermissions();

function onRequest(props) {
  const {page, rowsPerPage, sortBy, descending} = props.pagination

  roleStore.serverPagination.page = page;
  roleStore.serverPagination.rowsPerPage = rowsPerPage;
  fetchPermissions();
}

const savePermission = () => {
  permissionModal.value.validate().then(success => {
    if (success) {
      roleStore.createData().then(res => {
        if (res.status == 201){
          openDialog.value = false;
          permission.value = roleStore.permission;
          fetchPermissions()
        }
      }).finally(()=> {
        loading.value = false;
      })
    } else {
      loading.value = false;
    }
  })
}

const updatePermission = () => {
  permissionModal.value.validate().then(success => {
    if (success) {
      const permissionId = roleStore.permission.id;
      roleStore.updatePermission(permissionId).then(res => {
        if (res.status == 200){
          openDialog.value = false;
          permission.value = roleStore.permission;
          fetchPermissions()
        }
      }).finally(()=> {
        loading.value = false;
      })
    } else {
      loading.value = false;
    }
  })
}

const deletePermission = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: t('do_you_want_to_delete'),
    persistent: true,
    ok: {
      push: true,
      color: 'primary',
      label: t('button.ok')
    },
    cancel: {
      push: true,
      color: 'negative',
      label: t('button.cancel')
    },
  }).onOk(data => {
    roleStore.deletePermission(row.id).then(res => {

    });
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}


</script>

<template>
  <q-page class="q-mt-md">
    <div class="q-pa-md">
      <q-table
        flat bordered
        :rows="roleStore.all"
        :columns="columns"
        row-key="id"
        v-model:pagination="roleStore.serverPagination"
        :loading="roleStore.loading"
        :filter="roleStore.query"
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

          <div class="text-h6">{{ $t(roleStore.title) }}</div>
          <div class="q-ml-md">
            <q-input outlined dense debounce="300" v-model="roleStore.query" :placeholder="$t('table.search')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>

        </template>
        <template v-slot:top="props">
          <div class="col-2 q-table__title">{{ $t(roleStore.title) }}</div>

          <q-space />
            <q-input outlined dense debounce="300" v-model="roleStore.query" :placeholder="$t('table.search')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>

          <div class="q-ml-md q-gutter-md">
            <q-btn round color="primary" @click="createPermission" dense icon="mdi-plus">
              <q-tooltip>
                {{ $t('tooltip.add', { name: $t('permission') })}}
              </q-tooltip>
            </q-btn>
          </div>

          <q-btn
            round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />

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

                roleStore.all.indexOf(props.row) +
                1 +
                roleStore.serverPagination.rowsPerPage *
                (roleStore.serverPagination.page - 1)
              }}
            </q-td>
            <q-td :props="props" key="permission">
              {{ props.row.name }}
            </q-td>
            <q-td :props="props" key="name">
              {{ props.row.title }}
            </q-td>
            <q-td :props="props" key="group">
              {{ props.row.group }}
            </q-td>
            <q-td :props="props" key="created_at">
              {{ date.formatDate(props.row.created_at, 'DD MMMM, YYYY') }}
            </q-td>
            <q-td :props="props" key="actions">
              <div class="q-gutter-sm">
                <q-btn round color="secondary" dense icon="mdi-pencil" @click="editPermission(props.row)">
                  <q-tooltip>
                    {{ $t('tooltip.edit', { name: $t('permission') })}}
                  </q-tooltip>
                </q-btn>

                <q-btn round color="negative" dense icon="mdi-delete" @click="deletePermission(props.row)">
                  <q-tooltip>
                    {{ $t('tooltip.delete', { name: $t('permission') })}}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <ResponsiveModal
      v-model="openDialog"
      :submitting="loading"
      submit-button="submit"
      @save="roleStore.permission.id ? updatePermission() : savePermission()"
      :width="'900px'"
    >
      <template #title>
        {{ roleStore.permission.id ? $t('tooltip.edit', { name: $t('permission') }) : $t('tooltip.add', { name: $t('permission') }) }}
      </template>
      <template #body>
        <q-form ref="permissionModal">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6 col-md-6 col-sm-12">
                <q-input
                  outlined
                  :label="$t('permission') + ' *'"
                  v-model="roleStore.permission.name"
                  :rules="[rules.required]"
                />
              </div>
              <div class="col-6 col-md-6 col-sm-12">
                <q-input
                  outlined
                  :label="$t('form.name') + ' *'"
                  v-model="roleStore.permission.title"
                  :rules="[rules.required]"
                />
              </div>
              <div class="col-6 col-md-6 col-sm-12">
                <q-input
                  outlined
                  :label="$t('form.group') + ' *'"
                  v-model="roleStore.permission.group"
                  :rules="[rules.required]"
                />
              </div>
            </div>

          </div>
        </q-form>
      </template>
    </ResponsiveModal>
  </q-page>
</template>

<style scoped>

</style>
