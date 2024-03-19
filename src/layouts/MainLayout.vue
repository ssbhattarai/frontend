<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <span class="cursor-pointer" @click="goToHome"> {{ $t('app_title') }}</span>
        </q-toolbar-title>
        <q-select
          v-model="locale"
          :options="localeOptions"
          :label="$t('language')"
          label-color="white"
          dense
          options-selected-class="text-primary"
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 100px; color:white"
        />
        <q-separator dark vertical/>

        <q-btn-dropdown dense flat :label="authStore.user.name" icon="mdi-account-circle" color="white">
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section avatar>
                <q-avatar icon="person" color="primary" text-color="white"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('profile') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar>
                <q-avatar icon="logout" color="negative" text-color="white"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('logout') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>


      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :breakpoint="500"
    >
      <q-list>
        <q-item-label
          header
        >
          {{ $t('essential_links') }}
        </q-item-label>

        <!--        <EssentialLink-->
        <!--          v-for="link in essentialLinks"-->
        <!--          :key="link.title"-->
        <!--          v-bind="link"-->
        <!--        />-->
        <q-scroll-area class="bg-white text-grey-9 rounded-borders"
                       style="height: 200px; max-width: 300px;">
          <q-list padding>

            <template v-for="(item, i) in linksList" :key="i">
              <q-item
                clickable
                v-ripple
                class="GNL__drawer-item text-secondary"
                :active="item.link === route.name"
                :icon="item.icon"
                :label="$t(item.title)"
                :style="item.style"
                :to="{ name: item.link }"
                v-if="item.childs == null"
              >
                <q-item-section avatar>
                  <q-icon v-if="item.icon" :name="item.icon"/>
                  <q-icon v-if="item.img" :name="'img:' + item.img"/>
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    {{ $t(item.title) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-expansion-item
                clickable
                class="GNL__drawer-item"
                expand-separator
                :label="$t(item.title)"
                :icon="item.icon"
                v-if="item.childs != null"
              >
                <template v-for="(childItem, j) in item.childs">
                  <q-item
                    :key="j"
                    :to="{
                      name: childItem.link,
                      params: childItem.params,
                      query: childItem.query
                    }"
                    clickable
                    class="q-ml-md"
                    v-close-popup
                    :active="childItem.link === route.name"
                    active-class="bg-grey-3 text-primary"
                    v-if="childItem.childs == null
                    "
                  >
                    <q-item-section side v-if="childItem.icon">
                      <q-icon :name="childItem.icon" :color="route.name == childItem.link ? 'primary' : 'grey-6'"/>
                    </q-item-section>
                    <q-item-section side v-if="childItem.img">
                      <q-avatar color="white" rounded>
                        <q-icon
                          size="30px"
                          :name="'img:' + childItem.img"
                          color="white"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label color="secondary"
                      >{{ $t(childItem.title) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-expansion-item
                    :key="'btn-next' + j"
                    clickable
                    class="GNL__drawer-item q-ml-md"
                    expand-separator
                    :label="$t(childItem.title)"
                    :icon="childItem.icon"
                    v-else-if="childItem.childs != null ">
                    <template v-for="(childchildItem, j) in childItem.childs">
                      <template>
                        <q-item
                          :key="j"
                          :to="{
                            name: childchildItem.link,
                            params: childchildItem.params,
                            query: childchildItem.query
                          }"
                          clickable
                          class="q-ml-md"
                          v-close-popup
                          v-if="childchildItem.childs == null"
                        >
                          <q-item-section side v-if="childchildItem.icon">
                            <q-icon :name="childchildItem.icon" color="dark"/>
                          </q-item-section>
                          <q-item-section side v-if="childchildItem.img">
                            <q-avatar color="white" rounded>
                              <q-icon
                                size="30px"
                                :name="'img:' + childchildItem.img"
                                color="white"
                              />
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label color="primary"
                            >{{ $t(childchildItem.title) }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </template>
                  </q-expansion-item>
                </template>
              </q-expansion-item>
            </template>
          </q-list>
        </q-scroll-area>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useAuthStore} from "stores/auth-store";


export default defineComponent({
  name: 'MainLayout',

  setup() {
    const router = useRouter();
    const $q = useQuasar()
    const route = useRoute();
    const leftDrawerOpen = ref(false)
    const {locale} = useI18n({useScope: 'global'})

    locale.value = $q.localStorage.has('lang') ? $q.localStorage.getItem('lang') : 'en-US'


    const authStore = useAuthStore();

    const linksList = [
      {
        title: 'users_management',
        icon: 'mdi-account-box-multiple',
        link: "User",
        childs: [
          {
            title: 'permissions',
            icon: 'mdi-account-multiple',
            link: "Permission",
            childs: null
          },
          {
            title: 'roles',
            icon: 'mdi-account-multiple',
            link: "Role",
            childs: null
          },
          {
            title: 'users',
            icon: 'mdi-account-multiple',
            link: "User",
            childs: null
          }
        ],
      },
    ]

    const onChangeLocale = (e) => {
      console.log(e.target.value);
    }

    const goToHome = () => {
      router.push({name: "Home"})
    }
    const logout = () => {
      api.post('logout').then(res => {
        $q.localStorage.remove(process.env.ACCESS_KEY_NAME);
        router.push({name: "Login"});
      })
    }

    watch(locale,  (newLang) => {
      $q.localStorage.set('lang', newLang)
    })
    return {
      onChangeLocale,
      authStore,
      route,
      goToHome,
      logout,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      linksList,
      locale,
      localeOptions: [
        {value: 'en-US', label: 'English'},
        {value: 'ne', label: 'नेपाली'}
      ],
    }
  }
})
</script>

<style scoped>
.q-field__native .row .items-center span {
  color: white!important;
}
</style>
