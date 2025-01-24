<!--
 * @Author: your name
 * @Date: 2021-05-27 15:54:31
 * @LastEditTime: 2021-11-17 17:02:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /soft-otp-admin/src/views/Home.vue
-->
<template>
  <div id="home">
    <a-layout id="home-layout">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo" />
        <a-menu
          :default-selected-keys="['user']"
          :default-open-keys="['report_mng', 'statistics', 'data_import']"
          v-model="selectedMenu"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
          @click="onMenuChanged"
        >
          <a-sub-menu v-for="menu in menus" :key="menu.key">
            <span slot="title"
              ><a-icon :type="menu.type" /><span>{{ menu.title }}</span></span
            >
            <a-menu-item v-for="item in menu.items" :key="item.key">
              {{ item.title }}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggleCollapsed"
          />
          <div class="icons-list">
            <a-space size="middle">
              <a-dropdown>
                <a-icon type="user" />
                <a-menu slot="overlay" @click="onUserMenu">
                  <a-menu-item key="info">
                    {{ this.$t("settings.info.menu") }}
                  </a-menu-item>
                  <a-menu-item key="password">
                    {{ this.$t("settings.password.menu") }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-icon type="logout" @click="onLogout" />
            </a-space>
          </div>
        </a-layout-header>
        <a-breadcrumb :routes="routes" class="navigator">
          <template slot="itemRender" slot-scope="{ route, routes, paths }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.breadcrumbName }}
            </span>

            <router-link v-else :to="'/' + paths.join('/')">
              {{ route.breadcrumbName }}
            </router-link>
          </template>
        </a-breadcrumb>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
    <user-settings v-model="userSettingVisible" />
    <password-dialog v-model="passwordDialogVisible" />
  </div>
</template>

<script>
import PasswordDialog from "./components/PasswordDialog.vue";
import UserSettings from "./components/UserSettings.vue";

export default {
  components: { UserSettings, PasswordDialog },
  name: "Home",
  data: function () {
    return {
      base: "/",
      collapsed: false,
      routes: [],
      selectedMenu: ["user"],

      userSettingVisible: false,
      passwordDialogVisible: false,
      menus: [
        {
          key: "report_mng",
          title: this.$t("home.menu.log"),
          type: "appstore",
          items: [
            {
              key: "user",
              title: this.$t("home.menu.user"),
            },
            {
              key: "dm",
              title: this.$t("home.menu.dm"),
            },
            {
              key: "pm",
              title: this.$t("home.menu.pm"),
            },
            {
              key: "pmo",
              title: this.$t("home.menu.pmo"),
            },
          ],
        },
        {
          key: "statistics",
          title: this.$t("home.menu.worktime"),
          type: "setting",
          items: [
            {
              key: "staff",
              title: this.$t("home.menu.staff"),
            },
            {
              key: "proj_stats",
              title: this.$t("home.menu.proj_stats"),
            },
          ],
        },
        {
          key: "data_import",
          title: this.$t("home.menu.data_import"),
          type: "setting",
          items: [
            {
              key: "proj",
              title: this.$t("home.menu.proj"),
            },
            {
              key: "prod",
              title: this.$t("home.menu.prod"),
            },
          ],
        },
      ],
    };
  },
  computed: {
    menuSelectableKeys() {
      return [
        "user",
        "dm",
        "pm",
        "pmo",
        "staff",
        "proj_stats",
        "pm",
        "proj",
        "prod",
      ];
    },
    roles() {
      return this.$store.state.user.roles;
    },
  },
  mounted() {
    this.$store.dispatch("user/info").then(() => {
      this.menus = this.createMenus();
      this.getMenuName();
      this.createBread();
      if (this.$route.path === "/") {
        this.$router.push("user");
      }
    });
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    onUserMenu({ key }) {
      if (key === "info") {
        this.userSettingVisible = true;
      } else if (key === "password") {
        this.passwordDialogVisible = true;
      }
    },
    onLogout(e) {
      e.preventDefault();
      this.$store
        .dispatch("user/logout")
        .finally(() => this.$router.push("/login"));
    },
    onMenuChanged(e) {
      this.$router.push("/" + e.key);
    },
    getMenuName() {
      const matched = this.$route.matched;
      for (let i = matched.length - 1; i >= 0; i--) {
        let path = matched[i].path;
        let index = path.lastIndexOf("/");
        let key = path.substring(index + 1);
        if (this.menuSelectableKeys.indexOf(key) >= 0) {
          this.selectedMenu = [key];
          break;
        }
      }
    },
    createBread() {
      this.routes = this.$route.matched.map((item) => {
        return {
          path: item.path,
          breadcrumbName: item.name,
        };
      });
    },
    createMenus() {
      const roles = this.roles;
      if (!roles) {
        return;
      }
      const routes = this.$router.options.routes.find(
        (route) => route.name === "Home"
      ).children;
      console.log("routes", routes);
      let menus = [
        {
          key: "report_mng",
          title: this.$t("home.menu.log"),
          type: "appstore",
          items: [],
        },
        {
          key: "statistics",
          title: this.$t("home.menu.worktime"),
          type: "setting",
          items: [],
        },
      ];
      if (roles.indexOf("pmo") > -1) {
        menus.push({
          key: "data_import",
          title: this.$t("home.menu.data_import"),
          type: "setting",
          items: [],
        });
      }
      routes.forEach((route) => {
        if (!route.meta) {
          return;
        }
        const requireRole = route.meta.requireRole;
        const belongMenu = route.meta.inMenu;
        console.log("require role:", requireRole, "roles:", roles);
        // 如果属于某个Menu且没有角色要求,或者满足角色要求就加入到menu
        if (belongMenu && (!requireRole || roles.indexOf(requireRole) > -1)) {
          let menu = menus.find((menu) => menu.key === belongMenu);
          console.log("menu", menu);
          if (menu) {
            menu.items.push({
              key: route.path,
              title: this.$t("home.menu." + route.path),
            });
          }
        }
      });
      console.log("menus", menus);
      return menus;
    },
  },

  watch: {
    $route(to, from) {
      // this.getMenuName();
      this.createBread();
    },
  },
};
</script>

<style>
#home {
  width: 100%;
  height: 100%;
}

#home-layout {
  width: 100%;
  height: 100%;
}

#home-layout .trigger {
  height: 100%;
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  float: left;
}

.icons-list {
  float: right;
  margin: 0 36px;
  font-size: 18px;
}

.icons-list >>> .anticon {
  margin-right: 12px;
  font-size: 24px;
  cursor: pointer;
}

#home-layout .navigator {
  text-align: left;
  padding: 8px 8px;
  margin: 0 8px;
}

#home-layout .content {
  margin: 0px 12px;
  padding: 12px;
  /* background: #fff; */
  min-height: 280px;
  text-align: left;
}

#home-layout .trigger:hover {
  color: #1890ff;
}

#home-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
