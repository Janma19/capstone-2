import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditProductButton({ text, productId, name, description, altDescription, price, getProduct }) {
    const [nameOnModal, setNameOnModal] = useState(name);
    const [descriptionOnModal, setDescriptionOnModal] = useState(description);
    const [altDescriptionOnModal, setAltDescriptionOnModal] = useState(altDescription);
    const [priceOnModal, setPriceOnModal] = useState(price);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const openEditModal = () => {
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
    };
    function updateProduct(e, productId) {
        setLoading(true);
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                name: nameOnModal,
                description: descriptionOnModal,
                altDescription: altDescriptionOnModal,
                price: Number(priceOnModal),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message") && data.message === "Product updated successfully") {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Updated Successfully!",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                        // willClose: () => {
                        //     window.location.reload();
                        // },
                    });
                    getProduct(productId);
                    setShowEditModal(false);
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Update Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Update Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
            });
    }
    useEffect(() => {
        setNameOnModal(name);
        setDescriptionOnModal(description);
        setAltDescriptionOnModal(altDescription);
        setPriceOnModal(price);
    }, [showEditModal]);
    if (loading) {
        return (
            <Button variant="grey" className="mx-1" disabled>
                Loading...
            </Button>
        );
    }
    return (
        <>
            <Button className="col-12 btn-dark btn-outline-dark" onClick={() => openEditModal()}>
                {text || "Edit Product Details"}
            </Button>
            <Modal show={showEditModal} onHide={closeEditModal}>
                <Form onSubmit={(e) => updateProduct(e, productId)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={nameOnModal} onChange={(e) => setNameOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={descriptionOnModal} onChange={(e) => setDescriptionOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="productAlternateDescription">
                            <Form.Label>Alternate Description</Form.Label>
                            <Form.Control type="text" value={altDescriptionOnModal} onChange={(e) => setAltDescriptionOnModal(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" value={priceOnModal} onChange={(e) => setPriceOnModal(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="grey" onClick={closeEditModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Product Details
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
