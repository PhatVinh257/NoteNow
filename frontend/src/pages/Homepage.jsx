import { Header } from '@/components/Header'
import React, { useEffect, useState } from 'react'
import StatsAndFilter from '@/components/StatsAndFilter'
import TaskList from '@/components/TaskList'
import Footer from '@/components/Footer'
import AddTask from '@/components/AddTask'
import TaskListPagination from '@/components/TaskListPagination'
import DateTimeFilter from '@/components/DateTimeFilter'
import { toast } from 'sonner'
import api from '@/lib/axios'
const Homepage = () => {
  const [taskBuffer, setTaskBuffer] = useState([])
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1, //Khởi tạo là 1 để tránh các lỗi logic khi tính toán hoặc hiển thị giao diện (ví dụ: tránh hiển thị lỗi "Trang 1 trên 0"). Sau khi API trả về kết quả thật, con số này sẽ được cập nhật (ví dụ: 10, 50).
  })
  // Chỉ cần một useEffect theo dõi sự thay đổi của currentPage
  useEffect(() => {
    fetchData(pagination.currentPage,filter,dateQuery);
  }, [pagination.currentPage,filter,dateQuery]);
  const fetchData = async (page,filter) =>   { 
    try {
      // Gửi page lên server để lấy đúng dữ liệu phân trang
      const res = await api.get(`/tasks?page=${page}&filter=${filter}&d=${dateQuery}`);
      console.log(res.data.data)
      setTaskBuffer(res.data.data);
      setActiveTaskCount(res.data.stats.pending)
      setCompleteTaskCount(res.data.stats.is_completed)
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu:", error)
      toast.error("Lỗi")
    }
  }
   // Các hàm điều hướng chỉ cần cập nhật currentPage trong state
  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };
  const handlePrev = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };
 return (
   <div className="min-h-screen w-full relative">
  {/* Radial Gradient Background from Bottom */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
    }}
  />
   {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto">
    <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
     {/* Đầu trang */}
     <Header />
     {/* Tạo nhiệm vụ */}
         <AddTask handleNewTaskAdded={()=>fetchData(pagination.currentPage,filter)} />
     {/* Thống kê và bộ lọc */}
      <StatsAndFilter
        filter={filter}
        setFilter={setFilter}
        activeTasksCount={activeTaskCount}
        completedTasksCount={completeTaskCount}/>
         {/* Danh sách nhiệm vụ */}
         <TaskList filteredTasks={taskBuffer}
         handleTaskChanged={()=>fetchData(pagination.currentPage,filter)}/>
     {/* Phân trang và lọc theo date */}
     <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
           <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={pagination.currentPage}
              totalPages={pagination.totalPages} />
           <DateTimeFilter
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}/>
       </div>
     {/* Chân trang */}
         <Footer
           activeTasksCount={activeTaskCount}
         completedTasksCount={completeTaskCount}/>
    </div>
    </div>
</div>

  )
}

export default Homepage