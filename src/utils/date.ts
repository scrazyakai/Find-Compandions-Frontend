/**
 * 格式化时间为相对时间或标准格式
 * @param dateString 时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 计算不同时间单位的差值
  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const days = Math.floor(diffInSeconds / 86400);
  const weeks = Math.floor(diffInSeconds / 604800);

  // 今天以内的时间显示为相对时间
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        return `刚刚`;
      }
      return `${minutes}分钟前`;
    }
    return `${hours}小时${minutes}分钟前`;
  }
  // 昨天的时间显示为"昨天 HH:MM"
  if (days === 1) {
    return `昨天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }
  // 一周内的时间显示为"X天前"
  if (days < 7) {
    return `${days}天前`;
  }
  // 当年的时间显示为"MM-DD HH:MM"
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}-${date.getDate()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }
  // 往年的时间显示为"YYYY-MM-DD HH:MM"
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
};

/**
 * 数字补零函数
 * @param num 需要补零的数字
 * @returns 补零后的字符串
 */
const padZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};