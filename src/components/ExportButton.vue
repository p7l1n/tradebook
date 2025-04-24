<template>
  <button class="export-button" @click="exportToExcel">Экспорт в Excel</button>
</template>

<script>
const json2xls = require('json2xls');

export default {
  name: "ExportButton",
  emits: ["export"],
  props: {
    collection: {
      required: true,
    },
  },
  setup(props) {
    const exportToExcel = () => {
      console.log(props.collection);
    };

    return {
      exportToExcel,
    };
  },
};
</script>

<style lang="scss" scoped>
.export-button {
  width: 130px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: #1d6f42;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #155d35;
  }

  i {
    font-size: 20px;
  }
}
</style>
