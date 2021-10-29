import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AiFillEdit, AiFillDelete, AiFillCheckSquare, AiFillCloseCircle} from 'react-icons/ai';


export default function Admin() {

    const [items, setItems] = useState([]);
    const [editId, setEditId] = useState(['']);
    const [editData, setEditData] = useState({
        name:"",
        email:"",
        role:"",
    });
    const [data, setData] = useState({
        name:"",
        email:"",
        role:"",
    });
  
    useEffect(() => {
      fetch("https://login-backend-015.herokuapp.com/users")
        .then(res => res.json()) 
          .then((result) => {
            console.log(result);
            setItems(result);
          }, (error) => {
            console.log(error);
          })
    }, [])

    const deleteUser = (id) => {
        axios.delete('https://login-backend-015.herokuapp.com/users/' + id)
        .then(response => {
            console.log(response)
            const newData = items.filter(i => i._id !== id)
            setItems(newData)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const editUser = (id, name, email, role) => {
        setEditId(id)
        const originalData = {
            name:name,
            email:email,
            role:role
        }
        setEditData(originalData)
    }

    function editHandle(e) {
        const newData = {...editData}
        newData[e.target.id] = e.target.value
        setEditData(newData)
        console.log(editData)
    }

    function editSubmit(id) {
        axios.post('https://login-backend-015.herokuapp.com/users/update/' + id, editData)
        .then(response => {
            console.log(response.data)
            axios.get('https://login-backend-015.herokuapp.com/users')
            .then(res =>{
                setItems(res.data)
            })
            .catch(error => {
                console.log(error)
            })
        })
        .catch(error => {
            console.log(error)
        })
        setEditId('')
    }

    function cancelSubmit() {
        setEditId('')
    }

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(data)
    }

    function submit(e) {
        e.preventDefault();
        axios.post('https://login-backend-015.herokuapp.com/users/add/', data)
        .then(response => {
            console.log(response)
            const newData = [...items, data]
            setItems(newData)
        })
        .catch(error => {
            console.log(error)
        })
    }

    return(
        <div className = "card-container">
            <table>
                <thead>
                    <tr> 
                        <th>Name</th>   
                        <th>Email</th>
                        <th>Role</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) =>
                    <Fragment>
                        {editId === item._id ?
                        (<tr>
                            <td>
                                <input
                                    type="text"
                                    id="name"
                                    value={editData.name}
                                    onChange={e => editHandle(e)}
                                    required="required"
                                    placeholder="Enter a name..."
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="email"
                                    value={editData.email}
                                    onChange={e => editHandle(e)}
                                    required="required"
                                    placeholder="Enter a email..."
                                />
                            </td>
                            <td>
                                <select
                                    type="text"
                                    id="role"
                                    value={editData.role}
                                    onChange={e => editHandle(e)}
                                    required="required"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </td>   
                            <td>
                                <AiFillCheckSquare onClick={() => editSubmit(item._id)}/>
                            </td>
                            <td>
                                <AiFillCloseCircle onClick={() => cancelSubmit()}/>
                            </td>
                        </tr>):
                        (<tr>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.role}</td>
                            <td>
                                <AiFillEdit onClick={() => editUser(item._id, item.name, item.email, item.role)}/>
                            </td>
                            <td>
                                <AiFillDelete onClick={() => deleteUser(item._id)}/>
                            </td>
                        </tr>)}
                    </Fragment>)}    
                </tbody>
            </table>
            <form className="form-container" onSubmit={(e) => submit(e)}>
                <input className='input-inputs'
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={e => handle(e)}
                    required="required"
                    placeholder="Enter a name..."
                />
                <input className='input-inputs'
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={e => handle(e)}
                    required="required"
                    placeholder="Enter an email..."
                />
                <select className="select-selects"
                    type="text"
                    id="role"
                    value={data.role}
                    onChange={e => handle(e)}
                    required="required"
                >
                    <option value="Admin">Admin</option>
                    <option value="Normal">Normal</option>
                </select>
                <button className='button-buttons'>Add</button>
            </form>  
        </div>
    )
}