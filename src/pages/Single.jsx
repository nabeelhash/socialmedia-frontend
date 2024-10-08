import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


const Single = () => {
    const [name,setName]= useState('')
    const [email,setEmail]= useState('')
    const {id} = useParams()

    useEffect(function(){
        const fetchData = async function(){
            try{
                const response = await fetch(`http://localhost:4000/single/${id}`,{
                    method: 'GET',
                    credentials: 'include'
                })
                if(!response.ok){
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                toast.success('Successful')
                setName(result.name)
                setEmail(result.email)

              }
              catch (error) {
                toast.error(`Failed ${error.message}`)
                console.log(error)
              }
        }
        fetchData()
    },[])
  return (
    <div>
        <input type="text" value={name} onChange={function(e){setName(e.target.value)}}></input>
        {id}
        {name}
        {email}
      edit
    </div>
  )
}

export default Single
