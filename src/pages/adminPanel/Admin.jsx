import React, { useContext, useEffect, useState } from 'react'
import './admin.css'
import axios from 'axios'

import UserRow from './UserRow';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
const Admin = () => {

    const { userChange } = useContext(AuthContext);

    const [allUsers, setAllUsrs] = useState([]);
    let count = 1;
    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/user/getall");
                setAllUsrs(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllUser();
    }, [userChange])

    return (
        <div className='admin'>
            <div className="topbar-head-admin">
                
                <div className="topbarLinks-admin">
                    <Link to="/" style={{ textDecoration: "none", color: "white" }} ><h3> <HomeIcon fontSize='large' /> </h3></Link>
                </div>
                <h1 className='adminLogo' >Admin Panel</h1>

            </div>
            <div className="adminWrapper">
                <table class="table table-striped users-table">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Password</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user) => {
                            return <tr>
                                <td>{count++}</td>
                                <UserRow key={user._id} user={user} />
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Admin
