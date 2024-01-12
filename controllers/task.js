const Task = require('../models/Task')

// @URL     GET /
// @desc    Render Home page /TaskList 
exports.getTasks = async(req, res)=>{
    let tasks = await Task.find().lean()
    // we use "lean" beacuse it backs as array and with mongoose data
    // so lean is helpisng us to get only our data
    // .lean()
    //  console.log(tasks[1])
    // this is teh outcome of console
    // {
    //     _id: new ObjectId('65a03cd2ea6dec08c73f14f9'),
    //     title: 'resume',
    //     priority: 'medium',
    //     isCompleted: false,
    //     createdAt: 2024-01-11T19:09:06.195Z,
    //     updatedAt: 2024-01-11T19:09:06.195Z,
    //     __v: 0
    //   }
    tasks = tasks.map(task=>({...task, 
        createdAt: task.createdAt.toLocaleDateString(),
        low: task.priority==='low'? true: false, 
        medium: task.priority==='medium'? true: false, 
        heigh: task.priority==='heigh'? true: false, 
}))

    
    res.render('pages/home', {docTitle:'Home', tasks})


}

// @URL     GET /add
// @desc    Render Add page
exports.getAdd =  async(req, res)=>{
    res.render('pages/add', {docTitle:'Add Task'})
}

// @URL     POST /add
// @desc    add task to database 
exports.postAdd = async(req, res)=>{
    await Task.create(req.body)
    res.redirect('/')
}

// @URL     GET /edit/:id
// @desc   render edit page
exports.getEdit = async(req, res)=>{
    let task = await Task.findById(req.params.id).lean()
    task = {
        ...task,
        low: task.priority==='low'? true: false, 
        medium: task.priority==='medium'? true: false, 
        heigh: task.priority==='heigh'? true: false, 
    }
    console.log(task);
    const edit = true;
    res.render('pages/add', {docTitle:'Edit Task', task, edit})
}

// @URL     POST /edit/
// @desc   Edit a task in DB
exports.postEdit = async(req, res)=>{
    const id = req.body.id;
    await Task.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})
    res.redirect('/')
}

// @URL    GET /delete/:id
// @desc   delete a task
exports.getDelete = async(req, res)=>{
    await Task.findByIdAndDelete(req.params.id)
    res.redirect('/')
}

// @URL    GET /toggle/:id
// @desc   toggle a task to be completed or in-completed
exports.getToggleComplete = async(req, res)=>{
    let task = await Task.findById(req.params.id)
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.redirect('/'); 
}

