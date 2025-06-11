import React from "react";
import { FiUpload, FiFilter, FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import "../styles/dashboard.css"; // Import the CSS

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Theta Dynamics</h2>
                <nav className="menu">
                    <div className="menu-item active">All Documents</div>
                    <div className="menu-item">Automation</div>
                    <div className="menu-item">Extensions</div>
                    <div className="menu-item">Statistics</div>
                    <div className="menu-item">Settings</div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h1>All Documents</h1>

                {/* Filters & Search */}
                <div className="table-header">
                    <input type="text" placeholder="Search documents..." />
                    <div>
                        <FiFilter />
                        <FiSearch />
                        <FiUpload />
                        <IoMdAdd />
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Document Name</th>
                                <th>Queue</th>
                                <th>Labels</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                                <td>[SAMPLE] pro_forma_invoice.pdf</td>
                                <td>Apliaglobal  Pro forma invoices</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td><span className="status-badge status-review">To review</span></td>
                                <td>[SAMPLE] tax_eu_invoice.pdf</td>
                                <td>Apliaglobal  Tax invoices (EU)</td>
                                <td>---</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
