/* eslint-disable vue/no-unused-vars */
/* eslint-disable vue/no-unused-vars */
<!--
 * @Author: your name
 * @Date: 2021-09-26 15:34:38
 * @LastEditTime: 2021-11-18 19:15:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /daily-report-frontend/src/views/Report.vue
-->
<template>
  <div id="report" v-title data-title="工作日志-创建">
    <div class="report-frame">
      <a-row :gutter="16">
        <a-col :span="4">
          <a-date-picker :allowClear="false" v-model="onDay"
        /></a-col>
        <a-col :span="4">
          <a-input :default-value="author" addonBefore="Name" disabled />
        </a-col>
        <a-col :span="6">
          <a-input
            :default-value="department"
            addonBefore="Department"
            disabled
          />
        </a-col>
        <a-col :span="4" :offset="6">
          <a-button-group>
            <a-button @click="(e) => update(0)">
              {{ $t("report.button.save") }}
            </a-button>
            <a-button type="primary" @click="(e) => update(1)">
              {{ $t("report.button.submit") }}
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <a-spin :spinning="spinning">
        <a-table
          :columns="columns"
          :data-source="tasks"
          style="margin: 16px"
          :defaultExpandedRowKeys="[0]"
          :pagination="false"
        >
          <template slot="product_line" slot-scope="text, record">
            <editable-cell
              :text="text"
              @change="onCellChange(record.key, 'product_line', $event)"
            />
          </template>
          <span slot="product-selector" slot-scope="number, record">
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              style="width: 150px"
              :default-value="number"
              @change="onProductChanged(record.key, 'product_number', $event)"
            >
              <a-select-option
                v-for="product in refreshProducts"
                :key="product.number"
              >
                {{ product.name }}
              </a-select-option>
            </a-select>
          </span>
          <span slot="project-selector" slot-scope="number, record">
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              style="width: 150px"
              :default-value="number"
              @change="onProjectChanged(record.key, 'project_number', $event)"
            >
              <a-select-option
                v-for="project in refreshProjects"
                :key="project.number"
              >
                {{ project.name }}
              </a-select-option>
            </a-select>
          </span>

          <template slot="name" slot-scope="text, record">
            <editable-cell
              :text="text"
              @change="onCellChange(record.key, 'task_name', $event)"
            />
          </template>
          <template slot="cost" slot-scope="number, record">
            <editable-number-cell
              :number="number"
              @change="onCellChange(record.key, 'task_cost', $event)"
            />
          </template>
          <template slot="details" slot-scope="text, record">
            <editable-area-cell
              :text="text"
              @change="onCellChange(record.key, 'task_detail', $event)"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-button
              type="danger"
              shape="circle"
              icon="delete"
              v-if="tasks.length"
              @click="() => onDelete(record.key)"
            />
          </template>
        </a-table>
        <a-button
          type="dashed"
          style="width: 40%; margin-top: 8px; margin-left: 30%"
          @click="handleCreateTask"
        >
          <a-icon type="plus" /> Add Task
        </a-button>
      </a-spin>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EditableCell from "./components/EditableAreaCell.vue";
import EditableNumberCell from "./components/EditableNumberCell.vue";
import EditableAreaCell from "./components/EditableAreaCell.vue";
import moment from "moment";

const columns = [
  {
    title: "Product Line",
    dataIndex: "product_line",
    key: "product_line",
    scopedSlots: { customRender: "product_line" },
  },
  {
    title: "Project",
    dataIndex: "project_number",
    key: "project",
    scopedSlots: { customRender: "project-selector" },
  },
  {
    title: "Product",
    dataIndex: "product_number",
    key: "product",
    scopedSlots: { customRender: "product-selector" },
  },
  {
    title: "Name",
    dataIndex: "task_name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Cost",
    dataIndex: "task_cost",
    key: "cost",
    scopedSlots: { customRender: "cost" },
  },
  {
    title: "Details",
    dataIndex: "task_detail",
    key: "details",
    scopedSlots: { customRender: "details" },
  },
  {
    title: "",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  name: "Report",
  props: ["date"],
  components: {
    EditableCell,
    EditableNumberCell,
    EditableAreaCell,
  },
  beforeCreate() {//todo, 这里需要加判断，如果数据已经存在，则不需要再去获取了
      this.$store
      .dispatch("product/list")
      .then(() => {
        this.$store.
        dispatch("project/list").then(() => {
        })
        .catch((error) => {
        this.$message.error(error, 3);
      });
      })
      .catch((error) => {
        this.$message.error(error, 3);
      });
  },
  mounted() {
    this.$store
      .dispatch("report/selfQuery", {
        from: this.onDay.format('yyyy-MM-DD'),
        to: this.onDay.add(1, "day").format('yyyy-MM-DD'),
      })
      .then((tasks) => {
        this.tasks = tasks.map((task) => {
          let key = this.count;
          this.count = key + 1;
          return { ...task, key: key };
        });
      })
      .catch((error) => {
        this.$message.error(error, 3);
      });
  },
  data() {
    return {
      count: 0,
      tasks: [],
      columns,
      onDay: this.date ? moment(this.date) : moment(),
    };
  },
  computed: {
    department() {
      return this.$store.state.user.department
        ? this.$store.state.user.department
        : "研发X部";
    },
    author() {
      return this.$store.state.user.name ? this.$store.state.user.name : "周煌";
    },
    dayString() {
      return this.onDay.format("yyyy-MM-DD");
    },
    spinning() {
      return this.$store.state.report.spinning;
    },
    refreshProducts() {
      return this.$store.state.product.all.map((product) => {
        return { ...product, key: product.number };
      });
    },
    refreshProjects() {
     return this.$store.state.project.all.map((project) => {
        return { ...project, key: project.number };
      });
    },
  },
  methods: {
    update(status) {
      this.$store
        .dispatch("report/update", {
          tasks: this.tasks,
          on_day: this.dayString,
          author: this.author,
          status,
        })
        .then(() => {
          this.$message.success("工作日志已" + (status == 0 ? "保存" : "提交"));
        });
    },
    handleCreateTask() {
      const { count, tasks } = this;
      let newTask = { ...this.$_.last(tasks), key: count };
      this.count = count + 1;
      this.tasks = [...tasks, newTask];
    },
    onCellChange(key, dataIndex, value) {
      const tasks = [...this.tasks];
      const target = tasks.find((item) => item.key === key);
      if (target && target[dataIndex] !== value) {
        target[dataIndex] = value;
        this.tasks = tasks;
      }
    },
    onDelete(key) {
      const tasks = [...this.tasks];
      this.tasks = tasks.filter((item) => item.key !== key);
    },
    onProjectChanged(key, dataIndex, number) {
      const tasks = [...this.tasks];
      const target = tasks.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = number;
        this.tasks = tasks;
      }
    },
    onProductChanged(key, dataIndex, number) {
      const tasks = [...this.tasks];
      const target = tasks.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = number;
        this.tasks = tasks;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style scoped>
.report-frame {
  background-color: white;
  margin: 30px 30px;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>