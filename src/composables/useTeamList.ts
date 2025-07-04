import { ref } from 'vue';
import myAxios from '../plugins/myAxios';
import { Toast } from 'vant';

interface Team {
  id: number;
  name: string;
  description: string;
  maxNum: number;
  expireTime: string;
  status: number;
  createTime: string;
  updateTime: string;
  createUser: any;
}

export const useTeamList = (apiUrl: string) => {
  const teamList = ref<Team[]>([]);
  const isLoading = ref(false);

  const listTeam = async (searchText = '') => {
    isLoading.value = true;
    try {
      const res = await myAxios.get(apiUrl, {
        params: {
          searchText,
          pageNum: 1,
        },
      });
      if (res?.code === 0) {
        teamList.value = res.data as Team[];
      } else {
        Toast.fail('加载失败，请稍后重试');
      }
    } catch (error) {
      Toast.fail('网络错误，加载失败');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    teamList,
    isLoading,
    listTeam,
  };
};