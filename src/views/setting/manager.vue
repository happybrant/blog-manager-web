<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="博客设置" name="first">
        <el-row :gutter="24">
          <el-col :span="12">
            <CategoryTable ref="categoryTable" />
          </el-col>
          <el-col :span="12">
            <TagTable ref="tagTable" />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="展示信息" name="second">
        <PersonalInfoForm ref="personalInfoForm" />
      </el-tab-pane>
      <el-tab-pane label="笔记分类管理" name="third">
        <NoteCategoryTable ref="noteCategoryTable" />
      </el-tab-pane>
    </el-tabs>
    <EditCategoryForm ref="editCategoryForm" />
  </div>
</template>

<script>
import CategoryTable from '@/views/setting/category'
import TagTable from '@/views/setting/tag'
import EditCategoryForm from '@/views/setting/editCategory'
import PersonalInfoForm from '@/views/setting/personalInfo'
import NoteCategoryTable from '@/views/setting/noteCategory'
export default {
  name: 'Manager',
  components: { CategoryTable, EditCategoryForm, PersonalInfoForm, NoteCategoryTable, TagTable },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

