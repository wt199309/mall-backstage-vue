<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套 渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            >删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限弹出层对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 主体 数型控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色的列表
      roleList: [],
      //控制权限分配对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightslist: [],
      //树型控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //默认选中的节点Id值 数组
      defKeys: [],
      //即将分配权限的 ID
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    //根据ID删除相应权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否确认删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 判断是否点击取消按键   info弹框提示
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // 点击确认发起删除权限请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      //判断是否删除成功
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      //刷新数据
      //  this.getRolesList() //刷新整个列表，会导致整个列表重新渲染，这里只需要渲染最新的列表就可以了
      //res.data 为最新列表
      role.children = res.data
    },
    //点击权限分配按钮，弹出权限分配弹出层
    async showSetRightDialog(role) {
      // 将它的ID保存到 data 中
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      //每当发起请求后都应该判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message('获取权限列表数据失败')
      }
      //把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      console.log(this.rightslist)

      //调用递归函数获取三级节点ID
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取到所有三级权限的Id 并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      //如果当前 node 节点不包含 childern 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归找出所有三级节点
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    //监听权限分配对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []

    },
    //点击为角色分配权限
   async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

    const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr})

    if(res.meta.status !== 200 ) {
      return this.$message.error('分配权限失败')
    }
    this.$message.success('分配权限成功')
    this.getRolesList()
    this.setRightDialogVisible = false
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
//边框线
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
