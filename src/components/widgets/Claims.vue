<template>
  <div class="widget-claims-wrap">
    <div v-if="selectedItem" class="widget-form">
      <div class="widget-form__field">
        <el-select
          v-model="selectedOrganization"
          clearable
          filterable
          placeholder="Выбор кассы"
          style="width: 100%"
          size="large"
          class="base-btn"
          @change="onSelectOrganization"
        >
          <el-option
            v-for="item in organizationsItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="widget-form__field mini">
        <el-button
          type="success"
          :loading="claimLoading"
          :disabled="!selectedOrganization"
          class="base-btn"
          @click="addClaim('organization')"
        >
          Назначить
        </el-button>
      </div>
      <div class="widget-form__field mini">
        <el-button
          type="danger"
          :loading="claimAdminLoading"
          class="base-btn"
          @click="addClaim('admin')"
        >
          Сделать админом
        </el-button>
      </div>
    </div>
    <div class="widget-claims">
      <div class="widget-claims__title">Пользователи и Роли</div>
      <div class="widget-claims__list">
        <div class="widget-claims__list-item">
          <div class="widget-claims__list-item-field label">Email</div>
          <div class="widget-claims__list-item-field label">Роль</div>
          <div class="widget-claims__list-item-field label">ID</div>
        </div>
        <el-empty
          v-if="!claimList.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            active: selectedItem && selectedItem.userId === item.userId,
          }"
          class="widget-claims__list-item"
          v-for="(item, ndx) in claimList.slice(0, countToShow)"
          :key="ndx"
          @click="selectRow(item)"
        >
          <div class="widget-claims__list-item-field strong">
            {{ item.email }}
          </div>
          <div class="widget-claims__list-item-field">
            {{ getRole(item.claims) }}
          </div>
          <div class="widget-claims__list-item-field">
            {{ item.userId }}
          </div>
          <div
            class="widget-claims__list-item-field remove"
            @click.stop="remove(item)"
          ></div>
        </div>
      </div>
      <div
        v-if="claimList.length >= countToShow"
        class="widget-claims__more"
        @click="showMore"
      >
        Показать еще
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";

import { useStore } from "vuex";

export default {
  components: {},
  props: {
    searchStr: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const selectedItem = ref(null);
    const loading = ref(false);
    const activeRemoveNdx = ref(-1);
    const claimLoading = ref(false);
    const claimAdminLoading = ref(false);
    const selectedOrganization = ref("");
    const organization = ref("");

    const organizationsList = computed(
      () => store.getters["settings/organizationsList"]
    );

    const organizationsItems = computed(() => {
      return organizationsList.value.map((item) => {
        return {
          ...item,
          title: item.name,
          value: item.name,
        };
      });
    });

    function sortByClaimType(data) {
      return [...data].sort((a, b) => {
        const typeA = a.claims?.[0]?.type || "";
        const typeB = b.claims?.[0]?.type || "";
        return typeA.localeCompare(typeB);
      });
    }

    const claimList = computed(() => {
      const list = sortByClaimType(store.getters["claims/claimList"]);
      const search = props.searchStr.toLowerCase();
      if (!search) {
        return list;
      }
      return list.filter((item) => {
        return item.email.toLowerCase().includes(search);
      });
    });

    const countToShow = ref(20);
    const countIncrement = ref(20);

    const showMore = () => {
      countToShow.value += countIncrement.value;
    };

    const getRole = (claims) => {
      const isAdmin = claims.find(
        (role) => role.type === "isAdmin" && role.value === "true"
      );

      if (isAdmin) return "Администратор";

      const org = claims.find((r) => r.type === "organizationId");
      if (org) {
        return (
          organizationsList.value.find((item) => +item.id === +org.value)
            ?.name || "??"
        );
      }
      return "??";
    };

    const onSelectOrganization = (val) => {
      selectedOrganization.value = val;

      organization.value = organizationsList.value.find(
        (item) => item.name === val
      );
    };

    const selectRow = (item) => {
      selectedItem.value = item;
      const org = getRole(item.claims);

      if (!["Администратор", "??"].includes(org)) {
        onSelectOrganization(org);
      } else {
        onSelectOrganization("");
      }
    };

    const addClaim = async (mode) => {
      const claim = {
        userId: selectedItem.value.userId,
      };

      // удалить все права и назначить новые
      await Promise.all(
        selectedItem.value.claims.map(async (claim) => {
          await store.dispatch("claims/removeClaim", {
            userId: selectedItem.value.userId,
            claimType: claim.type,
            claimValue: claim.value,
          });
        })
      );

      if (mode === "admin") {
        claim.claimType = "isAdmin";
        claim.claimValue = "true";

        claimAdminLoading.value = true;

        await store.dispatch("claims/addClaim", claim);
        claimAdminLoading.value = false;
        return;
      }

      claim.claimType = "organizationId";
      claim.claimValue = `${organization.value.id}`;
      claimLoading.value = true;

      await store.dispatch("claims/addClaim", claim);
      claimLoading.value = false;
    };

    const remove = async (user) => {
      await store.dispatch("claims/removeUser", user.userId);
    };

    onMounted(async () => {
      await store.dispatch("claims/fetchClaimList");
    });

    return {
      selectedOrganization,
      organizationsItems,
      claimList,
      selectedItem,
      loading,
      claimLoading,
      claimAdminLoading,
      activeRemoveNdx,
      countIncrement,
      countToShow,
      addClaim,
      selectRow,
      remove,
      showMore,
      getRole,
      onSelectOrganization,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-claims-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.widget-form {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &__field {
    width: 220px;

    &.mini {
      width: 150px;
      margin-left: 10px;
    }
  }
}

.widget-claims {
  width: 100%;
  padding: 0 $paddingSmall;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding-bottom: 10px;

  &__title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: 11px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;

    background-color: $panelColorSecondary;
    color: $textColorWhite;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    height: auto;
  }

  &__list-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    &.editing {
      background-color: #ccc;
    }

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-claims__list-item-field {
        &:nth-child(even) {
          background-color: initial;
        }
      }
    }

    &.editMode {
      &:hover {
        cursor: pointer;
      }
    }
  }

  &__more {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 40px;
    border-radius: $controlRadius;
    background-color: $colorRowGrayActive;
    margin: 0 auto 10px;

    &:hover {
      opacity: 0.8;
    }
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    position: relative;

    &.remove {
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-image: url("~@/assets/icons/remove.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      position: absolute;
      right: 5px;
      top: 6px;
    }

    &.strong {
      color: $textColorBlack;
      font-weight: bold;
    }

    &.green {
      color: $colorGreenDark;
      font-weight: bold;
    }

    &.red {
      color: $colorRedDark;
      font-weight: bold;
    }

    &.label {
      font-size: 10px;
      text-transform: uppercase;
      color: $textColorGrayDark;
      font-weight: bold;
    }

    &.mini {
      font-size: 12px;
    }

    &:nth-child(even) {
      // background-color: $panelColorActive;
    }

    &.clicked {
      cursor: pointer;
    }
  }
}

.mt15 {
  margin-top: 5px;
}
</style>
