import { createNewTask, deleteATask, findAllTask, updateATask } from "../models/taskModel.js"

export const getAllTask = async (req, res) => { 
  // Lấy params từ query, đặt giá trị mặc định
 const { search = '', page = 1,filter='all',d="all" } = req.query;
 const pageSize = 5;
const offset = (Number(page) - 1) * pageSize;

  const now = new Date();
  let startDate;

  switch (d) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-08-24 00:00
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
   }
   console.log(startDate)
 try {
  const { tasks, total, stats } = await findAllTask(search, pageSize, offset, filter, startDate)
 
   res.status(200).json({
     message: "Lấy dữ liệu thành công",
     data: tasks,
     pagination: {
        currentPage: Number(page),
        pageSize: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize)
     },
     stats: {
       pending: stats.pending,
       is_completed: stats.completed,
       totalItems: total
     }
})
 } catch (error) {
  console.log("Lỗi khi lấy dữ liệu:", error)
  res.status(500).json({message:error})
 }
}
export const createTask = async (req, res) => { 
 const {title} = req.body
 try {
  const result = await createNewTask(title)
  res.status(200).json({message:"Tạo dữ liệu thành công",data:result})
 } catch (error) {
  console.log("Lỗi khi tạo dữ liệu:", error)
  res.status(500).json({message:error})
 }
}
export const updateTask = async (req, res) => { 
 const { id } = req.params
 const {title,description,is_completed} = req.body
 try {
  const result = await updateATask(title, description, is_completed, id)
  if (!result) { 
   return res.status(404).json({message:"Không tìm thấy dữ liệu"})
  }
  res.status(200).json({message:"Cập nhật dữ liệu thành công",data:result})
 } catch (error) {
  console.log("Lỗi khi cập nhật dữ liệu", error)
  res.status(500).json({message:"Lỗi"})
 }
}
export const deleteTask = async (req, res) => { 
 const {id} = req.params
 try {
  const result = await deleteATask(id)
  if (!result) { 
   return res.status(404).json({message:"Không tìm thấy dữ liệu"})
  }
  res.status(200).json({ message: "Xóa dữ liệu thành công",data:result })
 } catch (error) {
  console.log("Lỗi khi xóa dữ liệu:", error)
  res.status(500).json({message:"Lỗi"})
 }
}