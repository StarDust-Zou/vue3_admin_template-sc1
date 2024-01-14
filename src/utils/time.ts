//封装一个函数：获取一个结果：当前早上|上午|下午|晚上
export const getTime = () => {
  const now = new Date()
  const hour = now.getHours()
  let message

  if (hour >= 5 && hour < 9) {
    message = '早上'
  } else if (hour >= 9 && hour < 12) {
    message = '上午'
  } else if (hour >= 12 && hour < 14) {
    message = '中午'
  } else if (hour >= 14 && hour < 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
