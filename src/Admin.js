import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AiFillEdit, AiFillDelete, AiFillCheckSquare, AiFillCloseCircle} from 'react-icons/ai';
import 'font-awesome/css/font-awesome.min.css';
import Pagination from "./Pagination";
import { Button, Modal } from 'react-bootstrap'
import { errorValidation } from "./Error"

export default function Admin() {

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [count, setCount] = useState();
    const [filter, setFilter] = useState("");

    const [items, setItems] = useState([]);
    const [database, setDatabase] = useState([]);
    const [editId, setEditId] = useState(['']);
    
    const [editData, setEditData] = useState({
        name:"",
        email:"",
        role:"",
    });
    const [error, setError] = useState({
        name:"",
        email:""
    })
    const [data, setData] = useState({
        name:"",
        email:"",
        role:"Admin"
    });
    const [addError, setAddError] = useState({
        name:'Namefield cannot be left empty',
        email:'Emailfield cannot be left empty',
    })

    const [popup, setPopup] = useState(false);
    const [message, setMessage] = useState('');

    // middleware authorization bearer
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
  
    useEffect(async () => {
        fetch(process.env.REACT_APP_API + `?page=${page}&filter=${filter}`)
            .then(res => res.json()) 
            .then((result) => {
                setPages(result.pages);
                setItems(result.data);
                setCount(result.count);
                setDatabase(result.original)
            }, (error) => {
                console.log(error);
            })
    }, [page, filter])

    // Code refactoring for POST
    function getReq(paged, succMsg) {
        axios.get(process.env.REACT_APP_API + `?page=${page+paged}&filter=${filter}`, [page, filter])
            .then(res => {
                setItems(res.data.data)
                setPage(res.data.page)
                setPages(res.data.pages)
                setCount(res.data.count)
                messageLogger(succMsg, null)
            })
            .catch(err => {
                console.log(err)
                messageLogger("GET Request Error", null)
            })
    }

    // Code refactoring for setting message
    function messageLogger(messageOne, messageTwo) {
        if (!messageOne) {
            setMessage(messageTwo)
            setPopup(true)
        }
        else if (!messageTwo) {
            setMessage(messageOne)
            setPopup(true)
        }
        else {
            setMessage('1. ' + messageOne + " \n " + '2. ' + messageTwo)
            setPopup(true)
        }
    }

    // Handles delete request
    const deleteUser = (id) => {
        axios.delete(process.env.REACT_APP_API + '/' + id)
        .then(response => {
            console.log(response)
            if (count%10 < 2 && count%10!==0 && page===pages) {
                getReq(-1,"User Deleted")
            }
            else {
                getReq(0,"User Deleted")
            }
        })
        .catch(error => {
            console.log(error)
            messageLogger("DELETE Request Error", null)
        })
    }

    // Handles the initial edits input
    const editUser = (id, name, email, role) => {
        setEditId(id)
        const originalData = {
            name:name,
            email:email,
            role:role,
        }
        setEditData(originalData)
    }
    
    // Handles the input of the edits
    function editHandle(e) {
        e.preventDefault();
        const newData = {...editData}
        newData[e.target.id] = e.target.value
        if (e.target.id === 'name')
            error['name'] = errorValidation(null, e.target.id, e.target.value)
        else if (e.target.id === 'email')
            error['email'] = errorValidation(database, e.target.id, e.target.value)
        setError(error)
        setEditData(newData)
    }

    // Handles the editing of data
    function editSubmit(id) {
        if (error.name === '' && error.email === '') {
            axios.post(process.env.REACT_APP_API + '/update/' + id, editData)
            .then(response => {
                console.log(response)
                getReq(0, "User Updated")
            })
            .catch(error => {
                console.log(error)
                messageLogger("POST Request Error", null)
            })
            setEditId('')
        }
        else {
            messageLogger(error['name'], error['email'])
        }
    }

    // Handles edit cancellation request
    function cancelSubmit() {
        setEditId('')
        const blankState = {
            name:'',
            email:'',
            role:'',
        }
        setError(blankState)
    }

    // Handles the form inputs for adding new users
    function handle(e) {
        e.preventDefault()
        const newData = {...data}
        newData[e.target.id] = e.target.value
        if (e.target.id === 'name')
            addError['name'] = errorValidation(null, e.target.id, e.target.value)
        else if (e.target.id === 'email')
            addError['email'] = errorValidation(database, e.target.id, e.target.value)
        setData(newData)
    }

    // Submit Post Request for adding new users
    function submit(e) {
        if (addError.name === '' && addError.email === '') {
            axios.post(process.env.REACT_APP_API + '/add/', data)
            .then(response => {
                console.log(response)
                if (count%10===0) {
                    getReq(pages-page+1, "User Added")
                }
                else if (page!==pages) {
                    getReq(pages-page, "User Added")
                }
                else {
                    getReq(0, "User Added")
                }
            })
            .catch(error => {
                console.log(error)
                messageLogger("POST Request Error", null)
            })
        }
        else {
            messageLogger(addError['name'], addError['email'])
        }
    }

    const handleClose = () => setPopup(false);

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
            <Modal show={popup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>React App Says:</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="display-linebreak">{message}</div></Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}