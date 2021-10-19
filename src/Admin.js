import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import LoadMore from './images/loadMore.svg';

export default function Admin() {

    const [items, setItems] = useState([]);
    const [data, setData] = useState({
        name:"",
        email:"",
        role:"",
    });
    const [editData, setEditData] = useState({
        name:"",
        email:"",
        role:"",
    });
    const [email, setEmail] = useState('');
    let id  = "";
  
    useEffect(() => {
      fetch("http://localhost:5000/users")
        .then(res => res.json()) 
          .then((result) => {
            console.log(result);
            setItems(result);
          }, (error) => {
            console.log(error);
          })
    }, [])

    const deleteUser = () => {
        console.log(email)
        for (var i in items.map(item => item._id)) {
            if (String(items[i].email) === String(email)) {
                id = items[i]._id
                break
            }
        }
        console.log(id)
        axios.delete('http://localhost:5000/users/' + id)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })

        axios.get('http://localhost:5000/users/')
        .then(res =>{
            setItems(res.data)
            console.log(items)
        })
        .catch(error => {
            console.log(error)
        })
    }

    function submit(e) {
        e.preventDefault();
        axios.post('http://localhost:5000/users/add/', data)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })

        axios.get('http://localhost:5000/users/')
        .then(res =>{
            setItems(res.data)
            console.log(items)
        })
        .catch(error => {
            console.log(error)
        })
    }

    function editSubmit(e) {
        e.preventDefault();
        console.log(editData.email)
        for (var i in items.map(item => item._id)) {
            if (String(items[i].email) === String(editData.email)) {
                id = items[i]._id
                break
            }
        }
        console.log(id)
        axios.post('http://localhost:5000/users/update/' + id, editData)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })

        axios.get('http://localhost:5000/users/')
        .then(res =>{
            setItems(res.data)
            console.log(items)
        })
        .catch(error => {
            console.log(error)
        })
    }

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(data)
    }

    function editHandle(e) {
        const newData = {...editData}
        newData[e.target.id] = e.target.value
        setEditData(newData)
        console.log(editData)
    }

    const handleSelect=(e)=>{
        setEmail(e)
        console.log(e)
    }

    return(
        <div className = "card-container" style={{backgroundRepeat: 'no-repeat', backgroundImage: `url(${LoadMore})`, backgroundPosition: 'center'}}>
            <div>
                <table>
                    <thead>
                        <tr> 
                            <th>Name</th>   
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => <tr>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.role}</td>
                            <td>Test</td>
                        </tr>)}
                    </tbody>
                </table>
                <form className="form-container" onSubmit={(e) => submit(e)}>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={e => handle(e)}
                        required="required"
                        placeholder="Enter a name..."
                    />
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={e => handle(e)}
                        required="required"
                        placeholder="Enter an email..."
                    />
                    <select
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
                <form className="form-container" onSubmit={(e) => editSubmit(e, data.email)}>
                    <input
                        type="text"
                        id="name"
                        value={editData.name}
                        onChange={e => editHandle(e)}
                        required="required"
                        placeholder="Enter a name..."
                    />
                    <select
                        type="text"
                        id="email"
                        value={editData.email}
                        onChange={e => editHandle(e)}
                        required="required"
                    >
                        {items.map(item => (<option eventKey={item.email}>{item.email}</option>))}
                    </select>
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
                    <button className='button-buttons'>Edit</button>
                </form>  
                <div className='delete-container'>
                    <DropdownButton
                        className='dropdownbutton'
                        onSelect={handleSelect}
                        title="Delete Users"
                        variant="secondary"> 
                            {items.map(item => (<Dropdown.Item eventKey={item.email}>{item.email}</Dropdown.Item>))}
                    </DropdownButton>
                    <button className='button-buttons' onClick={() => deleteUser()}>Delete</button>
                </div> 
            </div>
        </div>
    )
}