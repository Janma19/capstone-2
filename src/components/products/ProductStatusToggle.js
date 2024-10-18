import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
export default function ProductStatusToggle({ productId, isActive, textActive, textInactive, getProduct }) {
    const [loading, setLoading] = useState(false);
    function activateProduct(productId) {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Activated Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        // willClose: () => {
                        //     window.location.reload();
                        // },
                    });
                    getProduct(productId);
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Activation Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Activation Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
            });
    }
    function archiveProduct(productId) {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Archived Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        // willClose: () => {
                        //     window.location.reload();
                        // },
                    });
                    getProduct(productId);
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Archiving Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Archiving Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
            });
    }
    if (loading) {
        return (
            <Button className="btn-grey btn-outline-dark" disabled>
                Loading...
            </Button>
        );
    }
    return isActive ? (
        <Button className="btn-light btn-outline-dark" onClick={() => archiveProduct(productId)}>
            {textActive}
        </Button>
    ) : (
        <Button className="btn-dark btn-outline-dark" onClick={() => activateProduct(productId)}>
            {textInactive}
        </Button>
    );
}
