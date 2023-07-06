/*
 * @Descripttion: 
 * @version: 
 * @Author: wushide
 * @Date: 2023-06-25 08:47:43
 * @LastEditors: wu-shide
 * @LastEditTime: 2023-07-06 23:07:50
 */
import dynamic from 'next/dynamic';

// 使用动态导入引入目标页面的组件
const TodoPage = dynamic(() => import('./todoList/page'));

const HomePage: React.FC = () => {
  return (
    <div>
      {/* 渲染目标页面的组件 */}
      <TodoPage />
    </div>
  );
};

export default HomePage;