import TodoListItem from '../components/TodoListItem'
import AddTask from '../components/AddTask'
import { useEffect, useRef, useState } from 'react'
import axios from '../utils/axios';
import { useAuth } from '../context/auth';
import Script from 'next/script';
import AuthRequired  from '../middlewares/auth_required.js';

export default function Home() {
  const { token,setAvatarImage,setProfileName } = useAuth();
  const [taskList,setTaskList]=useState([]);
  
  
  

  function getTasks() {
    /***
     * @todo Fetch the tasks created by the user.
     * @todo Set the tasks state and display them in the using TodoListItem component
     * The user token can be accessed from the context using useAuth() from /context/auth.js
     */
    if(token)
    {
     axios.get('todo/',{
      headers:{
        Authorization:'Token '+token,
      }
    })
    .then((res) => {
      setTaskList(res.data);
      iziToast.destroy();
      iziToast.success({
        message:"Loaded All the tasks Successfully"
      })
     
     
      
    })
    .catch(() => {
      
      iziToast.destroy();
      iziToast.error({
        title:"Error",
        message:"Something Went Wrong"
      })
    });
  }
    
   
  
  };

  useEffect(() => {
    if (token) {
      axios
        .get('auth/profile/', {
          headers: {
            Authorization: 'Token ' + token,
          },
        })
        .then((response) => {
          setAvatarImage(
            'https://ui-avatars.com/api/?name=' +
              response.data.name +
              '&background=fff&size=33&color=007bff'
          );
          setProfileName(response.data.name);
          iziToast.destroy();
          iziToast.success({
            title:"Welcome",
            message:"Loading Tasks"
          })
          getTasks();
        })
        .catch((error) => {
          iziToast.destroy();
          iziToast.error({
            title:"Error",
            message:"Some Error Occurred"
          })
        })
    }
  }, []);
  


  function addTask(t){
    const temp=[...taskList,t];
    setTaskList(temp);

  }

  const deleteThisTask = (id) => {
    let temp=[...taskList];
    temp=temp.filter((task) => {
      return task.id!=id;
    });
    setTaskList(temp);



  };


  

  
    
  

  return (
    <AuthRequired>
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css"></link>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></Script>
      <center>
        <AddTask addNewTask={addTask}/>
        <ul className='flex-col mt-9 max-w-sm mb-3 '>
          <span className='inline-block bg-blue-600 py-1 mb-2 px-9 text-sm text-white font-bold rounded-full '>
            Available Tasks
          </span>
          {taskList.map((task) => (
            
              <TodoListItem 
              key ={task.id}
              title={task.title}
              id={task.id}
              deleteThisTask={deleteThisTask}/>

            )
          )}
          
        </ul>
      </center>
    </div>
    </AuthRequired>
  )
}

