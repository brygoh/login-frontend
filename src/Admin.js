import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AiFillEdit, AiFillDelete, AiFillCheckSquare, AiFillCloseCircle} from 'react-icons/ai';
import 'font-awesome/css/font-awesome.min.css';
import Pagination from "./Pagination";

export default function Admin() {

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [count, setCount] = useState();

    const [items, setItems] = useState([]);
    const [editId, setEditId] = useState(['']);
    const [editData, setEditData] = useState({
        name:"",
        email:"",
        role:"",
    });
    const [error, setError] = useState({
        name:"",
        email:"",
        role:"",
    })
    const [data, setData] = useState({
        name:"",
        email:"",
        role:"Admin",
    });
    const [filter, setFilter] = useState("");
  
    useEffect(async () => {
        fetch(process.env.REACT_APP_API + `?page=${page}&filter=${filter}`)
            .then(res => res.json()) 
            .then((result) => {
                console.log(result.data);
                setPages(result.pages);
                setItems(result.data);
                setCount(result.count);
            }, (error) => {
                console.log(error);
            })
    }, [page, filter])

    const deleteUser = (id) => {
        axios.delete(process.env.REACT_APP_API + '/' + id, {headers: {"Authorization" : `Bearer ${localStorage.getItem('authToken')}`}})
        .then(response => {
            console.log(response)
            // const newData = items.filter(i => i._id !== id)
            // setItems(newData)
            // alert("User Deleted")
            if (count%10 < 2) {
            axios.get(process.env.REACT_APP_API + `?page=${page-1}&filter=${filter}`, [page, filter])
                .then(res => {
                    console.log(res.data)
                    setItems(res.data.data)
                    setPage(res.data.page)
                    setPages(res.data.pages)
                    setCount(res.data.count)
                    alert("User Deleted")
                })
                .catch(error => {
                    console.log(error)
                    alert("User Not Deleted")
                })
            }
            else {
                axios.get(process.env.REACT_APP_API + `?page=${page}&filter=${filter}`, [page, filter])
                .then(res => {
                    console.log(res.data)
                    setItems(res.data.data)
                    setPage(res.data.page)
                    setPages(res.data.pages)
                    setCount(res.data.count)
                    alert("User Deleted")
                })
                .catch(error => {
                    console.log(error)
                    alert("User Not Deleted")
                })
            }
        })
        .catch(error => {
            console.log(error)
            alert("User Not Deleted")
        })
    }

    const editUser = (id, name, email, role) => {
        setEditId(id)
        const originalData = {
            name:name,
            email:email,
            role:role,
        }
        setEditData(originalData)
    }
    
    function editHandle(e) {
        e.preventDefault();
        const newData = {...editData}
        console.log(newData)
        if (e.target.id === 'name') {
            // newData[e.target.id] = e.target.value.replace(/[^a-zA-Z,/]/ig,'')
            newData[e.target.id] = e.target.value
            if (/[^a-zA-Z ]+$/.test(newData[e.target.id]))
                error['name'] = 'Characters only'
            else if (!newData[e.target.id])
                error['name'] = 'Cannot be empty'
            else if (/^[a-zA-Z]+$/.test(newData[e.target.id]))
                error['name'] = ''
        }
        else if (e.target.id === 'email') {
            // newData[e.target.id] = e.target.value.replace(/[^a-zA-Z,/]/ig,'')
            newData[e.target.id] = e.target.value
            if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(newData[e.target.id]))
                error['email'] = 'Invalid Email'
            else if (!newData[e.target.id])
                error['email'] = 'Cannot be empty'
            else
                error['email'] = ''
        }
        else {
            newData[e.target.id] = e.target.value
        }
        setError(error)
        setEditData(newData)
        console.log(editData)
    }

    function editSubmit(id) {
        if (error.name === '' && error.email === '') {
            axios.post(process.env.REACT_APP_API + '/update/' + id, editData, {headers: {"Authorization" : `Bearer ${localStorage.getItem('authToken')}`}})
            .then(response => {
                console.log(response.data)
                axios.get(process.env.REACT_APP_API + `?page=${page}&filter=${filter}`, [page, filter])
                .then(res => {
                    console.log(res.data.data)
                    setItems(res.data.data)
                    alert("User Updated")
                })
                .catch(error => {
                    console.log(error)
                    alert("User Not Updated")
                })
            })
            .catch(error => {
                console.log(error)
                alert("User Not Updated")
            })
            setEditId('')
        }
        else {
            alert(error.name + '\n' + error.email)
        }
    }

    function cancelSubmit() {
        setEditId('')
        const blankState = {
            name:'',
            email:'',
            role:'',
        }
        setError(blankState)
    }

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(data)
    }

    function submit(e) {
        if (!/[^a-zA-Z ]+$/.test(data.name) && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(data.email)) {
            axios.post(process.env.REACT_APP_API + '/add/', data, {headers: {"Authorization" : `Bearer ${localStorage.getItem('authToken')}`}})
            .then(response => {
                console.log(response)
                // const newData = [...items, data]
                // setItems(newData)
                // alert("User Added")
                if (count%10===0) {
                    axios.get(process.env.REACT_APP_API + `?page=${page+1}&filter=${filter}`, [page, filter])
                    .then(res => {
                        console.log(res.data.data)
                        setItems(res.data.data)
                        setPage(res.data.page)
                        setPages(res.data.pages)
                        setCount(res.data.count)
                        alert("User Added")
                    })
                    .catch(error => {
                        console.log(error)
                        alert("User Not Added")
                    })
                }
                else {
                    axios.get(process.env.REACT_APP_API + `?page=${page}&filter=${filter}`, [page, filter])
                    .then(res => {
                        console.log(res.data.data)
                        setItems(res.data.data)
                        setPage(res.data.pages)
                        setPages(res.data.pages)
                        setCount(res.data.count)
                        alert("User Added")
                    })
                    .catch(error => {
                        console.log(error)
                        alert("User Not Added")
                    })
                }
            })
            .catch(error => {
                console.log(error)
                alert("User Not Added")
            })
        }
        else {
            alert("Can't Add User")
        }
    }

    return(
        <div className = "card-container">
            <div class="input-group rounded" style={{width:'80%', padding:'10px 0px'}}>
                <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                aria-describedby="search-addon" onChange={event => {setFilter(event.target.value);}}/>
                <span class="input-group-text border-0" id="search-addon">
                    <i class="fa fa-search"></i>
                </span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>   
                        <th>Email</th>
                        <th style={{width:'100px'}}>Role</th>
                        <th style={{width:'47.5px'}}></th>
                        <th style={{width:'47.5px'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => <Fragment>
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
                                <span style={{color:"red"}}>{error.name}</span>
                            </td>
                            <td>
                                <input
                                    type="email"
                                    id="email"
                                    value={editData.email}
                                    onChange={e => editHandle(e)}
                                    required="required"
                                    placeholder="Enter a email..."
                                />
                                <span style={{color:"red"}}>{error.email}</span>
                            </td>
                            <td style={{width:'100px'}}>
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
                            <td style={{width:'40px'}}>
                                <AiFillCheckSquare onClick={() => editSubmit(item._id)}/>
                            </td>
                            <td style={{width:'40px'}}>
                                <AiFillCloseCircle onClick={() => cancelSubmit()}/>
                            </td>
                        </tr>):
                        (<tr>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td style={{width:'100px'}}>{item.role}</td>
                            <td style={{width:'40px'}}>
                                <AiFillEdit onClick={() => editUser(item._id, item.name, item.email, item.role)}/>
                            </td>
                            <td style={{width:'40px'}}>
                                <AiFillDelete onClick={() => deleteUser(item._id)}/>
                            </td>
                        </tr>)}
                    </Fragment>)}    
                </tbody>
            </table>
            <Pagination page={page} pages={pages} changePage={setPage} />
            <div className="form-container">
                <div styles={{display:'flex', flexDirection:'row'}}>
                    <input className='input-inputs'
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={e => handle(e)}
                        required="required"
                        placeholder="Enter a name..."
                    />
                    {/* <span style={{color:"red"}}>{error.name}</span> */}
                </div>
                <div styles={{display:'flex', flexDirection:'row'}}>
                    <input className='input-inputs'
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={e => handle(e)}
                        required="required"
                        placeholder="Enter an email..."
                    />
                </div>
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
                <button className='button-buttons' onClick={()=>submit()}>Add</button>
            </div>  
        </div>
    )
}