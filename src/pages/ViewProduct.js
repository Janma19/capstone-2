import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import { Container, Row, Col, Card } from "react-bootstrap";

import SessionContext from "../context/SessionContext";
import Error from "./Error";
import EditProductButton from "../components/products/EditProductButton";
import ProductStatusToggle from "../components/products/ProductStatusToggle";
import AddToCartForm from "../components/carts/AddToCartForm";
import RemoveCartButton from "../components/carts/RemoveCartButton";
import ImageUpload from "../components/ImageUpload";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
export default function ViewProduct() {
    const { productId } = useParams();
    const { user, cart, productsData } = useContext(SessionContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [altDescription, setAltDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [imageLink, setImageLink] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [quantityInCart, setQuantityInCart] = useState(0);
    const [subtotalInCart, setSubtotalInCart] = useState(0);
    const [loading, setLoading] = useState(false);
    function getProduct(productId) {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("_id")) {
                    setName(data.name);
                    setDescription(data.description);
                    setAltDescription(data.altDescription);
                    setPrice(data.price);
                    setIsActive(data.isActive);
                    setImageLink(data.imageLink);
                } else {
                    setName(null);
                    setDescription(null);
                    setAltDescription(null);
                    setPrice(null);
                    setIsActive(null);
                    setImageLink(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }
    useEffect(() => {
        setLoading(true);
        if (cart.cartItems !== null) {
            let inCart = cart.cartItems.find((product) => product.productId === productId);
            if (typeof inCart !== "undefined") {
                setQuantityInCart(inCart.quantity);
                setSubtotalInCart(inCart.quantity * price);
            } else {
                setQuantityInCart(0);
                setSubtotalInCart(0);
            }
        }
        setLoading(false);
    }, [cart, price, productId]);
    useEffect(() => {
        getProduct(productId);
    }, [productId]);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return name === null ? (
        <Error message={"Product does not exist"} redirect={"/products"} buttonText={"Return to Products Catalog"} />
    ) : (
        <>
            <Container className="mt-5">
                <Row>
                    <Col lg={{ span: 6, offset: 3 }}>
                        <Card>
                            <Card.Body className="text-center">
                                <Card.Img
                                    variant="top"
                                    src={`${imageLink}`}
                                    onError={(e) => {
                                        e.target.src = `${process.env.PUBLIC_URL}/images/default-product.png`;
                                    }}
                                />
                                <Card.Title>{name}</Card.Title>
                                <Card.Subtitle>Description:</Card.Subtitle>
                                <Card.Text>{description}</Card.Text>
                                <Card.Subtitle>Alternate Description:</Card.Subtitle>
                                <Card.Text>{altDescription}</Card.Text>
                                <Card.Subtitle>Price:</Card.Subtitle>
                                <Card.Text>PhP {price}</Card.Text>

                                {user.id !== null ? (
                                    user.isAdmin ? (
                                        <>
                                            <Card.Subtitle>Active: </Card.Subtitle>
                                            <Card.Text>{isActive ? "Activated" : "Archived"}</Card.Text>
                                            <EditProductButton text={"Edit Product Details"} productId={productId} name={name} description={description} altDescription={altDescription} price={price} imageLink={imageLink} getProduct={getProduct} />
                                            <ProductStatusToggle productId={productId} isActive={isActive} textActive={"Archive Product"} textInactive={"Activate Product"} getProduct={getProduct} />
                                            <ImageUpload type={"product"} id={productId} fetchData={getProduct} buttonText={"Upload New Product Image"} labelText={"Select New Product Image:"} />
                                        </>
                                    ) : (
                                        <>
                                            <Card.Subtitle>Availability: </Card.Subtitle>
                                            <Card.Text>{isActive ? "Available" : "Unavailable"}</Card.Text>
                                            {quantityInCart > 0 && (
                                                <>
                                                    <Card.Subtitle>Number In Cart:</Card.Subtitle>
                                                    <Card.Text>{quantityInCart}</Card.Text>
                                                    <Card.Subtitle>Product Subtotal:</Card.Subtitle>
                                                    <Card.Text>PhP {subtotalInCart}</Card.Text>
                                                </>
                                            )}
                                            {isActive && <AddToCartForm productId={productId} price={price} />}
                                            {quantityInCart > 0 && <RemoveCartButton productId={productId} />}
                                        </>
                                    )
                                ) : (
                                    <Link className="btn btn-danger btn-block" to="/login">
                                        Login to Buy Now!
                                    </Link>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
