import { useState, useEffect } from "react";
import { Table, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditProductButton from "./EditProductButton";
import ProductStatusToggle from "./ProductStatusToggle";
export default function ManageProductsView({ productsData }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filterText, setFilterText] = useState("");
    const sortedData = [...productsData].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });
    const filteredData = sortedData.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(filterText.toLowerCase())));
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        } else if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };
    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ↑" : " ↓";
        }
        return null;
    };

    return (
        <div className="products-catalog-section container-fluid p-5">
            <h1 className="text-center my-4"> Admin Dashboard</h1>

            <input type="text" placeholder="Filter" value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ marginBottom: "10px" }} />
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th onClick={() => handleSort("_id")}>ID {getSortIcon("_id")}</th>
                        <th onClick={() => handleSort("name")}>Age {getSortIcon("age")}</th>
                        <th onClick={() => handleSort("description")}>Email {getSortIcon("description")}</th>
                        <th onClick={() => handleSort("price")}>Email {getSortIcon("price")}</th>
                        <th onClick={() => handleSort("isActive")}>Email {getSortIcon("isActive")}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/products/${item._id}`}>
                                    <Image src={`${item.imageLink}`} style={{ height: "auto", width: "15vw" }} onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/images/default-product.png`)} fluid />
                                </Link>
                            </td>
                            <td>
                                <Link to={`/products/${item._id}`}>{item._id}</Link>
                            </td>
                            <td>
                                <Link to={`/products/${item._id}`}>{item.name}</Link>
                            </td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td className={item.isActive ? "text-success" : "text-danger"}>{item.isActive ? "Available" : "Unavailable"}</td>
                            <td className="text-center">
                                <EditProductButton product={item} text={"Edit"} />
                                <ProductStatusToggle productId={item._id} isActive={item.isActive} textActive={"Archive"} textInactive={"Activate"} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
