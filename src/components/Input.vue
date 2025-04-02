<template>
  <div class="ui-input">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      @input="updateInputValue"
      :class="{ disabled, gray, red, green }"
      class="ui-input__input"
    />
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
    },
    type: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    gray: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
    green: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const updateInputValue = (event) => {
      const input = event.target;
      emit("update:modelValue", input.value);
    };

    return {
      updateInputValue,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.ui-input {
  display: flex;
  align-items: center;
  width: 100%;

  &__input {
    border: 1px solid transparent;
    outline: none;
    height: 40px;
    padding: 0 10px;
    border-radius: $controlRadius;
    width: 100%;

    &.gray {
      background-color: $panelColorLight;
    }

    &.red {
      background-color: $lightRed;
    }

    &.green {
      background-color: $lightGreen;
    }

    &.disabled {
      border: 1px solid #ccc;
    }
  }
}
</style>
