// 定义一些路由
import Index from "../pages/Index.vue";
import Team from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import UserRegisterPage from "@/pages/UserRegisterPage.vue";
import UserTagSelectPage from "@/pages/UserTagSelectPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import MessagePage from '../pages/MessagePage.vue';
import UserEditTagsPage from "../pages/UserEditTagsPage.vue";
import FriendsPage from '../pages/FriendsPage.vue';

const routes = [
    { path: '/', component: Index, meta: { showBackButton: false } },
    { path: '/team', title: '找队伍', component: Team, meta: { showBackButton: false } },
    { path: '/team/add', title: '创建队伍', component: TeamAddPage, meta: { backPath: '/team' } },
    { path: '/team/update', title: '更新队伍', component: TeamUpdatePage },
    { path: '/user', title: '个人信息', component: UserPage },
    { path: '/search', title: '找伙伴', component: SearchPage },
    { path: '/user/list', title: '用户列表', component: SearchResultPage },
    { path: '/user/edit', title: '编辑信息', component: () => import('../pages/UserEditPage.vue'), meta: { backPath: '/user' } },
    { path: '/user/edit-tags', component: () => import('../pages/UserEditTagsPage.vue'), meta: { backPath: '/user' } },
    { path: '/user/login', title: '寻伴', component: UserLoginPage, meta: { showTabbar: false, showBackButton: false } },
    { path: '/register', title: '注册', component: UserRegisterPage, meta: { showTabbar: false, showBackButton: true, backPath: '/user/login' } },
    { path: '/user/tag-select', title: '标签选择', component: UserTagSelectPage, meta: { showTabbar: false } },
    { path: '/user/update', title: '更新信息', component: UserUpdatePage, meta: { backPath: '/user' } },
    { path: '/user/team/join', title: '加入队伍', component: UserTeamJoinPage, meta: { backPath: '/user' } },
    { path: '/user/team/create', title: '创建队伍', component: UserTeamCreatePage, meta: { backPath: '/user' } },
    { path: '/groupChat', title: '聊天厅', component: () => import('../pages/GroupChatPage.vue'), meta: { showTabbar: true } },
    { path: '/friends', title: '好友列表', component: FriendsPage },
]

export default routes;
