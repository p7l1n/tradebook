<template>
  <button class="export-button" @click="exportToExcel">Экспорт в Excel</button>
</template>

<script>
import * as XLSX from "xlsx";
import { computed } from "vue";
import moment from "moment";
import { toCurrency } from "@/helpers";

export default {
  name: "ExportButton",
  props: {
    collection: {
      required: true,
    },
    isDk: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const parsedCollection = computed(() => {
      if (props.isDk) {
        return props.collection.map((item) => {
          return {
            Дата: moment(item.date).utcOffset(180).format("DD.MM, HH:mm"),
            Тип: item.type,
            Клиент: item.client,
            Валюта: item.inCurrency,
            Сумма: toCurrency(item.amount),
            Комментарий: item.comment,
          };
        });
      }

      return props.collection.map((item) => {
        return {
          Статус: item.comment.includes("payed")
            ? "Закрыта"
            : item.status == true
            ? "Выполнена"
            : "В ожидании",
          Дата: moment(item.date).utcOffset(180).format("DD.MM, HH:mm"),
          Тип: item.type,
          Клиент: item.client,
          Оператор: item.operator,
          Приход: item.inCurrency,
          СуммаПриход: toCurrency(item.inAmount),
          Курс: item.rate,
          Расход: item.outCurrency,
          СуммаРасход: toCurrency(item.outAmount),
          Посредник: item.agent,
          ВалютаПосредник: item.agent ? item.agentCurrency : "",
          СуммаПосредник: toCurrency(item.agentAmount),
          // Комментарий: item.comment,
        };
      });
    });

    const exportToExcel = () => {
      try {
        // Создаем новую книгу Excel
        const wb = XLSX.utils.book_new();

        // Преобразуем коллекцию в формат для Excel
        const ws = XLSX.utils.json_to_sheet(parsedCollection.value);

        // Настраиваем ширину колонок
        const colWidths = Object.keys(parsedCollection.value[0] || {}).map(
          () => ({
            wch: 20, // ширина колонки в символах
          })
        );
        ws["!cols"] = colWidths;

        // Добавляем стили для заголовков
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (!ws[address]) continue;
          ws[address].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E6E6E6" } },
            alignment: { horizontal: "center" },
          };
        }

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(wb, ws, "Данные");
        const prefix = props.isDk ? "ДК" : "Заявки";

        // Генерируем файл
        const fileName = `${prefix}_export_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        XLSX.writeFile(wb, fileName);
      } catch (error) {
        console.error("Ошибка при экспорте в Excel:", error);
      }
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
  border-radius: 4px;
  background-color: #1d6f42;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #155d35;
  }
}
</style>
